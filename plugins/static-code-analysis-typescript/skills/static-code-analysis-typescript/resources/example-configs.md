# Example Configs — Static Code Analysis for TypeScript

Practical baseline snippets for Node.js + TypeScript repositories (Playwright-flavored where noted).

> Version note: install the latest stable versions of all tools (`npm install -D <package>`), and pin them via `package-lock.json`. Any version numbers shown here are illustrative, not recommendations.

## Example `eslint.config.mjs`

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

## Example `package.json` quality section

This example mirrors the recommended architecture:

- Full-project lint and format
- Non-mutating CI checks
- Staged-file formatting/linting
- Explicit Node engine

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
    "node": ">=20"
  },
  "lint-staged": {
    "*.ts": ["npx prettier --write", "npx eslint --fix --max-warnings=0"],
    "*.{json,md,mjs,yml,yaml}": "npx prettier --write"
  }
}
```

Set `engines.node` to the Node versions your team and CI actually support — check each tool's documented minimum.

Install dev dependencies at their latest stable versions:

```bash
npm install -D eslint @eslint/js typescript-eslint typescript globals \
  prettier eslint-config-prettier eslint-plugin-prettier \
  eslint-plugin-simple-import-sort eslint-plugin-playwright \
  husky lint-staged
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

## Example Husky hook (`.husky/pre-commit`)

```sh
npm run lint-staged
npm run tsc:check
```

## Example `.prettierignore`

Use ignore patterns for generated and heavy output folders.

```txt
package-lock.json
playwright-report
test-results
tmp
```

## Example `.prettierrc.json`

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
See `./import-sorting.md` for rationale and migration steps.

## Example `tsconfig.json`

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

## Example VS Code settings (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

**Important:** Do NOT add `"source.organizeImports": "explicit"` to `codeActionsOnSave`.
VS Code's built-in organize imports conflicts with ESLint-based import sorting (`eslint-plugin-simple-import-sort`), causing competing re-orderings on save. Let ESLint handle import order via `lint-staged` on commit and the VS Code ESLint extension in real time.

## Example VS Code extensions (`.vscode/extensions.json`)

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

## Example CI workflow — integrated into existing pipeline (PREFERRED)

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
          # match the version range declared in package.json engines.node
          node-version-file: 'package.json'
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

## Example CI workflow — standalone (FALLBACK)

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
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          # match the version range declared in package.json engines.node
          node-version-file: 'package.json'
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
