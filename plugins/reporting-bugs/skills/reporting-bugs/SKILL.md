---
name: reporting-bugs
description: 'Transforms rough tester notes, screenshots, console output, or observed behavior into reproducible defect reports with severity, evidence, and follow-up guidance. Use when logging bugs, triaging intermittent issues, or rewriting vague defect notes into developer-ready reports.'
argument-hint: 'Observed behavior, expected behavior, steps, environment, evidence, and any reproduction notes'
user-invocable: true
---

# Reporting Bugs

Use this skill to turn messy observations into bug reports that developers can actually act on.
It is optimized for reproducibility, evidence quality, and clean communication rather than speculative root-cause analysis.

## When to Use

- write a bug report from rough notes or screenshots
- normalize findings from exploratory testing
- triage an intermittent or hard-to-reproduce issue
- rewrite a vague defect description into a developer-ready report
- capture product, accessibility, or automation defects in a consistent format

## Reporting Rules

- **Observation first** - describe what happened before discussing why it may have happened.
- **Reproduction beats opinion** - a calm, reproducible report is worth more than a dramatic summary.
- **Evidence should travel with the bug** - attach logs, screenshots, recordings, payloads, or selectors when available.
- **Severity follows impact** - grade the issue by user or business impact, not by frustration level.
- **Unknowns stay visible** - if confidence is low, say so clearly instead of bluffing.

## Workflow

### Phase 0: Gather the raw material

Collect what exists today:

- short summary of the problem
- environment and build details
- preconditions or setup state
- reproduction steps or triggering actions
- actual result
- expected result
- evidence such as screenshots, traces, logs, payloads, or timestamps

If critical pieces are missing, ask only for what is needed to make the report actionable.

### Phase 1: Normalize the reproduction story

Reduce the issue to a clean sequence:

1. starting state
2. user action or system trigger
3. observable result
4. expected result

If the issue is intermittent, capture the pattern explicitly:

- `always`
- `sometimes`
- `seen once`
- `not reproduced yet`

### Phase 2: Classify the issue

Give the bug enough metadata to route it correctly.

Suggested dimensions:

- **Category** - functional, data, auth, performance, accessibility, automation, or integration
- **Severity** - use `./resources/severity-matrix.md`
- **Confidence** - confirmed, likely, or suspected
- **Reproducibility** - always, intermittent, once, or unknown

Do not write a fake root cause.
If the user has a strong suspicion, place it in a separate **Notes / Hypothesis** section.

### Phase 3: Build the report

Use `./resources/bug-report-template.md` when possible.

A strong report should include:

- clear title with the broken behavior and surface
- environment block
- preconditions
- numbered steps to reproduce
- actual vs expected result
- severity with short justification
- evidence list
- missing evidence or follow-up questions if the report is still incomplete

### Phase 4: Add next-step guidance

When useful, end with one or more of these:

- suggested retest focus after the fix
- related areas that may also be affected
- test coverage that should be added or updated
- evidence still needed to confirm the defect fully

## Common Failure Modes

- reporting a symptom without a trigger
- skipping expected behavior and forcing the developer to guess the contract
- writing severity with no business or user impact explanation
- mixing multiple bugs into one ticket
- stating a root cause as fact without evidence

## Resource Map

- `./resources/bug-report-template.md` - default structure for the final bug report
- `./resources/severity-matrix.md` - impact-based severity rubric

## Related Skills

- `designing-functional-tests` - when the defect needs new manual coverage or regression updates
- `auditing-accessibility` - when the report is centered on WCAG or assistive-technology failures
- `requirements-test-coverage-mapper` - when a bug reveals a larger coverage gap against stated requirements

## Definition of Done

This skill is complete when:

- the bug can be understood without extra chat context
- reproduction details are explicit or clearly marked as missing
- severity is justified by impact
- evidence and unknowns are both visible
- the final report is ready to paste into a ticketing system or team channel
