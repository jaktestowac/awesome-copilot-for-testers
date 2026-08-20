# Orphans and Drift

Crossing both directions produces four quadrants. Most traceability work looks at one of them.

|  | Has a linked test | No linked test |
| --- | --- | --- |
| **Has a requirement** | Covered, if the link is verified | **Coverage gap** |
| **No requirement** | **Orphan test** | Out of scope, correctly |

The top-right is what everyone measures. The bottom-left is where the interesting findings are.

---

## Coverage gaps: requirements with no test

The familiar direction. Rank by risk rather than listing alphabetically.

| Req ID | Requirement | Risk | Why uncovered | Action |
| --- | --- | --- | --- | --- |
| REQ-022 | Cart survives a session refresh | High | Never written | Design tests, route to `designing-functional-tests` |
| REQ-031 | Confirmation email is sent | Medium | Only a mock-only unit test; no delivery check | Strengthen the existing test |
| REQ-040 | Export respects row permissions | High | Test exists but is skipped since 2026-02 | **Report as a gap, not as coverage** |

The last row is the trap. A skipped test keeps its annotation, so a generator that ignores skip status reports it as covered. Documented coverage that does not run is worse than a known gap.

Feed the ranked list to `assessing-release-readiness`. It is direct release evidence.

---

## Orphan tests: the direction nobody looks

A test linked to no requirement is one of three things, and reporting them as a single count throws away the distinction that matters.

### 1. Undocumented requirement

**The valuable case.** The behaviour matters, someone cared enough to test it, nobody wrote it down.

```ts
test('rejects an order when the cart total exceeds the account credit limit', async () => {
  // Detailed, deliberate, clearly load-bearing. No requirement mentions credit limits anywhere.
});
```

Someone knew this rule. It is enforced in code and verified by a test, and it exists in no specification. Action: **write the requirement**. The test is the evidence that it is real.

This is how traceability finds requirements rather than just checking them, and it is the reason the orphan direction is worth the effort.

### 2. Test of a removed feature

```ts
test('exports the order list to PDF', async () => {
  // The PDF export was removed in 2025. This test hits a stubbed endpoint and passes.
});
```

Action: delete. Check first that the feature is genuinely gone rather than moved.

### 3. Test that proves nothing

```ts
test('renders the dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toBeTruthy();
});
```

Action: route to `unslop-tests`. Do not map it to a requirement to tidy the matrix; that converts a worthless test into documented coverage.

### Reporting orphans

| Test | Classification | Evidence | Action |
| --- | --- | --- | --- |
| `credit-limit.spec.ts:14` | **Undocumented requirement** | Asserts a specific limit rule enforced in `src/orders/limits.ts` | Draft REQ-051, confirm with product |
| `export-pdf.spec.ts:8` | Dead feature | Endpoint removed 2025-11 | Delete |
| `dashboard.spec.ts:3` | Proves nothing | Only assertion is `toBeTruthy` | Route to `unslop-tests` |

A count of "17 orphan tests" tells nobody what to do. This table does.

---

## Drift: how links rot

Links decay silently. Nothing errors, the matrix simply stops being true.

| Cause | What happens | Detection |
| --- | --- | --- |
| **Test deleted** | The requirement silently loses its last link | Generator diffs against the previous run |
| **Test renamed or moved** | Fine if the annotation is in the code, broken if the matrix stores a file path | Store links in the code, not as paths |
| **Test refactored** | It still carries the annotation and now verifies something else | Only a re-verification catches this |
| **Requirement retired** | The annotation points at a dead ID | Validate every ID against the register |
| **Requirement reworded** | The test now verifies the old behaviour | The change procedure, not a tool |
| **Test skipped or quarantined** | Counted as coverage while not running | Generator reads the skip status |
| **Assertion weakened** | The link still holds; the coverage is thinner | Re-verification, or `unslop-tests` |

The dangerous ones are refactor and weakened assertion. Both leave the link syntactically valid and semantically false, and no static check finds them. Only breaking the behaviour and watching the test does.

### Practical drift checks, cheapest first

```bash
# 1. Annotations referencing an ID not in the register
grep -rhoP '@req:\K[A-Z]+-\d+' tests/ | sort -u > /tmp/used.txt
cut -d'|' -f2 docs/requirements.md | grep -oP '[A-Z]+-\d+' | sort -u > /tmp/known.txt
comm -23 /tmp/used.txt /tmp/known.txt   # annotations pointing at nothing

# 2. Requirements with no annotation anywhere
comm -13 /tmp/used.txt /tmp/known.txt

# 3. Linked tests that are skipped
npx playwright test --list --reporter=json \
  | jq -r '.suites[].specs[] | select(.tests[].annotations[]?.type == "skip") | .title' \
  | grep '@req:'
```

Wire these into the generator rather than running them by hand; see `traceability-automation.md`.

### Re-verification cadence

Static checks catch the cheap drift. Semantic drift needs re-verification, and it is expensive, so schedule it by risk:

| Requirement risk | Re-verify |
| --- | --- |
| High: money, permissions, personal data, compliance | Every release, or when the linked test changes |
| Medium | Quarterly, or when the linked test changes |
| Low | Annually, or on demand |

**"When the linked test changes" is the highest-value trigger** and the cheapest to automate: a pull request that modifies a test carrying a `@req` annotation prompts a re-verification of that link. It catches the refactor case at the moment it happens, when the author still knows what they changed.

---

## Triage table

Working order for a full crossing.

| Finding | Severity | Route to |
| --- | --- | --- |
| High-risk requirement, no test | **High** | `designing-functional-tests` |
| High-risk requirement, linked test skipped | **High** | Fix or delete the skip; report as a gap now |
| Link that failed verification (test passed on broken behaviour) | **High** | Fix the test; remove the link until it does |
| Requirement covered only by a guessed link | Medium | Verify, or ask the requirement owner |
| Orphan test that is an undocumented requirement | Medium | Write the requirement |
| Requirement covered only by a mock-only test | Medium | Note the weaker link; consider a level up |
| Annotation pointing at a retired ID | Low | Re-link or remove |
| Orphan test on a dead feature | Low | Delete |
| Orphan test proving nothing | Low | `unslop-tests` |

Row three outranks most gaps. A missing test is a known unknown; a link that says covered while the test passes on broken behaviour is a known that is wrong, and it is load-bearing in exactly the decisions traceability exists to support.
