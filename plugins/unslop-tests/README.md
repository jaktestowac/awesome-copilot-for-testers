---
description: 'Audits existing test code for the tells that make a suite look like coverage while proving nothing: tautological assertions, mock-only tests, hardcoded waits, coverage theater, swallowed errors, and retries used as fixes. Findings are ranked into three tiers, and every top-tier finding has to be proven by breaking the behavior and showing the test stayed green. Bundles the named-tell list, before/after pairs, per-runner mutation-check commands for Vitest, Jest, Playwright, and Mocha, and a report template. Framework-agnostic body, with framework-specific spellings in resources.'
---

# Unslop Tests Plugin

A generated test suite reads well, runs green, and often proves nothing. That combination is the problem: it looks like coverage, gets reviewed like coverage, and fails to notice the bug it was written for. This plugin names the tells so they can be caught by sight, then proves the important ones by running code.

## What's inside

- `skills/unslop-tests/` — the audit: 40 named tells across assertions, structure, determinism, test doubles, naming, data, suppression, and browser tests. Each one is tagged with a severity tier, and every Tier 1 finding has to reach rung 4 of the evidence ladder: break the behavior, run the test, show it stayed green.

Bundled resources:

- `resources/test-slop-before-after.md` — a before/after pair for every Tier 1 pattern, each ending with the exact one-line production edit the bad version fails to notice
- `resources/mutation-check.md` — which breaks expose a weak assertion and which prove nothing, single-test commands per runner, the isolation matrix mapping "fails only in random order" to a cause
- `resources/framework-spellings.md` — how each tell is written in Vitest, Jest, Playwright, and Mocha, with ripgrep commands for the greppable ones and a config-level section for `retries: 2` and friends
- `resources/audit-report-template.md` — the report shape, Tier 1 first, including a "Coverage removed" section so deleting a slop test cannot happen silently

Generated from the repository's `skills/` directory, which is the source of truth.

Related: the `writing-unit-tests` plugin covers authoring the tests in the first place. Use it to write them, use this one to judge them afterwards. The `code-review-advanced` plugin treats this as its test lens.

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install unslop-tests
```

## Note on source of truth

The skill content is a copy of `skills/unslop-tests/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
