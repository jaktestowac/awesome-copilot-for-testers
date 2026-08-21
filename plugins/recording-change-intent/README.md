---
description: 'Requires an externalised rationale for high-risk changes — new public exports, new endpoints, auth edits, migrations, removed guards — recorded as an Intent commit trailer, an ADR reference, or a module intent register, and reports high-risk changes that carry none. Use when agent-generated or AI-assisted changes ship without a recorded why, when reviewers cannot tell what a diff was for, when a codebase is losing its decision history, or when setting up an intent gate alongside test and coverage gates.'
---

# Recording Change Intent Plugin

This plugin gives an AI agent the capability to require and draft an externalised rationale for high-risk changes — recorded as an Intent commit trailer, an ADR reference or a module intent register — so the reason a change was made survives after the PR, the ticket and the chat thread are gone.

## What's inside

- `skills/recording-change-intent/` — the agent skill with supporting resources (trailer grammar and validation, hook and CI enforcement snippets, high-risk surface rules, module intent register), synced from the repository's `skills/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install recording-change-intent
```

## Usage

Once installed, ask the agent for example:

- "Does this change have a recorded rationale?"
- "Draft an Intent trailer for the current diff"
- "Which high-risk changes shipped this quarter with no recorded why?"

## Note on source of truth

The skill content is a copy of `skills/recording-change-intent/` at the repository root. Do not edit the plugin copy directly — update the root skill and run `npm run plugin:materialize`.
