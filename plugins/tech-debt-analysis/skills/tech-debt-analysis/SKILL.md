---
name: tech-debt-analysis
description: "Systematically identify, classify, and prioritize technical debt across code, tests, architecture, dependencies, and pipelines. Use when assessing codebase health, diagnosing slow or flaky tests, preparing refactoring roadmaps, or building ROI-aware remediation plans. Produces a structured Technical Debt Report with risk assessment, test impact analysis, and prioritized recommendations."
argument-hint: "Path to codebase or module, scope (repo/module/test-layer), and known pain points"
user-invocable: true
---

# Technical Debt Analysis

Use this skill to produce an evidence-based, prioritized technical debt assessment.
It covers code, test suites, architecture, dependencies, CI/CD pipelines, and documentation — with explicit emphasis on test debt as a first-class concern.

## When to Use

- "assess the health of this codebase"
- "why are our tests slow, flaky, or unreliable?"
- "prioritize refactoring work with clear ROI"
- "identify quality risks hiding behind working systems"
- "prepare input for a technical roadmap or quality initiative"

## Analysis Workflow

Follow the phases in order. Never skip discovery or evidence collection.

### Phase 0: Context and scope

Before analysis, establish:

- **system type**: frontend, backend, API, test automation, or platform
- **pain points**: bugs, regressions, slow CI, flaky tests, low confidence
- **scope**: whole repo, specific module, or test layer only
- **constraints**: time, legacy code, compliance, "no refactors" policy
- **goal**: awareness, prioritization, or remediation planning

If information is missing, mark as `TBD` and list assumptions explicitly.

### Phase 1: Debt signal collection

Identify observable signals, not conclusions. Sources to check:

- **Code structure** — complexity, duplication, coupling
- **Test behavior** — flakiness, runtime, coverage gaps, weak assertions
- **CI/CD signals** — build time, retry patterns, failure rates
- **Dependencies** — age, CVEs, maintenance status
- **Change history** — hotspots, frequent fixes
- **Documentation** — missing ADRs, tribal knowledge

If no signal or evidence exists, do not report debt — log it as an assumption or unknown.

### Phase 2: Debt classification

Every debt item must have one primary category from this fixed taxonomy:

- **Code Debt** — smells, complexity, duplication
- **Test Debt** — missing tests, flaky tests, slow feedback, weak assertions
- **Architecture Debt** — tight coupling, layering violations, unclear boundaries
- **Dependency Debt** — outdated, risky, or abandoned libraries
- **Process Debt** — slow CI, manual steps, poor feedback loops
- **Documentation Debt** — missing ADRs, unclear ownership, tribal knowledge

An optional secondary category may be added if justified.

### Phase 3: Risk and impact assessment

Evaluate each debt item on four dimensions using Low / Medium / High with justification:

- **Impact** — what breaks or slows if this remains?
- **Likelihood** — how often does it cause issues?
- **Quality risk** — bug escape probability, regression risk, confidence loss
- **Test impact** — does it reduce testability or reliability?

## Output Schema

Produce a markdown file named `TECHNICAL_DEBT_REPORT.md` with these sections.

### Metadata

Version, status (Draft/Review/Approved), scope analyzed, owner, date, and assumptions.

### Executive Summary

Overall debt health (Low/Medium/High), top 5 debt drivers by risk, major quality or testing risks, and recommended next actions.

### Debt Inventory

Each debt item as an atomic record:

```
Debt ID: TD-042
Category: Test Debt
Location: tests/integration/payments/
Description: Payment integration tests use hardcoded sleep waits instead of polling
Observed Evidence: 14 instances of sleep(5000) in 8 test files; CI retry rate 23%
Impact: High — flaky failures block releases, erode trust in test suite
Likelihood: High — triggers on every CI run under load
Quality/Test Impact: High — masks real regressions behind noise
Fix Options: Replace sleeps with explicit wait conditions; extract shared polling utility
Estimated Effort: M
Recommendation: Fix Soon — highest ROI flakiness reduction
```

Rules: no evidence means no debt item; avoid vague wording ("code is messy"); be precise and scoped.

### Test and Quality Risk Summary

Summarize how debt affects bug escape probability, regression risk, coverage effectiveness, test stability, execution time, and release confidence. Highlight test debt explicitly even when code debt dominates.

### Prioritization Matrix

Group items into three tiers:

- **Fix Now** — high risk, high impact, blocking quality
- **Fix Soon** — important but not currently blocking
- **Accept for Now** — conscious debt with documented rationale

Explain why some debt should not be fixed yet.

### Remediation Roadmap

For top-priority items: suggested steps, safer refactoring strategies (test-first when possible), dependencies or prerequisites, and validation strategy (how you confirm improvement). Avoid big-bang rewrites unless explicitly justified.

### Change Impact and ROI

For major fixes: what becomes easier to test, what risks are reduced, what developer or QA friction is removed. This section supports stakeholder buy-in.

## Quality Rules

- **Evidence required** — base every finding on observable signals; list assumptions explicitly
- **Test debt is first-class** — always analyze test impact even when code debt dominates
- **Incremental remediation** — prefer test-safe, incremental fixes over rewrites
- **Acknowledge uncertainty** — say when context is missing rather than guessing
- **No hallucinated intent** — do not invent design decisions or project history
- **Proportionate severity** — do not treat all debt as equally urgent; cosmetic issues are not blockers

## Self-Check

Before finalizing, verify: every debt item has evidence, categories are consistent, test impact is explicitly analyzed, risk ratings are justified, acceptable debt is documented, and recommendations are realistic and incremental.
