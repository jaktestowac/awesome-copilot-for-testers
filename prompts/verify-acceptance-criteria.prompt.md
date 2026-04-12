---
name: Verify acceptance criteria
agent: agent
description: 'Compare implementation evidence against acceptance criteria and show what is met, partial, missing, or still untestable.'
tools: ['vscode', 'read', 'search', 'web', 'playwright/*', 'todo']
---

# Task

If the `verifying-acceptance-criteria` skill is installed, load it before starting.
Tell the user that the `test-planner` agent mode is a good fit for this workflow when UI or end-to-end behavior must be checked in detail.

Your goal is to verify whether the implementation satisfies its stated contract.

Ask only for the missing essentials:

- the acceptance criteria or source of truth
- the implementation evidence to inspect: code, PR, screenshots, API responses, or a running URL
- the environment under review

If a live URL is available and safe to access, inspect the relevant behavior with Playwright.
Do not invent missing product rules.

Then do the following:

1. Normalize the criteria into atomic items with stable IDs.
2. Verify each item using the statuses: Met, Partial, Not Met, or Untestable.
3. Cite evidence for each verdict.
4. Summarize what is ready, what needs follow-up, and what still needs clarification.
5. End with the best next step: fix, clarify requirements, add tests, or re-verify later.

## Output format

Return Markdown only.
Use a verification matrix plus a short sign-off summary.
