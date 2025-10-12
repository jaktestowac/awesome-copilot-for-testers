---
title: Generate a comprehensive Test Plan 
description: Collects environment details and produces a prioritized test plan with web and API scenarios using the `Test Planner Chat Mode`.
tools: ['edit', 'search', 'new', 'runCommands', 'runTasks', 'think', 'problems', 'changes', 'testFailure', 'openSimpleBrowser', 'fetch', 'todos', 'microsoft/playwright-mcp/*']
mode: agent
---

Your goal is to prepare a comprehensive test plan for a website. Ask the user for a URL if not provided. Tell user that he should enable chat mode `Test Planner` (test-planner) for Agent for best results.

Ask me first for:
- Web app URL ${input:baseUrl} (required)
- API base URL (optional)
- Environment (dev/stage/prod) (optional)
- Main user roles (optional)
- Scope – features in/out of scope (optional)
- Known high-risk or business-critical areas (optional)

If I provide only the web app URL, focus on web testing and exploratory testing. 

Then explore and generate a comprehensive test plan for both web and API components.