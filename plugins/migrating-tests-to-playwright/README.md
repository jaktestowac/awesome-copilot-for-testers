---
description: 'Migrates Cypress, Selenium, WebdriverIO, or Protractor suites to Playwright in staged slices, each with a parity gate before the old test is deleted. Use when porting a legacy browser suite, when deciding which tests are not worth porting, when a half-finished migration has stalled with two suites running in parallel, or when a suite migration needs a plan before anyone starts translating files.'
---

# Migrating Tests To Playwright Plugin

Migrates Cypress, Selenium, WebdriverIO, or Protractor suites to Playwright in staged slices, each with a parity gate before the old test is deleted. Use when porting a legacy browser suite, when deciding which tests are not worth porting, when a half-finished migration has stalled with two suites running in parallel, or when a suite migration needs a plan before anyone starts translating files.

## What's inside

- `skills/migrating-tests-to-playwright/` — the agent skill, generated from the repository's `skills/migrating-tests-to-playwright/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install migrating-tests-to-playwright
```

## Note on source of truth

The skill content is a copy of `skills/migrating-tests-to-playwright/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
