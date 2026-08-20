---
description: 'Validates API responses against OpenAPI or JSON Schema, detects breaking changes between spec versions, and builds consumer-driven contract checks. Use when an API has a published spec, when a backend change might break a client, when API tests assert only status codes, or when mocked fixtures need a guard against drifting from the real service.'
---

# Testing Api Contracts Plugin

Validates API responses against OpenAPI or JSON Schema, detects breaking changes between spec versions, and builds consumer-driven contract checks. Use when an API has a published spec, when a backend change might break a client, when API tests assert only status codes, or when mocked fixtures need a guard against drifting from the real service.

## What's inside

- `skills/testing-api-contracts/` — the agent skill, generated from the repository's `skills/testing-api-contracts/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install testing-api-contracts
```

## Note on source of truth

The skill content is a copy of `skills/testing-api-contracts/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
