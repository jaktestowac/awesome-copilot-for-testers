---
mode: agent
description: 'Generate a Playwright test based on a scenario using Playwright MCP'
tools: ['search/codebase', 'edit/editFiles', 'fetch', 'problems', 'runCommands', 'runTasks', 'search', 'search/searchResults', 'runCommands/terminalLastCommand', 'runCommands/terminalSelection', 'edit', 'new', 'think', 'changes', 'testFailure', 'openSimpleBrowser', 'todos', 'microsoft/playwright-mcp/*']
---

# Playwright MCP: Guided Test Generation

Your task is to generate a **Playwright TypeScript test** using `@playwright/test` based on the user-provided scenario. Follow the workflow strictly and in sequence.

## Workflow Rules

1. **Scenario Requirement**
   - If the user has not provided a scenario, ask them to supply one before proceeding.
   - The scenario must clearly describe the behavior or feature to be tested.

2. **Step-by-Step Execution**
   - Use the Playwright MCP tools to complete each prescribed step in order.
   - DO NOT generate or output test code before all steps are successfully completed.
   - Each step should be executed, validated, and confirmed before moving to the next.

3. **Test Generation**
   - Once all steps are complete, generate a Playwright TypeScript test using `@playwright/test`.
   - The test must reflect the scenario details and follow Playwright best practices.
   - Save the generated file in the `tests/` directory.

4. **Execution & Iteration**
   - Execute the generated test file.
   - Analyze the results and iterate on the test code until it passes successfully.

## Output Rules

- Only output the final Playwright TypeScript test after all steps and iterations are done.
- Never generate or execute incomplete tests.
- Ensure the final test runs without errors and meets the scenario requirements.
