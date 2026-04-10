---
name: static-code-analysis-typescript
description: 'Use for create, review, or modernize static code analysis for node.js and typescript repositories. Use when you or the user needs to set up or audit eslint flat config, typescript-eslint, tsconfig, prettier, import sorting, husky, lint-staged, package.json quality scripts, and github actions quality gates.'
argument-hint: 'Repository type, current tooling, and target quality gate'
user-invocable: true
disable-model-invocation: false
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
- GitHub Actions workflow for quality gate

---

## Example Configs

Use these as practical baseline snippets for repositories similar to this one.

### Example `eslint.config.mjs`

This example shows:

- ESLint flat config
- `typescript-eslint`
- Playwright lint rules
- Prettier integration inside ESLint for TypeScript
- Import sorting via `eslint-plugin-simple-import-sort`
- Ignored generated folders

```js
import pluginJs from '@eslint/js';
import eslintPluginPlaywright from 'eslint-plugin-playwright';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['package-lock.json', 'playwright-report/**', 'test-results/**'] },
  { files: ['**/*.ts'] },
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'no-console': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
  },
  eslintPluginPlaywright.configs['flat/recommended'],
  {
    rules: {
      'playwright/no-nested-step': 'off',
    },
    settings: {
      playwright: {
        globalAliases: {
          test: ['setup', 'health'],
        },
      },
    },
  },
  eslintPluginPrettierRecommended,
];
```

**Key design decisions:**

- `simple-import-sort/imports` and `simple-import-sort/exports` enforce consistent import order as an ESLint rule, not a Prettier plugin
- `eslintPluginPrettierRecommended` must be last — it disables formatting rules that conflict with Prettier and adds the Prettier rule
- The `files: ['**/*.ts']` block scopes TypeScript rules to `.ts` files only
- Playwright `globalAliases` tells the Playwright plugin that `setup` and `health` are valid test functions

**Adapting for non-Playwright repos:**

Remove the Playwright-specific blocks:

```js
// Remove these two blocks:
eslintPluginPlaywright.configs['flat/recommended'],
{
 rules: { 'playwright/no-nested-step': 'off' },
 settings: { playwright: { ... } },
},
```

And remove `eslint-plugin-playwright` from `devDependencies`.

### Example `package.json` quality section

This example mirrors the recommended architecture:

- Full-project lint and format
- Non-mutating CI checks
- Staged-file formatting/linting
- Explicit Node engine
- Direct `typescript` dependency

```json
{
  "scripts": {
    "check": "npm run format && npm run lint && npm run tsc:check",
    "check:ci": "npm run format:check && npm run lint && npm run tsc:check",
    "format": "npx prettier --write .",
    "format:check": "npm run format:check:non-ts",
    "format:check:non-ts": "npx prettier . --check \"!**.ts\"",
    "lint": "npx eslint . --max-warnings=0",
    "lint-staged": "npx lint-staged",
    "tsc:check": "npx tsc --noEmit --pretty --strict"
  },
  "engines": {
    "node": "^20.19.0 || ^22.13.0 || >=24"
  },
  "lint-staged": {
    "*.ts": ["npx prettier --write", "npx eslint --fix --max-warnings=0"],
    "*.{json,md,mjs,yml,yaml}": "npx prettier --write"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "eslint": "^10.0.3",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-playwright": "^2.10.1",
    "eslint-plugin-prettier": "^5.5.5",
    "eslint-plugin-simple-import-sort": "^12.1.1",
    "globals": "^17.4.0",
    "husky": "^9.1.7",
    "lint-staged": "^16.4.0",
    "prettier": "3.8.1",
    "typescript": "^5.9.3",
    "typescript-eslint": "^8.57.1"
  }
}
```

**Script naming conventions:**

| Script         | Purpose                                 | Mutates files?  | Use in CI? |
| -------------- | --------------------------------------- | --------------- | ---------- |
| `check`        | Local aggregate: format + lint + tsc    | Yes (`--write`) | No         |
| `check:ci`     | CI aggregate: format:check + lint + tsc | No              | Yes        |
| `format`       | Apply Prettier formatting               | Yes             | No         |
| `format:check` | Validate formatting                     | No              | Yes        |
| `lint`         | Run ESLint (includes import sort)       | No              | Yes        |
| `lint-staged`  | Staged-file checks                      | Yes (fix mode)  | No         |
| `tsc:check`    | TypeScript type checking                | No              | Yes        |

