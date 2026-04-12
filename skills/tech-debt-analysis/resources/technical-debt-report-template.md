# Technical Debt Report Template

Use this template for `TECHNICAL_DEBT_REPORT.md`.
Keep the structure, remove placeholder text, and omit only sections that are clearly irrelevant.

## Metadata

- **Scope analyzed:** `<repository / module / test layer>`
- **Goal:** `<awareness / prioritization / roadmap / release risk / refactor planning>`
- **Audience:** `<engineering / QA / tech lead / management>`
- **Assumptions / missing context:** `<list explicit gaps>`

## Executive Summary

- **Overall debt health:** `<Low / Medium / High>`
- **Primary debt pressure:** `<delivery speed / test reliability / architecture / dependency / mixed>`
- **Top debt drivers:**
  - `<driver 1>`
  - `<driver 2>`
  - `<driver 3>`
- **Recommended next move:** `<one paragraph on what should happen next>`

## Debt Register

| ID    | Category     | Location          | Symptom           | Evidence                | Severity  | Risk                | Effort    | ROI                 | Recommendation           |
| ----- | ------------ | ----------------- | ----------------- | ----------------------- | --------- | ------------------- | --------- | ------------------- | ------------------------ |
| TD-01 | `<category>` | `<path / module>` | `<short symptom>` | `<observable evidence>` | `<S1-S4>` | `<Low/Medium/High>` | `<XS-XL>` | `<Low/Medium/High>` | `<smallest safe action>` |
| TD-02 | `<category>` | `<path / module>` | `<short symptom>` | `<observable evidence>` | `<S1-S4>` | `<Low/Medium/High>` | `<XS-XL>` | `<Low/Medium/High>` | `<smallest safe action>` |

## Top Priority Items

### TD-01 — `<title>`

- **Category:** `<architecture / code / test / dependency / process / operational / documentation>`
- **Location:** `<path / module / workflow>`
- **Observed evidence:** `<what was seen>`
- **Probable root cause:** `<why this debt likely exists>`
- **Risk if ignored:** `<delivery, quality, or business impact>`
- **Risk of fixing now:** `<coordination or regression risk>`
- **Recommended strategy:** `<minimal fix / staged refactor / containment>`
- **Validation:** `<how the team will know this improved>`

### TD-02 — `<title>`

- **Category:** `<category>`
- **Location:** `<location>`
- **Observed evidence:** `<evidence>`
- **Probable root cause:** `<cause>`
- **Risk if ignored:** `<risk>`
- **Risk of fixing now:** `<remediation risk>`
- **Recommended strategy:** `<strategy>`
- **Validation:** `<validation>`

## Test and Quality Impact

Summarize how the identified debt affects:

- release confidence
- regression risk
- test stability
- diagnostic quality
- onboarding and change safety

## Decision Matrix

### Fix Now

- `<item and rationale>`
- `<item and rationale>`

### Fix Soon

- `<item and rationale>`
- `<item and rationale>`

### Accept for Now

- `<item and rationale>`
- `<revisit trigger>`

## Quick Wins

- `<small, safe improvement>`
- `<small, safe improvement>`
- `<small, safe improvement>`

## Staged Refactors

For larger items, describe the sequence:

1. `<safety-net step>`
2. `<containment or preparatory step>`
3. `<core refactor>`
4. `<cleanup and validation>`

## Open Questions

- `<unknown that materially affects prioritization>`
- `<assumption that should be confirmed>`
