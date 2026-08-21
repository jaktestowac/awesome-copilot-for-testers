---
name: writing-unit-tests
description: 'Writes and reviews focused, deterministic unit tests that verify behavior through public interfaces instead of implementation details. Use whenever tests are added to code that already exists, and when the request mentions unit tests, test coverage, edge cases, mocks or test doubles, "add tests for this function", "cover this module", "these tests are flaky", or "this test breaks every refactor". Also use when reviewing an existing suite for brittleness, weak assertions, or missing boundary cases.'
argument-hint: 'Unit under test, its public interface, known edge cases, and the existing test runner (if any)'
user-invocable: true
---

# Writing Unit Tests

Use this skill when the goal is a small, fast test that proves one behavior of one unit.
It helps produce tests that read like a specification and survive refactors, instead of tests that mirror the code and break whenever it moves.

This skill is **framework-agnostic**. It does not assume a runner, an assertion library, or a mocking tool.
Detect what the project already uses before writing anything; if nothing exists yet, ask which runner to target and describe the tests in neutral terms until you know.

## When to Use

Trigger phrases: "unit tests", "add tests for this", "cover this function", "test coverage", "edge cases", "mock this", "these tests are flaky", "this test breaks on every refactor", "are these tests any good?".

Typical situations:

- add unit tests for an existing function, class, or module
- backfill tests for untested legacy code
- review an existing suite that is brittle, slow, or flaky
- expand coverage of edge cases and error paths
- decide what deserves a unit test versus an integration test

Reach for this skill when the code already exists. If the tests should come first and drive the implementation, use `test-driven-development` instead - then return here for the standard each test it produces must meet.

## What a Unit Test Is Here

A unit test exercises **one unit of behavior in isolation**, with no real I/O.

- **In scope** - pure functions, business rules, validators, mappers, reducers, state machines, error handling
- **Out of scope** - database queries, HTTP calls, file system access, real timers, cross-module workflows

### Pick the narrowest test that gives real confidence

| The behavior lives in                      | Test level                           | Why                                             |
| ------------------------------------------ | ------------------------------------ | ----------------------------------------------- |
| A calculation, rule, or transformation     | Unit                                 | Fast, exhaustive on edge cases, no setup cost   |
| Collaboration between two owned modules    | Unit at the outer module's interface | Keeps the seam public without mocking internals |
| A query, schema, or serialization contract | Integration                          | Only the real dependency can prove it           |
| The shape of an external provider's responses | Contract test                     | Stubs encode an assumption; a contract test is what notices when it rots |
| A user-visible workflow across layers      | End-to-end / functional              | Unit tests cannot observe it                    |

Push edge cases down to the unit level and keep the higher levels thin.
If a behavior can only be proven by crossing a process or network boundary, say so and route it to integration coverage rather than forcing it into a unit test with a wall of mocks.

### What not to test

Skip these unless they carry real logic:

- trivial getters, setters, and pass-through wrappers
- third-party library behavior - test your use of it, not the library itself
- framework wiring and generated code
- constants, or anything the type system already guarantees
- private helpers - they get covered through the public interface that uses them

A test with nothing to prove still costs review time and still breaks on refactors.

## Core Rules

- **Test behavior, not implementation** - assert on what the public interface returns, throws, or emits. Never reach into private state.
- **One reason to fail** - each test proves one behavior. If the name needs "and", split it.
- **Deterministic by construction** - inject or freeze time, randomness, IDs, locale, and environment. A test that can fail twice out of a hundred runs is a broken test.
- **Independent and order-free** - no shared mutable state between tests, no reliance on execution order, no leaking global setup.
- **Fast** - milliseconds, not seconds. Slowness is a signal the unit is not isolated.
- **No logic in the test** - no loops, conditionals, or recomputation of the expected value. Expected values are literals from an independent source: the spec, a worked example, a known-good result.
- **Parameterize, don't loop** - many similar cases belong in the runner's table-driven or parameterized API, where each row reports as its own test. A hand-rolled `for` loop hides which case failed.
- **Mock only at real boundaries** - substitute things you do not own (clock, network, storage). Mocking internal collaborators couples the test to the design and makes refactoring painful.
- **Prove the test can fail** - a test written after the code has never been seen failing. Break the behavior on purpose, watch the test go red, restore, and watch it go green. Evidence, not confidence.
- **Do not reshape production code to make testing easier without saying so** - hard-to-test code is a design finding to raise, not something to quietly restructure inside a "just adding tests" change. Ask, then do it as its own change.
- **No secrets, credentials, or real personal data in test data** - fixtures live in version control forever. Use obviously synthetic values.
- **No silently skipped tests** - a `skip`, an `only`, or a commented-out test carries an issue link and an owner, or it does not land.
- **Coverage is a gap detector, not a target** - use it to find untested branches, never as the reason a test exists.

