# Technical Debt Report

## Metadata

- **Scope analyzed:** `Playwright UI test layer and supporting CI workflow`
- **Goal:** `prioritization and remediation planning`
- **Audience:** `QA lead and engineering team`
- **Assumptions / missing context:** `Failure-rate metrics were not available, so CI instability is inferred from retries, waits, and workflow structure.`

## Executive Summary

- **Overall debt health:** `High`
- **Primary debt pressure:** `test reliability and delivery speed`
- **Top debt drivers:**
  - hard waits and retry-heavy synchronization patterns in critical UI specs
  - global CI retries masking instability instead of reducing it
  - oversized page objects and shared helpers hiding multiple responsibilities
- **Recommended next move:** Stabilize the highest-noise tests first, reduce false confidence in CI, and split broad test abstractions before attempting wider framework changes. This is a candidate for staged debt reduction, not a rewrite.

## Debt Register

| ID | Category | Location | Symptom | Evidence | Severity | Risk | Effort | ROI | Recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TD-01 | Test Debt | `tests/auth/*.spec.ts` | Hard waits drive flakiness and slow feedback | Multiple `waitForTimeout(...)` calls in auth and checkout flows | S1 | Low | S | High | Replace fixed waits with deterministic signals and stronger assertions |
| TD-02 | Process Debt | `.github/workflows/e2e.yml` | Global retries normalize unstable tests | Workflow and config rely on broad retries for the full suite | S2 | Medium | M | High | Reduce retries, isolate noisy tests, and add diagnostic reporting |
| TD-03 | Architecture Debt | `tests/pages/HomePage.ts` | Page object has too many responsibilities | Navigation, assertions, environment setup, and domain workflows live together | S2 | Medium | M | Medium | Split by page responsibility or business capability |
| TD-04 | Documentation Debt | `README.md`, onboarding docs | Local test prerequisites are tribal knowledge | Setup requires undocumented accounts and environment assumptions | S3 | Low | S | Medium | Document setup, fixture rules, and CI expectations |

## Top Priority Items

### TD-01 — Hard waits in critical UI flows

- **Category:** `test`
- **Location:** `tests/auth/*.spec.ts`
- **Observed evidence:** Several tests wait fixed amounts of time after submit actions instead of waiting on user-visible state or network completion.
- **Probable root cause:** The suite appears to have grown around timing issues instead of addressing missing synchronization boundaries.
- **Risk if ignored:** CI continues to produce noisy failures, engineers distrust red builds, and release confidence drops.
- **Risk of fixing now:** Low, provided deterministic assertions are added before removing waits.
- **Recommended strategy:** Replace the worst fixed waits first, starting with the highest-frequency failures, then expand the pattern to other specs.
- **Validation:** Track rerun frequency, average suite time, and failure diagnostics before and after the change.

### TD-02 — Global retries hiding instability

- **Category:** `process`
- **Location:** `.github/workflows/e2e.yml`, `Playwright config`
- **Observed evidence:** The workflow applies retries broadly rather than isolating known unstable tests.
- **Probable root cause:** The team optimized for fewer red builds instead of diagnosing why they were red.
- **Risk if ignored:** Slow feedback loops persist and broken behavior can remain undiscovered for longer.
- **Risk of fixing now:** Medium because turning retries down too quickly may surface more failures than the team can handle at once.
- **Recommended strategy:** Reduce retries in stages, add better failure artifacts, and create a quarantine or tagging strategy for known unstable cases.
- **Validation:** Compare suite duration, rerun count, and ratio of actionable to noisy failures.

## Test and Quality Impact

The dominant debt in this area is test debt with strong spillover into delivery quality. The suite likely catches many regressions, but it does so with too much noise. That lowers confidence, increases rerun culture, and makes real failures harder to distinguish from timing failures. Documentation gaps worsen the problem because debugging depends on maintainer memory rather than stable guidance.

## Decision Matrix

### Fix Now

- `TD-01` — hard waits are low-risk to improve and high-ROI
- strengthen assertions in the most brittle auth and checkout flows

### Fix Soon

- `TD-02` — CI retry strategy needs staged reduction
- `TD-03` — split overloaded page abstractions after stabilizing the most brittle specs

### Accept for Now

- `TD-04` — onboarding docs should be improved soon, but it does not block short-term stabilization work
- revisit after the first stabilization sprint when the real setup friction is clearer

## Quick Wins

- Replace the most obvious `waitForTimeout` calls in critical tests
- Add clearer failure artifacts for unstable UI flows
- Document required local accounts and environment assumptions

## Staged Refactors

1. Add stronger synchronization and assertions in the noisiest tests
2. Reduce broad retries and improve CI diagnostics
3. Split oversized page objects into narrower capabilities
4. Clean up old helper paths that become redundant after stabilization

## Open Questions

- Which specs are the highest-frequency CI offenders?
- Are there existing failure dashboards or retry metrics that can refine prioritization?
