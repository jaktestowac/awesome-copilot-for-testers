---
description: 'Performs evidence-driven code review for pull requests, legacy modules, and quality-critical changes. Use when reviewing complex or multi-file changes, test automation suites, architectural refactors, or hot paths that need analysis of correctness, maintainability, security, performance, test quality, and operability risks. Provides structured feedback with severity-ranked findings, actionable recommendations, and clear rationale. For a fast sanity check of a small diff or single file, use the code-review skill instead.'
---

# Code Review Advanced Plugin

Performs evidence-driven code review for pull requests, legacy modules, and quality-critical changes. Use when reviewing complex or multi-file changes, test automation suites, architectural refactors, or hot paths that need analysis of correctness, maintainability, security, performance, test quality, and operability risks. Provides structured feedback with severity-ranked findings, actionable recommendations, and clear rationale. For a fast sanity check of a small diff or single file, use the code-review skill instead.

## What's inside

- `skills/code-review-advanced/` - the agent skill, generated from the repository's `skills/code-review-advanced/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install code-review-advanced
```

## Note on source of truth

The skill content is a copy of `skills/code-review-advanced/` at the repository root. Do not edit the plugin copy
directly - update the root skill and run `npm run plugin:materialize`.
