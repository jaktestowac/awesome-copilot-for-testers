---
name: requirements-test-coverage-mapper
description: Map requirements (PRD/user stories/AC) to comprehensive test coverage using a traceability matrix (RTM). Outputs coverage gaps, risks, test levels, prioritization, automation candidates, and change-impact notes. Designed for QA/Test Architect workflows.
---

# ✅ Requirements → Test Coverage Mapper (RTM) Skill

This skill turns a PRD, user stories, acceptance criteria, and constraints into a
**traceability-driven test coverage plan**:
- a Requirements Traceability Matrix (RTM)
- a gap & ambiguity report
- test design recommendations across levels (unit/API/UI/e2e/non-functional)
- automation candidates and CI gating suggestions

The output is designed to be used as a **living artifact** and “single source of truth”
for coverage, readiness, and auditability.

---

## 🎯 When to Use

Use this skill when you need to:
- Validate **coverage completeness** before/after implementation
- Convert **PRD/user stories** into a test plan that is traceable and reviewable
- Identify **missing acceptance criteria**, ambiguous requirements, or hidden scope
- Support **change impact analysis** when requirements evolve
- Build a **risk-based regression** strategy or release readiness assessment

---

## 🧭 Operational Workflow

### Phase 0: Strategy Selection (Context First)
Classify the work to adjust rigor and output depth:

- Delivery stage: MVP / Iteration / Hardening / Release / Hotfix
- Domain risk: Low / Medium / High (payments, auth, compliance = high)
- Change surface: UI / API / Data / Infra / Cross-cutting
- AI criticality: None / Supporting / Core
- Target tooling (optional): Jira / Azure DevOps / TestRail / GitHub Issues

If unknown, mark as `TBD` and proceed with safe defaults.

---

### Phase 1: Discovery (Mandatory Questions)
Before producing the RTM, ask **at least 5** focused questions. Must cover:

1. **Test basis source**
   - PRD link/text? user stories? AC? designs? (what is “source of truth”?)
2. **Scope boundaries**
   - What is explicitly in/out? any non-goals?
3. **Quality attributes**
   - performance, security, accessibility, reliability, observability expectations?
4. **Data & environments**
   - test envs available, data seeding/masking rules, third-party dependencies?
5. **Release constraints**
   - deadline, MVP cuts, rollout type (flagged, staged, big-bang)?
6. **Definition of Done / acceptance**
   - who signs off and what evidence is required?

> If the user cannot answer, capture assumptions explicitly in the output.

---

### Phase 2: Normalization (Make Requirements Traceable)
The agent must normalize input into **atomic, testable requirements**:

- Split compound requirements into smaller “testable statements”
- Assign stable IDs if missing:
  - `REQ-001`, `REQ-002`… (requirements)
  - `US-001`… (user stories)
  - `AC-001`… (acceptance criteria)
- Mark ambiguous statements as `NEEDS_CLARIFICATION`

---

### Phase 3: Coverage Design (Levels + Risks + Data)
For each requirement, propose coverage across:

- **Functional**: positive/negative, edge cases, permissions
- **Integration**: APIs, events, DB, third parties
- **UX**: key flows, accessibility, error messaging
- **Non-functional**: performance, security, reliability, observability
- **AI-specific (if applicable)**: evaluation, drift, hallucinations/failure modes, fallbacks

Use **risk-based thinking**:
- assign impact (H/M/L) and likelihood (H/M/L)
- derive priority and test depth from risk

---

## 🧾 Output Schema (Strict)

Your output MUST follow this structure and order.

---

### 0) Document Metadata
- Version: `0.x`
- Status: Draft / Review / Approved
- Owner: (name or `TBD`)
- Last Updated: YYYY-MM-DD
- Sources Used: (PRD/story links or `Provided text in prompt`)
- Assumptions Policy: “No assumptions unless explicitly listed below.”

---

### 1) Executive Coverage Summary
- Coverage status: % requirements mapped / unmapped
- High-risk areas and proposed test focus
- Top 5 gaps / blockers
- Recommended next actions (what to clarify, what to implement, what to test first)

---

### 2) Requirements Traceability Matrix (RTM)

A table with **one row per atomic requirement**.