## Workflow

### Phase 0: Identify the unit and its interface

Before writing anything, state:

- the unit under test and its public entry points
- inputs it accepts, outputs it produces, errors it raises
- the side effects it is responsible for, if any
- the collaborators it depends on, and which of them are real boundaries

If the interface is unclear or the unit does too many things, say so. Untestable code is a design finding, not a testing failure.

The interface is the test surface: callers and tests cross the same seam. Wanting to test *past* the interface - reaching into internals, stubbing things the unit owns, asserting on private state - means the unit is the wrong shape, and that is worth reporting even when the tests get written anyway.

### Phase 1: Detect the project's testing conventions

Inspect the repository before choosing a style:

- existing test file locations and naming pattern
- runner and assertion style already in use
- available helpers, factories, fixtures, or custom matchers
- how setup and teardown are currently handled
- how the parameterized/table-driven API is spelled in this runner

Match the existing conventions. Do not introduce a new runner, library, or folder layout unless the user asks for it.

### Phase 2: Build the case list

List the behaviors to cover before writing code. Each lens maps to a standard test design technique:

| Lens                | Technique                | What to cover                                                                        |
| ------------------- | ------------------------ | ------------------------------------------------------------------------------------ |
| Happy path          | -                        | The main expected behavior with typical input                                        |
| Input classes       | Equivalence partitioning | One representative per meaningfully different input group                            |
| Boundaries          | Boundary value analysis  | Empty, zero, one, min, max, off-by-one, just outside the range                       |
| Rule combinations   | Decision table           | Each meaningful combination of the flags or conditions that drive branching          |
| Invalid input       | Negative testing         | Wrong type, malformed value, missing required field                                  |
| Error paths         | Negative testing         | Thrown errors, rejected results, failure return values                               |
| State transitions   | State transition testing | Behavior that depends on prior state or call sequence, including invalid transitions |
| Contract guarantees | -                        | Idempotence, immutability of inputs, ordering, defaults                              |
| Known-risky spots   | Error guessing           | Places this unit or its neighbors have broken before                                 |

Prefer a representative case per class over exhaustive permutations. Coverage of behavior beats coverage of lines.
When several inputs combine, cover the pairs that matter rather than the full cross-product.

#### When examples are the wrong tool

Some behaviors are defined by a rule that holds across the whole input space, not by a handful of cases. Where the project already has a property-based library, a single property earns more than twenty examples:

- **round trips** - `decode(encode(x))` equals `x` for any `x`
- **invariants** - the total never goes negative; the output is always sorted; every input item appears exactly once
- **idempotence** - applying it twice changes nothing after the first time
- **equivalence** - the fast path and the obvious slow path agree

Two conditions before reaching for one: the property must come from an independent source of truth, not from re-describing the implementation, and failures must be reproducible - record the seed and pin the failing case as a normal example test once it is found. Do not introduce a new library for this without asking.

### Phase 3: Write each test with a visible structure

Every test follows **Arrange - Act - Assert**, in that order and visibly separated:

1. **Arrange** - build the minimal input and any test doubles
2. **Act** - a single call to the unit under test
3. **Assert** - check the observable outcome

Naming rules:

- the name states the behavior and the condition, e.g. `returns zero when the cart is empty`
- a reader should understand what broke from the failure output alone, without opening the test
- group related tests so the suite reads as a specification of the unit

Assertion rules:

- assert on the specific value, not merely that something is truthy or defined
- assert the error type and the meaningful part of the message, not just that "it throws"
- avoid broad snapshots of whole objects when only one field carries the behavior

