---
name: test-driven-development
description: 'Drives implementation test-first through red-green-refactor cycles: one failing test, the minimal code to pass it, then cleanup under green. Use before writing production code for a new behavior, and whenever the request mentions TDD, test-driven, test-first, red-green-refactor, "write the test first", "start with a failing test", or reproducing a bug with a test before fixing it. Also use when implementation keeps landing before anyone knows how it will be verified.'
argument-hint: 'Behavior to build or bug to fix, the public interface it lives behind, and the existing test runner (if any)'
user-invocable: true
---

# Test-Driven Development

Use this skill when tests should drive the design instead of documenting it afterwards.
It keeps the work in small, verified steps: one failing test, one minimal implementation, one cleanup, repeat.

This skill is **framework-agnostic**. It does not assume a runner, an assertion library, or a mocking tool.
Detect what the project already uses before the first cycle; if nothing exists yet, ask which runner to target before writing a test.

## When to Use

Trigger phrases: "TDD", "test-driven", "test-first", "red-green-refactor", "write the test first", "start with a failing test", "make it fail, then make it pass", "reproduce it with a test before fixing".

Typical situations:

- build a new behavior test-first
- fix a bug by reproducing it with a failing test first
- add safety before refactoring untested code
- explore an unclear interface by writing the call you wish existed
- recover a codebase where implementation consistently outruns verification

Reach for this skill **before** writing production code, not after. If tests are being added to code that already exists, use `writing-unit-tests` instead.

## What TDD Is Here

TDD is a **design technique that produces tests as a by-product** — not a coverage technique. The loop's value is the pressure it puts on the interface: code that is hard to test first is usually code that is hard to use.

Judge a session by whether the design got clearer and every change was verified, not by the coverage number it produced.

### The seam

A **seam** is the public boundary the test observes behavior through — the interface a real caller would use. Tests live at seams, never against internals.

Every cycle starts by knowing which seam it drives. If you cannot name the seam, you are not ready to write the test.

### Choosing the loop shape

| Situation | Loop shape |
| --- | --- |
| A single unit's logic, interface already known | **Inner loop only** — unit-level red-green-refactor |
| A feature crossing several units | **Double loop** — one failing acceptance test held red on the outside, inner unit cycles until it goes green |
| The interface itself is the open question | Write the call you wish existed as the first test, and let it define the shape |
| Behavior depends on a real boundary (DB, HTTP, browser) | Drive the owned logic with unit cycles; verify the boundary separately in integration coverage |

In the double loop, the outer test stays red for several inner cycles. Say so explicitly, so a red suite is not mistaken for broken work.

## Core Rules

- **Red before green** - no production code is written without a failing test demanding it.
- **Watch it fail for the right reason** - a test that fails on a typo, a missing import, or a setup error proves nothing. Read the failure message every time.
- **Evidence, not assertion** - actually run the tests at each step and quote the real output. Never claim a test is red or green without having seen it.
- **Minimal implementation** - write only enough code to pass the current test. No speculative branches, no features the next test has not asked for yet.
- **One slice at a time** - one behavior, one test, one implementation. Never write a batch of tests up front against imagined behavior.
- **Refactor only under green** - restructure with the suite passing, and run it again after. Behavior must not change during a refactor step.
- **Test at the public interface** - drive the unit through the seam a real caller would use, not through internals.
- **Match step size to confidence** - obvious behavior takes bigger steps; unfamiliar or fiddly behavior takes smaller ones. Repeated failure to reach green means the step was too big.
- **Commit at green** - each completed cycle is a safe point to commit.

## Workflow

### Phase 0: Agree the interface and the seam

Before the first cycle, establish:

- the behavior being built, in the user's own vocabulary
- the public interface it will live behind
- the seam the tests will observe it through
- the loop shape from the table above
- what is explicitly out of scope for this session

If the interface is genuinely unknown, that is fine: write the call you wish existed in the first test and let it define the shape. Do not silently invent requirements the user has not stated.

### Phase 1: Write the test list

List the behaviors to build, in order, smallest and most central first.
This is a queue, not a batch: it records what is coming, it does not authorize writing those tests yet.

