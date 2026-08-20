---
description: 'Writes the documentation a test suite needs to be usable by someone who did not build it: run instructions, environment setup, tag glossary, ownership, fixture and data notes, and architecture decision records. Use when onboarding someone into a suite, when "how do I run these" keeps being asked, when a test architecture decision needs recording, or when a suite is inherited with no documentation.'
---

# Documenting Test Suites Plugin

Writes the documentation a test suite needs to be usable by someone who did not build it: run instructions, environment setup, tag glossary, ownership, fixture and data notes, and architecture decision records. Use when onboarding someone into a suite, when "how do I run these" keeps being asked, when a test architecture decision needs recording, or when a suite is inherited with no documentation.

## What's inside

- `skills/documenting-test-suites/` — the agent skill, generated from the repository's `skills/documenting-test-suites/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install documenting-test-suites
```

## Note on source of truth

The skill content is a copy of `skills/documenting-test-suites/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
