---
description: 'Creates GitHub Copilot skills with reusable workflows, companion resources, and validation gates. Use when packaging repeatable expertise into a `SKILL.md` folder, deciding what belongs in the skill body versus resources, or producing install-ready skill examples for a team or collection.'
---

# Creating Skills Plugin

Creates GitHub Copilot skills with reusable workflows, companion resources, and validation gates. Use when packaging repeatable expertise into a `SKILL.md` folder, deciding what belongs in the skill body versus resources, or producing install-ready skill examples for a team or collection.

## What's inside

- `skills/creating-skills/` — the agent skill, generated from the repository's `skills/creating-skills/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install creating-skills
```

## Note on source of truth

The skill content is a copy of `skills/creating-skills/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
