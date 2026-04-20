---
name: prd-generator
description: 'Generates production-ready Product Requirements Documents for software systems and AI-powered features. Covers problem framing, measurable outcomes, scoped functionality, testable requirements, technical feasibility, risk awareness, and stakeholder alignment. Use when writing a PRD, defining requirements for a feature, turning a vague idea into a spec, planning an AI/ML product, or aligning stakeholders before development.'
argument-hint: 'Product idea, feature brief, problem statement, stakeholder context, constraints, and any existing notes or prior PRDs'
user-invocable: true
---

# Product Requirements Document (PRD) Generator

Use this skill to produce high-quality, professional PRDs that serve as a single source of truth for product, design, engineering, QA, and leadership teams.
The PRD balances business goals, user needs, and technical execution for both traditional software and AI-driven products.

## When to Use

- write a PRD, define requirements, or plan a feature
- turn a vague idea into an implementation-ready specification
- align multiple stakeholders before development begins
- document requirements for AI/ML-enabled systems
- create a versioned reference document that evolves with the product

## Operating Principles

- **Never generate immediately** - always reduce uncertainty through discovery before drafting.
- **Measurable over subjective** - replace "fast" with "P95 latency <= 200ms"; replace "easy to use" with a Lighthouse score.
- **Testable by design** - every requirement states how it will be validated, what can be automated, and what signals failure.
- **Assumptions stay visible** - unvalidated conditions are listed explicitly, never buried.
- **Living document** - track versions, incorporate feedback, revisit assumptions as information emerges.
- **Adapt depth to risk** - MVP, growth, and scale products need different rigor levels.

## Workflow

### Phase 0: Strategy selection

Classify the PRD before discovery to calibrate structure and rigor:

- **Product stage**: MVP / Growth / Scale
- **Risk level**: Low / Medium / High
- **AI criticality**: None / Supporting / Core
- **Primary audience**: Engineering / Product / Exec / External

The classification determines depth, detail, and validation rigor throughout.

### Phase 1: Structured discovery

Ask clarifying questions before drafting. Cover at minimum:

1. **Problem and context** - what problem, why now
2. **Users and value** - primary users, desired outcomes
3. **Success measurement** - KPIs, definition of "good"
4. **Constraints** - deadlines, budget, tech stack, compliance
5. **Stakeholders** - who needs alignment or approval

Do not proceed until at least three major uncertainties are resolved.

### Phase 2: Draft the PRD

Follow the mandatory output structure below. Adapt section depth to the strategy classification from Phase 0.

### Phase 3: Validate and iterate

Run the self-review checklist before finalizing. Incorporate feedback from product, engineering, QA, and stakeholders. Re-check assumptions as new information surfaces.

## PRD Structure (Mandatory Output Schema)

1. **Executive Summary** - problem statement (1-3 sentences), proposed solution (1-3 sentences), 3-5 measurable success KPIs
2. **Context and Strategic Alignment** - business context, strategic goals supported, relevant constraints or market considerations
3. **User Experience and Functional Scope** - personas with goals and pain points, user scenarios/flows, user stories with acceptance criteria, explicit non-goals
4. **Success Metrics and Release Criteria** - business KPIs (adoption, retention, revenue), technical KPIs (latency, throughput, error rates), quality KPIs (availability, reliability), release readiness checklist
5. **Technical Requirements and Constraints** - high-level architecture overview, component breakdown (services, APIs, data stores), non-functional requirements (performance, security, scalability, compliance), integration points and dependencies
6. **AI/ML Requirements** (include only when AI is core or supporting) - models/tools/services, input/output specs, evaluation strategy, monitoring and drift detection, fallback behavior, data privacy and safety
7. **Risks, Assumptions, and Dependencies** - risks with impact, likelihood, and mitigation; unvalidated assumptions; team/system/vendor dependencies
8. **Roadmap and Phased Delivery** - table with Phase, Goals, Dependencies, and Exit Criteria for each increment (MVP, v1.1, Future)

## Self-Review Checklist

Before finalizing, verify:

- all success metrics are measurable
- assumptions are explicitly listed
- non-goals are clearly stated
- risks include mitigation strategies
- every major requirement is testable
- no undefined terms remain
- AI systems define offline evaluation and runtime monitoring

## Common Failure Modes

- generating a PRD from a single prompt without discovery
- using subjective language instead of measurable criteria
- omitting non-goals and letting scope creep in
- treating AI requirements as an afterthought
- listing risks without mitigation strategies
- skipping stakeholder alignment before finalizing

## Example Snippet (AI-Powered Code Search)

```
Version: 0.1 | Status: Draft | Owner: TBD

1. Executive Summary
Problem: Developers struggle to find code snippets in large repos.
Solution: AI-enabled code search with natural language interface.
KPIs: P95 latency <= 200ms, >= 90% relevance on benchmark, 30% DAU increase.

2. User Stories
As a developer, I want to ask plain-English questions so I find code faster.
Acceptance: multi-turn refinement, code snippets with citations.

3. Technical Specs
Architecture: NLP Service -> Vector DB -> Search API
Performance: search P95 <= 200ms under 10k docs.

4. Risks
- Model drift: monitor weekly, retrain on threshold breach.
- Embedding cost: budget cap with fallback to keyword search.
```

## Related Skills

- `requirements-test-coverage-mapper` - when the PRD needs traceability to test coverage
- `designing-functional-tests` - when requirements are ready to expand into test scenarios
- `verifying-acceptance-criteria` - when checking whether delivered features meet PRD acceptance criteria

## Definition of Done

This skill is complete when:

- discovery resolved at least three major uncertainties
- the PRD follows the mandatory output structure
- all success metrics are measurable and testable
- risks, assumptions, and non-goals are explicit
- the document is ready for stakeholder review and engineering handoff
