---
name: test-driven-development-quick
description: 'Runs the red-green-refactor loop with a compact set of rules: one failing test, the minimal code to pass it, cleanup under green. Use for routine test-first work on a single behavior or a small bug fix, and when the request mentions TDD, test-first, red-green-refactor, or writing the test before the code. For multi-unit features, outside-in double loops, legacy code without tests, or a session that needs a written cycle log, use the test-driven-development skill instead.'
argument-hint: 'The behavior to build or bug to fix, and the test runner already used in the project'
user-invocable: true
---

# Quick TDD

A compact standard for the red-green-refactor loop: enough to keep every change verified, short enough to read in one pass.

Framework-agnostic — match whatever runner and assertion style the project already uses. If none exists, ask which runner to target before the first test.

## When to Use

1. Build one new behavior test-first.
2. Fix a bug by reproducing it with a failing test.
3. Add a small branch or rule to code that already has tests.

Escalate to `test-driven-development` when the feature spans several units, needs an outside-in double loop, enters untested legacy code, or runs long enough to need a cycle log. Use `writing-unit-tests` when the code already exists and tests are being added after the fact.

## Before the First Test

State three things:

- the **behavior** being built, in the user's vocabulary
- the **seam** — the public interface a real caller would use, which the tests observe through
- the **test list** — the behaviors to build, smallest and most central first, worked one at a time

The list is a queue, not a batch. Writing all the tests up front verifies imagined behavior and locks in a shape nobody has validated.

## The Loop

### Red

1. Write **one** failing test for the next list entry.
2. Run it and read the real output.
3. Confirm it fails on the **missing behavior** — not a typo, missing import, or broken fixture. A mechanical failure is not red: fix it and run again.
4. If it passes immediately, stop. Either the behavior exists already or the test asserts nothing.

### Green

Write the simplest thing that passes. Pick by confidence:

- **Obvious implementation** — you know exactly how it works
- **Fake it** — return a constant, and let a queued test force the real logic
- **Triangulation** — add a second test with different data that the constant cannot satisfy

Then run the **full suite**, not just the new test. Do not clean up yet.

A fake is fine only while a listed test will remove it. A fake with nothing scheduled to kill it is a bug with a passing test.

### Refactor

Under green only, one change at a time, running the suite after each: remove duplication, fix names, split what grew too big — in the tests as well as the code. Structure only, never behavior. If a refactor goes red, revert it rather than debugging forward.

Commit at green, then take the next entry.

## The Rules

1. **Red before green.** No production code without a failing test demanding it.
2. **Evidence, not assertion.** Actually run the tests and quote the real output. Never claim red or green unseen.
3. **Minimal implementation.** Only the code the current test demands — no speculative branches.
4. **One slice at a time.** One behavior, one test, one implementation.
5. **Refactor only under green**, and never mix it with the green step.
6. **Drive the public seam**, never private methods.
7. **Match step size to confidence.** Repeated failure to reach green means the step was too big — revert to the last green and split the behavior.

## Bugs: Reproduce First

1. Write a test that fails **because of the bug**, at a seam that reaches the real failure path.
2. Confirm the failure matches the reported symptom, not a different one nearby.
3. Shrink it until every remaining element is load-bearing.
4. Fix the code until it passes, then re-check the original scenario.
5. Keep the test — it is the regression guard.

Never fix first and test after. A test written after the fix has never been seen catching the bug.

## When to Step Out

Say so and stop looping when the behavior needs a real network, database, or browser to prove (integration work), when the change is a pure rename or mechanical migration, or when the design is too open to express as an assertion yet — spike first, throw the spike away, then start cycling.

## Common Failure Modes

- writing all the tests first, then all the implementation
- claiming a test is red or green without running it
- red that fails on a missing import, so the assertion is never exercised
- a fake left in place because nothing was queued to generalize it
- cleanup smuggled into the green step, so a failure has two causes
- always moving to the next test and never refactoring
- loosening a stubborn test instead of fixing the behavior it describes
- running only the new test and finding the regression several cycles later

## Related Skills

- `test-driven-development` - the full loop: double loops, legacy entry, stuck protocol, cycle log
- `writing-unit-tests` - the quality standard each test the loop produces must meet
- `writing-unit-tests-quick` - the compact version of that standard

## Definition of Done

- every production change was preceded by a test seen failing for the right reason
- each green step held only the code the current test demanded
- no fake remains without a listed test to remove it
- refactoring happened under a passing suite and changed no behavior
- the full suite passes, and any bug fixed has a permanent regression test
- unbuilt test-list entries are stated, not silently dropped
