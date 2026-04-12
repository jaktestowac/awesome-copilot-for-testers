---
name: '<Prompt display name>'
agent: '<target-agent>'
description: '<What this prompt does and when to use it>'
model: '<preferred-model>'
argument-hint: '<What the user should provide>'
tools: ['<optional-tool-override>']
---

Create or run the workflow for <goal>.
If required inputs are missing, ask only for the missing essentials before continuing.

## Inputs

- Primary input: `${input:primaryInput:Describe the main thing the prompt needs}`
- Optional context: `${input:extraContext:Any useful constraints, files, or links}`

## Workflow

1. Inspect the relevant context before making assumptions.
2. Produce the main outcome for `<goal>`.
3. Validate the result or explain what still needs verification.
4. Summarize the next best action.

## Output expectations

- <main deliverable>
- <important supporting detail>
- <concise close-out or recommendation>

## Constraints

- Stay focused on <scope>.
- Do not <out-of-scope behavior> unless the user explicitly asks.
