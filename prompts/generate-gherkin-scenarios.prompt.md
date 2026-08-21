---
name: Generate Gherkin scenarios
agent: test-planner
description: 'Convert a user story, acceptance criteria, or feature description into well-formed Gherkin scenarios (Given/When/Then) with scenario outlines for data variations, ready for BDD frameworks like Cucumber or Playwright-BDD.'
tools: ['vscode', 'read', 'search', 'todo']
---

# Task

Your goal is to produce Gherkin scenarios that read as living documentation, not a UI click script in disguise.

Convert the requirements provided: ${input:requirements:user story, acceptance criteria, feature description, or a file path}

Ask only for missing essentials:

- the requirements, if not provided
- domain vocabulary the team already uses, if a glossary or existing feature files exist in the workspace (search for `*.feature` files first)
- explicit out-of-scope behavior

Then do the following:

1. Extract the behaviors: each distinct rule or outcome becomes its own scenario. Do not bundle unrelated outcomes into one scenario.
2. Write scenarios following Gherkin best practices:
   - declarative, business-language steps ("Given the user has an expired subscription"), not UI mechanics ("When I click the red button")
   - one When per scenario - a single action or event under test
   - concrete example values rather than abstract placeholders
   - `Scenario Outline` with an `Examples` table when the same rule varies only by data
   - `Background` only for setup shared by every scenario in the feature
3. Cover the rule from all sides: happy path, negative cases, boundary values, and permission variants that the requirements imply.
4. Reuse step phrasing consistently so steps can map to shared step definitions.
5. List the requirement statements that could not be expressed as scenarios and why - these go back to the product owner or to the `review-requirements` prompt.

## Output format

Return a complete `.feature` file in a Gherkin code block, with feature-level description and tags (e.g. `@smoke`, `@regression`) on scenarios.
After the feature file, add a short section with open questions and untestable statements.
Do not create or edit files unless I explicitly ask you to save the feature file.
