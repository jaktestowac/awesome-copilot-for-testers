---
name: 'Review Test Plan Gaps'
agent: 'test-planner'
description: 'Review a draft test plan for missing risks, low-value scenarios, and untested integration edges before implementation begins.'
model: 'Claude Sonnet 4.5 (copilot)'
argument-hint: 'Draft plan, feature summary, and known constraints'
---

Review the provided draft test plan and strengthen it before implementation starts.
If required inputs are missing, ask only for the smallest missing set before proceeding.

## Inputs

- Draft test plan: `${input:draftPlan:Paste the plan or point to a file}`
- Feature summary: `${input:featureSummary:Describe the feature or user journey}`
- Optional constraints: `${input:constraints:Environment, deadlines, or out-of-scope areas}`

## Workflow

1. Read the draft plan and identify the intended coverage, assumptions, and priorities.
2. Highlight missing edge cases, security concerns, integration blind spots, and low-signal scenarios.
3. Recommend the smallest high-impact improvements before any automated test work begins.
4. Summarize the revised priorities and the next best action for the team.

## Output expectations

- a short verdict on the draft plan quality
- a grouped list of coverage gaps and improvement recommendations
- a concise next-step recommendation

## Constraints

- Stay in review mode unless the user explicitly asks for a rewritten plan.
- Focus on risk and coverage, not formatting polish.
