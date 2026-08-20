---
description: 'Transforms rough tester notes, screenshots, console output, or observed behavior into reproducible defect reports with severity, evidence, and follow-up guidance. Use when logging bugs, triaging intermittent issues, or rewriting vague defect notes into developer-ready reports.'
---

# Reporting Bugs Plugin

Transforms rough tester notes, screenshots, console output, or observed behavior into reproducible defect reports with severity, evidence, and follow-up guidance. Use when logging bugs, triaging intermittent issues, or rewriting vague defect notes into developer-ready reports.

## What's inside

- `skills/reporting-bugs/` — the agent skill, generated from the repository's `skills/reporting-bugs/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install reporting-bugs
```

## Note on source of truth

The skill content is a copy of `skills/reporting-bugs/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
