---
name: verifying-acceptance-criteria
description: 'Compares implementation evidence against acceptance criteria and shows what is met, partial, missing, or untestable. Use when checking feature readiness, preparing QA sign-off, or turning criteria into a concrete verification matrix without inventing missing behavior.'
argument-hint: 'Acceptance criteria source, implementation evidence, environment, and any known assumptions or blockers'
user-invocable: true
---

# Verifying Acceptance Criteria

Use this skill when readiness depends on evidence rather than optimism.
It helps compare the stated contract of a feature with what the implementation actually proves today.

## When to Use

- verify a feature against acceptance criteria before sign-off
- review a build, PR, or live environment for readiness
- separate met requirements from partial or missing behavior
- expose criteria that are too vague to verify honestly
- prepare a QA-ready verification matrix for release or handoff

## Verification Rules

- **Source of truth must be explicit** - story, AC list, PRD slice, or ticket text.
- **Do not fill requirement gaps silently** - unclear criteria become `Untestable`, not invented behavior.
- **One criterion, one verdict** - split compound criteria into atomic items before judging them.
- **Evidence beats intuition** - every verdict should point to observable code, UI, API behavior, logs, or test evidence.
- **Partial is a valid status** - it is better than pretending a near-miss is complete.

## Workflow

### Phase 0: Gather both sides of the comparison

Collect:

- the acceptance criteria or equivalent source of truth
- implementation evidence such as code changes, screenshots, API responses, a running URL, or exploratory notes
- the environment or build under review

If either side is missing, ask for it before continuing.

### Phase 1: Normalize the criteria

Convert the input into atomic criteria with stable IDs such as `AC-001`, `AC-002`, and `AC-003`.

If a criterion mixes multiple expectations, split it.
If a criterion is vague, keep it but mark it as a likely `Untestable` candidate until evidence proves otherwise.

### Phase 2: Verify each criterion

Use these verdicts:

| Status | Meaning |
| --- | --- |
| Met | The implementation clearly satisfies the criterion |
| Partial | Some of the criterion is implemented, but not all of it |
| Not Met | No convincing evidence of implementation exists |
| Untestable | The criterion is too vague or ambiguous to verify honestly |

For every criterion, capture:

- the verdict
- the evidence
- any assumptions, blockers, or follow-up questions

### Phase 3: Summarize readiness

Group the result into:

- **Ready** - criteria clearly met
- **Needs follow-up** - partial or not met
- **Needs clarification** - untestable or ambiguous

Do not collapse these into a single optimistic conclusion.
If there are meaningful gaps, call them out plainly.

### Phase 4: Recommend the next move

Depending on what the matrix shows:

- fix missing behavior
- clarify the criteria upstream
- add or adjust tests
- re-run verification after evidence improves

Use `./resources/ac-verification-template.md` when possible.

## Common Failure Modes

- verifying against a fuzzy paraphrase instead of the real acceptance criteria
- treating partial implementation as complete
- hiding ambiguity in prose instead of using an explicit status
- failing to cite evidence for the verdict
- collapsing multiple criteria into one vague pass/fail judgment

## Resource Map

- `./resources/ac-verification-template.md` - structure for the verification matrix and readiness summary

## Related Skills

- `analyzing-regression-scope` - when change impact needs tactical retest planning
- `designing-functional-tests` - when unmet criteria need new scenarios or manual cases
- `requirements-test-coverage-mapper` - when full traceability across test levels is required
- `reporting-bugs` - when a failed criterion should become a defect ticket

## Definition of Done

This skill is complete when:

- every meaningful criterion has a stable ID
- each criterion has an explicit status
- every verdict points to evidence or a clearly stated gap
- ambiguity is visible instead of hidden
- the summary makes sign-off risk obvious