Sequence the list so that each entry:

- adds one observable behavior
- can be made to pass in a few lines
- builds on what the previous cycle established

Start with the simplest case that is still interesting — usually a degenerate or empty input — then work outward to the general case.

Keep the list visible and update it as cycles reveal new cases. Use `./resources/tdd-cycle-log-template.md` when the session runs long enough to need a record.

### Phase 2: Run the cycle

Repeat for one entry at a time. `./resources/worked-example.md` shows several consecutive cycles in full.

#### Red

1. Write exactly one failing test for the next behavior.
2. Run it and read the actual output.
3. Confirm it fails, and that the failure message describes the **missing behavior** — not a syntax error, missing file, or broken fixture. If it fails for a mechanical reason, fix that first and run again; the mechanical failure does not count as red.
4. If it passes immediately, stop: either the behavior already exists, or the test asserts nothing meaningful. Fix the test before continuing.
5. Check the failure message would be understandable to someone who did not write the test. If not, improve the assertion now — this is the cheapest moment to do it.

#### Green

Get to green as fast as possible. Ugly is fine here; the refactor step is where it gets cleaned up.

Pick the strategy that fits your confidence:

| Strategy | Use when | What you write |
| --- | --- | --- |
| **Obvious implementation** | You know exactly how it works and it is small | The real implementation, directly |
| **Fake it** | You are unsure, or want the loop green quickly | A hardcoded constant that satisfies this test |
| **Triangulation** | A faked value needs generalizing | A second test with different data, which forces the real logic |

Then:

1. Run the **full suite**, not just the new test.
2. Confirm green with real output.
3. Do not clean up yet.

Hardcoding is legitimate — the next test is what forces generalization. What is not legitimate is leaving a fake in place with no test on the list that will remove it.

See `./resources/green-step-strategies.md` for how to choose between them and how to triangulate deliberately.

#### Refactor

With everything green, look for these in order, in both the production code and the tests:

1. **Duplication** — including duplication between the test's expected value and the implementation
2. **Naming** — do the names now match the vocabulary the tests revealed?
3. **Structure** — long functions, misplaced responsibility, a parameter list that keeps growing
4. **Test cleanliness** — extract a factory, collapse near-identical tests into a parameterized one

Rules:

- change structure only, never behavior
- one refactoring at a time, running the suite after each
- if a refactor turns the suite red, revert it rather than chasing the failure forward
- duplication is a signal, not a sin — wait until the third occurrence before extracting an abstraction

Refactoring is optional per cycle but not optional overall. Skipping it repeatedly is how a green suite ends up guarding a mess.

Then take the next entry from the list.

### Phase 3: When you get stuck

If two or three attempts do not reach green:

1. **Stop adding code.** Revert to the last green commit rather than piling fixes onto a broken state.
2. **Take a smaller step.** Split the behavior; find a case that can pass in a couple of lines.
3. **Check the test, not just the code.** A test that is awkward to write is usually pointing at an interface problem — too many dependencies, hidden state, a boundary in the wrong place. Say that out loud; it is a design finding.
4. **Re-check the seam.** If the test needs heavy setup or many doubles, it is probably driving the wrong boundary.

Never leave the suite red at the end of a work session without saying so explicitly.

### Phase 4: Fix bugs by reproducing them first

For a defect, the cycle starts with reproduction.

1. **Find the correct seam.** The right seam is one where the test exercises the real bug pattern as it occurs at the call site. A test at a seam too shallow to reproduce the actual conditions gives false confidence.
2. **Write a test that fails because of the bug**, and confirm the failure matches the reported symptom — not a different failure that happens to be nearby. Wrong symptom means wrong bug.
3. **Minimise the repro.** Cut inputs, setup, and steps one at a time, re-running after each cut, until every remaining element is load-bearing. The minimal case becomes the permanent regression test.
4. **Fix the code** until the test passes.
5. **Re-run the original, un-minimised scenario** to confirm the real-world symptom is gone.
6. **Keep the test permanently** — it is the regression guard.