### Example Husky hook (`.husky/pre-commit`)

```sh
npm run lint-staged
npm run tsc:check
```

### Example `.prettierignore`

Use ignore patterns for generated and heavy output folders.

```txt
package-lock.json
playwright-report
test-results
tmp
```

### Example `.prettierrc.json`

```json
{
  "singleQuote": true,
  "endOfLine": "auto",
  "tabWidth": 2,
  "semi": true
}
```

**Important:** Import sorting is NOT configured in Prettier.
Use `eslint-plugin-simple-import-sort` in ESLint instead.
See the [Import Sorting](#import-sorting) section below for rationale.

### Example `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "sourceMap": true,
    "noEmit": true,
    "baseUrl": "."
  }
}
```

**Key design decisions:**

- `module: "ESNext"` — aligns with ESM syntax used throughout TypeScript source files (`import`/`export`). Avoids the inconsistency of targeting modern JS with `target: "ESNext"` while using a legacy module system.
- `moduleResolution: "bundler"` — required when `module` is `"ESNext"`. Without it, TypeScript falls back to `"classic"` resolution which does not understand `node_modules`. The `"bundler"` strategy is the correct choice when TypeScript does not emit code (e.g. `noEmit: true`) and files are processed by a bundler or test runner (Playwright uses ESBuild internally).
- `noEmit: true` — TypeScript is used only for type checking, not code generation.
- Path aliases (`paths`) are optional — only add them when justified by project structure. If used, ensure they are also supported by the test runner.

**Why not `"module": "CommonJS"`?**

Using `"module": "CommonJS"` with `"target": "ESNext"` is a legacy pattern. It causes TS to default to `moduleResolution: "node"` (Node.js CJS algorithm), which works but is semantically incorrect for projects that:

- Use ESM `import`/`export` syntax exclusively
- Never emit code (so the module format is irrelevant for output)
- Are processed by modern tooling (ESBuild, Vite, Playwright)

If migrating from `CommonJS` to `ESNext`, the only required change is adding `"moduleResolution": "bundler"` alongside the module change.

````


### Example VS Code settings (`.vscode/settings.json`)


```json
{
 "editor.formatOnSave": true,
 "editor.defaultFormatter": "esbenp.prettier-vscode",
 "typescript.preferences.importModuleSpecifier": "non-relative",
 "[typescript]": {
   "editor.defaultFormatter": "esbenp.prettier-vscode"
 }
}
````

**Important:** Do NOT add `"source.organizeImports": "explicit"` to `codeActionsOnSave`.
VS Code's built-in organize imports conflicts with ESLint-based import sorting (`eslint-plugin-simple-import-sort`), causing competing re-orderings on save. Let ESLint handle import order via `lint-staged` on commit and the VS Code ESLint extension in real time.

### Example VS Code extensions (`.vscode/extensions.json`)

Recommended extensions for this style of repo:

```json
{
  "recommendations": [
    "ms-playwright.playwright",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

### Example CI workflow — integrated into existing pipeline (PREFERRED)

When the repository already has a CI workflow (e.g. for Playwright tests), add a `quality` job to that workflow and make the test job depend on it:

```yaml
jobs:
  quality:
    name: Lint, Format & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Check formatting (non-TS)
        run: npm run format:check

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run tsc:check

  test:
    needs: quality
    # ... existing test job configuration ...
```

**Key integration points:**

- The `quality` job is added as a **separate job** within the same workflow
- The existing test job gets `needs: quality` — tests only run after quality checks pass
- Shared workflow triggers (`on:`) and `concurrency` settings apply to both jobs
- No need for duplicate `permissions`, `on`, or `concurrency` blocks

### Example CI workflow — standalone (FALLBACK)

Use this only when the repository has **no existing CI workflow** to integrate into:

```yaml
name: Quality Gate

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read

