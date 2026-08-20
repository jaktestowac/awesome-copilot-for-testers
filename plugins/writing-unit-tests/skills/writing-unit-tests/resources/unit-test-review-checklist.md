# Unit Test Review Checklist

Run this before declaring unit tests finished. Anything unchecked is either fixed or written down as a known gap.

## Scope and level

- [ ] The test exercises one unit of behavior, not a workflow across modules
- [ ] No real I/O: no database, network, file system, or real timers
- [ ] The unit level was the narrowest level that gives real confidence in this behavior
- [ ] Behavior that genuinely needs a boundary crossing was moved to integration coverage instead of being mock-wrapped
- [ ] No tests added for trivial getters, framework wiring, third-party library behavior, or things the type system guarantees

## Naming and readability

- [ ] The test name states the behavior and the condition, not the method name
- [ ] The name contains no "and" hiding a second behavior
- [ ] A failure message alone identifies what broke, without opening the file
- [ ] The suite reads top to bottom as a specification of the unit

## Structure

- [ ] Arrange, Act, and Assert are visibly separated
- [ ] Exactly one call to the unit under test in the Act step
- [ ] No loops, conditionals, or try/catch scaffolding in the test body
- [ ] Repeated cases use the runner's parameterized/table-driven API, so each case reports separately
- [ ] Setup is minimal; irrelevant fields come from a factory default, not the test body
- [ ] Load-bearing values are named rather than left as bare magic numbers or strings

## Assertions

- [ ] Asserts a specific expected value, not just truthy, defined, or "not null"
- [ ] Expected values are literals from an independent source (spec, worked example, known-good result)
- [ ] The expected value is **not** recomputed using the same logic as the implementation
- [ ] Error cases assert the error type and the meaningful part of the message
- [ ] Async rejections are asserted directly, not via a try/catch that passes when nothing throws
- [ ] Assertions describe outcomes, not invocation counts nobody cares about
- [ ] Snapshots, if used, are small and reviewed, not whole-object dumps

## Determinism

- [ ] Time and dates are injected or frozen; nothing asserts against "now"
- [ ] Randomness and generated IDs are injected or seeded
- [ ] Delays and retries use fake timers; no real `sleep` anywhere
- [ ] Every promise is awaited or returned; no floating async work
- [ ] Order-independent results are asserted as sets, not as fixed sequences
- [ ] Locale, timezone, and encoding are pinned, or assertions use structured values instead of formatted strings
- [ ] Environment variables and config are set per test and restored afterwards
- [ ] Tests pass when run in isolation, in reverse order, and repeatedly
- [ ] Tests pass with parallelism on as well as off
- [ ] No shared mutable state between tests; state is rebuilt per test
- [ ] No retry is standing in for a fix; any retried test is tracked as an open defect
- [ ] Any quarantined or skipped test carries an issue link and an owner

## Test doubles

- [ ] Doubles replace only things the project does not own: external services, storage, clock, randomness
- [ ] No internal collaborator, private helper, or pure function is substituted
- [ ] The lightest double that answers the question was used — stub or fake over mock
- [ ] No stub contains conditional logic
- [ ] Something, somewhere, still exercises the real boundary the stubs stand in for

## Coverage of behavior

- [ ] Happy path covered
- [ ] One representative case per equivalence class
- [ ] Boundaries covered: empty, zero, one, min, max, off-by-one, just outside range
- [ ] Meaningful combinations of the conditions that drive branching are covered
- [ ] Invalid input covered: wrong type, malformed value, missing required field
- [ ] Error and failure paths covered
- [ ] State transitions covered where behavior depends on prior state, including invalid transitions
- [ ] Contract guarantees covered where they exist: defaults, immutability of inputs, ordering, idempotence
- [ ] Historically fragile areas got deliberate attention
- [ ] Where a rule holds across a whole input space, a property was considered instead of more examples — with a recorded seed and the failing case pinned as an example test

## Test data hygiene

- [ ] No credentials, tokens, API keys, or connection strings in test files or fixtures
- [ ] No real personal data: names, emails, phone numbers, identifiers are obviously synthetic
- [ ] No hardcoded environment URLs that tie the test to one deployment

## Legacy code

- [ ] Where a new test failed against existing code, it was decided whether the bug was in the code or the expectation — no expected value was quietly adjusted to match observed output
- [ ] Tests over untested code pin current behavior rather than assumed behavior
- [ ] Characterization tests are labelled as such, not presented as a specification
- [ ] Behavior that looks wrong was raised as a question, not silently corrected

## Suite level

Run these when reviewing a whole suite rather than a single test.

- [ ] Setup is not copy-pasted across files, drifting apart as it is edited
- [ ] No helper or fixture has grown into a god object nobody can safely change
- [ ] No commented-out or `only`-scoped tests left behind
- [ ] Someone owns the total runtime, and it is stated
- [ ] Production code was not reshaped to suit the tests; testability findings were raised instead

## Final gates

- [ ] **Mutation check, actually executed** - the covered behavior was deliberately broken, the test was run and seen failing, then the code was restored and the test seen passing again
- [ ] **Refactor check** - renaming internals and restructuring the code without changing behavior leaves this test passing
- [ ] The full suite still passes, the real result was quoted, and runtime stayed in the milliseconds range
- [ ] Coverage was used to find gaps, not as the reason any test exists
- [ ] No test was added purely to move a coverage number
