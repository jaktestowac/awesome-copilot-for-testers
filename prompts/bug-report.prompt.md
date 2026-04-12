---
name: Create a bug report
agent: agent
description: 'Turn rough tester notes, screenshots, logs, or observed behavior into a professional bug report with severity, reproducibility, and evidence guidance.'
tools: ['vscode', 'read', 'search', 'web', 'todo']
---

# Task

If the `reporting-bugs` skill is installed, load it before starting.
Tell the user that the `test-planner` agent mode works well for product defects, while `accessibility-expert` is the better fit for issues that are purely accessibility-related.

Your goal is to turn partial notes into a clean, developer-ready bug report.

Ask only for missing essentials:

- where the issue happened
- what was expected
- what happened instead
- how to reproduce it
- environment or build details
- any evidence already captured

If the evidence is incomplete, do not guess.
Instead, create the report with a clear **Confidence** section and a short **Missing Evidence** checklist.

Then do the following:

1. Normalize the issue into a reproducible story: starting state, trigger, actual result, expected result.
2. Classify the bug by category, severity, and reproducibility.
3. Build a report with: title, severity, confidence, environment, preconditions, steps, actual result, expected result, user impact, evidence, and notes.
4. Keep diagnosis separate from observation. If root cause is uncertain, label it as a hypothesis.
5. Finish with suggested retest focus and any missing data needed for confirmation.

## Output format

Return Markdown only.
Structure the report so it can be pasted directly into Jira, GitHub Issues, Linear, or a team chat.
