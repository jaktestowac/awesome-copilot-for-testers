---
description: 'Tests the customization assets themselves - skills, prompts, custom agents, instructions - the way a product is tested: activation cases that check an asset fires when it should and stays quiet when it should not, output-contract cases, safety cases, collision cases between assets competing for the same trigger, a weighted rubric scored blind, and a baseline-versus-candidate gate before an edit ships. Use when a skill is edited and nobody knows whether behaviour changed, when two skills fight over the same request, when a description is being tuned for discoverability, when a collection has grown past manual spot-checking, or when the request mentions skill evals, prompt regression, or "does this skill actually work".'
---

# Testing Agent Skills Plugin

Tests the customization assets themselves - skills, prompts, custom agents, instructions - the way a product is tested: activation cases that check an asset fires when it should and stays quiet when it should not, output-contract cases, safety cases, collision cases between assets competing for the same trigger, a weighted rubric scored blind, and a baseline-versus-candidate gate before an edit ships. Use when a skill is edited and nobody knows whether behaviour changed, when two skills fight over the same request, when a description is being tuned for discoverability, when a collection has grown past manual spot-checking, or when the request mentions skill evals, prompt regression, or "does this skill actually work".

## What's inside

- `skills/testing-agent-skills/` - the agent skill, generated from the repository's `skills/testing-agent-skills/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install testing-agent-skills
```

## Note on source of truth

The skill content is a copy of `skills/testing-agent-skills/` at the repository root. Do not edit the plugin copy
directly - update the root skill and run `npm run plugin:materialize`.
