---
description: 'Playwright fixture instructions for shared setup, domain helpers, and reusable test bootstrapping.'
applyTo: 'tests/**/*.{spec.ts,fixture.ts}'
title: 'Playwright Fixture Instructions'
name: 'playwright-fixture-instructions'
---

## Scope

- Applies to: `tests/` Playwright spec files and fixture files
- Goal: keep setup reusable, explicit, and easy to debug

## Rules

- Keep browser or session setup in fixtures instead of repeating it inline in each test.
- Expose domain actions or page objects from fixtures when raw `page` usage would leak too much setup detail into tests.
- Generate unique test data per test and clean it up through API helpers when possible.
- Keep one primary responsibility per fixture so test failures remain explainable.

### Preferred pattern

```ts
import { test as base } from '@playwright/test';
import { CheckoutPage } from '../pages/checkout.page';

export const test = base.extend<{ checkoutPage: CheckoutPage }>({
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});
```

### Avoid

```ts
test('checkout flow', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  await page.goto('/checkout');
  await page.getByRole('textbox', { name: 'Email' }).fill('person@example.com');
  // repeated bootstrapping appears in multiple tests
});
```

## Notes

- Prefer `tests/fixtures/` for shared setup.
- Check existing fixture names before creating a new one.
- Use `npm run test:e2e -- --grep <scenario>` for fast local verification while iterating.
