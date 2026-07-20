---
name: Generate exploratory testing charters
agent: test-planner
description: 'Create prioritized, timeboxed exploratory testing session charters from a feature description, release notes, or live app exploration — with risk focus, test ideas, and oracle notes for each session.'
tools: ['vscode', 'read', 'search', 'web', 'playwright/*', 'todo']
---

# Task

Your goal is to produce session charters a tester can pick up and explore with immediately, instead of a generic "click around" instruction.

Ask only for missing essentials:

- what to explore: feature description, release notes, user story, or app URL ${input:target}
- known risk areas, recent changes, or past bug hotspots
- available time budget and number of testers, if known
- personas or roles that matter

If a live URL is provided and safe to explore, take a short reconnaissance pass with Playwright to ground the charters in the real UI.

Then do the following:

1. Break the target into explorable areas and rank them by risk and uncertainty.
2. For each area, write a charter using the pattern: **Explore** _target_ **with** _resources/data/tools_ **to discover** _information goal_.
3. Enrich each charter with:
   - a suggested timebox (30/60/90 minutes)
   - concrete test ideas and heuristics to apply (boundaries, interruptions, state changes, roles, data variations)
   - oracle notes: how the tester will recognize a problem
   - setup needs: accounts, data, environment
4. Order the charters into a suggested session sequence for the available time budget.
5. End with what is deliberately not covered and which findings should feed back into `bug-report` or `manual-test-cases`.

## Output format

Return Markdown only.
Use one section per charter with a stable ID, priority, and timebox, so charters can be assigned and tracked individually.
