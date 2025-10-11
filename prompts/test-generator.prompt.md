---
mode: 'agent'
model: GPT-5 (copilot)
tools: ['codebase', 'editFiles', 'fetch', 'problems', 'runCommands', 'runTasks', 'search', 'searchResults', 'terminalLastCommand', 'terminalSelection', 'edit', 'new', 'think', 'changes', 'testFailure', 'openSimpleBrowser', 'todos', 'microsoft/playwright-mcp']
description: 'Prepare a basic test plan for a website'
---
Your goal is to generate tests based on the test plan. Ask the user for a URL if not provided.

Do the following:
1. Read the test plan from ${input:testPlanPath}.
2. Generate automated tests for the test cases in the test plan:
  - Analyze project codebase to identify the framework (e.g., Playwright, Cypress, Selenium).
  - Generate tests in the appropriate framework and existing structure and structured format.
3. Run the tests to ensure they work correctly:
  - Debug and fix any issues that arise during test execution.
  - Rerun the tests to confirm they pass successfully.
  - Iterate until all tests pass without errors.