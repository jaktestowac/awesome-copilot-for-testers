---
description: 'Compares implementation evidence against acceptance criteria and shows what is met, partial, missing, or untestable. Use when checking feature readiness, preparing QA sign-off, or turning criteria into a concrete verification matrix without inventing missing behavior.'
---

# Verifying Acceptance Criteria Plugin

Compares implementation evidence against acceptance criteria and shows what is met, partial, missing, or untestable. Use when checking feature readiness, preparing QA sign-off, or turning criteria into a concrete verification matrix without inventing missing behavior.

## What's inside

- `skills/verifying-acceptance-criteria/` — the agent skill, generated from the repository's `skills/verifying-acceptance-criteria/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install verifying-acceptance-criteria
```

## Note on source of truth

The skill content is a copy of `skills/verifying-acceptance-criteria/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
