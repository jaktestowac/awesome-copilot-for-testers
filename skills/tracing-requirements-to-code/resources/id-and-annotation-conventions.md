# IDs and Annotation Conventions

The link lives beside the test. A link stored in a document rots the first time anyone refactors; a link in the test file moves when the test moves.

## Choosing the ID

The ID is the join key for everything else. Get it wrong and the annotation work is wasted.

| Property | Why it matters |
| --- | --- |
| **Stable** | An ID that changes when a ticket is moved between projects breaks every annotation at once |
| **Short** | It appears in hundreds of test titles |
| **Greppable** | Unambiguous when searched: `REQ-014` finds only that, `14` finds everything |
| **Resolvable** | A reader can get from the ID to the requirement text in one step |
| **Unique forever** | Never reused after a requirement is retired |

### Common schemes

| Scheme | Example | Verdict |
| --- | --- | --- |
| Tracker key | `PROJ-1234` | Good when the tracker is authoritative and keys never move. Check the move behaviour before committing. |
| Dedicated requirement ID | `REQ-014` | Best when requirements outlive tickets, which they usually do. Needs a maintained register. |
| Story plus criterion | `US-002/AC-004` | Precise, and brittle: criteria get renumbered when a story is edited |
| Spec section | `SPEC-3.2.1` | Good for a stable formal specification, poor for anything that gets reorganized |
| Feature slug | `checkout-discount` | Readable, and drifts as features are renamed |

Recommended default: **a dedicated `REQ-nnn` register**, cross-referenced to tracker keys. Tickets are units of work and get closed, split, and moved. Requirements are statements about the product and outlive all of that.

### The register

Wherever it lives, it needs one row per requirement:

| Req ID | Statement | Source | Risk | Status | Retired |
| --- | --- | --- | --- | --- | --- |
| REQ-014 | A card that expired before today is rejected at checkout with an expiry-specific message | PROJ-1234 / AC-004 | High | Active | - |
| REQ-015 | Discount applies to the pre-tax total | PROJ-1240 / AC-002 | High | Active | - |
| REQ-009 | Orders can be exported to PDF | PROJ-880 | Low | **Retired** | 2026-03-01 |

Retired rather than deleted. A deleted ID leaves annotations pointing at nothing and destroys the history of what was once covered.

## Annotation formats

Pick one canonical form and use it everywhere. A generator that has to handle three formats is a generator that handles none of them reliably.

### Playwright

The tag option is the machine-readable choice, and it works with `--grep`:

```ts
test('rejects a card that expired last month', { tag: ['@req:REQ-014'] }, async ({ page }) => {
  // ...
});
```

Run everything linked to a requirement:

```bash
npx playwright test --grep "@req:REQ-014"
```

The annotation API carries more, including a link back to the requirement:

```ts
test('rejects a card that expired last month', {
  annotation: [
    { type: 'requirement', description: 'REQ-014' },
    { type: 'issue', description: 'https://tracker.example/PROJ-1234' },
  ],
}, async ({ page }) => { ... });
```

Annotations appear in the JSON and HTML reports, which makes the generator's job easy. Tags are greppable from the shell without running anything. Use tags if you want one form; use both if the report integration is worth the duplication.

### Vitest and Jest

No first-class annotation API, so the title is the reliable carrier:

```ts
describe('checkout payment validation', () => {
  test('rejects a card that expired last month [REQ-014]', () => { ... });
});
```

A structured comment is more parseable and does not clutter the reported title:

```ts
/** @requirement REQ-014 */
test('rejects a card that expired last month', () => { ... });
```

Pick one. The comment form keeps failure output clean and needs a source parser; the title form shows up in every report and needs no tooling. For most teams the title form wins on cost.

Vitest 3 supports custom task metadata, which survives into the JSON reporter:

```ts
test('rejects a card that expired last month', { meta: { requirement: 'REQ-014' } }, () => { ... });
```

### Cucumber and Gherkin

Tags are already the idiom:

```gherkin
@req:REQ-014
Scenario: Expired card is rejected at checkout
  Given a customer with a card that expired last month
  When they attempt to pay
  Then the payment is rejected with an expiry-specific message
```

### Unit tests on a function

Where the requirement is about a specific unit, the annotation can sit on the code as well as the test. Keep the test annotation regardless: the test is what proves the requirement, and the source comment is a navigation aid.

```ts
/** Implements REQ-015: discount applies to the pre-tax total. */
export function applyDiscount(subtotal: number, code: DiscountCode): number { ... }
```

## Many-to-many

Both directions are normal and the convention has to allow them.

**One test, several requirements**, which happens on journey tests:

```ts
test('completes checkout with a discount code', { tag: ['@req:REQ-015', '@req:REQ-022'] }, async ({ page }) => { ... });
```

Be suspicious above three. A test linked to six requirements is usually a god test whose failure will not tell anyone which requirement broke. Split it, and let `unslop-tests` judge it.

**One requirement, several tests**, which is the healthy case:

```ts
test('rejects a card expiring last month',      { tag: ['@req:REQ-014'] }, ...);
test('rejects a card expiring today',           { tag: ['@req:REQ-014'] }, ...);
test('accepts a card expiring next month',      { tag: ['@req:REQ-014'] }, ...);
test('expiry message names the expiry reason',  { tag: ['@req:REQ-014'] }, ...);
```

A requirement covered by exactly one test is worth a look. Most requirements have a boundary, a negative case, and a message.

## File-level and suite-level annotation

Allowed only when every test in the scope genuinely serves the same requirement:

```ts
test.describe('REQ-014 card expiry validation', { tag: ['@req:REQ-014'] }, () => {
  test('rejects a card expiring last month', ...);
  test('rejects a card expiring today', ...);
});
```

Playwright propagates a `describe` tag to its tests, which keeps the generator honest. Where a runner does not propagate, annotate per test; a file-level comment that the generator has to attribute by proximity produces links nobody can trust.

## Commit and pull request conventions

The annotation says which requirement a test serves. The commit says why it changed.

```
test(checkout): cover expiry-specific message

Adds the message assertion REQ-014 requires. The existing tests
checked rejection but not the reason, so the generic-error
regression in PROJ-1301 passed them.

Refs: REQ-014, PROJ-1301
```

Pull request expectations worth stating in `CONTRIBUTING`:

- a new test carries a requirement annotation, or a line saying why it does not
- a changed requirement updates its linked tests in the same pull request
- a deleted test that held the last link to a requirement says so explicitly

## Where the convention is documented

In the test suite README, not only in this skill. See `documenting-test-suites`. A convention nobody can find is a convention that decays into three conventions.

State: the ID scheme, where the register lives, the canonical annotation form, the many-to-many rules, and the command to run everything linked to a requirement.
