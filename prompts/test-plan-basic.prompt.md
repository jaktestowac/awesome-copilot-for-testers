---
name: Generate a basic test plan
tools: ['vscode', 'execute', 'read', 'edit', 'search', 'web', 'playwright/*', 'todo']
description: 'Generate a quick, single-pass test plan for a website from light exploration. Use the test-planner prompt for a comprehensive, interactive plan covering web and API.'
agent: agent
---

# Task

Your goal is to prepare a test plan for a website based on exploration and analysis. Ask the user for a URL if not provided.

Do the following:

1. Explore the website at ${input:baseUrl} and basic user flows:

- Identify key user interactions and workflows.
- Focus on key user flows and app functionalities.

2. Prepare a test plan that:

- includes basic test cases for the main features of the website
- is in markdown format and is saved to `.qa/basic-test-plan.md`
