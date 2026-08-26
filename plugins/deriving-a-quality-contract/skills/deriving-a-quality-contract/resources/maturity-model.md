# Maturity Model - crawl / walk / run

Maturity gates _ambition_. It answers "what should this team adopt next", not "what would be ideal". Read the level off the repository as it is today, not off the team's seniority or intentions.

A practice whose `From` column is above the current level is **deferred**, not missing. Deferred practices belong in the contract's "next level" section - visible, sequenced, not counted as a gap.

## `crawl` - no reliable safety net

**You are here if any of these is true:**

- there is no test script, or it exists and nobody runs it
- CI does not run tests, or a red build does not stop a merge
- typecheck or lint is not enforced anywhere
- test failures are routinely ignored or retried until green

**Goal of this level:** make the build meaningful. Nothing else matters until a red build stops a merge.

**Adopt, in this order:** lint and format → typecheck in CI → a handful of unit tests on the logic that actually matters → secret scanning → make CI blocking.

**Exit criteria for `walk`:** CI runs lint, typecheck, and tests on every PR; a failure blocks the merge; the suite is trusted enough that a red run is investigated rather than re-run.

**The trap:** buying coverage before trust. A team at crawl that adopts a coverage threshold gets assertion-free tests written to satisfy it. Trust first, thresholds second.

## `walk` - a trusted gate exists

**You are here if:**

- CI blocks on lint, typecheck, and unit tests
- there is a real test suite people extend when they add features
- failures get investigated rather than retried

**Goal of this level:** widen coverage from units to the paths that actually break - integration, API, E2E on critical journeys - and start measuring instead of guessing.

**Adopt, in this order:** diff coverage on changed lines → integration tests over real collaborators → API or E2E tests on critical journeys → SAST and dependency audit → flake control with a quarantine register → accessibility automation if there is a UI → the LLM eval suite if there is an AI surface.

**Exit criteria for `run`:** critical journeys are covered end to end, coverage is measured per change rather than per repo, flake rate is known and under control, and the suite runs fast enough that nobody is tempted to skip it.

**The trap:** an E2E suite that grows faster than the team can stabilise it. Flake control is on the `walk` list for a reason - an untrusted E2E suite is worse than none, because it teaches people to ignore red.

## `run` - the suite is fast, trusted, and measured

**You are here if:**

- critical paths are covered at more than one level
- flake rate is measured and low
- coverage is enforced per change
- performance and security checks exist in some form

**Goal of this level:** find the defects the existing suite structurally cannot find, and make quality visible over time.

**Adopt:** mutation testing to test the tests → property-based testing on core invariants → performance thresholds tied to SLOs → DAST → chaos and resilience probes → visual regression → comprehension attestation on high-risk surface → quality trend reporting.

**The trap:** adopting `run`-level practices as trophies. Mutation testing on a suite with weak assertions produces a number nobody acts on. Each of these should answer a question the team is actually asking.

## Reading the level from the repo

| Signal                                                    | Level it implies               |
| --------------------------------------------------------- | ------------------------------ |
| No `test` script, or no CI test step                      | crawl                          |
| CI test step exists but `continue-on-error: true`         | crawl (the gate does not gate) |
| Blocking lint + typecheck + unit tests in CI              | walk                           |
| Coverage measured per change, not just per repo           | walk, upper end                |
| A quarantine register or flake dashboard exists           | walk → run                     |
| Mutation, property-based, or performance thresholds in CI | run                            |

When signals conflict, take the **lowest** level the evidence supports. Over-assigning maturity is how a team ends up with a contract full of practices it cannot yet keep.

## Regression is normal

Maturity moves backwards: a team loses the person who maintained the suite, flake rate climbs, someone adds `continue-on-error` to stop the pain. Re-deriving the level on each contract run catches this. A repo that was at `run` and now retries failures until green is at `walk` again, and the contract should say so.
