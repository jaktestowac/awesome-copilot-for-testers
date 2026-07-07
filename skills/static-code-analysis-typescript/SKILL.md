---
name: static-code-analysis-typescript
description: 'Creates, reviews, and modernizes static code analysis setups for Node.js and TypeScript repositories, covering ESLint flat config, typescript-eslint, tsconfig, Prettier, import sorting, Husky, lint-staged, package.json quality scripts, and CI quality gates. Use when setting up or auditing linting, formatting, type-checking, commit hooks, or GitHub Actions quality checks in a TypeScript project.'
argument-hint: 'Repository type, current tooling, and target quality gate'
user-invocable: true
---

# Static Code Analysis for TypeScript Projects

Use this skill when you need to create, review, fix, or modernize static code analysis in a Node.js + TypeScript repository.

It is designed for repositories that use or should use:

- `eslint` (flat config)
- `typescript-eslint`
- `typescript`
- `tsconfig.json`
- `prettier`
- `eslint-plugin-simple-import-sort` (import sorting via ESLint)
- `husky`
- `lint-staged`
- `package.json` scripts
- CI quality gates (GitHub Actions)

## When to Use

Use this skill when the user asks things like:

- "set up static analysis for TypeScript"
- "add ESLint / typescript-eslint / Prettier"
- "review our lint, tsc, husky, or lint-staged setup"
- "fix package.json scripts for code quality"
- "prepare CI checks for linting and type checking"
- "standardize naming for static code analysis scripts"
- "audit whether this repo follows current best practices"
- "set up import sorting"
- "replace trivago import sorting plugin"
- "add a CI quality gate workflow"

## Goals

This skill should help produce a setup that is:

- explicit
- reproducible
- CI-friendly
- fast enough for local development
- strict enough to catch issues early
- easy to understand from `package.json`, `README.md`, and the config files
- portable across Playwright, Cypress, and general TypeScript projects

## Recommended Outcome

A strong baseline should usually include:

- ESLint flat config (`eslint.config.mjs`)
- `typescript-eslint` for TypeScript-aware linting
- direct `typescript` dependency when `tsc` is used directly
- strict `tsconfig.json`
- clear split between formatting and linting responsibilities
- import sorting via ESLint (`eslint-plugin-simple-import-sort`)
- `husky` hook for local guardrails
- `lint-staged` for staged-file workflows
- CI commands that do not mutate files
- explicit Node version support in `package.json#engines`
- a CI quality gate (integrated into an existing workflow when one exists)

Concrete baseline files (eslint.config.mjs, package.json scripts, tsconfig, Prettier, Husky, VS Code settings, CI workflows) live in `./resources/example-configs.md`.

## Procedure

### 1. Inspect the existing setup

Check at least these files when they exist:

- `package.json`
- `eslint.config.*` (or legacy `.eslintrc*`)
- `tsconfig.json`
- `.prettierrc*`
- `.prettierignore`
- `.husky/*`
- `.github/workflows/*`
- `.vscode/settings.json`
- `.vscode/extensions.json`
- `README.md`
- any existing audit or decision documents

Identify:

- what tools are already installed
- whether the repo uses flat config or legacy ESLint config
- whether `typescript` is direct or transitive
- whether `tsc` is used as a real gate
- whether `prettier` is standalone, inside ESLint, or split by file type
- whether commit hooks validate the whole repo or only staged files
- whether CI enforces the same checks as local hooks
- how import sorting is handled (Prettier plugin, ESLint plugin, VS Code, or not at all)
- whether VS Code `source.organizeImports` could conflict with other import sorting

### 2. Classify the current architecture

Choose the current model before editing anything:

- **Model A — Separate responsibilities**: ESLint for code quality; Prettier for formatting; `prettier --check` used directly; `eslint-config-prettier` avoids rule conflicts.
- **Model B — ESLint also enforces Prettier in TypeScript**: `eslint-plugin-prettier` runs formatting checks inside ESLint, often paired with a separate Prettier CLI check for non-TS files.
- **Model C — Mixed or inconsistent**: scripts overlap, responsibilities are unclear, TS formatting may be checked twice or not clearly at all.

