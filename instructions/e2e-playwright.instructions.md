---
applyTo: 'tests/e2e/**/*.spec.ts'
description: This file describes the Playwright E2E test rules for Playwright + TypeScript tests.
title: Playwright E2E rules
name: e2e-playwright
---

# Playwright E2E rules

> Goal: stable, readable, debuggable E2E tests that behave the same locally and in CI.

## 1) Test intent & structure

- One test = one user journey / business outcome. Avoid "mega-tests".
- Use `test.describe()` for feature grouping and shared setup (fixtures/hooks), not for implicit dependencies.
- Prefer `test.step()` for _business-readable_ narrative and better reports (steps should describe intent, not implementation).
- Titles must be explicit and user-facing (e.g. `User can pay with card` vs `Payment works`).

## 2) Isolation & data management

- Tests must be order-independent and runnable in parallel.
- Do not share mutable state between tests (no global variables with IDs/tokens).
- If auth/state is needed, use a dedicated fixture / storageState approach (and keep it deterministic).
- Test data must be explicit:
  - create data via API/DB seed _before_ UI actions when possible,
  - clean up after test only if required (prefer unique test data to avoid cleanup races).

## 3) Locator strategy (stability first)

- Prefer Playwright user-facing locators:
  - `getByRole()` (with `name`) as default,
  - then `getByLabel()`, `getByPlaceholder()`, `getByText()` (carefully),
  - use `getByTestId()` for elements without stable semantics.
- Avoid brittle selectors (CSS/XPath) unless there is no semantic alternative.
- Locators must be unique (strict-mode friendly). Do **not** "fix" uniqueness by `.first()` / `.nth()` unless the UI contract is truly positional and documented (positional selection is a frequent flake source).
- Prefer narrowing via filtering/chaining instead of complex CSS:
  - `page.getByRole('dialog').getByRole('button', { name: 'Save' })`.

## 4) Waiting & assertions (no sleeps)

- Never add `waitForTimeout()` as a stabilization tactic.
- Always wait on **UI state** or **explicit app signal**, not on "network idle" by default. (Network patterns vary; UI state is the contract.)
- After actions that trigger async updates (navigation, save, search, background refresh), add _explicit_ assertions:
  - URL: `await expect(page).toHaveURL(...)`
  - UI: `await expect(locator).toBeVisible() / toHaveText() / toBeEnabled()` etc.
- Prefer assertions over manual waits:
  - `await expect(locator).toHaveText(...)` instead of `await locator.waitFor()` when possible.

## 5) Flake prevention patterns (do & don’t)

**DO**

- Assert the app is ready before critical actions (page loaded, key component visible).
- Use `expect.poll()` only for _true polling needs_ (eventual consistency), with a clear timeout and message.
- Keep timeouts local and justified (e.g. a known slow external sandbox), rather than raising global timeouts.

**DON’T**

- Don’t "click twice", retry actions manually, or wrap actions in broad try/catch to hide flakiness.
- Don’t rely on random data without logging it (if random is used, print seed/values).

## 6) Reporting & diagnostics

- Every `test.step()` should read like a mini user story and help triage in HTML report.
- On failures, we want artifacts:
  - traces for retries / failures (preferred),
  - screenshots on failure,
  - video only if it meaningfully helps (can be heavy in CI).
- When you add a new test, ensure failures are actionable:
  - use clear `expect(...).to...()` messages by choosing assertions that show "expected vs received",
  - avoid generic assertions like "truthy" without context.

## 7) Readability & maintainability

- Keep arrange/act/assert visible in the flow (steps can map to AAA).
- Use helpers/page-objects for reuse, but do not over-abstract:
  - avoid hiding important expectations inside deep helpers,
  - helpers should return locators or perform clearly named actions.
- Prefer small, composable helpers over "god page objects".

## 8) Quick anti-pattern checklist

- ❌ `waitForTimeout(...)`
- ❌ `.first()` / `.nth()` to bypass strict mode without a real contract
- ❌ assertions missing after async actions
- ❌ shared mutable state across tests
- ❌ selectors tied to CSS layout or dynamic classes
