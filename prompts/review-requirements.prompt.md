---
name: Review requirements for testability
agent: qa-strategist
description: 'Review a user story, PRD, or acceptance criteria for ambiguity, missing states, and untestable statements — before implementation starts. Produces concrete clarifying questions and rewritten, testable acceptance criteria.'
tools: ['vscode', 'read', 'search', 'web', 'todo']
---

# Task

Your goal is to find the defects in the requirements before they become defects in the product.

Review the requirements provided: ${input:requirements:user story, PRD section, acceptance criteria, or a file path}

Ask only for missing essentials:

- the requirements text or file, if not provided
- where this feature sits in the product, if the context is unclear

Then run these review passes and report what each one finds:

1. **Testability** — can each statement be verified with a concrete check? Flag vague terms ("fast", "user-friendly", "should work"), missing measurable thresholds, and criteria that describe implementation instead of observable behavior.
2. **Ambiguity and contradiction** — statements open to multiple readings, conflicting rules, undefined terms, and unstated assumptions.
3. **Completeness of states** — error states, empty states, loading states, boundary values, and limits that the requirements never mention.
4. **Entity lifecycle** — for each object the feature creates or touches: can it be read, updated, deleted, duplicated, or orphaned, and is each transition specified?
5. **Roles and permissions** — who may perform each action, and what each other role sees or is denied.
6. **Cross-feature impact** — interactions with existing features, shared data, and concurrent use that the requirements ignore.
7. **Non-functional gaps** — performance, security, accessibility, and observability expectations that are implied but never stated.

Do not invent product decisions: where a rule is missing, produce a question for the product owner, not an assumption presented as fact.

## Output format

Return Markdown only, with:

- a verdict: ready for development / needs clarification, with a short justification
- findings grouped by review pass, each with severity (blocker / major / minor)
- a numbered list of clarifying questions, ordered by how much each answer unblocks
- rewritten acceptance criteria for the worst offenders, in a testable given/when/then or checklist form
- suggested follow-up: feed the clarified requirements into `manual-test-cases`, `generate-gherkin-scenarios`, or `map-requirements-coverage`