See `./resources/good-and-bad-tests.md` for worked before/after pairs of each rule.

#### When a new test fails against existing code

A test added to code that already works can fail for two very different reasons: you found a bug, or you wrote the wrong expectation. Decide which before changing anything.

- Suspect the observation before the system: re-read the test, the setup, and the interface being called.
- If the expectation came from a real source of truth and the code disagrees, that is a defect - report it rather than editing the assertion.
- Never adjust the expected value to match the output you observed unless you have confirmed that output is correct. That move silently turns a specification into a characterization test, and nobody reading it later can tell the difference.

### Phase 4: Control every source of nondeterminism

A unit test must produce the same result on every machine, in any order, forever. Handle each source explicitly:

| Source                        | Handling                                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Current time and dates        | Inject a clock or freeze time; never assert against "now"                                                          |
| Randomness and generated IDs  | Inject the generator or seed it                                                                                    |
| Timeouts, delays, retries     | Use the runner's fake timers; never `sleep` for a real duration                                                    |
| Async results                 | Await or return every promise; assert on rejections explicitly, never with a bare try/catch that can silently pass |
| Concurrency and ordering      | Assert on the set of outcomes when order is not part of the contract                                               |
| Locale, timezone, encoding    | Pin them, or assert on structured values instead of formatted strings                                              |
| Environment variables, config | Set them per test and restore them afterwards                                                                      |
| Shared fixtures               | Rebuild state per test; never depend on data another test created                                                  |

If a test cannot be made deterministic at the unit level, that is the signal it belongs in integration coverage.

### Phase 5: Keep the fixtures and doubles small

- build inputs with a small factory or builder that takes overrides, so each test states only the fields it cares about
- keep irrelevant setup out of the test body
- avoid shared mutable fixtures across tests; recreate state per test
- prefer the lightest test double that answers the question - a stub that returns a value usually beats a mock that verifies calls
- give load-bearing values a name - `expect(items).toHaveLength(7)` says nothing about why seven is right
- keep test data obviously synthetic: no real credentials, tokens, customer names, emails, or identifiers. A fixture committed once is committed forever

See `./resources/test-doubles-guide.md` for the double taxonomy, the boundary rule, and how to design code that does not need heavy mocking.

### Phase 6: For untested legacy code, characterize before you improve

When the code has no tests and its behavior is not documented, do not start from what it _should_ do:

1. Write tests that pin down what it _currently_ does, including behavior that looks wrong.
2. Run them and let the actual output define the expected values.
3. Flag anything suspicious as a question for the user - do not silently "fix" it while adding tests.
4. Only once the behavior is pinned, refactor or correct it, using those tests as the safety net.

Say clearly which tests are characterization tests, so nobody mistakes them for a specification of intended behavior.

### Phase 7: Repair an unreliable or slow suite

When the job is an existing test that fails intermittently, or a suite that has become too slow to trust:

1. **Reproduce the failure first** - repeated runs, the test in isolation, random order, parallel on and off, CI versus local. Each configuration accuses a different cause.
2. **Classify it** before editing: shared state, order dependence, resource contention, real clock, real delay, unawaited async, nondeterministic output.
3. **Fix the cause, not the symptom.** A raised timeout, an added retry, or a `skip` is containment. Every retried test is an open defect reporting itself as a pass.
4. **Prove it** by running the configuration that used to fail, repeatedly, and quoting both the original failure and the repeated green.

`./resources/flaky-test-triage.md` has the reproduction commands, the symptom-to-cause table, the retry and quarantine rules, and the slow-test cases.

When reviewing a whole suite rather than one test, add the suite-level signals: duplicated setup drifting across files, helpers that have grown into god objects, magic values with no stated meaning, skipped or commented-out tests with no issue link, global retries masking instability, committed secrets or personal data in fixtures, and a total runtime nobody owns.

### Phase 8: Review before finishing

Run the tests against `./resources/unit-test-review-checklist.md`.

For a suite that already exists, or when the review is the whole job rather than the last step of authoring, use `unslop-tests` instead. It carries the named-tell list, the severity tiers, and the evidence ladder for proving a weak test really is weak.

Two checks matter most, and both are **run, not imagined**:

