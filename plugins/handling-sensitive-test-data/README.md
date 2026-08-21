---
description: 'Keeps test data legally and operationally safe: classifies personal data, replaces production copies with synthetic or anonymized fixtures, manages secrets in local runs and CI, strips personal data from traces and HAR files, and sets retention rules. Use when tests run against a production data copy, when fixtures contain real names or emails, when a data protection review is coming, or when test artifacts might carry personal data into CI logs.'
---

# Handling Sensitive Test Data Plugin

Keeps test data legally and operationally safe: classifies personal data, replaces production copies with synthetic or anonymized fixtures, manages secrets in local runs and CI, strips personal data from traces and HAR files, and sets retention rules. Use when tests run against a production data copy, when fixtures contain real names or emails, when a data protection review is coming, or when test artifacts might carry personal data into CI logs.

## What's inside

- `skills/handling-sensitive-test-data/` - the agent skill, generated from the repository's `skills/handling-sensitive-test-data/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install handling-sensitive-test-data
```

## Note on source of truth

The skill content is a copy of `skills/handling-sensitive-test-data/` at the repository root. Do not edit the plugin copy
directly - update the root skill and run `npm run plugin:materialize`.
