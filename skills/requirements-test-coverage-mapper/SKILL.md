---
name: requirements-test-coverage-mapper
description: 'Maps requirements (PRD, user stories, acceptance criteria) to planned test coverage via a Requirements Traceability Matrix, exposing coverage gaps, risks, test levels, prioritization, and automation candidates. Use when designing coverage from a specification, checking coverage completeness for a PRD or user story, finding missing acceptance criteria, or building a risk-based regression strategy. When the tests already exist and the matrix has to be extracted from them, verified, and kept accurate, use the tracing-requirements-to-code skill instead.'
argument-hint: 'PRD, user stories, or acceptance criteria to map, plus scope boundaries and known constraints'
user-invocable: true
---

# Requirements → Test Coverage Mapper (RTM)

This skill turns a PRD, user stories, acceptance criteria, and constraints into a traceability-driven test coverage plan:

- a Requirements Traceability Matrix (RTM)
- a gap & ambiguity report
- test design recommendations across levels (unit/API/UI/e2e/non-functional)
- automation candidates and CI gating suggestions

The output is designed to be used as a living artifact and single source of truth for coverage, readiness, and auditability.

## When to Use

Use this skill when you need to:

- Validate coverage completeness before/after implementation
- Convert PRD/user stories into a test plan that is traceable and reviewable
- Identify missing acceptance criteria, ambiguous requirements, or hidden scope
- Support change impact analysis when requirements evolve
- Build a risk-based regression strategy or release readiness assessment

## Operational Workflow

### Phase 0: Strategy Selection (Context First)

Classify the work to adjust rigor and output depth:

- Delivery stage: MVP / Iteration / Hardening / Release / Hotfix
- Domain risk: Low / Medium / High (payments, auth, compliance = high)
- Change surface: UI / API / Data / Infra / Cross-cutting
- AI criticality: None / Supporting / Core
- Target tooling (optional): Jira / Azure DevOps / TestRail / GitHub Issues

If unknown, mark as `TBD` and proceed with safe defaults.

### Phase 1: Discovery

Ask targeted questions where the answer would change the coverage plan. Cover these areas:

1. **Test basis source** - PRD link/text? user stories? AC? designs? (what is the "source of truth"?)
2. **Scope boundaries** - what is explicitly in/out? any non-goals?
3. **Quality attributes** - performance, security, accessibility, reliability, observability expectations?
4. **Data & environments** - test envs available, data seeding/masking rules, third-party dependencies?
5. **Release constraints** - deadline, MVP cuts, rollout type (flagged, staged, big-bang)?
6. **Definition of Done / acceptance** - who signs off and what evidence is required?

If the user cannot answer (or wants to move fast), capture the gaps as explicit assumptions in the output and proceed.

### Phase 2: Normalization (Make Requirements Traceable)

Normalize input into atomic, testable requirements:

- Split compound requirements into smaller "testable statements"
- Assign stable IDs if missing: `REQ-001`… (requirements), `US-001`… (user stories), `AC-001`… (acceptance criteria)
- Mark ambiguous statements as `NEEDS_CLARIFICATION`

### Phase 3: Coverage Design (Levels + Risks + Data)

For each requirement, propose coverage across:

- **Functional**: positive/negative, edge cases, permissions
- **Integration**: APIs, events, DB, third parties
- **UX**: key flows, accessibility, error messaging
- **Non-functional**: performance, security, reliability, observability
- **AI-specific (if applicable)**: evaluation, drift, hallucinations/failure modes, fallbacks

Use risk-based thinking: assign impact (H/M/L) and likelihood (H/M/L), and derive priority and test depth from risk.

### Phase 3b: Cross-Check the Backward Direction

The RTM table has one row per requirement, so it can only ever show requirements with no test. When tests already exist, also run the other direction: **which existing tests map to no requirement?**

An orphan test is one of three things, and they need different actions:

- an **undocumented requirement** - the behaviour matters, someone tested it, nobody wrote it down. Add it to the requirement set.
- a **test of removed behaviour** - delete it.
- a **test that proves nothing** - route it to `unslop-tests` rather than mapping it.

Report orphans classified, not counted. For a full bidirectional pass over an existing codebase, including annotation, link verification, and drift detection, use `tracing-requirements-to-code`.

### Phase 4: Produce the Output

Follow the strict output schema in `./resources/coverage-map-template.md` — document metadata, executive coverage summary, RTM table, scenario catalog, gap report, risk-based prioritization, automation/CI recommendations, and assumptions/change-impact notes, in that order.

## Quality Rules (Non-Negotiable)

### DO

- Make every requirement atomic and testable
- Use stable IDs for traceability
- Flag unknowns; don't invent constraints
- Prefer measurable outcomes and concrete expected results
- Recommend test levels intentionally (not everything must be E2E)

### DON'T

- Don't hallucinate requirements, flows, or data models
- Don't produce only UI tests (must consider unit/API/NFR)
- Don't accept ambiguous requirements without logging them as gaps
- Don't mark coverage "complete" if AC is missing or unclear

## Self-Review Checklist

Before final output:

- [ ] Every requirement has an ID and is atomic
- [ ] Every requirement maps to ≥1 scenario OR is flagged missing
- [ ] Where tests already exist, orphan tests are identified and classified
- [ ] A scenario marked `Exists` was confirmed against the actual test, not assumed from its title
- [ ] Ambiguities are captured as explicit questions
- [ ] Risk is assigned and used to prioritize
- [ ] Non-functional coverage is addressed where relevant
- [ ] Assumptions are listed explicitly

## Resource Map

- `./resources/coverage-map-template.md` - the strict output schema (RTM table, scenario catalog, gap report, prioritization tiers) with a worked example

## Related Skills

- `tracing-requirements-to-code` - when the tests already exist and the matrix must be extracted from them, verified, and kept accurate. Use this skill to plan coverage from a spec, that one to trace what was actually built.
- `prd-generator` - when requirements themselves still need to be written before mapping
- `verifying-acceptance-criteria` - when a specific build must be checked against the acceptance criteria
- `analyzing-regression-scope` - when the question is tactical retest scope after a change rather than full traceability
- `designing-functional-tests` - when RTM scenarios should expand into detailed test cases
- `assessing-release-readiness` - when the coverage gaps found here feed a go/no-go decision

## Definition of Done

This skill is complete when:

- every requirement is atomic, has a stable ID, and maps to at least one scenario or an explicit `MISSING_TEST` flag
- gaps and ambiguities are logged with concrete resolution questions
- prioritization tiers are risk-derived and actionable
- automation and CI recommendations are justified per scenario
- assumptions and change-impact notes are explicit
