---
description: 'Measures the risk that code shipped without anyone understanding it: a teach-back attestation on high-risk changes, a risk band from changed-code complexity, diff size and whether a human explanation accompanied it, and optional AI-authorship provenance. Findings stay advisory by design. Use when an AI-assisted codebase grows faster than the team reads it, when reviews are rubber-stamped, when nobody can explain a module that ships weekly, or when leadership asks how much of the code the team can actually maintain.'
---

# Assessing Comprehension Debt Plugin

This plugin gives an AI agent the capability to measure the risk that code shipped without anyone understanding it: a risk band from changed-code complexity, diff size and whether a human explanation accompanied the change, plus a teach-back protocol. Findings are advisory by design and never fail a build.

## What's inside

- `skills/assessing-comprehension-debt/` - the agent skill with supporting resources (risk band rubric with known false positives, four-question teach-back protocol), synced from the repository's `skills/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install assessing-comprehension-debt
```

## Usage

Once installed, ask the agent for example:

- "How much of this codebase can the team actually explain?"
- "Run a comprehension debt assessment for last quarter"
- "Which modules have one author and no reviewer?"

## Note on source of truth

The skill content is a copy of `skills/assessing-comprehension-debt/` at the repository root. Do not edit the plugin copy directly - update the root skill and run `npm run plugin:materialize`.
