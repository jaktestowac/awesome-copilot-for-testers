---
name: analyzing-regression-scope
description: 'Analyzes diffs, changed files, hotfixes, and release candidates to identify where regression risk spreads and what must be retested first. Use when scoping retest after a change, reviewing QA impact for a pull request, or building a minimal confidence suite for release validation.'
argument-hint: 'Diff, changed files, PR summary, release notes, critical flows, and any known risk areas'
user-invocable: true
---

# Analyzing Regression Scope

Use this skill when the real question is not "how do we test everything?" but "what must we retest now, and why?"
It is built for risk-aware retest planning after code changes, configuration shifts, dependency updates, or release packaging.

## When to Use

- analyze regression scope after a bug fix or feature change
- decide what must be retested for a hotfix
- prepare a release confidence suite from a diff or PR
- explain QA impact of shared component or config changes
- separate must-retest areas from nice-to-have regression coverage

## Operating Principles

- **Change surface first** - understand what changed before proposing retest coverage.
- **Risk spreads through dependencies** - shared modules, auth, data mapping, and configuration often widen impact.
- **Direct is not the whole story** - the changed file is only the start; adjacent behaviors matter too.
- **Small believable packs beat fake completeness** - a focused confidence suite is better than a giant list nobody will execute.
- **Unknown impact stays visible** - if propagation is unclear, log it as an open question instead of bluffing.

## Workflow

### Phase 0: Frame the input

Use the best available source:

- changed files
- a diff or PR summary
- release notes
- a hotfix description
- a list of touched components or endpoints

Capture any known critical journeys, environments, or roles that matter.

### Phase 1: Map the change surface

Break the change into four layers:

1. **Directly changed behavior** - the feature, endpoint, or component that was edited
2. **Adjacent behavior** - nearby flows that call, render, or depend on the changed surface
3. **Shared risk** - utilities, configuration, auth, layout, data mapping, or common services reused elsewhere
4. **State and data risk** - migrations, caching, permissions, synchronization, or environment-specific behavior

### Phase 2: Classify retest risk

Use a practical three-level scale:

| Risk | Use when |
| --- | --- |
| High | Direct change on a critical path, shared core module, data integrity flow, auth, checkout, notifications, or high-traffic workflow |
| Medium | Indirect dependency, shared helper, UI shell, validation logic, or meaningful edge-case exposure |
| Low | Isolated change with narrow blast radius and no obvious shared-path impact |

### Phase 3: Build the regression pack

Organize the result into four buckets:

- **Must retest** - confidence blockers; skipping these would be reckless
- **Should retest** - meaningful adjacent coverage if time allows
- **Can sample** - smoke-level checks instead of full retest
- **Can defer with caution** - lower-impact items worth tracking, not necessarily executing now

For every important area, include:

- why it is affected
- what to retest
- what data or environment setup is needed
- whether the coverage should stay manual or move into automation later

### Phase 4: Produce the report

Use `./resources/regression-scope-template.md` when possible.

A strong report includes:

- a short change summary
- a risk-ranked regression table
- a minimal confidence suite
- explicit open questions and blind spots

## Common Failure Modes

- equating changed files with full regression scope
- producing a huge retest list with no priority
- ignoring shared components, config, or auth ripple effects
- forgetting data setup or role-specific behavior
- treating uncertainty as low risk without explanation

## Resource Map

- `./resources/regression-scope-template.md` - structure for regression reports and confidence suites

## Related Skills

- `designing-functional-tests` - when the regression result should expand into manual scenarios or test cases
- `verifying-acceptance-criteria` - when the question becomes whether the feature now meets its stated contract
- `requirements-test-coverage-mapper` - when broader traceability matters more than tactical retest scope
- `code-review-advanced` - when the regression assessment should be paired with code-level risk review

## Definition of Done

This skill is complete when:

- the change surface is explained clearly
- high, medium, and low regression areas are separated
- the must-retest pack is believable and prioritized
- open questions and blind spots are explicit
- the output can guide a tester or release lead immediately
