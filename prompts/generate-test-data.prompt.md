---
name: Generate test data
agent: agent
description: 'Design realistic and edge-covering test data packs from requirements, constraints, or existing test plans for manual and automated testing.'
tools: ['vscode', 'read', 'search', 'web', 'todo']
---

# Task

If the `designing-test-data` skill is installed, load it before starting.
Tell the user that the `test-planner` agent mode is useful when the data pack should be tied directly to broader manual test coverage.

Your goal is to build a reusable test data catalog rather than a random list of sample values.

Ask only for what is missing:

- the feature, entities, or fields involved
- known constraints such as formats, limits, enums, and relationships
- whether the data is mainly for manual execution, automation, or both
- any state, role, or environment dependencies

If constraints are not fully specified, derive what you can from the provided plan, criteria, or codebase and list the rest as assumptions.

Then do the following:

1. Identify the key entities and field constraints.
2. Generate grouped data for:
   - valid baseline use
   - boundary values
   - invalid formats or rejected inputs
   - role and state combinations
   - temporal or expiry-sensitive values when relevant
3. Add setup, cleanup, and privacy notes.
4. Highlight which data sets are best suited for automation fixtures.

## Output format

Return Markdown only.
Use grouped tables with stable data-set IDs and clear purpose notes.
