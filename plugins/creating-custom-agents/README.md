---
description: 'Creates GitHub Copilot custom agents (`.agent.md`) for VS Code. Use when defining a specialized agent role, selecting a minimal toolset, referencing supporting skills, or shipping install-ready agent examples with clear boundaries and collaboration rules.'
---

# Creating Custom Agents Plugin

Creates GitHub Copilot custom agents (`.agent.md`) for VS Code. Use when defining a specialized agent role, selecting a minimal toolset, referencing supporting skills, or shipping install-ready agent examples with clear boundaries and collaboration rules.

## What's inside

- `skills/creating-custom-agents/` - the agent skill, generated from the repository's `skills/creating-custom-agents/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install creating-custom-agents
```

## Note on source of truth

The skill content is a copy of `skills/creating-custom-agents/` at the repository root. Do not edit the plugin copy
directly - update the root skill and run `npm run plugin:materialize`.
