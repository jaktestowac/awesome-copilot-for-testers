---
name: prd-generator
description:  Generate production-ready Product Requirements Documents (PRDs) for software systems and AI-powered features. The skill ensures clear problem framing, measurable outcomes, scoped functionality, testable requirements, technical feasibility, risk awareness, and stakeholder alignment.
---

# 📄 Product Requirements Document (PRD) Skill

This skill enables an AI agent to produce **high-quality, professional PRDs**
that serve as a **single source of truth** for product, design, engineering,
QA, and leadership teams.

The PRD balances **business goals**, **user needs**, and **technical execution**,
and supports both traditional software systems and AI-driven products.

---

## 🧠 What This Skill Does

When invoked, this skill:

- Elicits missing context through structured discovery
- Translates ambiguous ideas into clear, actionable requirements
- Produces a complete, testable, and measurable PRD
- Makes assumptions and risks explicit
- Adapts depth and rigor to product maturity and risk
- Treats the PRD as a **living, versioned artifact**

---

## 🎯 When to Use

Use this skill when the user wants to:

- "Write a PRD", "define requirements", or "plan a feature"
- Turn a vague idea into an implementation-ready specification
- Align multiple stakeholders before development
- Document requirements for **AI / ML-enabled systems**
- Create a reference document that evolves with the product

---

## 🧩 Operational Workflow

A PRD **must never be generated immediately** from a single prompt.
The agent must first reduce uncertainty and align expectations.

---

### Phase 0: PRD Strategy Selection

Before discovery, classify the PRD to adapt structure and rigor:

- **Product Stage**: MVP / Growth / Scale
- **Risk Level**: Low / Medium / High
- **AI Criticality**: None / Supporting / Core
- **Primary Audience**: Engineering / Product / Exec / External

> The chosen strategy determines depth, level of detail, and validation rigor.

---

### Phase 1: Discovery - Structured Elicitation

The agent must ask **clarifying questions** before drafting.

Use a structured approach (Who / What / Why / When / How):

1. **Problem & Context**
   - What problem are we solving?
   - Why does it matter now?
2. **Users & Value**
   - Who are the primary users?
   - What outcome do they care about?
3. **Success & Measurement**
   - How will success be measured?
   - What does "good" look like?
4. **Constraints**
   - Deadlines, budget, tech stack, compliance?
5. **Stakeholders**
   - Who needs alignment or approval?

> Do not proceed until **at least 3 major uncertainties** are resolved.

---

## 🧾 PRD Structure - Mandatory Output Schema

The PRD output **must follow this exact structure and order**.

---

### 1️⃣ Executive Summary

**Purpose**: Provide a concise, decision-friendly overview.

- **Problem Statement**  
  1–3 sentences describing the core pain or opportunity.
- **Proposed Solution**  
  1–3 sentences describing the approach (not implementation details).
- **Success Criteria**  
  3–5 measurable KPIs (business, technical, or quality).

---

### 2️⃣ Context & Strategic Alignment

**Purpose**: Explain why this work matters.

- Business or product context
- Strategic goals supported by this initiative
- Relevant constraints or market considerations

---

### 3️⃣ User Experience & Functional Scope

**Purpose**: Anchor requirements in user value.

- **User Personas**  
  Primary personas with goals and pain points.
- **User Scenarios / Flows**  
  High-level description of how users interact with the system.
- **User Stories**  
  `As a [persona], I want to [action] so that [benefit].`
- **Acceptance Criteria**  
  Clear, testable "done" conditions per story.
- **Out of Scope / Non-Goals**  
  Explicit exclusions to prevent scope creep.

---

### 4️⃣ Success Metrics & Release Criteria

**Purpose**: Define outcomes and readiness.

- **Business KPIs**  
  Adoption, retention, revenue, efficiency.
- **Technical KPIs**  
  Latency, throughput, error rates.
- **Quality KPIs**  
  Availability, reliability, correctness.
- **Release Readiness Checklist**  
  Conditions required for MVP and subsequent releases.

---

### 5️⃣ Technical Requirements & Constraints

**Purpose**: Enable engineering execution.

- **High-Level Architecture Overview**  
  Text or ASCII-based description of components and data flow.
- **Component Breakdown**  
  Services, APIs, data stores, integrations.
- **Non-Functional Requirements**  
  Performance, security, scalability, privacy, compliance.
- **Integration Points & Dependencies**  
  External systems, internal services, third parties.

---

### 6️⃣ AI / ML Requirements (If Applicable)

Include **only if AI is a core or supporting capability**.

- Models, tools, or services used
- Input and output specifications
- Evaluation and quality measurement strategy
- Monitoring, drift detection, and fallback behavior
- Data privacy and safety considerations

---

### 7️⃣ Risks, Assumptions & Dependencies

**Purpose**: Surface uncertainty explicitly.

- **Risks**
  - Description
  - Impact
  - Likelihood
  - Mitigation strategy
- **Assumptions**
  - Unvalidated conditions treated as true
- **Dependencies**
  - Teams, systems, vendors, or approvals

---

### 8️⃣ Roadmap & Phased Delivery

Break delivery into incremental phases:

| Phase | Goals | Dependencies | Exit Criteria |
|------|------|-------------|---------------|
| MVP  | ... | ... | ... |
| v1.1 | ... | ... | ... |
| Future | ... | ... | ... |

---

## 📌 PRD Quality Standards

### Requirements Must Be Measurable

Avoid subjective language.

**Bad**
- "Fast"
- "Easy to use"
- "High quality"

**Good**
- "P95 latency ≤ 200ms for 10k records"
- "100% Lighthouse accessibility score"
- "≥90% precision on benchmark queries"

---

## 🧪 Testability by Design

Every major requirement must indicate:

- How it will be validated
- What can be automated
- What signals indicate failure

AI systems must define **offline evaluation** and **runtime monitoring**.

---

## 🔁 Iteration & Collaboration Rules

- Treat the PRD as a **living document**
- Track versions and changes
- Incorporate feedback from product, engineering, QA, and stakeholders
- Revisit assumptions as new information emerges

---

## 🧠 AI Self-Review Checklist

Before finalizing, the agent must verify:

- [ ] All success metrics are measurable
- [ ] Assumptions are explicitly listed
- [ ] Non-goals are clearly stated
- [ ] Risks include mitigation strategies
- [ ] Requirements are testable
- [ ] No undefined terms remain

---

## 🧪 Example Snippet (Intelligent Search System)

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

### 2. User Stories
As a developer, I want to ask plain-English questions so I find code faster.
Acceptance:
- Multi-turn refinement
- Code snippets with citations

### 4. Technical Specs
Architecture:
- NLP Service -> Vector DB -> Search API
Performance:
- Search P95 ≤ 200ms under 10k docs
...

### Risks
- Model drift
- Cost of embeddings
...

### PRD Quality Review (AI Self-Check)

- [ ] All success metrics are measurable
- [ ] No undefined technical terms
- [ ] Assumptions explicitly listed
- [ ] Non-goals clearly stated
- [ ] Risks have mitigation strategies

```