When possible, make the final state explicit in docs so the split is understandable.

### 3. Normalize dependency expectations

For TypeScript repositories, prefer these principles:

- if the repo runs `tsc`, add `typescript` directly in `devDependencies`
- if ESLint is used, make the config style explicit and modern (flat config)
- if `typescript-eslint` is installed, ensure versions are compatible with ESLint and TypeScript
- if tooling requires newer Node versions, declare them in `package.json#engines`

Typical direct dev dependencies: `eslint`, `@eslint/js`, `typescript-eslint`, `typescript`, `prettier`, `eslint-config-prettier`, `eslint-plugin-simple-import-sort`, `globals`, `husky`, `lint-staged`, optionally `eslint-plugin-prettier` and repo-specific plugins such as `eslint-plugin-playwright`.

If the repository contains Playwright tests, strongly consider:

- `eslint-plugin-playwright`
- Playwright-specific rule tuning in ESLint
- ignoring generated Playwright artifacts such as `playwright-report/**` and `test-results/**`

### 4. Assess import sorting

Check how imports are currently sorted:

- **No sorting** → add `eslint-plugin-simple-import-sort`
- **`@trivago/prettier-plugin-sort-imports`** → migrate to `eslint-plugin-simple-import-sort` (Babel parser, no Prettier 4 support)
- **`@ianvs/prettier-plugin-sort-imports`** → consider migrating for cleaner separation
- **`eslint-plugin-simple-import-sort`** → already optimal
- **`eslint-plugin-perfectionist`** → acceptable if broader sorting rules are wanted
- **VS Code `source.organizeImports`** → remove if any other import sorting tool is active; it conflicts

Rationale, decision tree, and step-by-step migrations are in `./resources/import-sorting.md`.

After migration, run `npx eslint . --fix` to normalize all imports, then verify with `npx eslint . --max-warnings=0`.

### 5. Normalize script naming in `package.json`

Prefer predictable script names:

- `lint` → runs ESLint in non-fix mode and should fail on warnings if that is the chosen policy
- `format` → mutating formatter run, usually `prettier --write`
- `format:check` → non-mutating formatting validation
- `tsc:check` → `tsc --noEmit`
- `check` → aggregate quality command (local, may mutate)
- `check:ci` → aggregate quality command (CI, non-mutating)
- `lint-staged` → entrypoint for staged-file validation

Guidelines:

- commands used in CI should not mutate files
- provide both `check` (local, with `--write`) and `check:ci` (CI, with `--check`)
- if the repo intentionally splits non-TS and TS formatting, make that explicit with names such as `format:check` and `format:check:non-ts`

### 6. Decide how formatting should work

Make one of the following explicit:

- **Preferred modern baseline**: Prettier CLI validates formatting; ESLint handles code-quality rules; `eslint-config-prettier` disables formatting-conflicting lint rules.
- **Acceptable intentional split**: TypeScript files are checked via ESLint + `eslint-plugin-prettier`; non-TypeScript files are checked by `prettier --check`; docs clearly explain the split.

Avoid leaving the repo in a state where it is unclear whether `*.ts` files are checked by Prettier CLI, by ESLint, twice, or not consistently at all.

### 7. Validate TypeScript configuration

For `tsconfig.json`, prefer:

- `strict: true`
- `module: "ESNext"` when the project uses ESM `import`/`export` syntax (the default for modern TypeScript projects)
- `moduleResolution: "bundler"` — **required** when `module` is `"ESNext"` and TypeScript does not emit code; without it TS falls back to `"classic"` resolution which cannot resolve `node_modules`
- `noEmit: true` when TypeScript is used only for type checking
- explicit `baseUrl` / `paths` only when justified

**Common mistake:** `"module": "CommonJS"` with `"target": "ESNext"` — the project writes ESM but tells TypeScript to resolve modules as CJS. See the tsconfig notes in `./resources/example-configs.md` for the full rationale.

