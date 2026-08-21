# Does This Change Deserve the Loop?

The loop decides _where_ the seams go. Nothing inside it decides _whether_ a change is worth cycling at all.
That judgement is made once, before the first test, and it is stated out loud.

Two failures live here. Forcing the loop onto a change with nothing to assert against produces a test that restates the code.
Quietly abandoning the loop produces a fix with no evidence behind it. Both are avoidable in about a minute.

## The fit check

| The change is                                                  | Run the loop?                             | Verify with                                                          |
| -------------------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------- |
| A rule, calculation, transformation, validation, state machine | **Yes** - this is the loop's home ground  | Unit cycles                                                          |
| A defect with a cheap local reproduction                       | **Yes** - reproduce first, always         | The repro test, kept as a regression guard                           |
| A feature crossing several owned units                         | **Yes** - double loop                     | Fast acceptance test outside, unit cycles inside                     |
| Untested code you are about to change                          | **Yes, after a net** - characterize first | Characterization tests, then normal cycles                           |
| Config, wiring, glue, straight delegation                      | **No**                                    | Type check, lint, a startup or smoke check                           |
| A pure rename or mechanical migration                          | **No**                                    | The existing suite, unchanged, still green                           |
| Behavior that only a real network, DB, or browser can prove    | **No** - this is integration work         | Integration or end-to-end coverage, written after the behavior works |
| A design question too open to assert on yet                    | **Not yet**                               | Spike, throw the spike away, then cycle properly                     |
| Genuinely disposable exploratory code                          | **No**                                    | Nothing - but say it is disposable                                   |

### The no-source-of-truth test

Before writing the first assertion, ask where the expected value comes from.

If the answer is "from the implementation" - because the change is a pass-through, a config value, a field mapping with no
rule in it - there is nothing to test. The only assertion available recomputes what the code does, which passes by
construction and can never disagree with the code. That is the tautological anti-pattern reached from the other direction.

An independent source of truth is a spec line, a worked example, a known-good literal, a documented contract, or a
reported symptom. If none exists, the loop has nothing to drive on.

### Bad tests are worse than no test

A test is a bad test when it:

- mostly exercises its own mocks
- encodes current implementation details rather than intended behavior
- depends on timing, ordering, global state, or production-only data
- needs expensive infrastructure to prove a small change
- would be deleted the moment it went green

Prefer no test to a bad test - and say which one you chose, and why.

## Do not drive the loop with a slow test

Red-green only pays for itself while the feedback is fast. A browser or end-to-end test as the cycle signal costs minutes
per iteration, and an agent looping on one for a feature that does not exist yet reliably concludes the _test_ is broken.

- Drive with the fastest thing that can observe the behavior.
- In a double loop, the outer acceptance test is the cheapest test that proves the feature - not the heaviest.
- Browser and end-to-end coverage is written after the behavior works, as coverage rather than as a driver.

## Stepping out without dropping the evidence

Stepping out of the loop is a legitimate decision. Reporting a fix with nothing behind it is not.

When no failing test is practical:

1. **Say so before changing production code**, with the specific reason - not "hard to test".
2. **Name the closest executable check** you can actually run:
   - a targeted script that exercises the path
   - a manual reproduction command, with its before/after output
   - a log or output comparison
   - a focused integration or contract test that already exists
   - a startup, smoke, or type check for wiring-level changes
3. **Run it before and after the change** and keep both outputs.
4. **Report it as the evidence**, in place of the red-green pair.

## Reporting either way

Whichever path was taken, the close of the work names the evidence:

- the check that failed first, and the output it produced
- the check that passes now, and the full-suite result
- any nearby validation run when the change carried wider risk - type check, lint, adjacent suites
- if red-green could not be produced: why, and which substitute check was run instead

"I fixed it and the tests pass" is not a report. It names no check that was ever seen failing.
