---
description: 'Classifies a diff into file tags and hunk tags - new public export, new endpoint, modified auth, SQL string, migration, added dependency, touched prompt - then maps each tag to the quality practices it makes relevant, producing a defensible per-change check scope instead of running everything or guessing. Use when deciding what to test for a specific pull request, when a full regression run is too slow to gate on, when a pre-push or PR gate needs a scope someone can argue with, or when asked "which checks does this change actually need".'
---

# Scoping Change Relevance Plugin

This plugin gives an AI agent the capability to tag a diff — new public export, new endpoint, modified auth, SQL string, migration, added dependency, touched prompt, removed test — and resolve which quality practices those tags make relevant, producing a per-change check scope someone can argue with.

## What's inside

- `skills/scoping-change-relevance/` — the agent skill with supporting resources (file and hunk tag rules, practice relevance recipes, scope report template), synced from the repository's `skills/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install scoping-change-relevance
```

## Usage

Once installed, ask the agent for example:

- "What should we test for this pull request?"
- "Scope the checks for the diff against main"
- "Is this change as small as it looks?"

## Note on source of truth

The skill content is a copy of `skills/scoping-change-relevance/` at the repository root. Do not edit the plugin copy directly — update the root skill and run `npm run plugin:materialize`.
