# Audience Renderings

One finding set, four readers, four messages. The facts never change between renderings. What changes is the decision on the table, the unit magnitude is expressed in, and how much of the mechanism survives.

Read the shared finding set once, then compare the renderings.

## The shared finding set

Release candidate `2.14.0-rc3`, e-commerce checkout. Everything below is verified unless marked.

| ID | Finding | Evidence | Cost if ignored |
| --- | --- | --- | --- |
| F1 | Double-click on **Pay** submits the order twice | `CheckoutButton.tsx:31` has no disabled state during submit; 4 duplicate orders in the last 200 staging runs | Customers charged twice, manual refunds, support load |
| F2 | `payment.spec.ts` cannot run in CI | Stripe test key absent from `.github/workflows/e2e.yml` secrets; job skips the file and still reports green | The payment path is untested and CI says otherwise |
| F3 | 402 responses are swallowed and returned as success | `src/pay/submit.ts:48` catches and returns `{ok: true}`; no test covers 402 | Declined cards look accepted; order created with no payment |
| F4 | `login.spec.ts` flakes at 6% | 12 failures in 200 CI runs over 14 days, all at the post-login redirect wait | Real failures get retried away; trust in the suite drops |
| F5 | Coverage on changed lines is 41% | LCOV diff coverage, `main...HEAD`, 87 of 212 changed lines executed | Uncovered new logic ships unverified |
| F6 | Two fixture files duplicate the same cart builder | `tests/fixtures/cart.ts` and `tests/checkout/helpers.ts` | Drift between suites; slow onboarding |

Full artifact: `.qa/release-2.14.0-rc3-findings.md`.

## Rendering 1: the developer fixing it today

Decision: **what do I change, in what order, right now.**

Keep the mechanism. Keep the line numbers. Drop the business framing entirely.

> **Checkout RC3: 3 changes needed before this can ship, all in your area.**
> Blocker for CI: `payment.spec.ts` never runs - the Stripe test key is missing from `.github/workflows/e2e.yml`, so the job skips it and reports green.
>
> 1. `src/pay/submit.ts:48` returns `{ok: true}` on a caught 402. Rethrow, then add the 402 case to `submit.test.ts` next to the existing 500 case. (F3)
> 2. `CheckoutButton.tsx:31` has no disabled state during submit; a double-click posts twice. Disable on submit, re-enable in the settled handler. (F1)
> 3. Add `STRIPE_TEST_KEY` to the e2e workflow secrets, then confirm `payment.spec.ts` actually executes - the current green does not include it. (F2)
>
> Diff coverage is 41% (87 of 212 changed lines, LCOV `main...HEAD`). Items 1 and 2 cover most of the uncovered payment logic.
>
> Next: open `src/pay/submit.ts:48`.
>
> Not in this list: the `login.spec.ts` flake (6%, 12 of 200 runs) and the duplicated cart fixture. Separate write-ups if you want them.

Notes on the shaping:

- F3 is first because it is the cheapest fix on the most expensive failure, not because it was found first.
- Magnitude is in files and lines, the units a developer acts in.
- F4 and F6 are named and parked. They are not dropped and they are not mixed in.

## Rendering 2: the release manager deciding ship or hold

Decision: **ship, hold, or ship with a caveat.**

Keep the recommendation, the risk, and the time to clear. Drop every line number.

> **Recommendation: hold RC3. One day of work clears it.**
> Blocker: the payment tests never ran. CI reported green because the job skipped the file, so we currently have no evidence the payment path works in this build.
>
> - **Two payment defects, both reproducible.** A declined card can be recorded as a successful order, and a double-click can charge a customer twice (4 duplicates in the last 200 staging runs).
> - **Cost to clear:** 3 changes in 3 files, all in the checkout area, plus one CI config change. The last comparable fix took one working day.
> - **If we ship anyway:** the exposure is duplicate charges and unpaid orders, both customer-visible and both needing manual finance work to unwind.
>
> Nothing else in the candidate blocks. Suite health issues exist (one 6% flaky test, thin coverage on the changed lines) and belong in next sprint's planning, not this decision.
>
> Next: I re-run the full suite with the payment tests enabled once the key is in place, and send you the result.

Notes on the shaping:

- The one decision is named in line one. Nothing else is asked of this reader.
- "One day" is allowed here because rule 5 is satisfied: a comparable measured change backs it.
- The mechanism (`submit.ts:48`) is gone. It cannot change this reader's decision.

## Rendering 3: the on-call engineer at 02:00

Decision: **is this the thing paging me, and what do I do in the next five minutes.**

Keep symptom, detection, and mitigation. Drop everything about the codebase.

> **If you are seeing duplicate orders or paid-but-unpaid orders in checkout, these are known in 2.14.0-rc3.**
>
> - **Duplicate orders:** caused by a double-click on Pay. Look for two orders, same cart, same customer, seconds apart. Mitigation: refund the second; nothing to restart.
> - **Orders with no successful payment:** a declined card (402) is recorded as success. Look for orders with no matching payment intent. Mitigation: cancel the order, tell the customer the card was declined.
> - **Rollback:** 2.14.0-rc2 does not have either defect. Roll back if the volume is more than a handful.
>
> Neither has a runtime toggle. There is no config change that fixes them.
>
> Escalate to the checkout team if you see more than 10 of either in an hour.

Notes on the shaping:

- Ordered by what a 02:00 reader is most likely to be looking at.
- "There is no toggle" is stated, because the absence saves the reader from searching for one.
- No coverage numbers, no flake rates, no fixture debt. None of it changes the next five minutes.

## Rendering 4: the auditor in six months

Decision: **was this build verified, by whom, against what.**

Keep the evidence, the method, the gaps, and the dates. Compression is off - precedence rule 2 applies.

> **Verification record: 2.14.0-rc3, checkout scope. Recommendation issued: hold, not shipped.**
>
> - **Executed:** full Playwright e2e suite, 214 tests, 2 runs, 2026-08-21. Result: 201 passed, 12 failed, 1 skipped.
> - **Not executed:** `payment.spec.ts` (14 tests) - skipped by the CI job because `STRIPE_TEST_KEY` was absent. The payment path carries no automated evidence in this build.
> - **Diff coverage:** 41% of changed lines (87 of 212), LCOV, `main...HEAD`.
> - **Defects raised:** F1 and F3 (both payment-path, both reproduced on demand), F4 (flake, 12 of 200 runs over 14 days).
> - **Manual verification:** none recorded for this candidate. No exploratory session and no accessibility pass were run against the checkout change.
> - **Full finding set with evidence:** `.qa/release-2.14.0-rc3-findings.md`.
>
> The complete table of all six findings, with per-finding evidence and reproduction steps, is reproduced below in full.

Notes on the shaping:

- The gaps are as prominent as the results, because absence of evidence is the auditor's subject.
- The item cap does not apply. The full table is included, not summarised.
- Manual verification is stated as missing rather than left silent. See `attesting-manual-verification`.

## What stayed constant

Across all four renderings:

- No fact changed, and no number changed its denominator.
- The blocker appeared in the first two lines every time.
- Nothing claimed as verified was unrun, and the unrun file was named in every rendering where it mattered.
- Each rendering ends with one action, sized for that reader.

If a rendering needs a fact the others do not have, that is a sign the finding set is incomplete, not that the audience needs a different truth.
