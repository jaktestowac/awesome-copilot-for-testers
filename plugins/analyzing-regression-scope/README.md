---
description: 'Analyzes diffs, changed files, hotfixes, and release candidates to identify where regression risk spreads and what must be retested first. Use when scoping retest after a change, reviewing QA impact for a pull request, or building a minimal confidence suite for release validation.'
---

# Analyzing Regression Scope Plugin

Analyzes diffs, changed files, hotfixes, and release candidates to identify where regression risk spreads and what must be retested first. Use when scoping retest after a change, reviewing QA impact for a pull request, or building a minimal confidence suite for release validation.

## What's inside

- `skills/analyzing-regression-scope/` — the agent skill, generated from the repository's `skills/analyzing-regression-scope/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install analyzing-regression-scope
```

## Note on source of truth

The skill content is a copy of `skills/analyzing-regression-scope/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