| Req ID | Requirement / Statement | Source (Story/AC) | Risk (I×L) | Test Levels (Unit/API/UI/E2E/NFR) | Test Scenarios (IDs) | Automation Candidate | Status (Planned/Exists/Missing) | Notes |
|-------:|--------------------------|-------------------|------------|-----------------------------------|----------------------|----------------------|----------------------------------|------|

Rules:
- Every requirement must have **at least one** scenario ID, or be flagged as `MISSING_TEST`.
- Every scenario must have a **clear expected outcome**.
- If requirement is ambiguous → mark `NEEDS_CLARIFICATION` and propose exact questions.

---

### 3) Test Scenario Catalog (Specification by Example)
List scenarios referenced in the RTM.

Each scenario must include:
- Scenario ID (`TS-001`)
- Title
- Level(s): Unit/API/UI/E2E/NFR
- Preconditions / Data
- Steps (high-level)
- Expected results (assertable)
- Observability notes (logs/metrics/traces that confirm behavior)
- Negative cases / edge cases (if relevant)

---

### 4) Gap & Ambiguity Report
A prioritized list of issues that block good testing:

- Missing acceptance criteria
- Undefined error handling behavior
- Missing NFR targets (latency, rate limits, availability)
- Unclear roles/permissions
- Testability concerns (no hooks, unstable IDs, no deterministic mode)

Include:
- Gap ID (`GAP-001`)
- Description
- Why it matters
- Suggested resolution (exact question or requirement rewrite)

---

### 5) Risk-Based Prioritization (What to Test First)
Provide a prioritized plan:

- Tier 0 (release blockers / critical flows)
- Tier 1 (high risk / high usage)
- Tier 2 (regression breadth)

For each tier include:
- linked Req IDs and Scenario IDs
- recommended execution cadence (per PR, nightly, pre-release)
- minimal “confidence suite” for hotfixes

---

### 6) Automation & CI Recommendations
- Which scenarios are best suited for automation (and why)
- What should remain manual (and why)
- CI gating suggestion:
  - smoke suite vs regression suite
  - flaky risk notes
  - environment needs

If tooling is known (e.g., Azure DevOps/Jira/TestRail), propose how to encode links (IDs/tags).
If unknown → provide tool-agnostic tagging conventions.

---

### 7) Assumptions, Dependencies, and Change-Impact Notes
- Assumptions (explicit list)
- Dependencies (systems/teams/vendors)
- Change impact rules:
  - “If REQ-xxx changes, rerun suites: …”
  - “Areas likely to regress: …”

---

## ✅ Quality Rules (Non-Negotiable)

### DO
- Make every requirement **atomic** and **testable**
- Use stable IDs for traceability
- Flag unknowns; don’t invent constraints
- Prefer measurable outcomes and concrete expected results
- Recommend test levels intentionally (not everything must be E2E)

### DON’T
- Don’t hallucinate requirements, flows, or data models
- Don’t produce only UI tests (must consider unit/API/NFR)
- Don’t accept ambiguous requirements without logging them as gaps
- Don’t mark coverage “complete” if AC is missing or unclear

---

## 🧠 AI Self-Review Checklist
Before final output:
- [ ] Every requirement has an ID and is atomic
- [ ] Every requirement maps to ≥1 scenario OR is flagged missing
- [ ] Ambiguities are captured as explicit questions
- [ ] Risk is assigned and used to prioritize
- [ ] Non-functional coverage is addressed where relevant
- [ ] Assumptions are listed explicitly

---

## 🧪 Example (Mini)

### RTM (excerpt)
| Req ID | Requirement | Source | Risk | Levels | Scenarios | Auto | Status | Notes |
|---:|---|---|---|---|---|---|---|---|
| REQ-001 | User can reset password via email link valid for 15 minutes | US-002 / AC-004 | H×M | API/UI/E2E | TS-001, TS-002, TS-003 | Yes | Planned | Need rate-limit spec |

### Scenario (excerpt)
**TS-002 - Password reset token expires**
- Levels: API + UI
- Data: user exists; token issued at T0
- Steps: request reset → wait 16 min (or simulate time) → attempt reset
- Expected: reset rejected with `TOKEN_EXPIRED`; user not logged in; audit log entry exists

---

## ✅ Outcome
Used correctly, this skill produces a traceability-driven plan that:
- proves coverage,
- exposes gaps early,
- guides automation investment,
- and supports release readiness decisions.
