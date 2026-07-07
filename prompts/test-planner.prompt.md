---
name: Generate a comprehensive test plan
description: 'Collects environment details and produces a prioritized test plan with web and API scenarios. Use the test-plan-basic prompt for a quick single-pass plan without deep exploration.'
tools: ['vscode', 'execute', 'read', 'edit', 'search', 'web', 'playwright/*', 'todo']
agent: test-planner
---

# Task

Your goal is to prepare a comprehensive test plan for a website.

Ask me first for:

- Web app URL ${input:baseUrl} (required)
- API base URL ${input:apiBaseUrl} (optional)
- Environment (dev/stage/prod) ${input:environment} (optional)
- Main user roles ${input:userRoles} (optional)
- Scope – features in/out of scope ${input:scope} (optional)
- Known high-risk or business-critical areas ${input:riskAreas} (optional)

If I provide only the web app URL, focus on web testing and exploratory testing.

Then explore and generate a comprehensive test plan for both web and API components.
