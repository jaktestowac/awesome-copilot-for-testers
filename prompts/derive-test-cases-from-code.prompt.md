---
name: Derive test cases from code
agent: test-planner
description: 'Read a function, module, or diff and derive white-box test cases from its actual branches, boundaries, and error paths — then compare against existing tests to expose coverage gaps.'
tools: ['vscode', 'read', 'search', 'todo']
---

# Task

If the `designing-functional-tests` skill is installed, load it before starting.

Your goal is to derive test cases from what the code actually does, not from what the requirements say it should do. This complements the `manual-test-cases` prompt, which works from requirements.

Analyze the target code. Priority order:

1. The current selection: ${selection}
2. The active file: ${file}
3. A file, folder, or diff provided in the request: ${input:target:file path, folder, or diff to analyze}

If none of these yields a target, ask me to pick one before continuing.

Then do the following:

1. Map the testable surface: public functions, branches, loops, boundary conditions, error handling, side effects, and external dependencies.
2. Derive test cases for:
   - each meaningful branch and decision outcome
   - boundary values visible in the code (limits, comparisons, off-by-one risks)
   - error and exception paths, including how failures propagate
   - input validation and type/format edge cases
   - state and side effects: what must be set up and what must be verified afterwards
3. Search for existing tests covering this code and mark each derived case as **covered**, **partially covered**, or **missing**.
4. Flag testability problems you noticed: hidden dependencies, non-deterministic behavior, or logic that cannot be reached from any public entry point.
5. Prioritize the missing cases by risk.

## Output format

Return Markdown only.
Use a table: `ID | Target (function/branch) | Case | Input/Setup | Expected Result | Level (unit/integration/e2e) | Coverage | Priority`.
End with the top gaps to close first and, when relevant, which cases are good candidates for the `test-generator` prompt.

## Constraints

- Derive expected results from the code's actual behavior; if the code looks wrong, flag the suspicion instead of inventing a requirement.
- Do not create or edit any files — this is analysis and design only.
