---
name: tracing-requirements-to-code
description: 'Builds and maintains bidirectional traceability between requirements and the tests that verify them: extracts a matrix from an existing codebase, annotates tests with requirement IDs, finds orphan tests and uncovered requirements, verifies that each link is real, and enforces linkage in CI. Use when a suite exists but nobody can say what it proves, when an auditor or stakeholder asks which tests cover a requirement, when a traceability matrix has gone stale, or when a requirement changes and its blast radius must be found.'
argument-hint: 'Test suite path, where requirements live (tracker, PRD, specs), any existing matrix or ID convention, and whether the goal is a one-off extraction or an enforced link'
user-invocable: true
---

# Tracing Requirements to Code

Use this skill when the tests already exist and the question is what they actually verify.

Traceability is usually taught forward: take a specification, derive requirements, plan tests. That is `requirements-test-coverage-mapper`, and it is the right skill when you start from a document. This skill handles the other and more common situation: **a live codebase, hundreds of tests, requirements scattered across a tracker and three documents, and no reliable statement of which test proves what.**

The insistence that makes this worth doing: **a traceability link is a claim, not a record.** A test tagged `@req REQ-014` claims to verify REQ-014, and nothing about writing the tag makes that true. An unverified matrix is worse than no matrix, because it converts ignorance into documented confidence, and it is exactly the artifact people reach for when deciding what not to test.

## When to Use

- a suite exists and nobody can say which requirement a given test serves
- someone asks "which tests cover this requirement" and the answer takes a day
- a matrix was built once, was accurate that week, and has not been true since
- a requirement is changing and its affected tests must be found
- tests exist that nobody can trace to any requirement
- an audit, certification, or customer questionnaire needs coverage evidence

## Operating Principles

- **Traceability runs both ways.** Requirement to test finds coverage gaps. Test to requirement finds orphan tests, and nobody looks in that direction.
- **A link is verified or it is a guess.** The test must fail when the requirement's behaviour is broken. Until it has been seen to, the link is unconfirmed and labelled as such.
- **Extract from evidence, not from titles.** A test called "validates the discount rule" is a hypothesis about what it does. The assertions are the evidence.
- **The matrix lives in the code, not in a spreadsheet.** A link stored beside the test moves when the test moves. A link in a document rots the first time anyone refactors.
- **Orphans are findings in both directions.** An uncovered requirement is a coverage gap. An orphan test is either an undocumented requirement or a test of nothing, and both are worth knowing.
- **Drift is the default.** Links rot silently through renames, deletions, and refactors. Without a CI check, the matrix is accurate on the day it is written and decreasingly true afterwards.

## Workflow

### Phase 0: Establish the requirement source

Before touching tests, fix what a requirement **is** in this project and where the authoritative list lives:

- an issue tracker with stable keys (`PROJ-1234`)
- acceptance criteria inside stories
- a PRD or specification document
- a regulatory or contractual requirement list
- **none of the above**, in which case the first deliverable is a requirement inventory derived from the code and the tracker, marked as derived rather than authoritative

Record the ID scheme, and whether IDs are stable. An ID that changes when a ticket moves project is not usable as a link target, and discovering that after annotating 400 tests is expensive.

`./resources/id-and-annotation-conventions.md` covers choosing a scheme that survives.

### Phase 1: Extract what the tests actually verify

Work through `./resources/extracting-an-rtm.md`. The method, in short:

1. **Inventory the tests.** Every test, its file, its title, its level.
2. **Read the assertions, not the titles.** What behaviour would have to break for this test to fail?
3. **Group by behaviour**, not by file. Several tests often serve one requirement, and one god test sometimes serves five.
4. **Map to requirements** where the mapping is defensible.
5. **Label the confidence** of each mapping: `stated` (the test or its commit names the requirement), `inferred` (the behaviour clearly matches), `guessed` (it plausibly relates).

Do not silently promote a guess. A matrix that distinguishes stated from guessed is honest and usable; one that flattens them is a document nobody should trust and everybody will.

### Phase 2: Annotate at the source

Move each defensible link into the code, next to the test it describes.

```ts
test('rejects a card that expired last month @req:REQ-014', async ({ page }) => { ... });
```

Per-runner spellings, the machine-readable formats, and the trade-offs between tags, annotations, and comments are in `./resources/id-and-annotation-conventions.md`.

Rules that decide whether this survives:

- **one canonical form**, chosen once and used everywhere, so a generator can parse it
- **machine-readable**, because a convention nothing checks is a convention that decays
- **at the test level**, not the file level, unless every test in the file genuinely serves the same requirement
- **many-to-many is normal**: one test may serve several requirements and one requirement needs several tests

### Phase 3: Verify the links

The phase that separates this from bookkeeping. For each link, and at minimum for every link on a high-risk requirement:

1. Break the behaviour the requirement describes.
2. Run the linked test.
3. Confirm it fails, and that the failure names something recognizable.
4. Record the link as **verified** with the date.

A link that survives step 3 with a passing test is a false claim in the matrix. Fix the test or remove the link; do not leave it as documented coverage.

This is the same standard `unslop-tests` and `migrating-tests-to-playwright` apply, for the same reason: a test that has never been observed failing has unmeasured value, and a matrix built on such tests inherits that.

