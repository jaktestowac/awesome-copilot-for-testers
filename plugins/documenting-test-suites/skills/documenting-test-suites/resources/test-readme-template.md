# Test Suite README Template

---

# [Product] test suite

[One paragraph: what this suite covers, what it does not, and which stack it uses.]

- **Owner**: [team or person]
- **Last verified**: [YYYY-MM-DD] by [name]
- **Runners**: [Playwright 1.56 for E2E and API, Vitest 3 for unit]

## Quickstart

Everything needed to get from a fresh clone to a green run.

### Prerequisites

| Tool | Version | Check |
| --- | --- | --- |
| Node | 22.x | `node -v` |
| npm | 10.x | `npm -v` |
| Docker | any recent | `docker -v` |

Version managers: `.nvmrc` is present, so `nvm use` picks the right Node.

### Install

```bash
npm ci
npx playwright install --with-deps chromium
```

### Configure

```bash
cp .env.example .env
```

| Variable | Purpose | Where to get it |
| --- | --- | --- |
| `BASE_URL` | App under test | Defaults to `http://localhost:3000`, no action needed |
| `API_TOKEN` | Seeding fixtures | Ask [team] or take it from the shared vault entry `[name]` |
| `TEST_USER_PASSWORD` | Login fixture | Vault entry `[name]` |

Never commit `.env`. It is gitignored; check before you stage.

### Start dependencies

```bash
docker compose up -d db mailpit
npm run dev          # the app under test, on :3000
```

### Run

```bash
npm test                    # everything
npm run test:unit           # Vitest only, ~8s
npm run test:e2e            # Playwright E2E, ~4 min
npm run test:e2e -- --grep @smoke   # the fast subset, ~40s
```

### What a green run looks like

- unit: 214 passed, 0 skipped, about 8 seconds
- e2e: 96 passed, 3 skipped, about 4 minutes on 4 workers
- the 3 skips are expected; see [Known gaps](#known-gaps)

If your numbers differ substantially, something in the setup is off rather than the code being broken.

### First-run troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `ECONNREFUSED :3000` | App not running | `npm run dev` in another terminal |
| All login tests fail | Missing `TEST_USER_PASSWORD` | Fill it in `.env` from the vault |
| `browserType.launch: Executable doesn't exist` | Browsers not installed | `npx playwright install --with-deps chromium` |
| Everything times out on first run | Database not seeded | `npm run db:seed` |

## Layout

```
tests/
  unit/            colocated with source under src/**/*.test.ts
  api/             API tests, one file per resource
  e2e/             browser tests, one file per journey
  fixtures/        Playwright fixtures: auth, seeded data, network policy
  pages/           page objects for the E2E suite
  support/         builders, factories, assertions
  visual/          snapshot tests and their baselines
```

Where a new test goes:

| Testing | Put it in |
| --- | --- |
| A pure function or a class in isolation | `src/**/*.test.ts`, next to the code |
| One HTTP endpoint | `tests/api/<resource>.spec.ts` |
| A user journey across pages | `tests/e2e/<journey>.spec.ts` |
| Appearance of a component or page | `tests/visual/<name>.visual.spec.ts` |

## Conventions

Only the ones that are easy to get wrong.

- **Locators**: `getByRole` first, `getByLabel` second, `getByTestId` when neither works. CSS and XPath selectors are not used; a review will ask you to change them.
- **Test titles**: state the behaviour, not the mechanics. "rejects an expired card at checkout", not "test checkout 3".
- **Auth**: use the `authenticatedPage` fixture. Do not log in through the UI in a test unless login is the subject.
- **Data**: every test creates what it needs through the builders in `tests/support/factories`. Tests never depend on data another test created, and the suite runs in parallel, so shared mutable data will bite you.
- **Waiting**: web-first assertions only. There is a lint rule banning `waitForTimeout`.
- **Cleanup**: the `seededOrder` fixture removes its own data. If you add a fixture that creates data, it cleans up in its teardown.
- **Tags**: see the [tag glossary](./tags.md). Every E2E test carries exactly one priority tag.

## What a pull request touching tests should include

- the test, with a title that says the behaviour
- a note in the description if a new fixture or tag was added
- for a visual baseline change, before-and-after images
- no new `test.skip` without an issue link and a date

## CI

| Workflow | Trigger | Runs |
| --- | --- | --- |
| `ci.yml` | every push | unit, api, `@smoke` E2E |
| `nightly.yml` | 02:00 UTC | full E2E across 4 shards, visual |
| `visual-update.yml` | manual | regenerates baselines and opens a PR |

- **Shards**: 4, merged with `npx playwright merge-reports`
- **Artifacts**: traces, videos, and screenshots on failure; kept 14 days
- **Retries**: 1 in CI, 0 locally. A test that passes on retry is reported as flaky, not as a pass.
- **Secrets**: `API_TOKEN`, `TEST_USER_PASSWORD`, administered by [team]

### Reproducing a CI failure locally

```bash
# Same container as CI, which matters for visual tests and font rendering
docker run --rm -v "$(pwd):/work" -w /work \
  mcr.microsoft.com/playwright:v1.56.0-noble \
  npx playwright test --grep "the failing test title"
```

Download the trace from the run's artifacts and open it:

```bash
npx playwright show-trace trace.zip
```

## Known gaps

Read this before treating a green run as evidence.

| Area | State | Reason |
| --- | --- | --- |
| Bulk import | No coverage at any level | No test fixture large enough exists; tracked in [issue] |
| Refund flow | Unit tests only | Payment sandbox cannot produce refund states on demand |
| Safari | Not run | Support policy is Chrome and Firefox only |

### Skipped and quarantined tests

| Test | Since | Reason | Expires |
| --- | --- | --- | --- |
| `checkout.spec.ts > applies a stacked discount` | 2026-07-14 | Flaky under parallel load, [issue] | 2026-09-14 |

A quarantined test past its expiry is fixed or deleted, not extended silently.

## Decisions

Architecture decision records live in [`docs/adr/`](./docs/adr/). Read these before proposing a structural change:

- [0001 Playwright over Cypress](./docs/adr/0001-playwright-over-cypress.md)
- [0002 Fixtures over page objects for API setup](./docs/adr/0002-fixtures-for-setup.md)
- [0003 Real backend in E2E, mocks only for third parties](./docs/adr/0003-mocking-policy.md)

---

## The validation gate

Before publishing this README, do this and fix what it exposes:

1. Clone the repository into a new directory.
2. Open a fresh shell with no environment variables set.
3. Follow the quickstart exactly as written, typing nothing that is not on the page.
4. Write down every point where you had to already know something.

Each of those points is a missing line. This exercise finds more than a careful re-read, every time.

Re-run it whenever the setup changes, and update the last-verified line.

## What to leave out

| Do not write | Because |
| --- | --- |
| A list of every npm script | `package.json` has it, and it will drift |
| Framework tutorials | Playwright's docs are better and stay current |
| Every config value | The config file is the source of truth |
| Change history | That is what git is for |
| Aspirational conventions nobody follows | It teaches readers the document is fiction |
