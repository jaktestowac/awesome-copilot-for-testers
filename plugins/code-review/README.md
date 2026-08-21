---
description: 'Performs a quick, lightweight review of a small diff or single file, giving concise feedback on correctness, readability, tests, and obvious risks. Use when the user asks for a fast sanity-check review of a small change. For test-automation suites, architectural refactors, security-sensitive paths, or multi-file reviews, use the code-review-advanced skill instead.'
---

# Code Review Plugin

Performs a quick, lightweight review of a small diff or single file, giving concise feedback on correctness, readability, tests, and obvious risks. Use when the user asks for a fast sanity-check review of a small change. For test-automation suites, architectural refactors, security-sensitive paths, or multi-file reviews, use the code-review-advanced skill instead.

## What's inside

- `skills/code-review/` - the agent skill, generated from the repository's `skills/code-review/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install code-review
```

## Note on source of truth

The skill content is a copy of `skills/code-review/` at the repository root. Do not edit the plugin copy
directly - update the root skill and run `npm run plugin:materialize`.
