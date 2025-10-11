---
mode: 'agent'
model: GPT-5 (copilot)
tools: ['codebase', 'editFiles', 'fetch', 'problems', 'runCommands', 'runTasks', 'search', 'searchResults', 'terminalLastCommand', 'terminalSelection', 'edit', 'new', 'think', 'changes', 'testFailure', 'openSimpleBrowser', 'todos', 'microsoft/playwright-mcp']
description: 'Prepare a basic test plan for a website'
---
Your goal is to prepare a test plan for a website based on exploration and analysis. Ask the user for a URL if not provided.

Do the following:

1. Explore websites at ${input:baseUrl} and basic user flows:
  - Identify key user interactions and workflows.
  - Focus on key user flows and app functionalities.
2. Prepare a test plan that:
  - includes basic test cases for the main features of the website
  - is in markdown format and is saved to `spec/basic-test-plan.md`