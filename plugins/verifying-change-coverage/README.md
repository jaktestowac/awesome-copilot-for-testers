---
description: 'Verifies that the lines and branches a change actually touched are executed by tests, using LCOV or Cobertura diff coverage instead of whole-repo percentages, and escalates uncovered high-risk changes into a blocking finding. Use when a pull request needs a coverage gate that unrelated tests cannot satisfy, when total coverage looks healthy but the diff is untested, when wiring diff coverage into CI, or when someone claims a change is covered because the suite is green.'
---

# Verifying Change Coverage Plugin

This plugin gives an AI agent the capability to verify that the lines and branches a change actually touched are executed by tests, using LCOV or Cobertura diff coverage instead of whole-repo percentages, and to escalate uncovered high-risk changes into a blocking finding.

## What's inside

- `skills/verifying-change-coverage/` - the agent skill with supporting resources (coverage artifact formats and merging, thresholds and legitimate exceptions, CI wiring), synced from the repository's `skills/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install verifying-change-coverage
```

## Usage

Once installed, ask the agent for example:

- "Is the code in this PR actually covered by tests?"
- "Wire a diff-coverage gate into CI"
- "Total coverage is 84% - which of my new lines are untested?"

## Note on source of truth

The skill content is a copy of `skills/verifying-change-coverage/` at the repository root. Do not edit the plugin copy directly - update the root skill and run `npm run plugin:materialize`.
