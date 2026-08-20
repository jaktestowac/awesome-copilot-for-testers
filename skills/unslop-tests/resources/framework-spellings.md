# Framework Spellings

How each tell in `SKILL.md` is written in the runners this collection targets, and what to write instead.

Use this to grep a repository, and to translate a finding into the project's own idiom before proposing the fix.

## Grep for the obvious ones

These are worth wiring into CI rather than catching by eye.

```bash
# focused tests - should never reach the base branch
rg -n "\b(test|it|describe)\.only\b|\bfdescribe\b|\bfit\(" --glob '*.{test,spec}.*'

# skips without an issue reference on the line above
rg -n -B1 "\b(test|it|describe)\.skip\b|\bxit\(|\bxdescribe\b" --glob '*.{test,spec}.*'

# hardcoded waits
rg -n "waitForTimeout|setTimeout\(|sleep\(|delay\(" --glob '*.{test,spec}.*'

# assertions that cannot fail
rg -n "toBeDefined\(\)|toBeTruthy\(\)|not\.toBeNull\(\)|toBe\(true\)" --glob '*.{test,spec}.*'

# bare throw assertions
rg -n "toThrow\(\)|rejects\.toThrow\(\)" --glob '*.{test,spec}.*'

# real clock and unseeded randomness
rg -n "new Date\(\)|Date\.now\(\)|Math\.random\(\)|randomUUID\(" --glob '*.{test,spec}.*'

# suppressions inside tests
rg -n "@ts-(ignore|expect-error)|eslint-disable" --glob '*.{test,spec}.*'
```

A hit is a candidate, not a finding. `new Date()` in a fixture builder is fine; `new Date()` inside the expectation is pattern 17.

## Assertions

| Tell | Vitest / Jest | Playwright | Fix |
| --- | --- | --- | --- |
| Cannot fail (2) | `expect(x).toBeTruthy()` | `expect(loc).toBeTruthy()` on a locator object, which is always truthy | assert the value, or `await expect(loc).toBeVisible()` |
| Bare throw (5) | `expect(fn).toThrow()` | - | `toThrow(TypeError)` or `toThrow(/insufficient/)` |
| Silent catch (6) | `try { await f() } catch (e) { expect(...) }` | same | `await expect(f()).rejects.toThrow(X)`, or `expect.assertions(1)` |
| Unawaited async (7) | missing `await` on `expect(...).resolves` | missing `await` on `expect(locator)` | await it; enable a floating-promise lint rule on test files |
| Snapshot only (4) | `toMatchSnapshot()` | `toHaveScreenshot()` as the sole assertion | assert the field or the text that carries the behavior |

Playwright's web-first assertions retry; the plain `expect` does not. `expect(await loc.textContent()).toBe('x')` reads a value once and is the usual cause of a "flaky" text assertion. `await expect(loc).toHaveText('x')` polls. This is the single most common Playwright slop in generated code.

## Waiting and time

| Tell | Slop | Fix |
| --- | --- | --- |
| Hardcoded wait (16) | `await page.waitForTimeout(2000)` | `await expect(loc).toBeVisible()`, `await page.waitForResponse(...)`, `await expect(loc).toHaveCount(3)` |
| Hardcoded wait, unit | `await new Promise(r => setTimeout(r, 50))` | `vi.useFakeTimers()` + `await vi.advanceTimersByTimeAsync(50)`, or Jest's `jest.useFakeTimers()` |
| Real clock (17) | `expect(row.createdAt).toBe(new Date().toISOString())` | `vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))`, then assert the literal |
| Unseeded random (18) | `faker.person.fullName()` | `faker.seed(1)` in setup, or inject the generator |
| Locale format (19) | `expect(cell).toBe('1 234,56 zł')` | pin `TZ` and locale in the runner config, or assert on `{ amount: 1234.56, currency: 'PLN' }` |

Playwright's `waitForLoadState('networkidle')` is a hardcoded wait wearing a technical name. It is discouraged by Playwright's own docs. Wait for the thing the test cares about.

## Test doubles

| Tell | Vitest | Jest | Fix |
| --- | --- | --- | --- |
| Mocking what you own (22) | `vi.mock('./internal-service')` | `jest.mock('./internal-service')` | inject the dependency, fake at the boundary |
| Assertion on the call (24) | `expect(spy).toHaveBeenCalledWith(...)` as the only assertion | same | assert the observable outcome, keep the call assertion as support at most |
| Stub that lies (23) | a hand-written object literal returned by `mockResolvedValue` | same | build the stub from the real schema, and add one contract test against the real dependency |
| Leaked mock state | no `vi.restoreAllMocks()` | no `jest.restoreAllMocks()` | `restoreMocks: true` / `restoreMocks` in config, so it is not per-file discipline |

In Playwright, `page.route()` is the boundary tool. Stubbing your own API in every test converts an end-to-end test into an expensive unit test. Do it deliberately and say which layer you are still covering.

## Structure

| Tell | Slop | Fix |
| --- | --- | --- |
| Loop-hidden cases (12) | `cases.forEach(c => it(...))` with one shared assertion, or a `for` loop inside one test | `test.each(cases)` (Vitest, Jest), `for (const c of cases) test(c.name, ...)` at the top level (Playwright) |
| God test (10) | one `test` with eight `await` steps and one assertion at the end | split, or keep one deliberate journey and use `test.step()` so the failure names the step |
| Order dependence (15) | state built in `beforeAll`, mutated per test | `beforeEach`, or a factory per test |
| UI login every test (40) | login steps in `beforeEach` | Playwright `storageState` from a setup project |

## Locators

| Tell | Slop | Fix |
| --- | --- | --- |
| Brittle locator (36) | `page.locator('div.MuiBox-root > div:nth-child(3) > button')` | `page.getByRole('button', { name: 'Save' })` |
| Positional (36) | `page.locator('.row').nth(0)` | `getByRole('row', { name: /Ada/ })` |
| Text a copy edit breaks | `getByText('Save changes now')` | `getByRole('button', { name: /save/i })`, or a test id for text that changes often |
| XPath | `page.locator('//div[2]/span')` | role, label, or test id |

Order of preference: role and accessible name, then label or placeholder, then test id, then text, then CSS. XPath last and rarely.

## Config-level tells

These are single lines that mask defects across a whole suite. Report them as Tier 1 even though they are not in a test file.

| Config | Why it is slop |
| --- | --- |
| `retries: 2` (Playwright) or a global retry plugin | every retried test is an open defect reporting itself as a pass |
| `testTimeout` raised globally | hides the slow path instead of finding it |
| `--passWithNoTests` in CI | a broken glob reports green |
| `bail: 1` in CI | one failure hides the rest of the run |
| coverage thresholds as the only gate | rewards pattern 8 |
| `fullyParallel: false` added to fix a flake | a shared-state bug, now permanent and slow |

A retry configured on CI only, so local runs are honest and CI is not, is worth calling out by name. It means someone already knows the suite is unstable.
