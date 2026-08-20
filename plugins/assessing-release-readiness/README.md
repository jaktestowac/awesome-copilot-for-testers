---
description: 'Produces an evidence-backed go/no-go recommendation: exit criteria status, open-defect risk profile, coverage against risk, environment parity, rollback readiness, and the residual risk stated plainly. Use when preparing a release sign-off, when someone asks whether a build is ready to ship, or when a decision to release is being made on impressions rather than evidence.'
---

# Assessing Release Readiness Plugin

Produces an evidence-backed go/no-go recommendation: exit criteria status, open-defect risk profile, coverage against risk, environment parity, rollback readiness, and the residual risk stated plainly. Use when preparing a release sign-off, when someone asks whether a build is ready to ship, or when a decision to release is being made on impressions rather than evidence.

## What's inside

- `skills/assessing-release-readiness/` — the agent skill, generated from the repository's `skills/assessing-release-readiness/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install assessing-release-readiness
```

## Note on source of truth

The skill content is a copy of `skills/assessing-release-readiness/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
