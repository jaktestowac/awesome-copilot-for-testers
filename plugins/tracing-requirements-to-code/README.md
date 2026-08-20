---
description: 'Builds and maintains bidirectional traceability between requirements and the tests that verify them: extracts a matrix from an existing codebase, annotates tests with requirement IDs, finds orphan tests and uncovered requirements, verifies that each link is real, and enforces linkage in CI. Use when a suite exists but nobody can say what it proves, when an auditor or stakeholder asks which tests cover a requirement, when a traceability matrix has gone stale, or when a requirement changes and its blast radius must be found.'
---

# Tracing Requirements To Code Plugin

Builds and maintains bidirectional traceability between requirements and the tests that verify them: extracts a matrix from an existing codebase, annotates tests with requirement IDs, finds orphan tests and uncovered requirements, verifies that each link is real, and enforces linkage in CI. Use when a suite exists but nobody can say what it proves, when an auditor or stakeholder asks which tests cover a requirement, when a traceability matrix has gone stale, or when a requirement changes and its blast radius must be found.

## What's inside

- `skills/tracing-requirements-to-code/` — the agent skill, generated from the repository's `skills/tracing-requirements-to-code/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install tracing-requirements-to-code
```

## Note on source of truth

The skill content is a copy of `skills/tracing-requirements-to-code/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