- **Mutation check** - deliberately break the behavior the test claims to cover, run the test, confirm it fails, then restore the code and confirm it passes again. A test written after the implementation has never been seen failing; this is the only thing that proves it can. If it stays green while the behavior is broken, the assertion is too weak. Where the project runs a mutation-testing tool, that is the systematic version of the same check.
- **Refactor check** - rename internals and restructure without changing behavior; the test must still pass. If it breaks, it is coupled to implementation, not behavior.

Then report what was actually done:

- the command that ran, and the real result - counts, not "all green"
- the mutation check: which behavior was broken, and the failure it produced
- what is covered, and which listed cases were deliberately left out
- which tests are characterization tests rather than specifications
- design findings the tests surfaced: untestable seams, heavy setup, boundaries in the wrong place

## Common Failure Modes

- **Tautological assertion** - the expected value is recomputed the way the code computes it, so the test can never disagree with the code
- **Testing the mock** - every collaborator is stubbed, so the test only proves the stubs were called
- **Verifying through a side channel** - checking the database or internal state directly instead of observing through the interface
- **Multi-assert sprawl** - one test verifying five unrelated behaviors, so a failure says nothing specific
- **Hidden nondeterminism** - real clock, real randomness, real network, or locale-dependent formatting
- **Sleeping instead of controlling time** - a real delay that makes the suite slow and still flaky under load
- **Loop-hidden cases** - many cases inside one test, so the failure never says which input broke
- **Coverage theater** - calling code without asserting anything meaningful in order to move a percentage
- **Restating the implementation** - the test reads as a line-by-line echo of the function body
- **Over-mocking internals** - substituting collaborators the unit legitimately owns, which freezes the current design
- **Silently correcting legacy behavior** - changing what the code does while claiming to only add tests
- **Reshaping production code to suit the test** - restructuring the unit inside a test-adding change instead of raising the design finding
- **An imagined mutation check** - asserting the test would catch a break without ever breaking the behavior to see it
- **Retries as the fix** - a flake contained by re-running it, so the race stays in the product and the suite keeps reporting green
- **Skips with no owner** - a `skip`, `only`, or commented-out test with no issue link, quietly removing coverage
- **Secrets or real personal data in fixtures** - committed once, present in history forever

## Resource Map

- `./resources/good-and-bad-tests.md` - before/after examples of each rule, in neutral pseudocode
- `./resources/test-doubles-guide.md` - dummy, stub, spy, fake, and mock; where the boundary is; designing for testability
- `./resources/flaky-test-triage.md` - reproducing a flake, symptom-to-cause table, retry and quarantine rules, slow-test causes
- `./resources/unit-test-review-checklist.md` - final quality gate for new or reviewed unit tests

## Related Skills

- `unslop-tests` - the review pass on tests that already exist: the named-tell detector and the mutation-check gate
- `writing-unit-tests-quick` - the compact version, for routine everyday tests that do not need the full workflow
- `test-driven-development` - when the tests should drive the implementation instead of following it
- `designing-test-data` - when the inputs and boundary values need deliberate design first
- `designing-functional-tests` - when the behavior belongs in functional or end-to-end coverage instead
- `static-code-analysis-typescript` - when the underlying code quality is the real problem

## Definition of Done

This skill is complete when:

- the unit under test and its public interface are stated explicitly
- the project's existing test conventions were detected and followed
- the test level was chosen deliberately, and behavior that needs integration coverage was routed there instead of mocked
- the case list covers happy path, input classes, boundaries, invalid input, error paths, and state transitions where they apply
- each test has one reason to fail and an Arrange - Act - Assert structure
- expected values are independent literals, not recomputed logic
- every source of nondeterminism is controlled: time, randomness, async, locale, environment, shared state
- test doubles appear only at real boundaries
- test data is synthetic, with no secrets, credentials, or real personal data
- no test was left skipped without an issue link and an owner
- legacy behavior was characterized rather than silently changed
- production code was not reshaped inside the change; any testability finding was raised instead
- any flake was reproduced, diagnosed, and proved fixed by repeated runs - not contained by a retry
- the checklist passes, and the mutation and refactor checks were actually executed with their output quoted