jobs:
  quality:
    name: Lint, Format & Type Check
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [22]
    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Check formatting (non-TS)
        run: npm run format:check

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run tsc:check
```

**CI design principles:**

- Every command is non-mutating — no `--write` or `--fix`
- `npm ci` ensures reproducible installs
- Steps are separate for clear failure diagnosis
- Node version matches `engines.node` from `package.json`
- `permissions: contents: read` follows least-privilege principle
- **Prefer integrating into an existing pipeline** — only use a standalone workflow as a fallback

---

## Import Sorting

### Recommended approach: `eslint-plugin-simple-import-sort`

Import sorting belongs in ESLint, not in Prettier. The recommended plugin is `eslint-plugin-simple-import-sort`.

**Why ESLint-based import sorting is preferred:**

1. **Clean separation of concerns** — Prettier handles formatting (whitespace, quotes, semicolons); ESLint handles code quality and structure (including import order)
2. **Auto-fixable** — `eslint --fix` sorts imports, which integrates naturally with `lint-staged`
3. **No Prettier plugin complexity** — Prettier plugins for import sorting add a parser layer (often Babel-based) that can be slow, fragile, or incompatible with newer Prettier versions
4. **No VS Code conflicts** — Prettier import sorting plugins fight with VS Code's `source.organizeImports`; ESLint-based sorting does not
5. **Future-proof** — No coupling to Prettier's plugin API changes; ESLint plugin API is stable
6. **Lightweight** — `eslint-plugin-simple-import-sort` has zero dependencies and works with ESLint >=5

**Setup:**

1. Install: `npm install -D eslint-plugin-simple-import-sort`
2. Add to `eslint.config.mjs`:

```js
import simpleImportSort from 'eslint-plugin-simple-import-sort';


// Inside the config array:
{
 plugins: {
   'simple-import-sort': simpleImportSort,
 },
 rules: {
   'simple-import-sort/imports': 'error',
   'simple-import-sort/exports': 'error',
 },
},
```

3. Remove any Prettier import sorting plugins and their config options from `.prettierrc.json`
4. Remove `source.organizeImports` from `.vscode/settings.json` if present

**Default behavior:** Groups imports into: external packages → scoped packages → path aliases → relative imports. This works well out of the box for most TypeScript projects.

### Decision tree: choosing an import sorting strategy

```
Do you need import sorting?
├── No → Skip (but consider adding it for consistency)
└── Yes
   ├── Is the project new or being set up fresh?
   │   └── Use eslint-plugin-simple-import-sort (recommended)
   ├── Does the project already use @trivago/prettier-plugin-sort-imports?
   │   ├── Is there a strong reason to keep it?
   │   │   └── Keep it, but document that it uses Babel parser
   │   │       and has no Prettier 4 support
   │   └── Otherwise → migrate to eslint-plugin-simple-import-sort
   ├── Does the project already use @ianvs/prettier-plugin-sort-imports?
   │   └── Acceptable — it uses TS parser and supports Prettier 4
   │       Consider migrating to ESLint-based sorting for cleaner separation
   └── Does the project use eslint-plugin-perfectionist?
       └── Acceptable for teams wanting broader sorting (objects, types, enums)
           But overkill if only import sorting is needed
```

### Migrating from `@trivago/prettier-plugin-sort-imports`

1. Uninstall: `npm uninstall @trivago/prettier-plugin-sort-imports`
2. Install: `npm install -D eslint-plugin-simple-import-sort`
3. Remove from `.prettierrc.json`:

- `"plugins": ["@trivago/prettier-plugin-sort-imports"]`
- `"importOrder"` / `"importOrderSeparation"` / `"importOrderSortSpecifiers"` / any `importOrder*` options

4. Add ESLint rules (see setup above)
5. Remove `"source.organizeImports"` from `.vscode/settings.json`
6. Run `npx eslint . --fix` to re-sort all imports
7. Verify with `npx eslint . --max-warnings=0`

### Migrating from `@ianvs/prettier-plugin-sort-imports`

Same steps as trivago migration. Remove `"plugins"` and any `importOrder*` options from `.prettierrc.json`.

---

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

#### Model A — Separate responsibilities

- ESLint for code quality
- Prettier for formatting
- `prettier --check` used directly
- `eslint-config-prettier` used to avoid rule conflicts

#### Model B — ESLint also enforces Prettier in TypeScript

- `eslint-plugin-prettier` runs formatting checks inside ESLint
- often paired with a separate Prettier CLI check for non-TS files

#### Model C — Mixed or inconsistent

- scripts overlap
- responsibilities are unclear
- TS formatting may be checked twice or not clearly at all

When possible, make the final state explicit in docs so the split is understandable.

### 3. Normalize dependency expectations

For TypeScript repositories, prefer these principles:

- if the repo runs `tsc`, add `typescript` directly in `devDependencies`
- if ESLint is used, make the config style explicit and modern (flat config)
- if `typescript-eslint` is installed, ensure versions are compatible with ESLint and TypeScript
- if tooling requires newer Node versions, declare them in `package.json#engines`

