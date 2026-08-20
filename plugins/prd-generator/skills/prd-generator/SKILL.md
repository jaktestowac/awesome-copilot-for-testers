---
name: prd-generator
description: 'Produces production-ready Product Requirements Documents (PRDs) for software systems and AI-powered features, with clear problem framing, measurable outcomes, scoped functionality, testable requirements, and explicit risks. Use when the user wants to write a PRD, define requirements, plan a feature, or turn a vague product idea into an implementation-ready specification.'
argument-hint: 'Product or feature idea, target users, known constraints, and any existing requirements'
user-invocable: true
license: MIT
---

# Product Requirements Document (PRD) Generator

This skill produces high-quality, professional PRDs that serve as a single source of truth for product, design, engineering, QA, and leadership teams.

The PRD balances business goals, user needs, and technical execution, and supports both traditional software systems and AI-driven products.

Adapted from the `prd` skill in [github/awesome-copilot](https://github.com/github/awesome-copilot) (MIT).

## What This Skill Does

When invoked, this skill:

- Elicits missing context through structured discovery
- Translates ambiguous ideas into clear, actionable requirements
- Produces a complete, testable, and measurable PRD
- Makes assumptions and risks explicit
- Adapts depth and rigor to product maturity and risk
- Treats the PRD as a living, versioned artifact

## When to Use

Use this skill when the user wants to:

- "Write a PRD", "define requirements", or "plan a feature"
- Turn a vague idea into an implementation-ready specification
- Align multiple stakeholders before development
- Document requirements for AI / ML-enabled systems
- Create a reference document that evolves with the product

## Operational Workflow

A PRD must never be generated immediately from a single prompt. Reduce uncertainty and align expectations first.

### Phase 0: PRD Strategy Selection

Before discovery, classify the PRD to adapt structure and rigor:

- **Product Stage**: MVP / Growth / Scale
- **Risk Level**: Low / Medium / High
- **AI Criticality**: None / Supporting / Core
- **Primary Audience**: Engineering / Product / Exec / External

The chosen strategy determines depth, level of detail, and validation rigor.

### Phase 1: Discovery - Structured Elicitation

Ask clarifying questions before drafting, using a structured approach (Who / What / Why / When / How):

1. **Problem & Context** - what problem are we solving, and why now?
2. **Users & Value** - who are the primary users, and what outcome do they care about?
3. **Success & Measurement** - how will success be measured; what does "good" look like?
4. **Constraints** - deadlines, budget, tech stack, compliance?
5. **Stakeholders** - who needs alignment or approval?

Ask targeted questions only where the answer would change the PRD. When answers are unavailable or the user wants to move fast, record the gaps as explicit entries in the Assumptions section and proceed.

### Phase 2: Draft the PRD

Produce the PRD following the mandatory output schema in `./resources/prd-template.md` — exact section structure, order, and the worked example live there.

### Phase 3: Self-Review

Before finalizing, verify:

- [ ] All success metrics are measurable
- [ ] Assumptions are explicitly listed
- [ ] Non-goals are clearly stated
- [ ] Risks include mitigation strategies
- [ ] Requirements are testable
- [ ] No undefined terms remain

## PRD Quality Standards

### Requirements Must Be Measurable

Avoid subjective language.

**Bad**: "Fast", "Easy to use", "High quality"

**Good**: "P95 latency ≤ 200ms for 10k records", "100% Lighthouse accessibility score", "≥90% precision on benchmark queries"

### Testability by Design

Every major requirement must indicate:

- How it will be validated
- What can be automated
- What signals indicate failure

AI systems must define offline evaluation and runtime monitoring.

### Iteration & Collaboration Rules

- Treat the PRD as a living document
- Track versions and changes
- Incorporate feedback from product, engineering, QA, and stakeholders
- Revisit assumptions as new information emerges

## Resource Map

- `./resources/prd-template.md` - the mandatory PRD output schema, section-by-section guidance, and a worked example

## Related Skills

- `requirements-test-coverage-mapper` - when the finished PRD should be mapped to test coverage
- `verifying-acceptance-criteria` - when acceptance criteria from the PRD need verification against a build
- `designing-functional-tests` - when the PRD should expand into concrete test scenarios

## Definition of Done

This skill is complete when:

- the PRD follows the mandatory schema in the template, in order
- every requirement is measurable and testable
- assumptions, risks (with mitigations), and non-goals are explicit
- AI/ML sections are present when AI is a supporting or core capability
- the self-review checklist passes
