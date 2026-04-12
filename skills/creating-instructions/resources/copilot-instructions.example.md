# Copilot Instructions

This repository contains end-to-end, API, and support tooling for a product quality platform.
Use the rules below as the default operating agreement for GitHub Copilot changes in this workspace.

## Repository at a glance

- **Purpose**: maintain reliable regression coverage for the checkout, billing, and notification domains
- **Primary stack**: Node.js 22, TypeScript, Playwright, Vitest, REST APIs, GitHub Actions
- **Top-level folders**:
  - `tests/e2e/` - browser-based user journeys and smoke coverage
  - `tests/api/` - API regression suites and contract-focused checks
  - `tests/fixtures/` - reusable fixtures, test data builders, and setup helpers
  - `src/support/` - shared clients, utilities, schemas, and domain helpers
  - `.github/workflows/` - CI pipelines and quality gates

## Commands Copilot should prefer

- `npm run lint` - run static checks after editing source or tests
- `npm run test:e2e -- --project=chromium` - verify browser flows locally
- `npm run test:api` - verify service-level behavior without UI noise
- `npm run test:ci` - full non-mutating verification before final handoff

## Architecture rules

- Keep browser interaction logic in page objects or fixtures, not inline in assertions-heavy tests.
- Store domain-aware helpers under `src/support/` and import them from tests instead of duplicating request or parsing logic.
- Put feature-specific test data builders close to the feature they support.

## Implementation rules

- Prefer accessible locators (`getByRole`, `getByLabel`, `getByText`) over CSS selectors unless no stable user-facing handle exists.
- Use web-first assertions and avoid hard waits such as `waitForTimeout`.
- When a change affects behavior, update the most relevant automated test instead of only adjusting fixtures or mocks.

## Data, config, and secrets

- Read environment-specific values from `.env` files or CI secrets, never from hardcoded constants.
- Keep sample payloads in `tests/fixtures/data/` and sanitize anything copied from production.
- Log enough context to debug failures, but never print tokens, passwords, or session cookies.

## Testing and quality gates

- Add happy-path and edge-case coverage when introducing new user flows.
- Prefer API-level setup and cleanup over UI-only setup when it reduces flake and runtime.
- If a failure is timing-sensitive, capture traces or diagnostics before retrying or widening timeouts.

## Change hygiene

- Keep pull requests scoped to one concern whenever possible.
- Avoid renaming or reformatting unrelated files in the same change.
- Update README or contributor docs if commands, folder structure, or installation steps change.