Typical direct dev dependencies may include:

- `eslint`
- `@eslint/js`
- `typescript-eslint`
- `typescript`
- `prettier`
- `eslint-config-prettier`
- `eslint-plugin-simple-import-sort`
- optionally `eslint-plugin-prettier`
- optionally repo-specific plugins such as `eslint-plugin-playwright`
- `globals`
- `husky`
- `lint-staged`

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

After migration, run `npx eslint . --fix` to normalize all imports, then verify with `npx eslint . --max-warnings=0`.

### 5. Normalize script naming in `package.json`

Prefer predictable script names.

Recommended naming:

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
- if the repo intentionally splits non-TS and TS formatting, make that explicit with names such as:
- `format:check`
- `format:check:non-ts`

### 6. Decide how formatting should work

Make one of the following explicit:

#### Preferred modern baseline

- Prettier CLI validates formatting
- ESLint handles code-quality rules
- `eslint-config-prettier` disables formatting-conflicting lint rules

#### Acceptable intentional split

- TypeScript files are checked via ESLint + `eslint-plugin-prettier`
- non-TypeScript files are checked by `prettier --check`
- docs clearly explain the split

Avoid leaving the repo in a state where it is unclear whether `*.ts` files are:

- checked by Prettier CLI
- checked by ESLint
- checked twice
- or not checked consistently

### 7. Validate TypeScript configuration

For `tsconfig.json`, prefer:

- `strict: true`
- `module: "ESNext"` when the project uses ESM `import`/`export` syntax (which is the default for modern TypeScript projects)
- `moduleResolution: "bundler"` — **required** when `module` is `"ESNext"` and TypeScript does not emit code. Without this, TS falls back to `"classic"` resolution which cannot resolve `node_modules`
- `noEmit: true` when TypeScript is used only for type checking
- explicit `baseUrl` / `paths` only when justified
- alignment between runtime/module system and test/tooling needs

**Common mistake:** Using `"module": "CommonJS"` with `"target": "ESNext"`. This is semantically inconsistent — the project writes ESM but tells TypeScript to resolve modules as CJS. While it works (because `noEmit` means no output), it limits TypeScript's understanding of ESM-specific features and defaults to the older `"node"` resolution algorithm.

If the repo uses path aliases, confirm they are supported consistently by:

- TypeScript
- runtime/test tooling
- editor tooling

### 8. Set up Husky and lint-staged correctly

Recommended pattern:

- `lint-staged` handles staged-file formatting and fixable lint checks (including import sorting)
- full-project `tsc:check` may still run in `pre-commit` or `pre-push`, depending on repo size and tolerance for slower hooks

Good staged-file mapping examples:

- `*.ts` → `prettier --write`, `eslint --fix` (this auto-sorts imports and fixes lint issues)
- `*.{json,md,yml,yaml,mjs}` → `prettier --write`

Also review ignored outputs so formatters and linters do not waste time on generated artifacts.

Guidelines:

- use `lint-staged` for fast local feedback
- avoid running whole-repo ESLint in pre-commit if staged-only checks are enough
- if full `tsc:check` is too slow for pre-commit, move it to `pre-push` or CI

### 9. Define CI quality gates

A minimal CI quality job should:

1. Install dependencies reproducibly (`npm ci`)
2. `npm run format:check`
3. `npm run lint`
4. `npm run tsc:check`

#### Pipeline discovery strategy (IMPORTANT)

