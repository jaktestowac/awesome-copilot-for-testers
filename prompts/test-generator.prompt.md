---
name: Generate tests based on test plan
agent: agent
tools: ['vscode', 'execute', 'read', 'edit', 'search', 'web', 'playwright/*', 'todo']
description: 'Generate automated tests from a written test plan file, matching the project''s existing framework. Use the playwright-generate-test prompt instead when starting from a scenario description.'
---

# Task

Your goal is to generate tests based on the test plan.

Do the following:

1. Read the test plan from ${input:testPlanPath}. If no path was provided, ask the user for it.
2. Generate automated tests for the test cases in the test plan:

- Analyze project codebase to identify the framework (e.g., Playwright, Cypress, Selenium).
- Generate tests in the appropriate framework, following the existing structure, naming, fixtures, and helper patterns.
- Keep the generated tests trustworthy:
  - each test is independent and sets up its own state
  - assertions verify meaningful outcomes, not just navigation
  - no hardcoded waits or sleeps - use the framework's waiting/assertion mechanisms
  - no hardcoded credentials or environment URLs - use existing config or environment variables
- Reference the originating test case ID from the plan in each test title or comment for traceability.

3. Run the tests to ensure they work correctly:

- Debug and fix any issues that arise during test execution.
- Rerun the tests to confirm they pass successfully.
- Iterate until all tests pass without errors.

4. Summarize honestly:

- Report exactly which tests were run and passed, and which could not be executed (and why).
- Never present unexecuted tests as verified.
