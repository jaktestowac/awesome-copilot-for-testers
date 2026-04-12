---
name: Analyze regression scope
agent: agent
description: 'Turn a diff, PR summary, changed files, or hotfix description into a prioritized regression scope with a minimal confidence suite and retest guidance.'
tools: ['vscode', 'read', 'search', 'todo']
---

# Task

If the `analyzing-regression-scope` skill is installed, load it before starting.
Tell the user that the `qa-strategist` agent mode is useful when the change also needs adversarial or security-driven expansion.

Your goal is to determine what must be retested after a change and what can safely stay out of the first-pass regression pack.

Ask only for what is missing:

- diff, PR summary, changed files, or release notes
- the critical user journeys or business flows that matter most
- environment or release context if it changes risk

Then do the following:

1. Map the change surface into direct, adjacent, shared, and data/state risk.
2. Classify each affected area as high, medium, or low regression risk.
3. Build a retest pack with:
   - must retest
   - should retest
   - can sample
   - can defer with caution
4. Provide a minimal confidence suite for the current change.
5. End with open questions, blind spots, and the best candidates for future automation hardening.

## Output format

Return Markdown only.
Use a concise regression report that a tester, lead, or release manager can act on immediately.
