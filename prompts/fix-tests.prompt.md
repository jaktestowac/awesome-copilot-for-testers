---
mode: 'agent'
model: GPT-5 (copilot)
tools: ['codebase', 'editFiles', 'fetch', 'problems', 'runCommands', 'runTasks', 'search', 'searchResults', 'terminalLastCommand', 'terminalSelection', 'edit', 'new', 'think', 'changes', 'testFailure', 'openSimpleBrowser', 'todos', 'microsoft/playwright-mcp']
description: 'Fix failing tests'
---
Your goal is to fix failing tests.

Do the following:
1. Identify failing tests:
  - Run the test suite to identify which tests are failing.
  - Analyze error messages and logs to understand the reasons for failure.
2. Fix failing tests:
  - Modify the code or tests to address the root causes of failures.
  - Ensure that fixes are aligned with the overall test strategy and quality standards.
3. Validate fixes:
  - Rerun the test suite to confirm that all tests pass successfully.
  - Conduct additional testing as needed to ensure the stability and reliability of the application.

Repeat steps 1-3 until all tests pass without errors.