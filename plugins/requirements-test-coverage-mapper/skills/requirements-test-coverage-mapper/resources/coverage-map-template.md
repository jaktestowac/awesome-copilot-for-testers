# RTM Output Schema - Strict Structure

The output must follow this structure and order.

## 0) Document Metadata

- Version: `0.x`
- Status: Draft / Review / Approved
- Owner: (name or `TBD`)
- Last Updated: YYYY-MM-DD
- Sources Used: (PRD/story links or `Provided text in prompt`)
- Assumptions Policy: "No assumptions unless explicitly listed below."

## 1) Executive Coverage Summary

- Coverage status: % requirements mapped / unmapped
- High-risk areas and proposed test focus
- Top 5 gaps / blockers
- Recommended next actions (what to clarify, what to implement, what to test first)

## 2) Requirements Traceability Matrix (RTM)

A table with one row per atomic requirement.

| Req ID | Requirement / Statement | Source (Story/AC) | Risk (I×L) | Test Levels (Unit/API/UI/E2E/NFR) | Test Scenarios (IDs) | Automation Candidate | Status (Planned/Exists/Missing) | Notes |
| -----: | ----------------------- | ----------------- | ---------- | --------------------------------- | -------------------- | -------------------- | ------------------------------- | ----- |

Rules:

- Every requirement must have at least one scenario ID, or be flagged as `MISSING_TEST`.
- Every scenario must have a clear expected outcome.
- If a requirement is ambiguous → mark `NEEDS_CLARIFICATION` and propose exact questions.

## 3) Test Scenario Catalog (Specification by Example)

List scenarios referenced in the RTM. Each scenario must include:

- Scenario ID (`TS-001`)
- Title
- Level(s): Unit/API/UI/E2E/NFR
- Preconditions / Data
- Steps (high-level)
- Expected results (assertable)
- Observability notes (logs/metrics/traces that confirm behavior)
- Negative cases / edge cases (if relevant)

## 4) Gap & Ambiguity Report

A prioritized list of issues that block good testing:

- Missing acceptance criteria
- Undefined error handling behavior
- Missing NFR targets (latency, rate limits, availability)
- Unclear roles/permissions
- Testability concerns (no hooks, unstable IDs, no deterministic mode)

Include per item: Gap ID (`GAP-001`), description, why it matters, suggested resolution (exact question or requirement rewrite).

## 5) Risk-Based Prioritization (What to Test First)

- Tier 0 (release blockers / critical flows)
- Tier 1 (high risk / high usage)
- Tier 2 (regression breadth)

For each tier include: linked Req IDs and Scenario IDs, recommended execution cadence (per PR, nightly, pre-release), and a minimal "confidence suite" for hotfixes.

## 6) Automation & CI Recommendations

- Which scenarios are best suited for automation (and why)
- What should remain manual (and why)
- CI gating suggestion: smoke suite vs regression suite, flaky risk notes, environment needs

If tooling is known (e.g., Azure DevOps/Jira/TestRail), propose how to encode links (IDs/tags). If unknown → provide tool-agnostic tagging conventions.

## 7) Assumptions, Dependencies, and Change-Impact Notes

- Assumptions (explicit list)
- Dependencies (systems/teams/vendors)
- Change impact rules:
  - "If REQ-xxx changes, rerun suites: …"
  - "Areas likely to regress: …"

---

## Example (Mini)

### RTM (excerpt)

|  Req ID | Requirement                                                 | Source          | Risk | Levels     | Scenarios              | Auto | Status  | Notes                |
| ------: | ----------------------------------------------------------- | --------------- | ---- | ---------- | ---------------------- | ---- | ------- | -------------------- |
| REQ-001 | User can reset password via email link valid for 15 minutes | US-002 / AC-004 | H×M  | API/UI/E2E | TS-001, TS-002, TS-003 | Yes  | Planned | Need rate-limit spec |

### Scenario (excerpt)

**TS-002 - Password reset token expires**

- Levels: API + UI
- Data: user exists; token issued at T0
- Steps: request reset → wait 16 min (or simulate time) → attempt reset
- Expected: reset rejected with `TOKEN_EXPIRED`; user not logged in; audit log entry exists