If the repo uses path aliases, confirm they are supported consistently by TypeScript, runtime/test tooling, and editor tooling.

### 8. Set up Husky and lint-staged correctly

Recommended pattern:

- `lint-staged` handles staged-file formatting and fixable lint checks (including import sorting)
- full-project `tsc:check` may still run in `pre-commit` or `pre-push`, depending on repo size and tolerance for slower hooks

Good staged-file mapping examples:

- `*.ts` → `prettier --write`, `eslint --fix` (auto-sorts imports and fixes lint issues)
- `*.{json,md,yml,yaml,mjs}` → `prettier --write`

Guidelines:

- use `lint-staged` for fast local feedback
- avoid running whole-repo ESLint in pre-commit if staged-only checks are enough
- if full `tsc:check` is too slow for pre-commit, move it to `pre-push` or CI
- review ignored outputs so formatters and linters do not waste time on generated artifacts

### 9. Define CI quality gates

A minimal CI quality job should:

1. Install dependencies reproducibly (`npm ci`)
2. `npm run format:check`
3. `npm run lint`
4. `npm run tsc:check`

**Pipeline discovery strategy (IMPORTANT): always prefer integrating quality checks into an existing CI workflow rather than creating a separate one.**

1. **Search for existing workflows** — look in `.github/workflows/` for any existing CI pipeline (e.g. `playwright-e2e-tests.yml`, `ci.yml`, `test.yml`, `build.yml`)
2. **If a main pipeline exists** — add a `quality` job to that workflow, with the test job depending on it via `needs: quality`
3. **Only if NO existing pipeline is found** — create a new standalone workflow (example in `./resources/example-configs.md`)

Why integrate rather than separate: a single workflow gives one status check in PRs, shared triggers and concurrency reduce drift, and `needs` ensures tests don't waste CI minutes on code that fails basic quality checks.

CI principles:

- use non-mutating commands only
- do not rely solely on local hooks — CI is the authoritative gate
- keep CI aligned with local script names
- use `permissions: contents: read` for least-privilege
- cache `npm` dependencies for speed
- match the CI Node version to `engines.node` from `package.json`

### 10. Update documentation

Always reflect the final design in docs. At minimum, update `README.md` (plus audit/report docs and `.vscode/settings.json` recommendations when relevant).

Document clearly: required Node version, what each quality script does, whether TS formatting is checked by ESLint or Prettier CLI, how import sorting works, what Husky runs on commit, what CI runs, and what files are ignored by Prettier/ESLint and why.

### 11. Verify and report

After editing, verify:

- `npm run lint` — passes with zero warnings
- `npm run format:check` — passes
- `npm run tsc:check` — passes
- `npm run lint-staged` — exits cleanly (may report nothing staged)

The final report should distinguish between configuration problems, dependency problems, and code-quality violations in the current codebase.

If verification hits unexpected behavior, consult `./resources/troubleshooting.md`.

## Decision Rules

**Prefer adding `typescript` directly when:** `tsc` is invoked from `package.json`; the repo depends on TypeScript version stability; the current install works only because of a transitive dependency.

**Prefer adding `engines.node` when:** key tools require a newer Node version; the README requirement is vague or outdated; the project is team-shared or CI-managed.

**Prefer `lint-staged` when:** the repo uses Husky; pre-commit currently runs whole-repo checks that are unnecessarily slow; the user wants local guardrails without painful commit latency.

**Prefer `eslint-plugin-simple-import-sort` when:** setting up a new repo; migrating away from `@trivago/prettier-plugin-sort-imports`; the team wants clean separation of concerns; VS Code `source.organizeImports` is causing conflicts.

**Allow `@ianvs/prettier-plugin-sort-imports` when:** the repo already uses it and it works well; the team prefers regex-based import grouping; complex import order requirements benefit from explicit regex patterns.

**Avoid `@trivago/prettier-plugin-sort-imports` in new projects because:** it uses a Babel-based parser (slower, less TypeScript-aware); it has no Prettier 4 support; it conflicts with VS Code's `source.organizeImports`; `@ianvs/prettier-plugin-sort-imports` is a strictly better fork.

