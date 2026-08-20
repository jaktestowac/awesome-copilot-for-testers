---
description: 'Designs realistic, boundary-heavy, and role-aware test data packs for manual and automated testing. Use when a feature needs deliberate inputs and fixtures before execution, when edge-case values keep being improvised, or when automation needs stable example data with setup notes.'
---

# Designing Test Data Plugin

Designs realistic, boundary-heavy, and role-aware test data packs for manual and automated testing. Use when a feature needs deliberate inputs and fixtures before execution, when edge-case values keep being improvised, or when automation needs stable example data with setup notes.

## What's inside

- `skills/designing-test-data/` — the agent skill, generated from the repository's `skills/designing-test-data/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install designing-test-data
```

## Note on source of truth

The skill content is a copy of `skills/designing-test-data/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
