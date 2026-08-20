# Parity Gate

Run this per slice. The slice is not done, and the source tests are not deleted, until every box is checked or explicitly waived with a reason.

## 1. Intent mapping

- [ ] Every source test in the slice appears in the mapping table with a destination
- [ ] Every destination is one of: a new test, a merged test, dropped, or deferred
- [ ] Dropped entries have a reason and a named acceptor
- [ ] Deferred entries have an issue link

### Mapping table

| Source test | Intent | Destination | Note |
| --- | --- | --- | --- |
| `checkout_spec.js > should apply discount` | Discount applies to the pre-tax total | `checkout.spec.ts > applies a percentage discount before tax` | Ported |
| `checkout_spec.js > should show spinner` | Loading feedback appears | Dropped | Tests an implementation detail; the outcome assertion covers the user-visible behaviour |
| `checkout_spec.js > should handle timeout` | Checkout survives a slow payment call | `checkout.spec.ts > shows a retry prompt when payment times out` | Rewritten; the original used a 30s sleep and passed regardless |

Intent, not implementation. "Clicks the submit button" is not an intent; "an order is created from a valid cart" is.

## 2. The new tests work

- [ ] All new tests in the slice pass
- [ ] They pass **three consecutive runs** with no changes between them
- [ ] They pass on CI, not only locally
- [ ] They pass under the suite's normal parallelism, not with `workers: 1`
- [ ] No `test.skip`, `test.fixme`, or `test.only` left behind

```bash
npx playwright test tests/e2e/checkout --repeat-each=3
```

## 3. The new tests fail

The check that makes the rest of the gate mean something. A test that has never been observed failing has unmeasured value.

For **at least every high-risk test in the slice**:

- [ ] Break the behaviour deliberately (comment out the validation, return the wrong value, remove the element)
- [ ] Run the test
- [ ] Confirm it fails
- [ ] Confirm the failure message says what broke, well enough for someone at 2am

Record it:

| Test | Behaviour broken | Failed | Message useful |
| --- | --- | --- | --- |
| `applies a percentage discount before tax` | Discount applied after tax | yes | yes: "expected 90.00, received 92.70" |
| `rejects an expired card` | Expiry check removed | yes | yes: names the missing error text |
| `shows a retry prompt when payment times out` | Timeout handler removed | **no** | Test passed with the handler gone. **Fixed before the gate closed.** |

That last row is why this check exists. It found a ported test that proved nothing, which the "both suites green" definition of parity would have accepted.

## 4. Quality of the ported tests

- [ ] No `waitForTimeout` or equivalent sleep anywhere in the slice
- [ ] No XPath, and no CSS selector chains longer than about two levels
- [ ] Locators prefer role, then label, then test id
- [ ] Auth uses the shared storage state, not a UI login per test
- [ ] Test data is created by the test and cleaned up by the test
- [ ] No shared mutable state between tests in the slice
- [ ] Every action and assertion is awaited (`@typescript-eslint/no-floating-promises` passes)
- [ ] Test titles state behaviour, not mechanics
- [ ] Tags applied per the glossary

An audit with `unslop-tests` over the slice is the fastest way to check most of this.

## 5. Non-functional parity

- [ ] Slice runtime recorded, old against new
- [ ] Flake rate over at least 10 CI runs recorded
- [ ] Artifacts on failure work: trace, screenshot, video
- [ ] The failure is reproducible locally from the CI artifacts

| Metric | Source slice | Playwright slice |
| --- | --- | --- |
| Tests | 28 | 22 |
| Runtime | 6m 10s | 1m 05s |
| Flake rate over 10 runs | 6% | 0% |

## 6. Deletion

The step that makes the slice real.

- [ ] Source tests in this slice are deleted
- [ ] Source fixtures, helpers, and page objects used only by this slice are deleted
- [ ] The CI job no longer runs the deleted tests
- [ ] The README coverage section reflects the change
- [ ] The migration plan's slice row has its deletion commit

Deletion happens in the same pull request as the parity evidence, or in the next one. A slice left undeleted is a slice that will still be there in six months, and it is how migrations stall.

## 7. Final slice only

When the last slice lands:

- [ ] Source framework removed from `package.json`
- [ ] Its config, plugins, and support files deleted
- [ ] Its CI job removed
- [ ] Any container images or Grid infrastructure decommissioned
- [ ] The README, the ADR, and the onboarding path updated
- [ ] The dropped-coverage list published in the README's known gaps section
- [ ] The migration plan closed with final numbers

A dependency left in `package.json` gets version bumps from a bot forever and quietly suggests the old suite still matters.

## Waivers

A box can be waived. It cannot be skipped silently.

> **Waived**: deliberate-break check for the 6 admin-panel tests in slice 4.
> **Reason**: no staging admin account with destructive permissions is available.
> **Accepted by**: [name], [date].
> **Compensating**: the slice's two highest-risk tests were checked manually against a local build.

A waiver with no compensating action and no acceptor is a skipped check with paperwork.
