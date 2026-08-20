---
name: writing-unit-tests-quick
description: 'Writes a few solid unit tests, using a compact set of rules for structure, assertions, determinism, and edge cases. Use for routine everyday testing of a single function, class, or small module, or for a quick sanity check on tests someone just wrote. For legacy backfills, flaky-suite investigations, deep test-double design, or a full suite review, use the writing-unit-tests skill instead.'
argument-hint: 'The function or module to test, and the test runner already used in the project'
user-invocable: true
---

# Quick Unit Tests

A compact standard for everyday unit testing: enough to keep tests honest, short enough to read in one pass.

Framework-agnostic — match whatever runner, assertion style, and file layout the project already uses. If none exists, ask which runner to target before writing anything.

## When to Use

1. Add tests for one function, class, or small module.
2. Sanity-check a handful of tests someone just wrote.
3. Cover a bug fix or a small new branch.

Escalate to `writing-unit-tests` when the job is a legacy backfill, a flaky or slow suite, a full-suite review, or heavy test-double design. Use `test-driven-development` when the tests should come before the code.

## The Rules

1. **Test behavior, not implementation.** Assert what the public interface returns, throws, or emits. Never touch private state.
2. **One reason to fail.** If the test name needs "and", split it.
3. **Name the behavior and the condition.** `returns zero when the cart is empty` — the CI log alone should say what broke.
4. **Arrange - Act - Assert**, visibly separated, with exactly one call to the unit under test.
5. **Expected values are independent literals.** Never recompute them the way the code does, and never import the implementation's own constant — that test can only agree with the code.
6. **Assert specific values.** Not truthy, not defined. For errors, assert the type and the meaningful part of the message.
7. **No logic in the test.** No loops or conditionals — use the runner's parameterized/table-driven API so each case reports separately.
8. **Control nondeterminism.** Inject or freeze time, randomness, and IDs; use fake timers instead of real delays; await every promise and assert rejections directly.
9. **Mock only what you do not own.** Network, storage, clock. Never stub your own modules — that freezes the design and breaks on every refactor.
10. **No real I/O.** If proving the behavior needs a database, HTTP call, or browser, say so and route it to integration coverage instead of mocking around it.
11. **Synthetic test data only.** No credentials, tokens, or real personal data — a fixture committed once stays in history forever.
12. **Leave nothing skipped silently.** A `skip` or `only` carries an issue link and an owner, or it does not land.
13. **Do not reshape the code to suit the test.** Hard-to-test code is a design finding to raise, not something to restructure inside a test-adding change.

## Cases to Cover

For each unit, walk this list and keep what applies:

- **happy path** — typical input
- **input classes** — one representative per meaningfully different group
- **boundaries** — empty, zero, one, min, max, off-by-one, just outside the range
- **invalid input** — wrong type, malformed value, missing required field
- **error paths** — thrown errors, rejected promises, failure return values
- **state or sequence** — behavior that depends on what happened before

Skip trivial getters, framework wiring, and third-party library behavior. A test with nothing to prove still breaks on refactors.

## Before You Finish

Two checks, both quick, and both **run rather than imagined**:

- **Mutation check** — break the covered behavior on purpose, run the test, see it fail, restore the code, see it pass. A test written after the code has never been seen failing; this is the only thing that proves it can.
- **Refactor check** — rename internals and restructure without changing behavior. Does the test still pass? If not, it is coupled to implementation.

Then run the full suite, not just the new tests, and quote the real result.

If a test fails intermittently, do not add a retry or raise a timeout. Reproduce it first — repeat runs, isolation, random order, parallel on and off — then fix the cause. `writing-unit-tests` carries the triage procedure.

## Common Failure Modes

- expected value recomputed the same way the implementation computes it
- one test asserting five unrelated things, so a failure says nothing
- `toBeTruthy()` where a real value belongs
- a `try/catch` around the act step that passes when nothing throws
- real clock, real `sleep`, or real network inside a unit test
- every collaborator stubbed, so the test only proves the stubs were called
- a mutation check assumed rather than executed, so nobody knows the test can fail
- an expected value quietly changed to match whatever the code returned, turning a spec into a characterization test
- a flake contained with a retry or a longer timeout instead of diagnosed
- a skipped test with no issue link, quietly removing coverage
- real credentials or personal data in a fixture
- tests added to move a coverage number

## Related Skills

- `writing-unit-tests` - the full standard: legacy backfills, flaky suites, test-double design, suite review
- `test-driven-development-quick` - when the tests should drive the implementation, in the same compact form
- `test-driven-development` - the full loop, for multi-unit features and legacy code
- `designing-test-data` - when the inputs and boundary values need deliberate design first

## Definition of Done

- every test has one reason to fail and a visible Arrange - Act - Assert shape
- expected values are independent literals
- nothing depends on real time, randomness, I/O, or another test's state
- boundaries and error paths are covered, not just the happy path
- test data is synthetic, and nothing was left skipped without an issue link
- both the mutation and refactor checks were actually run, and the full suite is green with its result quoted
