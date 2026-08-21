# Before and After

Worked pairs for the Tier 1 patterns. The "before" versions are not strawmen. They are the shapes an agent produces by default, and each one reads as competent work.

---

## 1. Completion claimed, nothing run

**Before**

> Fixed. The discount was being applied before the tax calculation, so I moved the call. This resolves the incorrect totals for member checkouts.

Three sentences, one mechanism, no execution. It reads like a verified fix and is indistinguishable from a guess.

**After**

> Moved the discount call above the tax calculation in [total.ts:34](src/cart/total.ts#L34).
>
> Seen failing before the change, passing after:
>
> ```
> $ npx vitest run src/cart/total.test.ts -t "member discount"
> # before:  1 failed   expected 108.00, received 118.44
> # after:   1 passed
> ```
>
> Not run: the e2e checkout suite. It needs a seeded database this environment does not have.

---

## 2. Green claimed from a partial run

**Before**

> All tests pass, the change is safe to merge.

**After**

> ```
> $ npx vitest run
> Test Files  42 passed (42)
>      Tests  318 passed | 4 skipped (322)
> ```
>
> The 4 skips are in [payments.test.ts:12-58](src/payments/payments.test.ts#L12-L58), skipped before this change with no issue reference. That area is where a totals change would break, so "safe to merge" is not something I can support from this run.

The second version is worse news and more useful. The first version's job was to end the conversation.

---

## 4. Fix asserted without seeing red

**Before**

> Added a test for the empty-cart case and it passes, so the guard works.

A test written after the code, never seen failing, is a test that might assert nothing. It could pass with the guard deleted.

**After**

> Added [total.test.ts:71](src/cart/total.test.ts#L71) for the empty cart. Checked it can fail: with the guard at [total.ts:12](src/cart/total.ts#L12) commented out, the test reports `TypeError: cannot read properties of undefined`, and it passes with the guard restored. Guard is back in place.

---

## 6. Absence claimed from a narrow search

**Before**

> `computeTotal` is not used anywhere else, so renaming it is safe.

**After**

> Callers of `computeTotal`, from `rg -n "computeTotal" --type ts`: only [checkout.ts:9](src/checkout.ts#L9).
>
> Not covered by that search: dynamic property access, the generated API client in `packages/client`, and the two consuming repos. I checked the barrel at [index.ts:4](src/index.ts#L4) and the symbol is exported publicly, so a rename is a breaking change for anything outside this repo.

The claim went from "safe" to "breaking change". That is the search doing its job.

---

## 7. Silent recovery

**Before**

> Ran the suite, 12 tests pass.

**After**

> First run failed to start: `Cannot find module '@playwright/test'`, dependencies were not installed. After `npm ci`, the suite ran: 12 passed. Worth knowing if CI assumes a warm `node_modules`.

---

## 9. Invented API

**Before**

> Replaced the fixed wait with `await page.waitForNetworkIdle()`, which waits for the requests to settle instead of a fixed duration.

Plausible, well-explained, and not a Playwright API. It would have cost the reader a search and a failed run.

**After**

> Replaced the fixed wait at [comments.spec.ts:31](tests/comments.spec.ts#L31) with a wait on the response the list depends on:
>
> ```ts
> await page.waitForResponse((r) => r.url().includes('/api/comments') && r.ok());
> await expect(page.getByText('Nice one')).toBeVisible();
> ```
>
> Checked against `@playwright/test` 1.49 in [package.json:18](package.json#L18). I first reached for `waitForNetworkIdle`, which does not exist in this version.

---

## 12. Output that was never produced

**Before**

> ```
> Running 24 tests using 4 workers
>   24 passed (18.2s)
> ```

Formatted as a paste, invented from what the run would probably print. Nothing in the answer marks it as a reconstruction, and a reader has no way to tell.

**After**

> I did not run the e2e suite. The command would be `npx playwright test tests/checkout`, which needs the dev server on port 3000 and a seeded database. Unverified.

If you did not capture it, do not format it as output. A code block is a claim that these characters appeared on a terminal.

---

## 14. Numbers from nowhere

**Before**

> The change cuts suite time by roughly 40% and coverage is around 80%.

**After**

> Suite time, 10 runs each with `hyperfine`: 4.81s ± 0.20 before, 2.93s ± 0.11 after, local 8-core with no other load. That is 39% on this machine, and CI may differ.
>
> Coverage: 81.4% lines and 62.1% branches over `src/**`, from `vitest run --coverage`, v8 provider. The branch number is the one that matters for the readiness call, and it did not move.

---

## 29. Part of the ask dropped in silence

**Before**

> Done. Added the missing assertions to the cart tests, fixed the flaky comment test, and cleaned up the fixtures.

Four things were requested. The fourth, the CI config, is not mentioned. The word "Done" covers the gap.

**After**

> Three of the four are done. The CI change is not.
>
> - assertions added: [cart.test.ts:44-92](src/cart/cart.test.ts#L44-L92)
> - flake fixed: waits on the response now, 50 repeats with retries off give 50 passed
> - fixtures moved to a factory: [factories.ts](tests/factories.ts)
> - **not done:** removing `retries: 2` from [playwright.config.ts:18](playwright.config.ts#L18). Two other specs rely on it. Removing it now would turn the green build red without fixing the races behind it, and those are separate bugs.

---

## 30. Blocker buried

**Before**

> Summary: the checkout suite is in good shape. 38 of 40 specs pass, the fixtures are now generated, and the locators are role-based throughout. Two specs remain skipped pending investigation of the payment provider sandbox.

The last clause is the whole message. Everything before it is what the reader will remember.

**After**

> Payment checkout is untested. The two specs covering it are skipped because the provider sandbox rejects our test cards, and that is the highest-value path in the suite.
>
> The rest: 38 of 40 pass, fixtures are generated, locators are role-based.

---

## 33 and 35. Effort theater

**Before**

> I carefully reviewed all 14 test files across the cart and checkout packages, examining each assertion and thoroughly analysing the fixture setup, to comprehensively assess the quality of the suite.

**After**

> Read in full: the 6 files in `src/cart`. Sampled: 3 of 8 in `tests/e2e`. Two findings, both in the sampled set, so there are probably more.

---

## 38 and 39. Confidence miscalibration

**Before**

> Coverage may possibly be somewhere around 80%, and this change definitely fixes the flake.

Backwards in both directions. The coverage number was measured and is hedged into uselessness. The flake fix was never repeat-tested and is stated as certain.

**After**

> Coverage is 81.4% lines, from `vitest run --coverage`.
>
> The flake is probably fixed, and I cannot say that more strongly yet. 50 repeats with retries off give 50 passed locally, but the original failure only appeared on CI under load and I could not reproduce it locally before the change either. Worth watching for a week.
