# Import Sorting — Strategy, Decision Tree, and Migrations

## Recommended approach: `eslint-plugin-simple-import-sort`

Import sorting belongs in ESLint, not in Prettier. The recommended plugin is `eslint-plugin-simple-import-sort`.

**Why ESLint-based import sorting is preferred:**

1. **Clean separation of concerns** — Prettier handles formatting (whitespace, quotes, semicolons); ESLint handles code quality and structure (including import order)
2. **Auto-fixable** — `eslint --fix` sorts imports, which integrates naturally with `lint-staged`
3. **No Prettier plugin complexity** — Prettier plugins for import sorting add a parser layer (often Babel-based) that can be slow, fragile, or incompatible with newer Prettier versions
4. **No VS Code conflicts** — Prettier import sorting plugins fight with VS Code's `source.organizeImports`; ESLint-based sorting does not
5. **Future-proof** — No coupling to Prettier's plugin API changes; ESLint plugin API is stable
6. **Lightweight** — `eslint-plugin-simple-import-sort` has zero dependencies

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

## Decision tree: choosing an import sorting strategy

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

## Migrating from `@trivago/prettier-plugin-sort-imports`

1. Uninstall: `npm uninstall @trivago/prettier-plugin-sort-imports`
2. Install: `npm install -D eslint-plugin-simple-import-sort`
3. Remove from `.prettierrc.json`:

- `"plugins": ["@trivago/prettier-plugin-sort-imports"]`
- `"importOrder"` / `"importOrderSeparation"` / `"importOrderSortSpecifiers"` / any `importOrder*` options

4. Add ESLint rules (see setup above)
5. Remove `"source.organizeImports"` from `.vscode/settings.json`
6. Run `npx eslint . --fix` to re-sort all imports
7. Verify with `npx eslint . --max-warnings=0`

## Migrating from `@ianvs/prettier-plugin-sort-imports`

Same steps as the trivago migration. Remove `"plugins"` and any `importOrder*` options from `.prettierrc.json`.
