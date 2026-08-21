---
description: 'Generates the CI workflow that enforces a quality contract: layered jobs from fast local hooks to release gates, per-practice steps for JS/TS toolchains, diff-scoped checks, sticky PR reporting, required-check wiring, and a severity policy deciding what fails the build. Use when quality practices are agreed but not enforced, when CI runs everything on every commit, when a gate reports green while the check it runs cannot fail, or when a per-change gate needs to post findings on the pull request.'
---

# Generating Quality Gate Workflows Plugin

This plugin gives an AI agent the capability to turn agreed quality practices into CI that actually enforces them: layered jobs, diff-scoped checks, soft gates expressed as soft gates rather than hidden behind commands that always succeed, sticky PR reporting, and required-check wiring.

## What's inside

- `skills/generating-quality-gate-workflows/` — the agent skill with supporting resources (per-practice GitHub Actions jobs, the GitLab CI equivalents, governance jobs, monorepo and fork-safety patterns), synced from the repository's `skills/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install generating-quality-gate-workflows
```

## Usage

Once installed, ask the agent for example:

- "Generate the CI workflow that enforces our quality contract"
- "Why is this build green when the audit step clearly failed?"
- "Add a diff-coverage gate without blocking the whole team on day one"

## Note on source of truth

The skill content is a copy of `skills/generating-quality-gate-workflows/` at the repository root. Do not edit the plugin copy directly — update the root skill and run `npm run plugin:materialize`.
