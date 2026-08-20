# Test Architecture Decision Record

Short, numbered, immutable. When a decision changes, write a new record that supersedes the old one rather than editing history.

Store as `docs/adr/NNNN-short-title.md`.

## Template

```markdown
# NNNN. [Decision in one line, present tense]

- **Status**: [Proposed / Accepted / Superseded by NNNN]
- **Date**: YYYY-MM-DD
- **Deciders**: [names]

## Context

[What forced the decision. Constraints, the problem being solved, what was true at the time.
Written so someone in two years understands the situation without asking anyone.]

## Decision

[What was decided. Present tense, active voice: "We run E2E tests against a real backend."]

## Alternatives considered

### [Alternative A]

- **Why it was attractive**: [...]
- **Why it was rejected**: [...]

### [Alternative B]

- **Why it was attractive**: [...]
- **Why it was rejected**: [...]

## Consequences

**Good**

- [...]

**Bad**

- [the costs the team accepted, stated plainly]

**Neutral**

- [what changed without being better or worse]

## Revisit when

- [the condition that would make this decision wrong]
```

The alternatives section carries most of the value. Without it, the next person who thinks of an alternative has no way of knowing it was already weighed, so the decision gets re-argued from zero.

The "revisit when" section is the second most valuable and the most often omitted. It converts a decision from permanent into conditional, which is what it actually is.

## Worked example

```markdown
# 0003. Real backend in E2E tests, mocks only for third parties

- **Status**: Accepted
- **Date**: 2026-03-04
- **Deciders**: [QA lead], [tech lead]

## Context

The E2E suite mocked all API responses through Playwright `route`. It ran in 90 seconds and
was completely stable. In Q1 it missed three production defects in a row, all of the same
shape: the frontend and backend disagreed about a response, and the mocks encoded the
frontend's belief. The suite was green through all three.

At the same time, staging had become reliable enough to test against, and seed data could be
created through the API in about 200ms per fixture.

## Decision

E2E tests run against a real backend on staging. Only systems we do not own are mocked:
the payment provider for negative cases, the address autocomplete provider, and analytics.

## Alternatives considered

### Keep mocking everything, add contract tests

- **Why it was attractive**: keeps the suite fast and stable; contract tests would catch
  the shape mismatches that hurt us.
- **Why it was rejected**: contract tests catch shape drift, not behavioural disagreement.
  Two of the three defects were behavioural: the backend applied a discount rule the
  frontend did not expect. A schema check would have passed.

### Mock at the network layer but record fixtures from the real backend nightly

- **Why it was attractive**: real shapes, still fast and deterministic.
- **Why it was rejected**: a nightly-refreshed fixture is up to 24 hours stale, and the
  refresh job becomes a thing to maintain and to trust. We judged the maintenance cost
  higher than the runtime cost of real calls.

## Consequences

**Good**

- The three defect classes above are now catchable.
- Seed data goes through the real API, so the seeding path is exercised too.

**Bad**

- Suite runtime went from 90 seconds to about 4 minutes. Mitigated by sharding to 4 workers.
- The suite now depends on staging being up. Two red builds in the first month were staging
  outages, not defects. We added a health check that fails fast with a clear message.
- Test data cleanup is now a real concern; every fixture cleans up in teardown.

**Neutral**

- Flake rate is unchanged, which we did not expect.

## Revisit when

- Staging availability drops below roughly 95 percent over a month.
- Suite runtime exceeds 10 minutes and sharding stops helping.
- A service mesh or ephemeral environment per pull request becomes available, which would
  remove the shared-staging contention that constrains this decision.
```

## Decisions worth recording

If it will be re-argued, record it.

| Decision | Why it gets re-argued |
| --- | --- |
| Runner and framework choice | Someone always prefers a different one |
| Page objects, fixtures, or both | The most durable style argument in test automation |
| What is mocked and what is real | Speed against fidelity, permanently in tension |
| Parallelization and isolation strategy | Comes back every time a test flakes |
| Environment strategy: shared, ephemeral, local | Cost against realism |
| Where tests live: colocated or separate tree | Aesthetic on the surface, structural underneath |
| Tag taxonomy | Grows organically unless a decision anchors it |
| Retry policy | Someone will propose more retries the next red Friday |
| What is deliberately not automated | Otherwise it reads as an oversight rather than a decision |
| An approach that was tried and abandoned | Without a record, it gets tried again |

That last row is the most valuable and the least written. A record of a failed approach saves the next person the whole experiment.

## Rules

- **One decision per record.** A record covering three decisions cannot be superseded cleanly.
- **Never edit an accepted record** except to change its status to superseded. The record is a snapshot of reasoning at a date; editing it destroys that.
- **Number sequentially**, never reuse a number.
- **Keep it short.** One page. A record nobody reads has no effect on anything.
- **Link it from the README**, or nobody will find it.
