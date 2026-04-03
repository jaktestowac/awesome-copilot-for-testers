---
applyTo: '{tests,src}/**/*.ts'
description: This file describes the TypeScript code style for the project.
title: TypeScript style rules
name: typescript-style
---

# TypeScript style rules

## 1) Types & API boundaries

- Exported functions/classes MUST have explicit return types (public API clarity).
- Avoid `any`. If the type is unknown, use `unknown` and narrow with type guards before use.
- Prefer `readonly` / immutable patterns for inputs (e.g., `readonly T[]`, `Readonly<T>`) when mutation is not intended.
- Prefer `type` for unions/intersections and `interface` for object shapes that are expected to be extended (team consistency).
- Use `as const` for literal configs and fixtures when it improves inference and prevents widening.

## 2) Errors & contracts

- Library/helpers in `src/` MUST throw typed errors (custom `Error` classes) with stable `name` and meaningful message.
- When catching errors, do not swallow: either rethrow, wrap with context, or return a typed `Result`-style object.
- Tests SHOULD assert on error _type/code_ first; assert exact error messages only when the message is part of the public contract (otherwise tests get brittle).

## 3) Imports & module hygiene

- Imports MUST be sorted and unused imports removed (keep diffs clean).
- Prefer type-only imports when possible: `import type { X } from '...'` (prevents runtime side effects).
- Prefer named exports for utilities; avoid default exports unless required by framework conventions.

## 4) Async & side effects

- Prefer `async/await` over `.then()` chains for readability.
- Do not introduce hidden side effects at import time (no I/O, no env reads that execute on module load); prefer explicit init functions.

## 5) Tests (if under `tests/`)

- Prefer Playwright/Jest-style expectations that auto-wait/retry where available; avoid fixed sleeps/timeouts (`waitForTimeout`) unless there is no alternative.
- Assertions SHOULD be focused: assert one behavior per expectation group and provide a helpful message when it improves debugging.
