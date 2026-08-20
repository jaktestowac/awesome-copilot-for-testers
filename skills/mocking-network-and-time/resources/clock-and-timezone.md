# Clock, Timezone, and Locale

A time-dependent test needs three things pinned: the instant, the timezone, and the locale. Pinning two of the three still leaves a test that fails somewhere.

## Playwright

```ts
test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date('2025-03-11T10:00:00Z') });
});
```

Move time forward deliberately instead of waiting:

```ts
await page.clock.fastForward('02:00');           // two hours
await page.clock.runFor(1000);                   // one second of timers
await page.clock.setFixedTime(new Date('2025-12-31T23:59:30Z'));
```

`setFixedTime` stops the clock entirely, which is right for a rendered timestamp. `install` plus `fastForward` keeps timers working, which is right for a session-expiry banner.

Timezone and locale belong in the config, not in the test body:

```ts
// playwright.config.ts
export default defineConfig({
  use: {
    timezoneId: 'Europe/Warsaw',
    locale: 'pl-PL',
  },
});
```

Test another region as its own project rather than by mutating a shared default:

```ts
projects: [
  { name: 'warsaw', use: { ...devices['Desktop Chrome'], timezoneId: 'Europe/Warsaw', locale: 'pl-PL' } },
  { name: 'tokyo',  use: { ...devices['Desktop Chrome'], timezoneId: 'Asia/Tokyo',    locale: 'ja-JP' } },
],
```

## Vitest

```ts
import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2025-03-11T10:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
});
```

The `afterEach` restore is not optional. A leaked fake timer makes an unrelated later test hang until the suite times out, and the blame lands on the wrong file.

Advance explicitly:

```ts
await vi.advanceTimersByTimeAsync(30 * 60 * 1000);
await vi.runOnlyPendingTimersAsync();
```

Timezone comes from the process, so set it where the runner starts:

```jsonc
// package.json
"scripts": {
  "test": "TZ=Europe/Warsaw vitest run"
}
```

On Windows, use `cross-env` so the same script works everywhere:

```jsonc
"test": "cross-env TZ=Europe/Warsaw vitest run"
```

Or pin it in config so no shell is involved:

```ts
// vitest.config.ts
export default defineConfig({
  test: { env: { TZ: 'Europe/Warsaw' } },
});
```

## Jest

```ts
jest.useFakeTimers().setSystemTime(new Date('2025-03-11T10:00:00Z'));
afterEach(() => jest.useRealTimers());
```

```jsonc
// jest.config.js
{ "globalSetup": "<rootDir>/test/set-timezone.js" }
```

```js
// test/set-timezone.js
module.exports = () => {
  process.env.TZ = 'Europe/Warsaw';
};
```

## Choosing the pinned instant

- pick a date with no special properties as the default: a Tuesday, mid-month, mid-year, away from any DST boundary
- avoid the 1st and the 31st unless boundary behaviour is the subject
- avoid the current year if the fixture will outlive it; a hardcoded 2024 date is clearer about being fixed than one that happens to be today
- when the assertion reads a formatted date, assert against a value produced under the same pinned locale, never against a string you typed from memory

## Cases worth a deliberate test

| Case | Example instant | What it catches |
| --- | --- | --- |
| DST forward (hour skipped) | `2025-03-30T01:30:00Z` in `Europe/Warsaw` | Durations computed by subtracting local times |
| DST backward (hour repeated) | `2025-10-26T00:30:00Z` in `Europe/Warsaw` | Ambiguous local timestamps, duplicate scheduling |
| Leap day | `2024-02-29` | "Same day next year" arithmetic |
| Year boundary | `2025-12-31T23:59:59Z` | Reporting periods, sequence resets |
| Month-end rollover | `2025-01-31` plus one month | Billing date arithmetic |
| Negative UTC offset | `America/Los_Angeles` | Code that assumes offsets are positive |
| Half-hour offset | `Asia/Kolkata` | Code that assumes whole-hour offsets |
| Non-Gregorian locale formatting | `ar-SA`, `ja-JP-u-ca-japanese` | Hardcoded date parsing |

## Determinism beyond the clock

- **Random values**: inject a seeded generator rather than mocking `Math.random` globally, so the seam is visible in the signature.
- **UUIDs**: assert shape (`expect(id).toMatch(UUID_RE)`) rather than value, or inject an id factory.
- **Sort stability**: two records with identical timestamps sort unpredictably. Give fixtures distinct instants.
- **Animation**: prefer disabling animations at the config level over waiting them out. See `running-visual-regression-tests`.
