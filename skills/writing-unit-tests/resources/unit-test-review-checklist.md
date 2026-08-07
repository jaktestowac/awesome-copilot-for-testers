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
- [ ] No shared mutable state between tests; state is rebuilt per test

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

## Legacy code

- [ ] Tests over untested code pin current behavior rather than assumed behavior
- [ ] Characterization tests are labelled as such, not presented as a specification
- [ ] Behavior that looks wrong was raised as a question, not silently corrected

## Final gates

- [ ] **Mutation check** - deliberately breaking the covered behavior makes this test fail
- [ ] **Refactor check** - renaming internals and restructuring the code without changing behavior leaves this test passing
- [ ] The full suite still passes, and runtime stayed in the milliseconds range
- [ ] Coverage was used to find gaps, not as the reason any test exists
- [ ] No test was added purely to move a coverage number
