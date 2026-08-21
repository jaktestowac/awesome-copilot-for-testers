---
description: 'Creates GitHub Copilot hooks for VS Code using `hooks.json`, supporting scripts, and companion docs. Use when automating deterministic checks, pre/post tool policies, or reusable hook packs that need safe defaults, observability, and clear installation guidance.'
---

# Creating Hooks Plugin

Creates GitHub Copilot hooks for VS Code using `hooks.json`, supporting scripts, and companion docs. Use when automating deterministic checks, pre/post tool policies, or reusable hook packs that need safe defaults, observability, and clear installation guidance.

## What's inside

- `skills/creating-hooks/` - the agent skill, generated from the repository's `skills/creating-hooks/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install creating-hooks
```

## Note on source of truth

The skill content is a copy of `skills/creating-hooks/` at the repository root. Do not edit the plugin copy
directly - update the root skill and run `npm run plugin:materialize`.
