---
description: 'Writes and reviews focused, deterministic unit tests that verify behavior through public interfaces instead of implementation details. Bundles the full workflow — test-level choice, case design, determinism control, test doubles, legacy characterization, and a review checklist — together with a compact quick version for routine everyday testing. Framework-agnostic: no runner, assertion library, or mocking tool is assumed.'
---

# Writing Unit Tests Plugin

Writes and reviews focused, deterministic unit tests that verify behavior through public interfaces instead of implementation details. Bundles the full workflow — test-level choice, case design, determinism control, test doubles, legacy characterization, and a review checklist — together with a compact quick version for routine everyday testing. Framework-agnostic: no runner, assertion library, or mocking tool is assumed.

## What's inside

Two paired skills — pick by how much the job needs:

- `skills/writing-unit-tests/` — the full standard: test-level choice, case design lenses, determinism control, test doubles, legacy characterization, plus worked examples and a review checklist in `resources/`
- `skills/writing-unit-tests-quick/` — the compact version: ten rules, a case list, and two final checks, for routine everyday testing

Both are generated from the repository's `skills/` directory, which is the source of truth.

Related: the `test-driven-development` plugin covers the case where tests should come **before** the code.

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install writing-unit-tests
```

## Note on source of truth

The skill content is a copy of `skills/writing-unit-tests/` and `skills/writing-unit-tests-quick/` at the repository
root. Do not edit the plugin copy directly — update the root skill and run `npm run plugin:materialize`.
