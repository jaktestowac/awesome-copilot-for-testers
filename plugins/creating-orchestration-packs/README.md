---
description: 'Creates agent orchestration packs: cooperating `.agent.md` files with an orchestrator, subagents, matched handoffs, minimal tool grants, and a shared handoff packet contract. Use when one agent role is too broad for a job, when a workflow needs explore, plan, implement, review, and verify as separate roles, or when a pack fails the orchestration lint because a handoff target does not resolve.'
---

# Creating Orchestration Packs Plugin

Creates agent orchestration packs: cooperating `.agent.md` files with an orchestrator, subagents, matched handoffs, minimal tool grants, and a shared handoff packet contract. Use when one agent role is too broad for a job, when a workflow needs explore, plan, implement, review, and verify as separate roles, or when a pack fails the orchestration lint because a handoff target does not resolve.

## What's inside

- `skills/creating-orchestration-packs/` — the agent skill, generated from the repository's `skills/creating-orchestration-packs/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install creating-orchestration-packs
```

## Note on source of truth

The skill content is a copy of `skills/creating-orchestration-packs/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