If no correct seam exists — the bug can only be reproduced through a path nothing can drive in a test — **that is itself the finding**. Say so, fix the bug, and flag the missing seam as a design problem rather than pretending a shallow test covers it.

Never fix first and test afterwards. A test written after the fix has never been seen catching the bug.

### Phase 5: Entering legacy code

To change code that has no tests, get a safety net before the loop starts:

1. Write characterization tests that pin what the code **currently** does, letting actual output define the expected values.
2. Raise anything that looks wrong as a question rather than fixing it in passing.
3. With the net in place, start normal red-green-refactor cycles for the new behavior.

See the legacy phase in `writing-unit-tests` for how to write those characterization tests.

### Phase 6: Know when to step out of the loop

TDD is not the right tool for everything. Step out and say so when:

- the behavior can only be proven across a real network, database, or browser — that is integration or end-to-end work
- the task is a pure rename or mechanical migration with no behavior change
- the design question is too open to express as an assertion yet — spike first, throw the spike away, then start the cycle properly
- the code is exploratory and genuinely disposable

Say which of these applies instead of forcing a unit-shaped test onto the problem.

### Phase 7: Close the session

Before declaring the work finished:

- run the full suite one final time and quote the result
- read the tests end to end — do they describe the feature to someone who has not seen the code?
- list any test-list entries left unbuilt, rather than dropping them silently
- name any fake implementation still in place and the test that should remove it
- state what the loop revealed about the design, including seams that turned out to be in the wrong place

## Common Failure Modes

- **Horizontal slicing** - writing all the tests first, then all the implementation. The tests then verify imagined behavior and lock in a shape nobody has validated.
- **Green without red** - writing the test after the code, so nobody has seen it fail.
- **Claiming red without running** - reporting a state the tests were never actually executed to prove.
- **Failing for the wrong reason** - the red step fails on a missing import or broken fixture, and the assertion is never actually exercised.
- **Over-implementing** - adding branches, options, and abstractions the current test never demanded.
- **Fake left behind** - a hardcoded value ships because no test on the list ever forced it to generalize.
- **Refactoring in the green step** - mixing behavior change with cleanup, so a failure has two possible causes.
- **Never refactoring** - always moving to the next test, so the design debt the loop was supposed to prevent accumulates anyway.
- **Step too big** - fighting for green across many attempts instead of reverting and splitting the behavior.
- **Testing internals** - driving private methods, which makes every later refactor break the suite.
- **Skipping the suite run** - running only the new test and discovering the regression several cycles later.
- **Deleting the red** - loosening or removing a stubborn test instead of fixing the behavior it describes.
- **Treating TDD as a coverage tool** - chasing a percentage rather than using the loop to shape the interface.

## Resource Map

- `./resources/worked-example.md` - consecutive cycles in full, in neutral pseudocode
- `./resources/green-step-strategies.md` - fake it, obvious implementation, triangulation, step size, and the revert protocol
- `./resources/tdd-cycle-log-template.md` - test list plus per-cycle record of red, green, and refactor steps

## Related Skills

- `test-driven-development-quick` - the compact version, for routine single-behavior cycles that do not need the full workflow
- `writing-unit-tests` - the quality standard each test produced by the loop must meet, and the characterization-test procedure for legacy code
- `designing-test-data` - when the inputs and boundary values need deliberate design before the cycles start
- `designing-functional-tests` - when the behavior belongs in functional or end-to-end coverage instead
- `code-review` - for the deeper structural cleanup that does not belong inside the loop

## Definition of Done

This skill is complete when:

- the interface, the seam, and the loop shape were agreed before the first test
- a test list exists and was worked one entry at a time
- every production change was preceded by a test **seen** failing for the right reason, with real output
- each green step contained only the code the current test demanded
- any faked implementation was either generalized or has a listed test that will force it
- refactoring happened under a passing suite and changed no behavior
- the full suite passes and any bug fixed in the session has a minimised, permanent regression test
- design findings the loop surfaced — awkward seams, heavy setup, missing boundaries — were stated
- remaining entries on the test list are stated explicitly rather than silently dropped