**Always prefer integrating quality checks into an existing CI workflow rather than creating a separate one.**

Follow this procedure:

1. **Search for existing workflows** — look in `.github/workflows/` for any existing CI pipeline (e.g. `playwright-e2e-tests.yml`, `ci.yml`, `test.yml`, `build.yml`, etc.)
2. **If a main pipeline exists** — add a `quality` job to that workflow. This keeps all CI checks in one place, avoids duplicated triggers, and makes the pipeline status easier to track in pull requests. The quality job should run **before** the test job using `needs: quality` dependency, so tests only run after code quality checks pass.
3. **Only if NO existing pipeline is found** — create a new workflow at `.github/workflows/quality.yml` using the example in this skill.

**Why integrate rather than separate?**

- A single workflow provides one status check in PRs instead of multiple
- Shared triggers and concurrency settings reduce configuration drift
- The `needs` dependency ensures tests don't waste CI minutes on code that fails basic quality checks
- Teams have a single place to understand the full CI pipeline

CI principles:

- use non-mutating commands only
- do not rely solely on local hooks — CI is the authoritative gate
- keep CI aligned with local script names
- fail loudly on configuration drift
- use `permissions: contents: read` for least-privilege
- cache `npm` dependencies for speed
- matrix test against the Node version declared in `engines.node`

### 10. Update documentation

Always reflect the final design in docs.

At minimum, update:

- `README.md`
- audit/report docs if they exist
- optionally decision logs
- `.vscode/settings.json` recommendations when editor behavior is part of the workflow

Document clearly:

- required Node version
- what each quality script does
- whether TS formatting is checked by ESLint or Prettier CLI
- how import sorting works (ESLint-based, not Prettier plugin)
- what Husky runs on commit
- what CI runs
- what files are ignored by Prettier / ESLint and why

### 11. Verify and report

After editing, verify:

- `npm run lint` — passes with zero warnings
- `npm run format:check` — passes
- `npm run tsc:check` — passes
- `npm run lint-staged` — exits cleanly (may report nothing staged)

The final report should distinguish between:

- configuration problems
- dependency problems
- code-quality violations in the current codebase

---

## Decision Rules

### Prefer adding `typescript` directly when:

- `tsc` is invoked from `package.json`
- the repo depends on TypeScript version stability
- the current install works only because of a transitive dependency

### Prefer adding `engines.node` when:

- one or more key tools require a newer Node version
- the README requirement is vague or outdated
- the project is team-shared or CI-managed

### Prefer `lint-staged` when:

- the repo uses Husky
- pre-commit currently runs whole-repo checks that are unnecessarily slow
- the user wants local quality guardrails without painful commit latency

### Prefer `eslint-plugin-simple-import-sort` when:

- setting up a new repo from scratch
- migrating away from `@trivago/prettier-plugin-sort-imports` (Babel parser, no Prettier 4 support)
- the team wants clean separation of concerns (formatting ≠ code structure)
- VS Code `source.organizeImports` is causing conflicts

### Allow `@ianvs/prettier-plugin-sort-imports` when:

- the repo already uses it and it works well
- the team prefers regex-based import grouping over ESLint rules
- the project has complex import order requirements that benefit from explicit regex patterns

### Avoid `@trivago/prettier-plugin-sort-imports` in new projects because:

- it uses a Babel-based parser internally (slower, less TypeScript-aware)
- it only supports Prettier 2.x–3.x (no Prettier 4 support)
- it conflicts with VS Code's `source.organizeImports`
- `@ianvs/prettier-plugin-sort-imports` is a strictly better fork (TS parser, Prettier 4 support)

### Prefer separate Prettier CLI over ESLint-plugin-Prettier when:

- setting up a new repo from scratch
- performance and simplicity matter
- the team wants the current mainstream recommendation from Prettier docs

### Allow `eslint-plugin-prettier` when:

- the repo already uses it intentionally
- it is part of a documented TS/non-TS split
- changing the model would create unnecessary churn right now

### Prefer a CI workflow when:

- the repo is team-shared or has multiple contributors
- quality enforcement should not depend on individual developer hooks
- the project uses pull requests
- even for solo projects, CI catches hook-bypass scenarios (`--no-verify`)

