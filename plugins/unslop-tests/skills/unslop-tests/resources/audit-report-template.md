# Audit Report Template

The shape of the output. Lead with what is broken, not with what you read.

Fill it in and delete the sections that are empty. An empty Tier 1 section is a real result and should be stated, not omitted.

---

## Scope

- Reviewed: `src/billing/**/*.test.ts` (6 files, read in full)
- Sampled: `tests/e2e/**` (3 of 24 files)
- Not read: `tests/legacy/**`, excluded by the caller
- Base: working diff against `main`, including uncommitted changes

State the sampling honestly. A sampled audit reported as a complete one is its own kind of slop.

---

## Tier 1, proven

The test passes while the behavior is broken. Each entry carries execution output.

### 1. Tautological assertion hides a wrong tax rate

- **Where:** [total.test.ts:24](src/billing/total.test.ts#L24)
- **Tell:** pattern 1. Expected value is recomputed with the same `reduce` the implementation uses.
- **Break:** [total.ts:11](src/billing/total.ts#L11), rate `0.23` to `0.5`
- **Command:** `npx vitest run src/billing/total.test.ts -t "sums the line items"`
- **Result:** `1 passed, 0 failed` - did not notice
- **Fix:** expected value replaced with the literal `123.00`, taken from the worked example in `docs/vat.md`
- **Re-run:** `1 failed, 0 passed` with the break present, `1 passed, 0 failed` after restoring

### 2. Global retries mask a race in comment posting

- **Where:** [playwright.config.ts:18](playwright.config.ts#L18)
- **Tell:** pattern 20. `retries: 2` on CI only.
- **Evidence:** `npx playwright test -g "shows the new comment" --repeat-each 50 --retries 0` gives `7 failed, 43 passed`
- **Diagnosis:** the comment list renders before the POST resolves; the test waits on a fixed 1000 ms
- **Fix:** wait on the response and the rendered text; retries removed for this project
- **Re-run:** `50 passed, 0 failed`

---

## Tier 1, unproven

Findings that read as Tier 1 but did not reach rung 4 of the ladder. Do not present these as settled.

- [checkout.spec.ts:88](tests/e2e/checkout.spec.ts#L88) - mock-only test, pattern 21. Not proven: the suite needs a seeded database this environment does not have. Reading suggests the assertion would survive reordering the charge and the reservation, but that was not executed.

---

## Tier 2

Passes today, fails for the wrong reason later. One line each.

- [orders.test.ts:41](src/orders/orders.test.ts#L41) - pattern 17, asserts against `new Date()`. Breaks at midnight UTC.
- [orders.test.ts:96](src/orders/orders.test.ts#L96) - pattern 22, mocks `./price-engine`, which this repo owns.
- [search.spec.ts:12](tests/e2e/search.spec.ts#L12) - pattern 36, `.locator('div.results > div:nth-child(2)')`.
- [fixtures.ts:7](src/orders/fixtures.ts#L7) - pattern 31, one order object mutated by four tests.

---

## Tier 3

Works, but the failure output tells nobody what broke.

- [orders.test.ts:8](src/orders/orders.test.ts#L8) - pattern 25, named `works correctly`.
- [orders.test.ts:33](src/orders/orders.test.ts#L33) - pattern 12, four cases inside one `for` loop.
- [total.test.ts:52](src/billing/total.test.ts#L52) - pattern 28, `toHaveLength(7)` with no stated reason.
- 11 more instances of pattern 26 across the six files, comments restating their assertion.

Group repeats with a count instead of listing every line.

---

## Cleared

Patterns checked and not present. Keep this short; it exists so the reader knows what the audit covered.

- No `only` anywhere in scope.
- No credentials or real personal data in fixtures.
- No unawaited async: the floating-promise lint rule is on for test files.

---

## Checks run

- Mutation check on both Tier 1 findings, output above.
- Isolation: `--sequence.shuffle` and `--no-file-parallelism`, both green after the fixes.
- Refactor check: renamed `calcTotal` to `calculateTotal` and its locals; tests still pass.

---

## Design findings

Raised, not fixed. These are production-code changes and belong in their own change.

- `checkout()` needs six collaborators injected to be testable, which is why [checkout.spec.ts:88](tests/e2e/checkout.spec.ts#L88) became a mock-only test. The payment and inventory calls want to be one boundary.
- `formatInvoice()` returns a locale-formatted string, so every test asserting on it is locale-dependent. Returning a structured value and formatting at the edge would remove pattern 19 from four tests at once.

---

## Coverage removed

State anything that stopped being tested, so nobody discovers it later.

- Deleted [reports.test.ts:14](src/reports/reports.test.ts#L14), pattern 8, a `not.toThrow()` check with no assertion. `buildReport` now has no test at all. Filed as #- replace with a real grouping test.

Never delete a slop test silently. A useless test still marked where somebody thought coverage existed.
