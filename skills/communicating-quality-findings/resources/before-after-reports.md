# Before and After Reports

One worked pair per rule, in the output shapes QA work actually produces: triage summaries, review round-ups, stand-up updates, release calls, and bug titles.

Each pair keeps the same facts. Only the shape changes.

## Rule 1: Result and blocker in the first two lines

**Before** - a review round-up that buries the finding under the method:

> I started by looking at the fixture setup, since that is usually where these problems come from, and then went through the specs one at a time. The fixtures look reasonable overall, though there is some duplication. In the specs I noticed a few patterns worth discussing, including some assertion styles that vary between files. There is also a question about whether the CI job is running everything it should be - the payment spec may not be included in the run.

**After**:

> Checkout suite: 3 real failures, 1 blocker.
> Blocker: `payment.spec.ts` never runs in CI - the Stripe test key is missing from `.github/workflows/e2e.yml`, so the job skips the file and still reports green.
>
> The three failures and the fixture duplication are below, ranked.

The "may not be included in the run" was the whole report. It was in the last sentence, hedged.

## Rule 2: One decision per report

**Before** - a release call carrying four asks:

> RC3 looks close. The payment defects need fixing first. While we are here, we should decide whether to adopt the new fixture pattern, agree a coverage target for Q4, and think about whether the flaky login test should be quarantined or fixed properly. Let me know your thoughts on all of these.

**After**:

> **Recommendation: hold RC3.** One blocker, one day of work to clear it. Detail below.
>
> Three other decisions came out of this review - fixture pattern, Q4 coverage target, and what to do with the flaky login test. None of them affect this release. Want them as one planning write-up, or separately?

The reader now has one thing to answer. The other three are visible, parked, and offered.

## Rule 3: Order findings by cost, not by discovery order

**Before** - a triage summary in the order the reviewer walked the diff:

> 1. `tests/fixtures/cart.ts` duplicates the cart builder in `helpers.ts` (low)
> 2. `CheckoutButton.tsx` missing disabled state (high)
> 3. Inconsistent assertion style in `cart.spec.ts` (low)
> 4. `submit.ts` swallows 402 (high)
> 5. Diff coverage 41% (medium)
> 6. `login.spec.ts` flaky (medium)

**After**:

> **Blocks release**
>
> - Declined cards recorded as successful orders - `src/pay/submit.ts:48`. Order created with no payment.
> - Double-click charges the customer twice - `CheckoutButton.tsx:31`. 4 duplicates in the last 200 staging runs.
>
> **Fix this sprint**
>
> - Diff coverage 41% (87 of 212 changed lines) - most of the gap is the two payment paths above, so fixing them closes it.
> - `login.spec.ts` flakes at 6% (12 of 200 runs, 14 days) - retries currently hide real failures.
>
> **Noted, no action needed now**
>
> - Duplicate cart builder in two fixture files; inconsistent assertion style in `cart.spec.ts`.

Same six findings. The reader now knows which two to read.

## Rule 4: The artifact goes in a file, the decisions go in the message

**Before** - a 41-row traceability matrix pasted into chat, followed by:

> As you can see, there are some gaps.

**After**:

> **Requirements coverage for checkout: 12 of 41 requirements have no test.**
> Full matrix: `.qa/rtm-checkout.md`, one row per requirement with test IDs and evidence.
>
> Three of the twelve gaps touch payment and need a decision this week:
>
> - REQ-14 (declined card handling) - no test at any level
> - REQ-22 (duplicate submit protection) - no test at any level
> - REQ-31 (refund path) - manual only, last verified 2026-06-04
>
> The remaining nine are reporting and admin screens. Proposed: cover them next sprint.
>
> Next: confirm REQ-14 and REQ-22 are in scope for this release and I will write the tests.

The matrix keeps all 41 rows. The message asks for one thing.

## Rule 5: State magnitude in units the reader can count

**Before**:

> The flakiness is getting pretty bad and stabilising the suite will be a decent amount of work.

**After**:

> Three specs account for all of it: `login.spec.ts` (12 failures in 200 runs), `search.spec.ts` (7 in 200), `cart.spec.ts` (3 in 200), all over the last 14 days. Every failure is a fixed-timeout wait on a post-navigation element.
>
> Nine call sites to change, all the same pattern, all in `tests/`. The last change of this shape touched 7 files and took one working day.

"Decent amount of work" and "pretty bad" carried no information. Counts, denominators, and a window do.

An estimate is allowed when something measured backs it, and the backing is stated. Without the last sentence, "one working day" would be invention.

## Rule 6: Every finding carries a first step

**Before**:

> - Error handling in the payment flow should be improved.
> - Consider adding tests for edge cases.
> - The fixtures could be cleaner.

**After**:

> - `src/pay/submit.ts:48` catches a 402 and returns `{ok: true}`, so declined cards create orders. First step: rethrow, then add the 402 case to `submit.test.ts` next to the existing 500 case.
> - No test covers a declined card at any level. First step: copy the 500-response test in `submit.test.ts` and change the status.
> - `tests/fixtures/cart.ts` and `tests/checkout/helpers.ts` both build a cart. First step: delete the `helpers.ts` copy and re-point its 4 importers at the fixture.

Three pieces of advice became three tasks. Note that "consider adding tests for edge cases" turned out to be one specific missing test.

## Rule 7: Restate the state of the work every turn

**Before** - turn four of a stabilisation session:

> Done. That one is fixed now. Shall I keep going?

**After**:

> 3 of 7 findings fixed: F1 (double submit), F2 (CI key), F5 (diff coverage now 78%, 165 of 212).
> Next: F3, the swallowed 402 in `src/pay/submit.ts:48`.
> Not started: F4 (login flake), F6 (fixture duplication). Blocked: none.
>
> Continue with F3?

The reader has been away for two hours and does not remember what F3 was.

## Rule 8: Failures stated flat

**Before** - a bug title and opening line:

> **Critical issue severely undermining the robustness and reliability of the checkout experience**
>
> Unfortunately, I have discovered a rather worrying problem that could have significant implications for our customers.

**After**:

> **Checkout submits the order twice on double-click**
>
> `CheckoutButton.tsx:31` has no disabled state during submit. Two POSTs to `/orders` with the same cart. Seen 4 times in the last 200 staging runs; every occurrence created two orders and two charges.

The title now says what breaks. The first line says where and how often.

## Rule 9: Brevity never removes the evidence rung

**Before** - the whole report:

> Fixed.

**After**:

> Fixed and verified: `npx playwright test checkout` - 12 passed, 0 failed. I ran it against the pre-fix commit first and reproduced the double submit, so the test is exercising the change.
>
> Not verified: the retry path in `submit.ts:61`. I changed it, no test covers it, and I did not run it manually.

Two lines longer, and the second paragraph is the reason this report is worth reading. A short report is not the same as a short claim.

## Compression that went too far

The failure mode this skill can cause. Same finding set as rule 3, compressed to death:

> Suite has some payment issues and coverage is lowish. Fixed the main ones.

Everything traceable is gone: which findings, which are fixed, what "lowish" means, what was run. This is shorter than every "After" above and worse than every "Before". Shape is not compression, and rule 9 exists to catch exactly this.
