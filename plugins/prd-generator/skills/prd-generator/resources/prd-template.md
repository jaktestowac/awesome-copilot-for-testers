# PRD Output Schema - Mandatory Structure

The PRD output must follow this exact structure and order.

## Document Metadata (header)

- Version, Status (Draft/Review/Approved), Last Updated, Owner
- Change Log (one line per version)

## 1. Executive Summary

**Purpose**: Provide a concise, decision-friendly overview.

- **Problem Statement** - 1–3 sentences describing the core pain or opportunity.
- **Proposed Solution** - 1–3 sentences describing the approach (not implementation details).
- **Success Criteria** - 3–5 measurable KPIs (business, technical, or quality).

## 2. Context & Strategic Alignment

**Purpose**: Explain why this work matters.

- Business or product context
- Strategic goals supported by this initiative
- Relevant constraints or market considerations

## 3. User Experience & Functional Scope

**Purpose**: Anchor requirements in user value.

- **User Personas** - primary personas with goals and pain points.
- **User Scenarios / Flows** - high-level description of how users interact with the system.
- **User Stories** - `As a [persona], I want to [action] so that [benefit].`
- **Acceptance Criteria** - clear, testable "done" conditions per story.
- **Out of Scope / Non-Goals** - explicit exclusions to prevent scope creep.

## 4. Success Metrics & Release Criteria

**Purpose**: Define outcomes and readiness.

- **Business KPIs** - adoption, retention, revenue, efficiency.
- **Technical KPIs** - latency, throughput, error rates.
- **Quality KPIs** - availability, reliability, correctness.
- **Release Readiness Checklist** - conditions required for MVP and subsequent releases.

## 5. Technical Requirements & Constraints

**Purpose**: Enable engineering execution.

- **High-Level Architecture Overview** - text or ASCII-based description of components and data flow.
- **Component Breakdown** - services, APIs, data stores, integrations.
- **Non-Functional Requirements** - performance, security, scalability, privacy, compliance.
- **Integration Points & Dependencies** - external systems, internal services, third parties.

## 6. AI / ML Requirements (If Applicable)

Include only if AI is a core or supporting capability.

- Models, tools, or services used
- Input and output specifications
- Evaluation and quality measurement strategy
- Monitoring, drift detection, and fallback behavior
- Data privacy and safety considerations

## 7. Risks, Assumptions & Dependencies

**Purpose**: Surface uncertainty explicitly.

- **Risks** - description, impact, likelihood, mitigation strategy
- **Assumptions** - unvalidated conditions treated as true
- **Dependencies** - teams, systems, vendors, or approvals

## 8. Roadmap & Phased Delivery

Break delivery into incremental phases:

| Phase  | Goals | Dependencies | Exit Criteria |
| ------ | ----- | ------------ | ------------- |
| MVP    | ...   | ...          | ...           |
| v1.1   | ...   | ...          | ...           |
| Future | ...   | ...          | ...           |

## Closing: PRD Quality Review (AI Self-Check)

- [ ] All success metrics are measurable
- [ ] No undefined technical terms
- [ ] Assumptions explicitly listed
- [ ] Non-goals clearly stated
- [ ] Risks have mitigation strategies

---

## Example Snippet (Intelligent Search System)

```
### Document Metadata

- Version: 0.1
- Status: Draft
- Last Updated: YYYY-MM-DD
- Owner: TBD

### Change Log

v0.1 – Initial draft

### 1. Executive Summary
Problem: Developers struggle to find code snippets in large repos.
Solution: AI-enabled code search with natural language interface.
Success KPIs:
- ≤200ms P95 query latency
- ≥90% relevance on benchmark queries
- 30% increase in daily active users

### 3. User Stories
As a developer, I want to ask plain-English questions so I find code faster.
Acceptance:
- Multi-turn refinement
- Code snippets with citations

### 5. Technical Specs
Architecture:
- NLP Service -> Vector DB -> Search API
Performance:
- Search P95 ≤ 200ms under 10k docs
...

### 7. Risks
- Model drift
- Cost of embeddings
...
```
