# Extracting an RTM from an Existing Codebase

The situation this handles: the tests exist, the requirements are scattered, and nobody can say what the suite proves. You are reverse-engineering the matrix from evidence.

## The rule that governs the whole exercise

**Read the assertions, not the titles.**

A test title is what someone believed the test did on the day they wrote it. The assertions are what it does now. These diverge constantly, and every divergence that goes into the matrix becomes documented coverage of something that is not covered.

```ts
// Title claims one thing
test('validates the discount rule', async () => {
  const total = applyDiscount(100, 'SAVE10');
  expect(total).toBeDefined();          // proves nothing about any rule
});
```

Mapping that to REQ-015 by its title puts a false claim in the matrix. Read it, see that it asserts nothing about the discount, and record it as an orphan or route it to `unslop-tests`.

## Procedure

### 1. Inventory the tests

Get a complete list before making any judgements.

```bash
# Playwright: every test, machine-readable
npx playwright test --list --reporter=json > .ai-outputs/test-inventory.json

# Vitest
npx vitest list --reporter=json > .ai-outputs/test-inventory.json

# Rough count by area, for scoping the exercise
npx playwright test --list | grep -c '›'
```

Record the total. It is the denominator for everything that follows, and it is what stops "we mapped 40 tests" from sounding like completeness.

### 2. Inventory the requirements

From the authoritative source fixed in Phase 0. Where there is none, build a derived list and label it derived.

Deriving requirements from a codebase is legitimate and needs saying out loud:

- acceptance criteria in closed tickets
- validation rules in the code
- error messages the product emits, each of which implies a rule
- configuration and feature flags
- API specification constraints
- comments naming a rule or a ticket

A derived requirement is a hypothesis about intent. Mark it, and have someone who owns the product confirm it before it becomes a baseline.

### 3. Read each test for its behaviour

For each test, answer one question: **what would have to break for this to fail?**

That answer, not the title, is the behaviour it verifies.

```ts
test('checkout works', async ({ page }) => {
  await page.goto('/checkout');
  await page.getByLabel('Card number').fill('4000000000000069');   // expired card
  await page.getByRole('button', { name: 'Pay' }).click();

  await expect(page.getByRole('alert')).toHaveText('This card has expired. Please use another card.');
});
```

Title says "checkout works". What would have to break: expiry rejection, and the expiry-specific message. This maps to REQ-014, and confidently, because the assertion names the behaviour. The title was useless.

Work in this order:

1. the assertions
2. the setup, which reveals the precondition the requirement describes
3. the action
4. the title, last, and only as a hint

### 4. Group by behaviour

Group across files, not within them. The real structure of what a suite proves rarely matches its folder layout.

- several tests on one behaviour, its boundaries, and its message: one requirement, several links
- one long journey test crossing five behaviours: several requirements, and a candidate for splitting
- two tests in different files asserting the same thing: duplicate coverage, worth reporting

### 5. Map, with a confidence label

Every mapping gets one of three labels, and the labels never get flattened.

| Confidence | Basis | Treat as |
| --- | --- | --- |
| **Stated** | The test, its annotation, or its commit names the requirement | Reliable |
| **Inferred** | The assertions clearly verify the behaviour the requirement describes | Reliable after verification |
| **Guessed** | It plausibly relates, and nothing confirms it | Not coverage. A question for someone. |

A matrix that distinguishes these is usable. One that flattens them into "covered" is worse than no matrix, because someone will decide not to write a test on the strength of a guess.

Guesses are routed, not resolved by guessing harder. Ask the requirement owner, or verify by breaking the behaviour, and the guess becomes stated or disappears.

### 6. Verify what you can

Take the high-risk requirements and prove the links:

1. break the behaviour
2. run the linked tests
3. confirm they fail, and that the message names something recognizable
4. record the link verified, with the date

Then record the **coverage of the verification itself**: how many links were verified, out of how many, chosen how. A matrix that says "38 of 210 links verified, selected by requirement risk" is honest. One that is silent implies all of them.

### 7. Record the extraction

| Req ID | Requirement | Linked tests | Confidence | Verified | Level | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| REQ-014 | Expired card rejected with an expiry-specific message | `checkout.spec.ts:31`, `checkout.spec.ts:44` | Inferred | **Yes**, 2026-08-20 | E2E | Message assertion present |
| REQ-015 | Discount applies to the pre-tax total | `discount.test.ts:12` | **Guessed** | No | Unit | Test asserts a total but not the ordering; may not cover this at all |
| REQ-022 | Cart survives a session refresh | none found | - | - | - | **Gap** |
| REQ-031 | Order confirmation email is sent | `email.test.ts:8` | Inferred | **No** | Unit | Mock-only; verifies the call, not the delivery |

The REQ-015 row is the one that earns the exercise. Its title suggested coverage; reading the assertions did not confirm it. Flattened into "covered", it becomes a reason not to test the discount ordering, which is exactly where the bug will be.

## Scoping a large suite

Full extraction over a thousand tests is a project. Scope it and say so.

Order by value:

1. **High-risk requirements first.** Money, permissions, personal data, anything with a compliance obligation.
2. **The area under active change.** Traceability pays off where things move.
3. **The area with the worst escape record.** Escaped defects point at where the matrix would have helped.
4. **Everything else**, opportunistically: annotate as tests are touched, rather than as a campaign.

Point four is how the backlog actually gets cleared. A dedicated annotation sprint covers the suite once; annotating on touch keeps it covered.

Record the scope in the report: which requirements were mapped, which tests were read, and the proportion of the suite that was examined. **A sampled extraction reported as a complete one is its own kind of lie**, and it is the failure mode of every traceability exercise done under time pressure.

## Signals worth reporting during extraction

The extraction surfaces things beyond the matrix. Capture them.

| Signal | What it means |
| --- | --- |
| A test whose title contradicts its assertions | Rename it, and check nothing depended on the title |
| A requirement covered only by a mock-only test | The link is weaker than the matrix implies; note it |
| Two tests asserting the same behaviour in different files | Duplicate coverage; one may be deletable |
| A test with no assertion that can fail | Route to `unslop-tests`, do not map it |
| A behaviour heavily tested with no matching requirement | Undocumented requirement; the valuable orphan |
| A requirement whose tests are all skipped | Documented coverage that does not run. Report as a gap, not as coverage. |

The last row deserves attention. A skipped test still carries its annotation, so a naive generator counts it as coverage. Make the generator read the skip status; see `traceability-automation.md`.
