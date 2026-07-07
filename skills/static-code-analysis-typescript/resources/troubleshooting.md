# Troubleshooting — Static Code Analysis for TypeScript

## `source.organizeImports` fights with import sorting

**Symptom:** Imports keep re-ordering on every save, causing unstaged changes.
**Cause:** VS Code's built-in `source.organizeImports` and an ESLint/Prettier import sorting plugin produce different orderings.
**Fix:** Remove `"source.organizeImports"` from `.vscode/settings.json`. Let ESLint handle import order.

## ESLint reports `simple-import-sort/imports` errors after migration

**Symptom:** Many import order errors after switching from a Prettier plugin.
**Fix:** Run `npx eslint . --fix` once to normalize all imports, then commit.

## `format:check` passes but `lint` fails on Prettier issues

**Symptom:** TypeScript files have formatting issues caught by ESLint but not by `format:check`.
**Cause:** If using Model B (`eslint-plugin-prettier`), `format:check` only checks non-TS files. TS formatting is checked by ESLint.
**Fix:** This is expected behavior in Model B. Run `npx eslint . --fix` to fix TS formatting.

## `tsc:check` fails but ESLint passes

**Symptom:** Type errors in `tsc --noEmit` that ESLint doesn't catch.
**Cause:** ESLint with `tseslint.configs.recommended` does not enable type-checked rules.
**Fix:** Both checks are needed. For stricter linting, consider upgrading to `tseslint.configs.recommendedTypeChecked` with `parserOptions.projectService: true`.

## Pre-commit hook is slow

**Symptom:** Commits take too long due to `tsc:check` running on every commit.
**Fix:** Move `tsc:check` from pre-commit to pre-push, or rely on CI for type checking. Keep `lint-staged` in pre-commit for fast feedback.
