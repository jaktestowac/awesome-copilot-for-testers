---
description: 'Creates, reviews, and modernizes static code analysis setups for Node.js and TypeScript repositories, covering ESLint flat config, typescript-eslint, tsconfig, Prettier, import sorting, Husky, lint-staged, package.json quality scripts, and CI quality gates. Use when setting up or auditing linting, formatting, type-checking, commit hooks, or GitHub Actions quality checks in a TypeScript project.'
---

# Static Code Analysis Typescript Plugin

Creates, reviews, and modernizes static code analysis setups for Node.js and TypeScript repositories, covering ESLint flat config, typescript-eslint, tsconfig, Prettier, import sorting, Husky, lint-staged, package.json quality scripts, and CI quality gates. Use when setting up or auditing linting, formatting, type-checking, commit hooks, or GitHub Actions quality checks in a TypeScript project.

## What's inside

- `skills/static-code-analysis-typescript/` — the agent skill, generated from the repository's `skills/static-code-analysis-typescript/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install static-code-analysis-typescript
```

## Note on source of truth

The skill content is a copy of `skills/static-code-analysis-typescript/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
