---
description: 'Turns "we will skip this check for now" into a dated, attributed, expiring waiver with a stated reason and owner, inventories the silent skips already hiding in a repo - skipped tests, disabled lint rules, ts-expect-error, continue-on-error, lowered thresholds, coverage ignores - and reports expired waivers as findings. Use when a team wants to bypass a quality gate, when skip lists and quarantined tests accumulate without owners, when an audit asks why a check is off, or when a repo needs to know what it has quietly stopped enforcing.'
---

# Governing Quality Waivers Plugin

This plugin gives an AI agent the capability to turn "we will skip this check for now" into a dated, attributed, expiring waiver - and to inventory the silent skips already hiding in a repository: skipped tests, disabled lint rules, ts-expect-error, continue-on-error, coverage ignores, lowered thresholds and raised retries.

## What's inside

- `skills/governing-quality-waivers/` - the agent skill with supporting resources (waiver register template with expiry enforcement, silent-skip inventory with search commands), synced from the repository's `skills/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install governing-quality-waivers
```

## Usage

Once installed, ask the agent for example:

- "Inventory every silent skip in this repository"
- "We need to skip contract testing this quarter - write the waiver"
- "Which quality checks have we quietly stopped enforcing?"

## Note on source of truth

The skill content is a copy of `skills/governing-quality-waivers/` at the repository root. Do not edit the plugin copy directly - update the root skill and run `npm run plugin:materialize`.
