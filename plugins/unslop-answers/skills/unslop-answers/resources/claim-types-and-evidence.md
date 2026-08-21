# Claim Types and the Evidence Each One Needs

Lookup table for the claims that recur in QA work. Find the claim you are about to make, produce the evidence in the middle column, and if you cannot, use the wording in the last column instead of the claim.

Commands assume a Node and Playwright or Vitest project. Adapt the runner, keep the shape.

---

## "It is fixed"

**Evidence:** the failing case reproduced before the change, and the same case passing after it.

```
git stash && npx vitest run src/cart/total.test.ts -t "applies the member discount"
# 1 failed  <- the bug, reproduced
git stash pop && npx vitest run src/cart/total.test.ts -t "applies the member discount"
# 1 passed
```

Both outputs go in the answer. One of them alone proves nothing: the first shows a bug exists, the second shows a test passes.

**If you cannot:** "changed, not run" or "passes now, but I did not see it fail before the change, so I cannot say this test covers the bug".

---

## "Tests pass"

**Evidence:** the runner's summary line, unedited, plus the scope of the run.

```
npx vitest run
# Test Files  42 passed (42)
#      Tests  318 passed | 4 skipped (322)
```

Report the skips. Four skipped tests are four pieces of missing coverage, and they are the most common place a regression hides during a cleanup.

**If you cannot:** name what ran. "The unit suite passes, 318 of 322 with 4 skipped. The e2e suite was not run, it needs a seeded database."

---

## "There is no regression"

**Evidence:** the same suite, before and after, with the counts compared. A run of only the changed area does not support this claim.

```
git stash && npx vitest run --reporter=basic > /tmp/before.txt
git stash pop && npx vitest run --reporter=basic > /tmp/after.txt
diff /tmp/before.txt /tmp/after.txt
```

**If you cannot:** "no regression in the 42 unit files. The e2e and visual suites were not run."

---

## "Coverage is N%"

**Evidence:** the tool, the metric, the paths, and the baseline.

```
npx vitest run --coverage
# % Lines 81.4 | % Branch 62.1 | % Funcs 74.0   (src/**, v8 provider)
```

Line coverage and branch coverage differ by twenty points in most codebases, so an unqualified percentage is close to meaningless. Quote the metric you mean, and quote the branch number when someone is deciding readiness on it.

**If you cannot:** do not estimate. Coverage is cheap to measure and an estimate is a fabricated number.

---

## "The suite is flaky" or "the flake is fixed"

**Evidence:** repeat runs with retries off, and the failure count out of the total.

```
npx playwright test -g "shows the new comment" --repeat-each 50 --retries 0
# 7 failed, 43 passed
```

After the fix, the same command with the same repeat count. A single green run after a fix says nothing about a race that fires one time in seven.

**If you cannot:** "reported flaky by CI, 3 failures in the last 40 runs on main. Not reproduced locally in 50 repeats, so the cause is unconfirmed."

---

## "It is faster" or "it is slow"

**Evidence:** repeated runs, both sides, the spread, and the machine.

```
hyperfine --warmup 1 --runs 10 'npx vitest run src/report'
# before: 4.812 s ±  0.204 s
# after:  2.930 s ±  0.111 s   (local, 8 core, no other load)
```

One timing against one timing is noise. Test-suite timings on a laptop vary by 20% run to run.

**If you cannot:** "one run went from about 5s to about 3s. One observation each, not a measurement."

---

## "No other code uses this"

**Evidence:** the searches you ran, quoted. Absence claims are only as wide as the search.

```
rg -n "computeTotal" --type ts
rg -n "computeTotal" --glob '!**/*.ts'      # templates, docs, configs
rg -n "compute_total|computetotal" -i      # other spellings
```

Dynamic access defeats all of these. A property reached through a string key or a barrel re-export will not appear.

**If you cannot:** "no callers in `src/**/*.ts`. Not checked: dynamic access, the generated client, and the two other repos that import this package."

---

## "This is the root cause"

**Evidence:** a reproduction you can trigger on demand, and the mechanism named at a `file:line`. Ideally the confirmation step: change that line, the symptom goes away; revert, it returns.

**If you cannot:** call it a hypothesis and say what would confirm it. "Most likely the unawaited `refresh()` at [list.ts:88](src/list.ts#L88). Not confirmed: I could not reproduce the empty list locally in 50 runs."

---

## "Severity: high"

**Evidence:** the affected user, the observable effect, the frequency, and whether a workaround exists. Four short clauses.

> High. A member checking out with a coupon is charged the full price. Every coupon order, no workaround, money leaves the customer.

A severity with no impact clause is an opinion in a field that looks like data.

---

## "The requirement is covered"

**Evidence:** the requirement id, the test that covers it, and the assertion inside that test that would fail if the requirement broke.

> REQ-114 (session expires after 30 idle minutes) covered by [session.spec.ts:44](tests/session.spec.ts#L44), asserting the redirect to `/login` after the clock advances 31 minutes.

A test whose name mentions the requirement is not coverage. Point at the assertion.

**If you cannot:** it is not covered. Say so.

---

## "Ready to release"

**Evidence:** a readiness call is a recommendation with named residual risk, not a metric.

State: what ran and what did not, the open defects by severity, what is untested and who accepted that, and the rollback path. A pass rate on its own does not answer the question that was asked.

**If you cannot:** "I can report the suite results. The readiness call needs the open-defect list and an owner, which I do not have."

---

## "Accessible" or "secure"

**Evidence:** the tool, its version, the rule set, the pages or endpoints scanned, and the findings. Both of these words describe properties no scanner establishes.

```
npx @axe-core/cli http://localhost:3000/checkout --tags wcag2a,wcag2aa
# 0 violations   (axe-core 4.10, checkout page only, logged-out state)
```

**Wording that survives review:** "no axe violations on the checkout page in the logged-out state, wcag2a and wcag2aa. Keyboard traps, screen-reader flow, and the logged-in state were not checked."

---

## "I checked the whole thing"

**Evidence:** the file list, split into read in full, sampled with the sample size, and skipped with the reason.

A sampled audit reported as a complete one is the highest-cost slop in this document, because it removes the reader's reason to look again.
