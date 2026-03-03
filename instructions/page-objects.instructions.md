---
applyTo: 'src/pages/**/*.ts'
description: This file describes the Page Object / App Action rules for Playwright + TypeScript tests.
title: Page Objects / App Actions rules (Playwright + TS)
name: page-objects
---

# Page Objects / App Actions rules (Playwright + TS)

## Goal

Create stable, readable, and reusable automation primitives:

- tests express **user intent**
- page objects hide **UI details**
- failures are **diagnostic** (good errors, good waits, good locators)

## Responsibilities & boundaries

- Page Objects expose **intent-level** methods (e.g. `loginAs(user)`, `addProductToCart(name)`), not low-level `click()` chains.
- Keep locators **private**. Expose actions + _key_ domain assertions only.
- Prefer a thin Page Object layer + optional **Component Objects** for reusable widgets (nav, modal, table).
- Do NOT put test data generation, API clients, or environment config inside Page Objects (use fixtures/helpers).

## Constructor, typing, and state

- Accept `Page` (and optionally `baseURL`) via constructor.
- Store **Locator** objects, not ElementHandles (Locators are resilient to re-renders).
- Avoid storing state that can go stale across navigations (urls, text snapshots, counts). Read it when needed.

## Locators: production rules

- Prefer user-facing locators:
  - `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText` (carefully), `getByTestId` (for stable hooks).
- Avoid brittle selectors: long CSS chains, nth-child, layout-driven selectors, random classes.
- Use locator narrowing/chaining instead of complex CSS (e.g. `page.getByRole(...).getByText(...)`).
- Locators must be **strict** and unambiguous (1 target). If not, narrow by role/name/filter.

## Actions & waits (no flakiness)

- NEVER use `page.waitForTimeout()` as synchronization.
- Use Playwright’s auto-wait + explicit `expect(...)` waits for readiness/visibility.
- Any method that triggers navigation must wait for completion:
  - prefer `await Promise.all([ page.waitForURL(...), locator.click() ])`
  - or assert the new page’s stable element.
- Prefer assertions that validate user-visible outcomes (URL, heading, toast, table row).

## Assertions: where they live

- Keep **minimal, meaningful** assertions inside Page Objects (e.g. `expectLoggedInAs(name)`).
- Avoid dumping "test assertions" everywhere; tests still own the scenario expectations.

## Naming conventions

- Locators end with `Locator` suffix (e.g. `submitButtonLocator`).
- Intent methods are verbs: `open()`, `loginAs()`, `save()`, `deleteProject()`.
- Keep methods small and composable; avoid `doEverything()`.

## Error messages & diagnostics

- When asserting, add meaningful messages (what user expected vs what was observed).
- Prefer returning useful objects for chaining (e.g. `submit(): Promise<DashboardPage>`).

## Recommended structure (example)

- `open()` navigates and verifies the page is ready.
- `assertLoaded()` checks a stable landmark (heading/main container).

Example style:

- `private readonly signInButtonLocator = this.page.getByRole('button', { name: 'Sign in' });`
- `async open(): Promise<this> { await this.page.goto('/login'); await this.assertLoaded(); return this; }`
- `async loginAs(user): Promise<DashboardPage> { ...; await expect(dashboardHeading).toBeVisible(); return new DashboardPage(this.page); }`

## Fixtures integration (preferred)

- Login/setup flows that are shared across tests should be implemented as Playwright **fixtures** (test/worker scope as appropriate), and Page Objects should be created by fixtures/factories.
