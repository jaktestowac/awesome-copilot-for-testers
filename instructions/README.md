# 🤖 Custom Instructions for Testers

This directory contains reusable instruction files for GitHub Copilot, focused on test automation with Playwright and TypeScript.

## What instruction files are

Instruction files (`*.instructions.md`) define coding standards that Copilot applies automatically to every request touching files matched by their `applyTo` glob. Each file has frontmatter:

```yaml
---
description: 'One-line intent of the rules'
applyTo: 'tests/**/*.spec.ts'
---
```

## How to use

- Copy the files you want into your workspace's `.github/instructions/` folder, or
- Add general guidance to `.github/copilot-instructions.md` (applies to everything), or
- Use the `Chat: Attach Instructions` command from the command palette to apply one in the current chat.

Docs: [VS Code custom instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)

## Files in this directory

| File | Scope (`applyTo`) | Purpose |
| ---- | ----------------- | ------- |
| [playwright-typescript.instructions.md](playwright-typescript.instructions.md) | `tests/**/*.ts` | Playwright test generation: locators, assertions, structure, and testing patterns (AAA, POM, DTO, Builder, Factory, fixtures) |
| [e2e-playwright.instructions.md](e2e-playwright.instructions.md) | `tests/e2e/**/*.spec.ts` | E2E-specific rules: test intent, isolation, locator strategy, waiting discipline, flake prevention, diagnostics |
| [api-playwright-tests.instructions.md](api-playwright-tests.instructions.md) | `tests/api/**/*.spec.ts` | API test rules: HTTP semantics, contract assertions, typed clients, data isolation |
| [page-objects.instructions.md](page-objects.instructions.md) | `**/pages/**/*.ts` | Page Object Model conventions: structure, private locators, intent-level methods, navigation waits |
| [typescript-style.instructions.md](typescript-style.instructions.md) | `{tests,src}/**/*.ts` | TypeScript style: explicit types at boundaries, typed errors, import hygiene, async conventions |

## Writing good instruction files

- Keep rules **specific and testable** — "Use `getByRole` before CSS selectors", not "write good locators".
- Scope `applyTo` as narrowly as the content allows; only truly universal rules belong in broad globs.
- Don't duplicate rules across files — each rule should have one home, and other files can cross-reference it.
- Keep files short; every matching request pays the token cost of the whole file.
