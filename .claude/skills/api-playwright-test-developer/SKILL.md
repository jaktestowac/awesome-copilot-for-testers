---
name: api-playwright-test-developer
description: Writes and reviews API automation tests with Playwright. Use when creating backend API tests, contract checks, data-driven assertions, or API+UI hybrid workflows in Playwright Test. Focus on robust, maintainable test design with clear setup/teardown, single responsibility per test, and best practices for assertions and data management.
---

# API Playwright Test Developer

This skill defines the standard approach for writing and maintaining Playwright-based API tests. It is optimized for robust, repeatable automated validation of REST/GraphQL services, readable test design, and minimal flakiness.

## When to use

- API endpoint functional testing (status, schema, body values)
- Data-driven regression coverage across all environments
- Contract checks (OpenAPI/JSON Schema) for service evolution
- End-to-end test flows mixing UI and API interactions (hybrid tests)
- CI pipeline smoke tests and API health checks

## Core principles

1. Explicit setup/teardown
    - Use `test.beforeEach` and `test.afterEach` for consistent test state management (e.g., create/delete test data).
    - Avoid shared mutable state across tests to prevent flakiness.
    - Use unique identifiers in test data to avoid collisions and ensure idempotency.
    - Dont clean up test data in `afterEach` so that you can inspect it after test failures.
2. Single responsibility per test case
    - Each test should target one behavior (e.g., 200 vs 401, field validation, paginated listing).
    - Use descriptive test titles to clarify the intent and expected outcome.
    - For complex scenarios, break down into multiple focused tests rather than one large test with many assertions.
    - When testing e2e flows, consider using `test.step` to logically group related API calls and assertions within a single test case.
3. Assertions
    - Avoid brittle tests that rely on dynamic timestamps or ordering unless controlled.
    - Add descriptive messages to assertions for easier debugging.
    - Use soft assertions `expect.soft` for multiple checks in a single test without stopping at the first failure.
4. Clear data management
    - Use fixtures/config to store base URL, auth tokens, test payload templates.
    - Use factory functions to generate test data with unique identifiers.
    - Avoid hardcoding environment-specific values in tests; use environment variables or config files.
    - For complex data setup, consider using API calls in `beforeEach` to create necessary resources instead of relying on static test data.
5. Patterns and best practices
    - Use `request` fixture for API calls.
    - Use AAA pattern (Arrange-Act-Assert) for test structure.
    - Use builders or factories for constructing request payloads to improve readability and maintainability.
    - Use Simple Request Object Pattern to encapsulate API interactions and reduce duplication across tests.
    - Use `test.describe` to group related tests and share setup/teardown logic.

## Recommended folder layout

```
.
├── tests/
│   ├── api/
│   │   ├── users.spec.ts
│   │   ├── auth.spec.ts
│   │   ├── orders.spec.ts
│   │   └── contracts.spec.ts
│   ├── e2e/
│   │   ├── signup-and-purchase.spec.ts
│   │   └── checkout-api-ui.spec.ts
│   └── fixtures/
│       ├── api-fixtures.ts
│       ├── data-fixtures.ts
│       └── auth-fixtures.ts
├── playwright.config.ts
├── .env.example
├── helpers/
│   ├── api-helpers.ts
│   ├── schema-validators.ts
│   └── retry-utils.ts
├── data/
│   └── payloads/
│       ├── create-user.json
│       ├── update-order.json
│       └── login.json
└── docs/
    └── api-test-guidelines.md
```

- `tests/api/`: dedicated API service tests and contract/spec tests.
- `tests/e2e/`: hybrid scenarios that combine UI and API flows.
- `tests/fixtures/`: setup data and auth fixtures for Playwright Test.
- `helpers/`: reusable request builders, response assertions, schema validators.
- `data/payloads/`: canonical test payloads to avoid inline duplication.
- `.env.example`: environment abstraction for endpoints and tokens.
- `.github/workflows/api-tests.yml`: CI pipeline orchestration with separate API test job.


## Playwright Test Example (TypeScript)

```ts
import { test, expect } from '@playwright/test';

test.describe('API: /users', () => {
  test('GET /users returns 200 and JSON schema', async ({ request }) => {
    const response = await request.get('/api/users', {
      headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThanOrEqual(0);
  });
});
```

## Common patterns

- `request.get`, `request.post`, `request.put`, `request.delete`
- HTTP retries for transient 5xx responses (in test infrastructure, not per-test)
- Data-driven tests using `test.each` or `test.describe.parallel`
- Auth token refresh helpers and failures when invalid credentials are used
- Validate headers `cache-control`, `strict-transport-security`, etc. for security tests

## Hybrid API+UI scenario

1. Authenticate with API: `POST /auth/login` → token
2. Set browser storage/cookie in Playwright page context
3. Visit protected UI page to assert data mirrored from API
4. Modify resource via API, then confirm UI updates (or vice versa)

## Troubleshooting guide

- 401/403: verify token scope, environment URL, and clock skew
- 404: confirm route path and version (`/v1`, `/v2`), check mock intercepts
- Timeout: increase `timeout` in `request` and `page.waitForResponse` with precise matcher
- Flakiness: isolate side effects, use dedicated test data, run service health checks before suite

## Best practices checklist

- [ ] Leverage shared fixtures for base URL and authentication
- [ ] Keep request payloads small and reproducible
- [ ] Assert exact response fields and types
- [ ] Log request/response on failure with contextual messages
- [ ] Use `test.step` for complex flows to improve readability
- [ ] Regularly review and refactor tests to remove redundancy and improve clarity

## References

- Playwright REST API request docs: https://playwright.dev/docs/api-testing