---

## Quick Setup from Scratch

For setting up a new Playwright + TypeScript project with full static analysis, run these commands:

```bash
# 1. Initialize and install core dependencies
npm init -y
npm install -D @playwright/test typescript


# 2. Install static analysis tools
npm install -D eslint @eslint/js typescript-eslint globals
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
npm install -D eslint-plugin-simple-import-sort
npm install -D eslint-plugin-playwright
npm install -D husky lint-staged


# 3. Initialize Husky
npx husky init


# 4. Create config files using the examples in this skill:
# - eslint.config.mjs
# - .prettierrc.json
# - .prettierignore
# - tsconfig.json
# - .husky/pre-commit
# - .vscode/settings.json
# - .vscode/extensions.json


# 5. CI quality gate:
#    - If .github/workflows/ already has a CI pipeline → add quality job there
#    - If no pipeline exists → create .github/workflows/quality.yml


# 5. Add scripts to package.json (see example above)


# 6. Verify
npm run lint
npm run format:check
npm run tsc:check
```

---

## Troubleshooting

### `source.organizeImports` fights with import sorting

**Symptom:** Imports keep re-ordering on every save, causing unstaged changes.
**Cause:** VS Code's built-in `source.organizeImports` and an ESLint/Prettier import sorting plugin produce different orderings.
**Fix:** Remove `"source.organizeImports"` from `.vscode/settings.json`. Let ESLint handle import order.

### ESLint reports `simple-import-sort/imports` errors after migration

**Symptom:** Many import order errors after switching from a Prettier plugin.
**Fix:** Run `npx eslint . --fix` once to normalize all imports, then commit.

### `format:check` passes but `lint` fails on Prettier issues

**Symptom:** TypeScript files have formatting issues caught by ESLint but not by `format:check`.
**Cause:** If using Model B (`eslint-plugin-prettier`), `format:check` only checks non-TS files. TS formatting is checked by ESLint.
**Fix:** This is expected behavior in Model B. Run `npx eslint . --fix` to fix TS formatting.

### `tsc:check` fails but ESLint passes

**Symptom:** Type errors in `tsc --noEmit` that ESLint doesn't catch.
**Cause:** ESLint with `tseslint.configs.recommended` does not enable type-checked rules.
**Fix:** Both checks are needed. For stricter linting, consider upgrading to `tseslint.configs.recommendedTypeChecked` with `parserOptions.projectService: true`.

### Pre-commit hook is slow

**Symptom:** Commits take too long due to `tsc:check` running on every commit.
**Fix:** Move `tsc:check` from pre-commit to pre-push, or rely on CI for type checking. Keep `lint-staged` in pre-commit for fast feedback.

---

## Completion Checklist

A task using this skill is complete when:

- [ ] Dependency declarations are explicit (no transitive reliance)
- [ ] Script names are clear and consistent
- [ ] `check:ci` exists as a non-mutating aggregate command
- [ ] Formatting responsibility is understandable and documented
- [ ] Import sorting is handled by ESLint, not Prettier plugins
- [ ] `typescript` and Node requirements are documented in `engines`
- [ ] Husky and `lint-staged` are aligned
- [ ] CI workflow exists at `.github/workflows/quality.yml`
- [ ] `.vscode/settings.json` does not have `source.organizeImports` conflicting with ESLint import sorting
- [ ] Docs (`README.md`) match the actual setup
- [ ] Verification results are recorded (`lint`, `format:check`, `tsc:check` all pass)

---

## Example prompts

- `/static-code-analysis-typescript review this repo and standardize eslint, typescript, husky, lint-staged, and CI scripts`
- `/static-code-analysis-typescript create a modern static analysis setup for a Node + TypeScript test repository`
- `/static-code-analysis-typescript explain whether TS formatting should be handled by eslint-plugin-prettier or prettier --check in this project`
- `/static-code-analysis-typescript migrate from @trivago/prettier-plugin-sort-imports to eslint-plugin-simple-import-sort`
- `/static-code-analysis-typescript add a CI quality gate workflow for GitHub Actions`
- `/static-code-analysis-typescript set up import sorting for a Playwright project`
