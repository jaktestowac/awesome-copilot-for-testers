---
name: tech-debt-analysis
description: Analyze technical debt in codebases and test suites using evidence-based signals. Produces a structured, prioritized Technical Debt Report with risk assessment, test impact analysis, remediation options, and ROI-aware recommendations.
---

# 🧱 Technical Debt Analysis Skill

This skill enables an AI agent to **systematically identify, classify, and
prioritize technical debt** across code, tests, architecture, dependencies,
and delivery pipelines.

---

## 🎯 When to Use

Use this skill when you need to:

- Assess the **health and sustainability** of a codebase
- Identify **quality risks hidden behind “working” systems**
- Understand **why testing is slow, flaky, or ineffective**
- Prioritize refactoring work with **clear impact and ROI**
- Prepare input for **technical roadmap or quality initiatives**
- Decide **what technical debt to fix vs consciously accept**

---

## 🧭 Operational Workflow

The agent must follow the phases below **in order**.
Skipping discovery or evidence collection is not allowed.

---

### Phase 0: Context & Strategy Selection (Mandatory)

Before analysis, clarify the context.

Ask (or infer safely if explicitly stated):

- System type: Frontend / Backend / API / Test Automation / Platform
- Current pain points: bugs, regressions, slow CI, flaky tests, low confidence
- Scope of analysis: whole repo / module / test layer only
- Constraints: time, legacy code, “no refactors”, compliance
- Goal: awareness / prioritization / remediation planning

If information is missing, mark as `TBD` and list assumptions explicitly.

---

### Phase 1: Debt Signal Collection (Evidence First)

Identify **observable signals**, not conclusions.

Possible signal sources:
- Code structure (complexity, duplication, coupling)
- Test behavior (flakiness, runtime, coverage gaps)
- CI/CD signals (build time, retry patterns, failure rates)
- Dependency metadata (age, CVEs, maintenance status)
- Change history (hotspots, frequent fixes)
- Documentation gaps (missing ADRs, tribal knowledge)

> If no signal or evidence exists, do **not** report debt - log it as an assumption or unknown.

---

### Phase 2: Debt Classification (Use a Fixed Taxonomy)

Every debt item must be classified into **one primary category**:

- **Code Debt** – smells, complexity, duplication
- **Test Debt** – missing tests, flaky tests, slow feedback, weak assertions
- **Architecture Debt** – tight coupling, layering violations, unclear boundaries
- **Dependency Debt** – outdated, risky, abandoned libraries
- **Process Debt** – slow CI, manual steps, poor feedback loops
- **Documentation Debt** – missing ADRs, unclear ownership, tribal knowledge

Optional secondary category may be added if justified.

---

### Phase 3: Risk & Impact Assessment

Each debt item must be evaluated using **risk-based thinking**:

- **Impact**: What breaks or slows if this remains?
- **Likelihood**: How often does it cause issues?
- **Quality Risk**: Bug escape, regression risk, confidence loss
- **Test Impact**: Does it reduce testability or reliability?

Use simple scales (Low / Medium / High) but justify each rating.

---

## 🧾 Output Schema (Strict)

The final output must be a markdown file named: TECHNICAL_DEBT_REPORT.md and follow the structure below.

---

### 0️⃣ Document Metadata

- Version: `0.x`
- Status: Draft / Review / Approved
- Scope Analyzed:
- Owner:
- Date:
- Assumptions:

---

### 1️⃣ Executive Summary

- Overall technical debt health: Low / Medium / High
- Top 5 debt drivers (by risk)
- Major quality or testing risks identified
- Recommended next actions (short list)

---

### 2️⃣ Debt Inventory (Atomic Records)

Each debt item must be listed as an **atomic record**.

```
Debt ID:
Category:
Location (files/modules/tests):
Description:
Observed Evidence:
Impact:
Likelihood:
Quality/Test Impact:
Fix Options:
Estimated Effort (S/M/L):
Recommendation:
```

Rules:
- No evidence → no debt item
- Avoid generic wording (“code is messy”)
- Be precise and scoped

---

### 3️⃣ Test & Quality Risk Summary

Summarize how technical debt affects:

- Bug escape probability
- Regression risk
- Test coverage effectiveness
- Test stability and execution time
- Confidence in releases

Highlight **test debt explicitly**, even if code debt dominates.

---

### 4️⃣ Prioritization & Decision Matrix

Group debt items into:

- **Fix Now** – high risk, high impact
- **Fix Soon** – important but not blocking
- **Accept for Now** – conscious debt with rationale

Explain *why* some debt should **not** be fixed yet.

---

### 5️⃣ Remediation Roadmap (Incremental)

For top-priority items:

- Suggested remediation steps
- Safer refactoring strategies (test-first if needed)
- Dependencies or prerequisites
- Validation strategy (how we know it improved)

Avoid “big bang” rewrites unless explicitly justified.

---

### 6️⃣ Change Impact & ROI Notes

For major fixes, describe:
- What becomes easier to test
- What risks are reduced
- What developer or QA friction is removed

This section is critical for stakeholder buy-in.

---

## 🧠 AI Safety & Quality Rules

### DO
- Base findings on observable evidence
- Explicitly list assumptions
- Treat test debt as first-class technical debt
- Prefer incremental, test-safe remediation
- Acknowledge uncertainty

### DON’T
- Hallucinate intent or design decisions
- Recommend refactors without test safety
- Over-optimize cosmetic issues
- Treat all debt as equally urgent

---

## ✅ AI Self-Review Checklist

Before finalizing:

- [ ] Every debt item has evidence
- [ ] Debt categories are used consistently
- [ ] Test impact is explicitly analyzed
- [ ] Risks are justified, not guessed
- [ ] “Acceptable debt” is documented
- [ ] Recommendations are realistic and incremental

---

## 🎯 Outcome

When applied correctly, this skill produces a **credible, actionable, and
architecturally sound technical debt assessment** that:

- improves system quality,
- strengthens test effectiveness,
- reduces long-term risk,
- and supports informed decision-making.
