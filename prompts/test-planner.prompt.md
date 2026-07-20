---
name: Generate a comprehensive test plan
description: 'Collects environment details and produces a prioritized test plan with web and API scenarios. Use the test-plan-basic prompt for a quick single-pass plan without deep exploration.'
tools: ['vscode', 'execute', 'read', 'edit', 'search', 'web', 'playwright/*', 'todo']
agent: test-planner
---

# Task

Your goal is to prepare a comprehensive, risk-prioritized test plan for a website and its API.

Ask me first for:

- Web app URL ${input:baseUrl} (required)
- API base URL ${input:apiBaseUrl} (optional)
- Environment (dev/stage/prod) ${input:environment} (optional)
- Main user roles ${input:userRoles} (optional)
- Scope – features in/out of scope ${input:scope} (optional)
- Known high-risk or business-critical areas ${input:riskAreas} (optional)

If I provide only the web app URL, focus on web and exploratory testing.
Confirm write actions are safe in the given environment before interacting with forms or data.

Then do the following:

1. Explore the application with Playwright: identify key user flows, roles, forms, and states. If an API base URL was given, probe the main endpoints and auth model.
2. Map features to risk: classify each area as high, medium, or low based on business impact and likelihood of failure.
3. Build the test plan with:
   - scope, assumptions, and out-of-scope areas
   - prioritized test scenarios per feature (happy path, negative, boundary, permission)
   - API scenarios when applicable (contract, auth, error handling)
   - suggested test types and automation candidates
   - open questions and information gaps
4. Pause for my feedback and refine the plan until I confirm it is complete.

## Output format

Return Markdown and save the final plan to `.qa/test-plan.md`.
Use stable scenario IDs and priority tags so the plan can feed directly into the `test-generator` or `manual-test-cases` prompts.
