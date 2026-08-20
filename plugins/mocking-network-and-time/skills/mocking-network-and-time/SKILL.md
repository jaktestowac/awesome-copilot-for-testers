---
name: mocking-network-and-time
description: 'Decides what to fake and stubs it correctly: network interception with Playwright route or HAR replay, MSW handlers, fake clocks, and fixed timezones. Use when a test depends on a third party, when a date-sensitive test breaks overnight, when a suite is slow because it calls real services, or when a mocked test stays green while production is broken.'
argument-hint: 'Test files or flows to stabilize, the dependency in question (API, third party, clock, timezone), and the test level'
user-invocable: true
---

# Mocking Network and Time

Use this skill when a test is unreliable, slow, or unrepeatable because it reaches something the test cannot control: someone else's API, the wall clock, the machine's timezone, or a payment sandbox that rate-limits on Fridays.

Mocking buys determinism and pays for it in **fidelity**. Every mock is a claim about how the real dependency behaves, and that claim rots silently. The skill is not "how do I stub this", it is "what should stay real, what should be faked, and how do I find out when a fake has drifted from the thing it imitates".

## When to Use

- a test fails only when a third-party sandbox is down or slow
- a date-sensitive test passes in November and fails on 1 January
- a suite takes minutes because every test hits a real backend
- a test passes with a mock while the same flow is broken in production
- a team is deciding between MSW, Playwright `route`, and a real test environment
- fixtures were recorded once and nobody knows whether they still match the API

## Operating Principles

- **Mock the boundary you do not own.** Third-party APIs, payment providers, email, clocks, randomness. Your own code under test stays real.
- **Fidelity is the constraint, determinism is the goal.** Reach for the least fidelity loss that removes the nondeterminism.
- **A mock is a contract copy, so verify the original.** Any mocked response shape needs a periodic check against the real API, or it becomes a test that proves your fixtures agree with themselves.
- **Fail loudly on unmocked traffic.** A handler set that silently passes unknown requests through hides both new dependencies and typos in URLs.
- **Freeze time explicitly, never implicitly.** Pin the instant, the timezone, and the locale together. Two of the three is still a flaky test.
- **State the fidelity you gave up.** Every mocking decision is written down with what it stops catching.

## Workflow

### Phase 0: Name the nondeterminism

Before choosing a tool, say what exactly is uncontrolled. One of:

- **external service** - a system you do not deploy
- **internal service** - a system your team owns, deployed separately
- **time** - now, durations, timers, expiry, scheduling
- **environment** - timezone, locale, random values, IDs, ports
- **data** - state left over from other tests or other people

A test can suffer more than one. Fix them separately; a single "make it deterministic" change that touches all four is unreviewable.

### Phase 1: Decide what stays real

Work through `./resources/when-to-mock.md`. It maps test level against dependency type and gives the default for each cell.

The two defaults worth stating up front:

- **Unit and component tests**: mock everything across the process boundary.
- **End-to-end tests**: keep your own stack real. Mock only what you do not own or cannot control.

If the answer is "mock our own API in an end-to-end test", the test has stopped being end-to-end. Say so and either accept it as an integration test or keep the backend real.

### Phase 2: Pick the interception layer

| Layer | Tool | Use when |
| --- | --- | --- |
| Browser network | Playwright `page.route` / `context.route` | E2E, stubbing a third party or forcing an error response |
| Recorded traffic | Playwright HAR replay | E2E against a large read-only API surface you do not want to hand-write |
| Application fetch layer | MSW (`setupServer` / `setupWorker`) | Component and integration tests, shared handlers across runners |
| Module boundary | Runner mocks (`vi.mock`, `jest.mock`) | Unit tests, and only when the seam is your own module |
| Clock | Playwright `clock`, `vi.useFakeTimers` | Anything time-dependent |
| Process env | `TZ`, `LANG`, seeded random | Timezone, locale, and ID determinism |

Recipes for each are in `./resources/playwright-route-recipes.md`, `./resources/msw-recipes.md`, and `./resources/clock-and-timezone.md`.

Prefer the highest layer that solves the problem. Mocking at the module boundary to fix a network problem couples the test to your import graph and survives no refactor.

