---
description: 'Plugin that analyzes a codebase for technical debt, identifies areas for improvement, and generates actionable, prioritized insights to enhance code quality and maintainability.'
---

# Tech Debt Analysis Plugin

This plugin gives an AI agent the capability to analyze a codebase for technical debt, identify areas for improvement, and generate actionable insights to enhance code quality and maintainability.

## What's inside

- `skills/tech-debt-analysis/` — the agent skill with supporting resources (debt taxonomy, prioritization matrix, report templates), synced from the repository's `skills/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install tech-debt-analysis
```

## Usage

Once installed, ask the agent to analyze technical debt, for example:

- "Audit this repository for technical debt"
- "Analyze the test suite for test debt and flakiness risk"
- "Generate a prioritized tech debt report for this module"

## Note on source of truth

The skill content is a copy of `skills/tech-debt-analysis/` at the repository root. Do not edit the plugin copy directly — update the root skill and re-sync.
