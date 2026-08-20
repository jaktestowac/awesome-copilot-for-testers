---
description: 'Produces production-ready Product Requirements Documents (PRDs) for software systems and AI-powered features, with clear problem framing, measurable outcomes, scoped functionality, testable requirements, and explicit risks. Use when the user wants to write a PRD, define requirements, plan a feature, or turn a vague product idea into an implementation-ready specification.'
---

# Prd Generator Plugin

Produces production-ready Product Requirements Documents (PRDs) for software systems and AI-powered features, with clear problem framing, measurable outcomes, scoped functionality, testable requirements, and explicit risks. Use when the user wants to write a PRD, define requirements, plan a feature, or turn a vague product idea into an implementation-ready specification.

## What's inside

- `skills/prd-generator/` — the agent skill, generated from the repository's `skills/prd-generator/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install prd-generator
```

## Note on source of truth

The skill content is a copy of `skills/prd-generator/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