### Phase 3: Write the stub

Every stub carries four things:

1. **A precise matcher.** Match method and path, not a bare substring. A loose glob that also catches the analytics beacon will hide the day the real call disappears.
2. **A realistic body.** Status, headers, and content type that the real service actually returns. Copy from a captured response, not from memory.
3. **The failure cases.** A stub that only ever returns 200 tests one branch. Add the 4xx, the 5xx, the timeout, and the malformed body that your error handling claims to survive.
4. **Unhandled-request enforcement.** `onUnhandledRequest: 'error'` in MSW, or an explicit catch-all route that fails the test in Playwright. Default to strict.

### Phase 4: Control time and environment

When time matters:

- pin the instant (`clock.setFixedTime` / `vi.setSystemTime`) to a date with no special properties, and one that is not near a DST boundary unless DST is the thing under test
- pin the timezone through config or `TZ`, never rely on the CI agent's default
- pin the locale when any assertion reads formatted dates, numbers, or currency
- advance time explicitly rather than waiting for it; a test that sleeps to let a timer fire is a slow test with a race in it

`./resources/clock-and-timezone.md` has the per-runner spellings and the DST and leap-day cases worth a deliberate test.

### Phase 5: Guard against drift

A mock without a drift guard becomes false documentation. Pick at least one:

- **A contract check** against the real spec or a live sample, run on a schedule rather than per commit. Hand off to `testing-api-contracts`.
- **A refresh command** for recorded HAR files, documented next to the fixtures, with the date of the last refresh recorded.
- **A thin real-dependency smoke test** that exercises the same endpoint unmocked, tagged so it can be excluded from the main run.

Record which guard applies. "None" is an acceptable answer only for a dependency that is genuinely frozen, and it still gets written down.

### Phase 6: Record the fidelity trade

Close with a short note next to the stub or in the test README:

- what is mocked and at which layer
- what the mock stops the suite from catching
- what guards the mock against drift, and when it was last verified

Use `./resources/mocking-decision-record.md`.

## Common Failure Modes

- mocking your own backend in a test you still call end-to-end, then trusting it as release evidence
- a handler set that passes unknown requests through, so a renamed endpoint silently keeps testing nothing
- stubs that only return success, next to error-handling code no test ever executes
- a single giant HAR recorded eighteen months ago, refreshed by nobody, matched loosely
- fake timers installed without restoring them, so an unrelated later test hangs on a real timeout
- freezing the clock but not the timezone, so the suite passes in Warsaw and fails in the CI region
- reaching for `vi.mock` on a module to solve what is actually a network problem

## Resource Map

- `./resources/when-to-mock.md` - decision table by test level and dependency type, with the fidelity cost of each choice
- `./resources/playwright-route-recipes.md` - `route`, `fulfill`, `abort`, request modification, and HAR record and replay
- `./resources/msw-recipes.md` - node and browser setup, handler patterns, strict unhandled-request config, per-test overrides
- `./resources/clock-and-timezone.md` - fake clocks, fixed timezone and locale, DST and leap-day cases, per-runner spellings
- `./resources/mocking-decision-record.md` - short template for recording the fidelity trade and the drift guard

## Related Skills

- `testing-api-contracts` - when the mock needs a drift guard against the real specification
- `ui-playwright-test-developer` (planned) - when the stub is part of a wider browser test being written or refactored
- `api-playwright-test-developer` - when the API side of the flow is under construction
- `writing-unit-tests` - when the question is about test doubles at the module boundary rather than the network
- `stabilizing-flaky-tests` (planned) - when nondeterminism remains after the network and clock are controlled
- `unslop-tests` - when the suite is mock-heavy and may be proving nothing

## Definition of Done

This skill is complete when:

- the nondeterminism is named and classified, not just suppressed
- the decision about what stays real is explicit and matches the test level
- every stub matches precisely, returns a realistic body, and covers at least one failure branch
- unhandled requests fail the test rather than passing through
- time-dependent tests pin instant, timezone, and locale together
- each mock has a named drift guard or a written statement that it has none
- the fidelity given up is recorded where the next reader will find it
