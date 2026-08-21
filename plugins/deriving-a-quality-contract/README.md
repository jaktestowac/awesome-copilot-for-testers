---
description: 'Derives a project-specific quality contract from three axes — risk profile, team maturity, and product surface — labelling each testing practice MUST, SHOULD, or COULD, then produces a PRESENT/PARTIAL/MISSING/WAIVED gap matrix with an ordered remediation plan. Use when a project has no agreed testing strategy, when a team argues about which practices are mandatory, when onboarding a legacy or inherited repository, when a quality strategy document has to be derived from evidence instead of opinion, or when someone asks "what testing should we actually be doing here".'
---

# Deriving A Quality Contract Plugin

This plugin gives an AI agent the capability to derive a project-specific quality contract — which testing practices are MUST, SHOULD or COULD for this risk profile, maturity level and product surface — and then report the gap between that contract and what the repository actually enforces.

## What's inside

- `skills/deriving-a-quality-contract/` — the agent skill with supporting resources (practice catalog, risk profiles, maturity model, detection signals, contract template), synced from the repository's `skills/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install deriving-a-quality-contract
```

## Usage

Once installed, ask the agent for example:

- "Derive a quality contract for this repository"
- "Which testing practices are mandatory for this project, and which are we missing?"
- "Build a gap matrix and a remediation plan from what this repo actually enforces"

## Note on source of truth

The skill content is a copy of `skills/deriving-a-quality-contract/` at the repository root. Do not edit the plugin copy directly — update the root skill and run `npm run plugin:materialize`.
