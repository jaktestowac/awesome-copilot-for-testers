---
name: analyzing-test-reports
description: 'Analyzes CI test reports to identify dominant failure themes, flakiness signals, and the next investigation steps. Use when triaging failed builds, recurring flaky suites, or release-candidate test instability.'
argument-hint: 'Test report summary, failed jobs, and the scope to analyze'
user-invocable: true
---

# Analyzing Test Reports

Use this skill when a build fails and the important problem is buried under noise.
It helps turn a pile of red results into a prioritized investigation summary.

## When to Use

Use this skill when the user asks for things like:

- "analyze this failed CI run"
- "group the failures and tell me what matters first"
- "is this build flaky or genuinely broken?"

Typical scenarios:

- nightly regression failures
- repeated retry-only pipelines
- release candidate verification

## Outcome Standard

A strong result usually includes:

- the dominant failure clusters
- the likeliest root-cause candidates
- the next best debugging steps

## Workflow

### Phase 0: Frame the failure set

- identify the failing suites, environments, and time window
- separate new failures from recurring noise

### Phase 1: Group the signals

- cluster failures by symptom, stack trace, test target, or infrastructure dependency
- note where the same fault appears under multiple test names

### Phase 2: Assess confidence

- label findings as likely product bug, test bug, infrastructure issue, or unknown
- call out where evidence is weak and further logs are required

### Phase 3: Recommend next actions

- prioritize the smallest set of checks that can confirm or disprove the leading theory
- separate urgent containment from longer-term stability work

## Definition of Done

A task using this skill is complete when:

- the key failure groups are clear
- the likely causes are ranked by confidence
- the next debugging actions are actionable and ordered
