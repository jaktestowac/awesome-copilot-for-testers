---
title: Generate a Basic Test Plan
tools: ['vscode', 'execute', 'read', 'edit', 'search', 'web', 'playwright/*', 'todo']
description: 'Generate a basic Test Plan'
model: GPT-5 (copilot)
agent: agent
---

# Task

Your goal is to prepare a test plan for a website based on exploration and analysis. Ask the user for a URL if not provided.

Do the following:

1. Explore websites at ${input:baseUrl} and basic user flows:

- Identify key user interactions and workflows.
- Focus on key user flows and app functionalities.

2. Prepare a test plan that:

- includes basic test cases for the main features of the website
- is in markdown format and is saved to `spec/basic-test-plan.md`
