# Mocking Decision Record

Keep this next to the fixtures or in the test suite README. One record per mocked dependency, not per test.

---

## [Dependency name]

- **Owned by us**: [yes / no]
- **Mocked at**: [Playwright route / HAR replay / MSW / module boundary / fake clock]
- **Applies to**: [which suites or tags]
- **Reason**: [the specific nondeterminism this removes: rate limit, cost, outage, wall clock, shared sandbox]

### What this stops the suite catching

- [e.g. breaking changes to the provider's response shape]
- [e.g. real latency and timeout behaviour]

### Drift guard

- **Type**: [contract check / HAR refresh / unmocked smoke test / none]
- **Command**: `[how to run or refresh]`
- **Cadence**: [per commit / nightly / per release / on demand]
- **Last verified**: [YYYY-MM-DD]

### Review trigger

- [what event should force a re-check: provider version bump, incident, spec change]

---

## Worked example

## Stripe payments API

- **Owned by us**: no
- **Mocked at**: Playwright `context.route` for negative cases; provider sandbox for the happy path
- **Applies to**: `@checkout` tagged E2E suite
- **Reason**: the sandbox cannot produce card-declined and 3DS-timeout responses on demand, and it rate-limits under parallel runs

### What this stops the suite catching

- changes to Stripe's error payload shape
- real 3DS redirect behaviour in the declined path
- rate-limit handling under production traffic patterns

### Drift guard

- **Type**: unmocked smoke test
- **Command**: `npx playwright test --grep @payments-live`
- **Cadence**: nightly against the sandbox
- **Last verified**: 2026-08-14

### Review trigger

- Stripe API version bump in `package.json`, or any payments incident
