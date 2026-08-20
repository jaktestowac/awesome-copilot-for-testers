# When to Mock

Every mock trades fidelity for determinism. This table gives the default for each cell. Deviate deliberately and write down why.

## Decision table

| Dependency | Unit test | Component / integration test | End-to-end test |
| --- | --- | --- | --- |
| Your own pure logic | Real | Real | Real |
| Your own module across a seam | Mock the seam | Real | Real |
| Your own HTTP API | Mock | Mock or real, pick one per suite | **Real** |
| Your own database | Mock or in-memory | Real, per-test isolation | Real |
| Third-party API you pay for | Mock | Mock | Mock |
| Third-party widget / iframe | Not applicable | Mock or stub the frame | Mock, or route-abort and assert graceful degradation |
| Payment provider | Mock | Provider sandbox | Provider sandbox, mocked for negative cases |
| Email / SMS delivery | Mock | Capture inbox (Mailpit, Mailhog) | Capture inbox |
| Auth provider | Mock | Real with a seeded test account | Real, with storage state reused |
| Clock and timers | Fake | Fake | Fake, or pick dates far from boundaries |
| Randomness / UUIDs | Seed or inject | Seed or inject | Assert shape, not value |
| Feature flags | Inject | Set explicitly per test | Set explicitly per test |
| Analytics / telemetry | Mock | Route-abort | Route-abort |
| File storage / CDN | Mock | Local emulator | Real or emulator |

## The fidelity cost of each choice

Write the cost down next to the decision. These are the usual ones.

| Choice | What it stops catching |
| --- | --- |
| Mock your own API in E2E | Contract breaks between frontend and backend, serialization bugs, auth middleware, real error shapes |
| Mock a third-party API | Their breaking changes, rate limits, real latency, undocumented field behaviour |
| Recorded HAR replay | Anything that changed since the recording date |
| Fake clock | Real scheduling, timer leaks, timeouts that only appear under real elapsed time |
| In-memory database | Constraint violations, migrations, transaction and isolation behaviour, query performance |
| Provider sandbox instead of production | Production-only rules: fraud checks, regional restrictions, real settlement timing |
| Route-abort analytics | Nothing worth catching. This one is nearly free. |

## Signals you have mocked too much

- the suite is green while the feature is broken in the same commit
- deleting the implementation and keeping only the mocks leaves tests passing
- a test file has more lines of handler setup than of assertion
- the mocks encode behaviour nobody can point to in a spec or a captured response
- an incident review concludes "the tests could never have caught this"

## Signals you have mocked too little

- the suite fails when a vendor has an outage
- run time is dominated by network waiting
- tests fail on the first working day of a month, quarter, or year
- a test needs a coworker to not be using the shared sandbox account
- retries were added to make the suite green

## Ordering rule

When more than one option removes the nondeterminism, prefer in this order:

1. Make the dependency controllable for real (seeded data, test account, injectable clock).
2. Intercept at the network boundary (MSW, Playwright `route`).
3. Replay recorded traffic (HAR).
4. Mock the module boundary.

Lower down the list means more coupling to your own code structure and more drift risk. Go as far down as you must and no further.
