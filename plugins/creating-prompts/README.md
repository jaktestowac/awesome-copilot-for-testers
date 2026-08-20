---
description: 'Creates GitHub Copilot prompt files (`.prompt.md`) for VS Code. Use when building reusable workflow starters that route work to the right agent, collect the right inputs, and ship with install-ready templates, examples, and validation guidance.'
---

# Creating Prompts Plugin

Creates GitHub Copilot prompt files (`.prompt.md`) for VS Code. Use when building reusable workflow starters that route work to the right agent, collect the right inputs, and ship with install-ready templates, examples, and validation guidance.

## What's inside

- `skills/creating-prompts/` — the agent skill, generated from the repository's `skills/creating-prompts/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install creating-prompts
```

## Note on source of truth

The skill content is a copy of `skills/creating-prompts/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
