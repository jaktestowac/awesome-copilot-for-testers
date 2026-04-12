---
name: designing-functional-tests
description: 'Designs risk-based functional test plans, manual test cases, regression slices, and automation handoff packs from requirements, URLs, or exploratory notes. Use when preparing manual QA coverage before automation, turning feature descriptions into scenario catalogs, or converting exploratory findings into structured test assets.'
argument-hint: 'Feature scope, requirements or URL, roles, environment, and whether you need a plan, cases, or regression scope'
user-invocable: true
---

# Designing Functional Tests

Use this skill when the goal is to turn product intent into tester-ready coverage rather than directly generating automation.
It helps produce plans and cases that are clear enough for manual execution and clean enough to hand off to automation later.

## When to Use

- create a risk-based functional test plan
- turn acceptance criteria into manual test cases
- convert exploratory notes into reusable scenario packs
- prepare a regression slice for a bug fix or small feature
- identify which scenarios should move into automated tests first

## Core Rules

- **No silent invention** - missing behavior becomes a question or an explicit assumption.
- **Risk decides depth** - high-risk flows deserve positive, negative, boundary, permission, and recovery coverage.
- **One case proves one thing** - avoid giant cases that validate five behaviors at once.
- **Stable IDs matter** - use durable IDs for scenarios and cases so they can be referenced later.
- **Manual first, automation second** - good automation starts with stable, observable manual intent.

## Workflow

### Phase 0: Frame the deliverable

Decide which artifact is needed:

- **Full plan** - scope, priorities, scenario catalog, risks, open questions
- **Manual cases** - detailed steps and expected results
- **Regression slice** - the smallest believable retest pack after a change

If the user did not specify the artifact, choose the lightest format that still solves the task.

### Phase 1: Run the test-readiness gate

Before writing cases, confirm the test basis gives enough signal to work with.

Minimum signal:

- the feature or flow being tested
- the actor or user role
- the starting state or preconditions
- an observable success outcome

If any of these are missing:

1. Ask targeted questions.
2. If the user wants to move fast, proceed with an **Assumptions** section instead of inventing hidden requirements.
3. Tag affected scenarios or cases with `ASSUMPTION`.

Do not write confident-looking expected results for behavior that is still unknown.

### Phase 2: Map the coverage lenses

For each high-value flow, check these lenses:

| Lens | What to cover |
| --- | --- |
| Happy path | Baseline success path |
| Negative | Invalid inputs, rejected actions, failures |
| Boundary | Empty, min, max, off-by-one, format edges |
| Permissions | Wrong role, wrong state, missing access |
| Recovery | Retry, refresh, session loss, partial failure |
| Data / State | Persistence, deduplication, conflicting updates |
| Accessibility smoke | Keyboard reachability, labels, error visibility |

Not every flow needs the same depth.
Apply full coverage to risky flows and lighter smoke coverage to low-risk areas.

### Phase 3: Prioritize before expanding

Use a simple three-level priority scale:

- **High** - critical business path, security-sensitive area, money/data movement, or frequent user action
- **Medium** - important supporting workflow or high-change area
- **Low** - secondary behavior, visual polish, or low-impact option

High-priority flows should include at least:

- one happy path
- one negative case
- one boundary or permission case
- one recovery or state-handling case

### Phase 4: Produce the requested artifact

#### Full plan

Use `./resources/test-plan-template.md` when possible.
A good plan includes:

- scope and exclusions
- risks and priorities
- scenario catalog with IDs like `SCN-001`
- assumptions and open questions
- automation handoff notes

#### Manual test cases

Use `./resources/manual-test-cases-template.md` when possible.

Case rules:

- Use IDs like `MTC-001`
- Keep steps observable and short
- Write specific expected results, not "works correctly"
- Include case type tags such as `happy`, `negative`, `boundary`, `permission`, `recovery`, `a11y-smoke`
- Add an **Automation Candidate** value: `high`, `medium`, or `low`

#### Regression slice

For small changes or bug fixes, produce:

- changed surface
- must-retest scenarios
- adjacent risk areas
- optional "do later" scenarios if time is tight

### Phase 5: Prepare the handoff

Before finishing, decide what should happen next:

- send risky edge cases into the `qa-strategy` workflow for adversarial expansion
- send stable, repeatable scenarios into `test-generator` or `playwright-generate-test`
- send requirements-heavy work into `requirements-test-coverage-mapper` when traceability matters more than step-by-step execution

## Output Standards

Always include:

- clear scope
- priority or risk signal
- explicit assumptions or open questions
- scenario or case IDs
- enough detail for another tester to execute without a live explanation

Good output is handoff-ready, not just impressive-looking.

## Common Failure Modes

- writing a plan that only covers happy paths
- burying critical assumptions inside prose
- mixing multiple assertions into one giant test case
- using vague expected results such as "data saved successfully"
- generating every possible case without prioritization

## Resource Map

- `./resources/test-plan-template.md` - structure for full plans and regression slices
- `./resources/manual-test-cases-template.md` - table format for detailed manual execution

## Related Skills

- `requirements-test-coverage-mapper` - when traceability to PRD, stories, or AC is the main deliverable
- `reporting-bugs` - when the task has shifted from planning to documenting a defect
- `auditing-accessibility` - when coverage needs a deeper accessibility pass instead of smoke checks

## Definition of Done

This skill is complete when:

- the requested artifact type is clear
- missing information is either answered or listed as assumptions
- high-risk flows have deeper coverage than low-risk flows
- each case or scenario has a stable ID
- the output can be executed or handed off without extra explanation
