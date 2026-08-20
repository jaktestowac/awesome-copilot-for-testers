# Playwright Route Recipes

Network interception in the browser. All examples use `@playwright/test`.

## Stub a response

```ts
await page.route('**/api/products?*', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ items: [{ id: 'p-1', name: 'Notebook', price: 1299 }], total: 1 }),
  });
});
```

Match method and path together when a route handles more than one verb:

```ts
await page.route('**/api/cart', async (route) => {
  if (route.request().method() !== 'POST') return route.fallback();
  await route.fulfill({ status: 201, json: { id: 'cart-1', items: [] } });
});
```

`route.fulfill({ json })` serializes and sets the content type for you.

## Force the failure branches

A stub that only returns 200 leaves the error path untested.

```ts
// Server error
await page.route('**/api/checkout', (route) => route.fulfill({ status: 500, json: { error: 'internal' } }));

// Validation error with the real error shape
await page.route('**/api/checkout', (route) =>
  route.fulfill({ status: 422, json: { errors: [{ field: 'postcode', code: 'invalid_format' }] } }),
);

// Network failure
await page.route('**/api/checkout', (route) => route.abort('failed'));

// Timeout, without a hardcoded wait in the test body
await page.route('**/api/checkout', async (route) => {
  await new Promise((resolve) => setTimeout(resolve, 30_000));
  await route.abort('timedout');
});
```

## Pass through but modify

```ts
// Add a header on the way out
await page.route('**/api/**', async (route) => {
  const headers = { ...route.request().headers(), 'x-test-run': process.env.RUN_ID ?? 'local' };
  await route.continue({ headers });
});

// Rewrite one field of the real response
await page.route('**/api/user', async (route) => {
  const response = await route.fetch();
  const body = await response.json();
  await route.fulfill({ response, json: { ...body, plan: 'enterprise' } });
});
```

`route.fetch()` performs the real request, so the test still exercises the server while the test controls one field.

## Fail on unmocked traffic

Register the catch-all last. Playwright runs handlers most-recently-added first.

```ts
test.beforeEach(async ({ page }, testInfo) => {
  await page.route('**/api/**', (route) => {
    throw new Error(`Unmocked API call in "${testInfo.title}": ${route.request().method()} ${route.request().url()}`);
  });
});
```

Allow-list what the app legitimately needs before that line, and let genuinely irrelevant traffic go:

```ts
await page.route(/googletagmanager|hotjar|sentry\.io/, (route) => route.abort());
```

## Scope

| Scope | Call | Use for |
| --- | --- | --- |
| One page | `page.route(...)` | Per-test stubs |
| Whole context | `context.route(...)` | Auth, feature flags, telemetry blocking |
| Whole project | a fixture that calls `context.route` in `beforeEach` | Suite-wide policy such as the unmocked-traffic guard |

Prefer a fixture over repeating the same route in every file, so the policy lives in one place.

## HAR record and replay

Record once against a real environment:

```ts
await context.routeFromHAR('fixtures/catalog.har', {
  url: '**/api/**',
  update: true, // record mode
});
```

Then replay in CI:

```ts
await context.routeFromHAR('fixtures/catalog.har', {
  url: '**/api/**',
  update: false,
  notFound: 'abort', // never silently reach the network
});
```

Rules for HAR files:

- set `notFound: 'abort'`, never `'fallback'`, or a stale HAR will quietly hit the real API in CI
- scope the `url` filter so the HAR holds only the API surface, not fonts and images
- strip tokens, cookies, and personal data before committing (see `handling-sensitive-test-data`)
- record the refresh command and the recording date in the fixtures README
- treat a HAR older than the API's release cadence as expired

## Debugging an interception that does not fire

1. `npx playwright test --debug` and watch the Network panel in the inspector.
2. Log every request to see the URL your matcher should have matched:
   ```ts
   page.on('request', (r) => console.log(r.method(), r.url()));
   ```
3. Check ordering. Later `route` registrations win, so a broad early handler is not the problem, a broad late one is.
4. Check the scope. A `page.route` set after navigation started misses the requests already in flight; register before `page.goto`.
5. Service workers intercept before Playwright does. Set `serviceWorkers: 'block'` in the context options while debugging.
