---
description: 'Creates GitHub Copilot instruction files for VS Code, including repository guidance and scoped `.instructions.md` rules. Use when encoding project conventions, choosing `applyTo` patterns, or shipping install-ready instruction examples with rationale and guardrails.'
---

# Creating Instructions Plugin

Creates GitHub Copilot instruction files for VS Code, including repository guidance and scoped `.instructions.md` rules. Use when encoding project conventions, choosing `applyTo` patterns, or shipping install-ready instruction examples with rationale and guardrails.

## What's inside

- `skills/creating-instructions/` — the agent skill, generated from the repository's `skills/creating-instructions/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install creating-instructions
```

## Note on source of truth

The skill content is a copy of `skills/creating-instructions/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
