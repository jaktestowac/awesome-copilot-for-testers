---
description: 'Packages repository skills as installable Copilot plugins: marketplace registration, `plugin.json` manifests, generated skill copies, and the sync check CI enforces. Use when bundling one or more skills for installation, when adding a plugin to the marketplace, or when `npm run lint` reports that a plugin copy has drifted from its source skill.'
---

# Creating Plugins Plugin

Packages repository skills as installable Copilot plugins: marketplace registration, `plugin.json` manifests, generated skill copies, and the sync check CI enforces. Use when bundling one or more skills for installation, when adding a plugin to the marketplace, or when `npm run lint` reports that a plugin copy has drifted from its source skill.

## What's inside

- `skills/creating-plugins/` — the agent skill, generated from the repository's `skills/creating-plugins/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install creating-plugins
```

## Note on source of truth

The skill content is a copy of `skills/creating-plugins/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
