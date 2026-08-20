---
description: 'Defines, computes, and interprets test and quality metrics: pass rate, flake rate, suite duration, defect escape rate, time to detect, and coverage with its caveats. Use when building a QA dashboard, reporting suite health to stakeholders, comparing releases over time, or when a coverage percentage or a bug count is being treated as a measure of quality.'
---

# Analyzing Quality Metrics Plugin

Defines, computes, and interprets test and quality metrics: pass rate, flake rate, suite duration, defect escape rate, time to detect, and coverage with its caveats. Use when building a QA dashboard, reporting suite health to stakeholders, comparing releases over time, or when a coverage percentage or a bug count is being treated as a measure of quality.

## What's inside

- `skills/analyzing-quality-metrics/` — the agent skill, generated from the repository's `skills/analyzing-quality-metrics/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install analyzing-quality-metrics
```

## Note on source of truth

The skill content is a copy of `skills/analyzing-quality-metrics/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