**Prefer separate Prettier CLI over eslint-plugin-prettier when:** setting up a new repo; performance and simplicity matter; the team wants the current mainstream recommendation from Prettier docs.

**Allow `eslint-plugin-prettier` when:** the repo already uses it intentionally; it is part of a documented TS/non-TS split; changing the model would create unnecessary churn right now.

**Prefer a CI workflow when:** the repo is team-shared; quality enforcement should not depend on individual developer hooks; the project uses pull requests; even for solo projects, CI catches hook-bypass scenarios (`--no-verify`).

## Quick Setup from Scratch

For setting up a new Playwright + TypeScript project with full static analysis:

```bash
# 1. Initialize and install core dependencies
npm init -y
npm install -D @playwright/test typescript

# 2. Install static analysis tools (latest stable versions)
npm install -D eslint @eslint/js typescript-eslint globals
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
npm install -D eslint-plugin-simple-import-sort
npm install -D eslint-plugin-playwright
npm install -D husky lint-staged

# 3. Initialize Husky
npx husky init

# 4. Create config files using ./resources/example-configs.md:
#    eslint.config.mjs, .prettierrc.json, .prettierignore, tsconfig.json,
#    .husky/pre-commit, .vscode/settings.json, .vscode/extensions.json

# 5. Add quality scripts to package.json (see ./resources/example-configs.md)

# 6. CI quality gate:
#    - If .github/workflows/ already has a CI pipeline → add a quality job there
#    - If no pipeline exists → create a standalone quality workflow

# 7. Verify
npm run lint
npm run format:check
npm run tsc:check
```

## Completion Checklist

A task using this skill is complete when:

- [ ] Dependency declarations are explicit (no transitive reliance)
- [ ] Script names are clear and consistent
- [ ] `check:ci` exists as a non-mutating aggregate command
- [ ] Formatting responsibility is understandable and documented
- [ ] Import sorting is handled by ESLint, not Prettier plugins
- [ ] `typescript` and Node requirements are documented in `engines`
- [ ] Husky and `lint-staged` are aligned
- [ ] A CI quality job exists (integrated into an existing workflow, or standalone only when none exists)
- [ ] `.vscode/settings.json` does not have `source.organizeImports` conflicting with ESLint import sorting
- [ ] Docs (`README.md`) match the actual setup
- [ ] Verification results are recorded (`lint`, `format:check`, `tsc:check` all pass)

## Resource Map

- `./resources/example-configs.md` - baseline eslint.config.mjs, package.json scripts, tsconfig, Prettier, Husky, VS Code, and CI workflow examples
- `./resources/import-sorting.md` - import sorting rationale, decision tree, and migration guides
- `./resources/troubleshooting.md` - symptoms, causes, and fixes for common setup problems

## Related Skills

- `code-review-advanced` - when the static-analysis audit should be paired with a code-level review
- `tech-debt-analysis` - when lint/type findings should feed a broader debt assessment
- `creating-instructions` - when the resulting conventions should become instruction files

## Definition of Done

This skill is complete when:

- the current architecture is classified (Model A/B/C) before any edits
- dependencies, scripts, tsconfig, hooks, and CI follow the decision rules above
- import sorting is ESLint-based or an intentional documented exception
- all verification commands pass and results are reported
- documentation matches the final setup

## Example prompts

- `/static-code-analysis-typescript review this repo and standardize eslint, typescript, husky, lint-staged, and CI scripts`
- `/static-code-analysis-typescript create a modern static analysis setup for a Node + TypeScript test repository`
- `/static-code-analysis-typescript explain whether TS formatting should be handled by eslint-plugin-prettier or prettier --check in this project`
- `/static-code-analysis-typescript migrate from @trivago/prettier-plugin-sort-imports to eslint-plugin-simple-import-sort`
- `/static-code-analysis-typescript add a CI quality gate workflow for GitHub Actions`
- `/static-code-analysis-typescript set up import sorting for a Playwright project`
