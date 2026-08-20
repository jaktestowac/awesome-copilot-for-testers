# Cypress to Playwright

The mapping is mostly mechanical. The rows marked **rethink** are where a direct translation produces a worse test than the original.

## Selection

| Cypress | Playwright | Note |
| --- | --- | --- |
| `cy.get('.btn-primary')` | `page.getByRole('button', { name: 'Save' })` | **Rethink.** Port the intent, not the CSS chain |
| `cy.get('[data-cy=submit]')` | `page.getByTestId('submit')` | Set `testIdAttribute: 'data-cy'` in config to keep the attribute |
| `cy.contains('Save')` | `page.getByText('Save')` | `getByRole` is usually better for interactive elements |
| `cy.get('input#email')` | `page.getByLabel('Email')` | If there is no label, that is an accessibility finding |
| `cy.get('.row').eq(2)` | `page.getByRole('row').nth(2)` | |
| `cy.get('.row').first()` | `page.getByRole('row').first()` | |
| `cy.get('.item').find('.price')` | `page.getByTestId('item').getByTestId('price')` | Chained locators scope the same way |
| `cy.get('.item').filter(':visible')` | `page.getByTestId('item').filter({ visible: true })` | |
| `cy.get('tr').contains('Alice').parent()` | `page.getByRole('row').filter({ hasText: 'Alice' })` | Cleaner in Playwright; avoid `parent()` traversal |

## Actions

| Cypress | Playwright |
| --- | --- |
| `.click()` | `.click()` |
| `.type('text')` | `.fill('text')` for inputs, `.pressSequentially('text')` when key events matter |
| `.clear().type('x')` | `.fill('x')` |
| `.select('Option')` | `.selectOption({ label: 'Option' })` |
| `.check()` / `.uncheck()` | `.check()` / `.uncheck()` |
| `.trigger('mouseover')` | `.hover()` |
| `.type('{enter}')` | `.press('Enter')` |
| `.scrollIntoView()` | Rarely needed; actions auto-scroll |
| `.selectFile('path')` | `.setInputFiles('path')` |
| `cy.visit('/path')` | `page.goto('/path')` |
| `cy.reload()` | `page.reload()` |
| `cy.go('back')` | `page.goBack()` |

## Assertions

| Cypress | Playwright |
| --- | --- |
| `.should('be.visible')` | `await expect(locator).toBeVisible()` |
| `.should('not.exist')` | `await expect(locator).toHaveCount(0)` |
| `.should('have.text', 'x')` | `await expect(locator).toHaveText('x')` |
| `.should('contain', 'x')` | `await expect(locator).toContainText('x')` |
| `.should('have.value', 'x')` | `await expect(locator).toHaveValue('x')` |
| `.should('have.attr', 'href', '/a')` | `await expect(locator).toHaveAttribute('href', '/a')` |
| `.should('have.class', 'active')` | `await expect(locator).toHaveClass(/active/)` |
| `.should('be.disabled')` | `await expect(locator).toBeDisabled()` |
| `.should('have.length', 3)` | `await expect(locator).toHaveCount(3)` |
| `cy.url().should('include', '/checkout')` | `await expect(page).toHaveURL(/\/checkout/)` |

Playwright's `expect` retries the same way Cypress's `should` does. The behaviour you relied on is preserved; the `await` is the only real change.

## Waiting

**Rethink every one of these.** This is where the migration earns most of its value.

| Cypress | Playwright | Note |
| --- | --- | --- |
| `cy.wait(2000)` | Delete it | Web-first assertions already wait |
| `cy.wait('@getUsers')` | `await page.waitForResponse('**/api/users')` | Often unnecessary; assert on the resulting UI instead |
| `cy.get('.spinner').should('not.exist')` | `await expect(page.getByTestId('spinner')).toBeHidden()` | Better: assert the loaded content directly |
| `cy.get('.list', { timeout: 10000 })` | `await expect(list).toBeVisible({ timeout: 10_000 })` | Keep the raised timeout only where genuinely slow |