Verifying every link in a large suite is not affordable. Verify by risk, record the coverage of the verification itself, and state what was taken on trust.

### Phase 4: Find the orphans

Cross the two directions and take all four quadrants seriously. `./resources/orphan-and-drift-detection.md` has the triage.

| | Has a test | No test |
| --- | --- | --- |
| **Has a requirement** | Covered, verify the link | **Coverage gap** |
| **No requirement** | **Orphan test** | Out of scope |

- **Coverage gap**: a requirement nothing verifies. Route to `designing-functional-tests` or `requirements-test-coverage-mapper`.
- **Orphan test**: the direction nobody looks. It is one of three things, and the distinction matters:
  - an **undocumented requirement**, which is the valuable case. The behaviour matters, someone tested it, nobody wrote it down. Write it down.
  - a **test of a removed feature**, which should be deleted.
  - a **test that proves nothing**, which `unslop-tests` should judge.

Reporting orphan tests as a single count wastes them. Classify each one.

### Phase 5: Automate and gate

A matrix maintained by hand is a matrix that is true once. `./resources/traceability-automation.md` has a generator that parses annotations and emits the matrix, plus the CI gate.

Enforce, in increasing order of strictness, and adopt them in this order:

1. **Every annotation references a requirement that exists.** Cheap, catches typos and deleted tickets immediately.
2. **Every high-risk requirement has at least one linked test.** Scoped to a declared critical set rather than everything.
3. **New tests carry an annotation.** Applied to changed files only, so the backlog does not block every pull request.
4. **No requirement loses its last link without an explicit acknowledgement.**

Introduce a gate against changed files first. A gate that fails on a pre-existing backlog of 300 unannotated tests gets disabled in a week, and then nothing is enforced at all.

### Phase 6: Handle change

When a requirement changes, the matrix is what tells you what to revisit. The procedure is in `./resources/traceability-automation.md`:

- find every test linked to the changed requirement
- classify each: still valid, needs updating, now wrong
- update the tests **and** the links in the same change
- when a requirement is removed, its tests are deleted or re-linked, never left pointing at nothing

Requirement changes are the main source of drift, and they are the moment traceability pays for itself. Hand the wider retest question to `analyzing-regression-scope`.

### Phase 7: Report

`./resources/traceability-automation.md` has the report shape. It states:

- coverage per requirement, with the link confidence and verification status
- uncovered requirements, ranked by risk
- orphan tests, classified rather than counted
- links that could not be verified, and why
- drift found since the last run
- **what the matrix does not cover**, which is the line that keeps it from being over-quoted

## Common Failure Modes

- a matrix in a spreadsheet, accurate the day it was written, quietly wrong within a month
- links inferred from test titles, so a misleadingly named test becomes documented coverage
- stated and guessed mappings flattened into one column
- links recorded and never verified, converting ignorance into documented confidence
- orphan tests reported as a number rather than classified
- annotating in a format nothing parses, so nothing checks it
- a CI gate switched on against the whole backlog, then disabled and never restored
- a requirement edited without touching the tests linked to it
- treating full traceability as achievable everywhere, rather than mandatory on the risky part and best-effort elsewhere

## Resource Map

- `./resources/id-and-annotation-conventions.md` - choosing a stable ID scheme, per-runner annotation spellings for Playwright, Vitest, Jest, and Cucumber, and the many-to-many cases
- `./resources/extracting-an-rtm.md` - building the matrix from an existing codebase: reading assertions rather than titles, confidence labels, and a worked extraction
- `./resources/orphan-and-drift-detection.md` - the four quadrants, orphan-test classification, the ways links rot, and the triage table
- `./resources/traceability-automation.md` - a generator script, the staged CI gate, the change-impact procedure, and the report template

## Related Skills

- `requirements-test-coverage-mapper` - the forward direction: designing coverage from a PRD before the tests exist. Use that one to plan, this one to verify what was built.
- `verifying-acceptance-criteria` - when the question is whether a specific build meets its criteria, rather than which test covers what
- `analyzing-regression-scope` - when a requirement change needs its full retest blast radius, beyond the linked tests
- `unslop-tests` - when an orphan test needs judging on whether it proves anything
- `designing-functional-tests` - when an uncovered requirement needs its tests designed
- `documenting-test-suites` - where the ID convention and the matrix's location belong permanently
- `assessing-release-readiness` - which consumes the uncovered-requirement list as release evidence

## Definition of Done

This skill is complete when:

- the authoritative requirement source and its ID stability are recorded
- every mapping carries a confidence label of stated, inferred, or guessed, and guesses are not promoted silently
- defensible links live in the code beside their tests, in one canonical machine-readable form
- every link on a high-risk requirement has been verified by breaking the behaviour and observing the test fail, with the date recorded
- links that could not be verified are labelled unverified rather than omitted
- both directions are crossed: uncovered requirements ranked by risk, and orphan tests classified as undocumented requirement, dead test, or proves-nothing
- a generator produces the matrix from the annotations rather than a human maintaining it
- a CI gate is enforced against changed files at minimum, and the staged escalation is recorded
- the change procedure updates tests and links together
- the report states what the matrix does not cover
