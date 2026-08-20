---
description: 'Sets up and maintains visual regression testing: what to snapshot, baseline strategy, masking dynamic regions, threshold tuning, containerized baselines, and the review-and-update workflow. Use when styling regressions escape to production, when snapshots fail on every machine or every run, when baselines are being updated without being looked at, or when deciding whether visual testing is the right tool at all.'
---

# Running Visual Regression Tests Plugin

Sets up and maintains visual regression testing: what to snapshot, baseline strategy, masking dynamic regions, threshold tuning, containerized baselines, and the review-and-update workflow. Use when styling regressions escape to production, when snapshots fail on every machine or every run, when baselines are being updated without being looked at, or when deciding whether visual testing is the right tool at all.

## What's inside

- `skills/running-visual-regression-tests/` — the agent skill, generated from the repository's `skills/running-visual-regression-tests/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install running-visual-regression-tests
```

## Note on source of truth

The skill content is a copy of `skills/running-visual-regression-tests/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