The pattern to reach for: assert on the outcome, not on the mechanism. `await expect(page.getByRole('row')).toHaveCount(3)` waits for the load, proves the result, and needs no intercept.

## Network

| Cypress | Playwright |
| --- | --- |
| `cy.intercept('GET', '/api/users', { fixture: 'users.json' })` | `await page.route('**/api/users', r => r.fulfill({ path: 'fixtures/users.json' }))` |
| `cy.intercept('POST', '/api/order', { statusCode: 500 })` | `await page.route('**/api/order', r => r.fulfill({ status: 500 }))` |
| `cy.intercept('/api/**').as('api')` then `cy.wait('@api')` | `await page.waitForResponse('**/api/**')`, or assert on the UI |
| `cy.request('POST', '/api/seed', body)` | `await request.post('/api/seed', { data: body })` |

Recipes in `mocking-network-and-time`, `resources/playwright-route-recipes.md`.

## Setup and structure

| Cypress | Playwright |
| --- | --- |
| `describe` / `it` | `test.describe` / `test` |
| `beforeEach` | `test.beforeEach` |
| `it.only` / `it.skip` | `test.only` / `test.skip` |
| `Cypress.env('KEY')` | `process.env.KEY` |
| `cy.fixture('data.json')` | `import data from './fixtures/data.json'` |
| `cy.task('db:seed')` | A fixture that calls the API or the database directly |
| Custom commands in `commands.js` | **Rethink.** Usually a fixture; sometimes a helper function |

### Custom commands become fixtures

```js
// Cypress
Cypress.Commands.add('login', (email, password) => {
  cy.request('POST', '/api/login', { email, password })
    .then(({ body }) => window.localStorage.setItem('token', body.token));
});
```

```ts
// Playwright: a fixture, so it is typed, explicit in the signature, and set up once
export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});
```

Better still, do the login once in a setup project and reuse the storage state across every test. The Cypress habit of logging in per test is a cost the migration can remove.

## Constructs with no direct equivalent

| Cypress | What to do |
| --- | --- |
| `cy.stub()` / `cy.spy()` on browser globals | `page.exposeFunction` or `page.addInitScript`; often a sign the test should be a unit test |
| `.then()` chaining on subjects | Plain `await`. The Cypress chain exists because commands are queued; Playwright is async/await |
| `cy.wrap()` | Not needed |
| `Cypress.on('uncaught:exception')` | `page.on('pageerror')`. Consider failing the test on it rather than swallowing it |
| Component testing | Playwright component testing exists and is experimental; Vitest plus Testing Library is often the better target |
| Time travel debugger | Traces (`npx playwright show-trace`). Different tool, same job, and it works for CI failures |

## Config

| Cypress | Playwright |
| --- | --- |
| `baseUrl` | `use.baseURL` |
| `viewportWidth` / `viewportHeight` | `use.viewport` |
| `defaultCommandTimeout` | `expect.timeout` |
| `retries` | `retries` |
| `video`, `screenshotOnRunFailure` | `use.video`, `use.screenshot`, `use.trace` |
| `env` | `use.extraHTTPHeaders`, or plain `process.env` |
| Browser selection | `projects` with `devices[...]` |

## Traps

- **Every action and assertion is awaited.** A missing `await` reports a pass while the assertion runs after the test ended. Enable `@typescript-eslint/no-floating-promises`; this is the single highest-value lint rule in a migrated suite.
- **`.should('not.exist')` is `toHaveCount(0)`**, not `toBeHidden()`. Hidden and absent are different states and the distinction matters.
- **Playwright runs files in parallel by default.** A Cypress suite that relied on serial execution and shared state will fail in ways that look like flakiness. Fix the shared state; do not set `workers: 1` and move on.
- **`cy.get` retries the query; a Playwright `locator` is lazy.** Creating a locator does nothing until it is used, which is why storing locators in page objects is safe.
- **Cypress `beforeEach` visits are often redundant** once storage state handles auth.
