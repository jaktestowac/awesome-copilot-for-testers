# MSW Recipes

Mock Service Worker intercepts at the application's fetch layer, so the same handlers serve unit tests, component tests, and the browser during development.

## Shared handlers

Keep one source of truth for the happy path. Tests override per case.

```ts
// test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('*/api/products', () =>
    HttpResponse.json({ items: [{ id: 'p-1', name: 'Notebook', price: 1299 }], total: 1 }),
  ),
  http.post('*/api/cart', async ({ request }) => {
    const body = (await request.json()) as { productId: string };
    return HttpResponse.json({ id: 'cart-1', items: [{ productId: body.productId, qty: 1 }] }, { status: 201 });
  }),
];
```

## Node setup, strict by default

```ts
// test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

```ts
// vitest.setup.ts
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './test/mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

`onUnhandledRequest: 'error'` is the single most valuable line in this file. Without it a renamed endpoint reaches the real network in CI and the test still passes.

`resetHandlers()` after each test undoes per-test overrides. Leaving it out makes the suite order-dependent.

## Per-test override

```ts
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

test('shows a retry prompt when the catalog is unavailable', async () => {
  server.use(http.get('*/api/products', () => new HttpResponse(null, { status: 503 })));

  render(<Catalog />);

  await expect(screen.findByRole('button', { name: 'Try again' })).resolves.toBeVisible();
});
```

## The failure cases worth handlers

| Case | Handler |
| --- | --- |
| Server error | `new HttpResponse(null, { status: 500 })` |
| Validation error | `HttpResponse.json({ errors: [...] }, { status: 422 })` |
| Unauthorized | `new HttpResponse(null, { status: 401 })` |
| Network failure | `HttpResponse.error()` |
| Slow response | `await delay(5000)` before returning |
| Malformed body | `new HttpResponse('not json', { headers: { 'content-type': 'application/json' } })` |
| Empty collection | `HttpResponse.json({ items: [], total: 0 })` |

The last two are the ones teams skip and the ones that cause production incidents.

## Browser setup

```ts
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from '../../test/mocks/handlers';

export const worker = setupWorker(...handlers);
```

Start it only when explicitly enabled, never on a condition that can be true in production:

```ts
if (import.meta.env.VITE_API_MOCKING === 'enabled') {
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'warn' });
}
```

## MSW alongside Playwright

Both can intercept, and having both active on the same call is a debugging trap. Pick one per suite:

- **MSW** when the application already ships a worker for local development and the test is component-level.
- **Playwright `route`** for browser end-to-end tests. It sits below the application and does not need the app to boot the worker.

If a Playwright test must run against an app with the MSW worker active, disable the worker for that run through the env var rather than layering interception.

## Keeping handlers honest

- generate response bodies from the same schema the API publishes, so a spec change breaks the handlers (see `testing-api-contracts`)
- keep handler bodies small enough to read; a 300-line fixture nobody reads is a snapshot with extra steps
- when a handler encodes behaviour, put the reason in a comment: which endpoint, which documented rule
- review handlers whenever the corresponding API version changes
