---
description: 'Drives implementation test-first through red-green-refactor cycles: one failing test, the minimal code to pass it, then cleanup under green. Bundles the full workflow — loop shape, green-step strategies, bug reproduction, legacy entry, a worked example, and a cycle log — together with a compact quick version for routine single-behavior cycles. Framework-agnostic: no runner, assertion library, or mocking tool is assumed.'
---

# Test Driven Development Plugin

Drives implementation test-first through red-green-refactor cycles: one failing test, the minimal code to pass it, then cleanup under green. Bundles the full workflow — loop shape, green-step strategies, bug reproduction, legacy entry, a worked example, and a cycle log — together with a compact quick version for routine single-behavior cycles. Framework-agnostic: no runner, assertion library, or mocking tool is assumed.

## What's inside

Two paired skills — pick by how much the job needs:

- `skills/test-driven-development/` — the full loop: loop shape, green-step strategies, the stuck protocol, bug reproduction, legacy entry, plus a cycle-by-cycle worked example and a session log in `resources/`
- `skills/test-driven-development-quick/` — the compact version: the loop, seven rules, and reproduce-first for bugs, for routine single-behavior cycles

Both are generated from the repository's `skills/` directory, which is the source of truth.

Related: the `writing-unit-tests` plugin holds the quality standard each test the loop produces must meet.

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install test-driven-development
```

## Note on source of truth

The skill content is a copy of `skills/test-driven-development/` and `skills/test-driven-development-quick/` at the
repository root. Do not edit the plugin copy directly — update the root skill and run `npm run plugin:materialize`.
