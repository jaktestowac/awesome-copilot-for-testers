# Thresholds and SLOs

A threshold is a pass/fail line. Every one of them traces to something, or it is a number someone made up that a team will later argue about.

## Where a threshold can come from

| Source | Example | Strength |
| --- | --- | --- |
| A documented SLO | "99% of checkout requests under 1s" | Strongest; it is already a commitment |
| A user-need study | "Above 3s, abandonment rises sharply" | Strong |
| A contractual obligation | An enterprise SLA | Strong, and non-negotiable |
| A current baseline you intend to hold | "p95 is 640ms today; do not regress past 750ms" | Good for regression gates |
| A competitor benchmark | "Their search returns in 300ms" | Weak alone, useful as context |
| A round number someone likes | "Under 500ms" | None. Ask what it is protecting |

When the only available source is the last row, say so in the report. A threshold with no derivation still functions as a gate; it just cannot settle an argument about whether it is the right gate.

## Human-perception anchors

Useful when no SLO exists, as a starting point rather than an answer.

| Duration | Perception |
| --- | --- |
| under 100ms | Instant |
| 100ms to 300ms | Fast, no feedback needed |
| 300ms to 1s | Noticeable; the flow of thought survives |
| 1s to 3s | Slow; needs a loading indicator |
| 3s to 10s | Attention wanders; abandonment rises |
| over 10s | Assumed broken |

These are about perceived responsiveness of an interaction, not about API calls in isolation. A page composed of six API calls in sequence inherits the sum.

## Choosing the percentile

| Percentile | What it describes | Use for |
| --- | --- | --- |
| p50 | The typical experience | Understanding normal behaviour |
| p95 | 1 user in 20 is worse off than this | The main SLO target for most systems |
| p99 | 1 in 100; where timeouts and abandonment live | High-value flows: checkout, login, payment |
| p99.9 | 1 in 1,000 | Only at scale, and only when a single bad request is costly |
| max | One data point | Investigation, never a threshold |

Never use the mean. A mean of 200ms is compatible with 95 percent of users at 100ms and 5 percent at 2 seconds, and the second group is the one that leaves.

**Compose percentiles when a journey has several calls.** If a page makes 6 sequential calls each meeting p95 < 200ms, its p95 is not 200ms; tail effects compound. Set a journey-level threshold as well as per-endpoint ones.

## Per-endpoint, not global

A global threshold mixes a health check with a report export and describes neither.

```js
export const options = {
  thresholds: {
    // Fast paths
    'http_req_duration{name:health}':   ['p(95)<50'],
    'http_req_duration{name:products}': ['p(95)<300', 'p(99)<800'],

    // The commercial path: tighter, because abandonment costs money
    'http_req_duration{name:checkout}': ['p(95)<800', 'p(99)<2000'],

    // Known-expensive, deliberately looser
    'http_req_duration{name:export}':   ['p(95)<8000'],

    // Errors: a fast 500 is not a pass
    'http_req_failed': ['rate<0.001'],
    'http_req_failed{name:checkout}': ['rate<0.0001'],

    // Business outcome: the test must actually complete transactions
    'checkout_completed': ['count>100'],
    'checkout_success_rate': ['rate>0.99'],
  },
};
```

The last block is the one most often missing. A load test where every HTTP call returns 200 and no order is ever created looks like a pass and proves nothing.

## Error budgets

An SLO implies a budget, and the budget is what makes the SLO actionable.

| SLO | Allowed failure | Per 30 days |
| --- | --- | --- |
| 99% | 1% | 7h 12m |
| 99.5% | 0.5% | 3h 36m |
| 99.9% | 0.1% | 43m |
| 99.95% | 0.05% | 21m |
| 99.99% | 0.01% | 4m |

Two things this makes visible:

- **Each nine costs roughly ten times more than the last.** 99.99% means every deploy, dependency, and cloud incident fits in four minutes a month.
- **A load test that breaches the SLO for two minutes has consumed half a month's budget at 99.99%.** That framing turns "it was a bit slow during the spike" into a number.

## Latency and availability together

Define the SLO so that slow counts as failed, or the availability number will be met by a system nobody can use.

> 99.9% of checkout requests complete successfully **in under 2 seconds**, measured over 30 days.

Without the latency clause, a request that eventually returns after 45 seconds counts as available.

## Thresholds for a CI regression gate

Different job, different tuning. The CI gate catches order-of-magnitude regressions; it does not measure capacity.

- **Compare against the last release**, not against an absolute number, so the gate tracks the system as it changes
- **Allow generous drift**, around 20 to 30 percent. A gate tight enough to flake gets disabled within a month and never re-enabled
- **Use p95, not p99.** Short CI runs do not have enough samples for a stable p99
- **Fail on the error rate strictly.** Errors are not noisy in the way latency is

```js
thresholds: {
  'http_req_duration{name:checkout}': [`p(95)<${BASELINE_P95 * 1.3}`],
  'http_req_failed': ['rate<0.01'],
}
```

Store the baseline as a committed file updated deliberately, not as a rolling average that silently absorbs regressions one release at a time.

## Documenting a threshold

Each one gets a line:

| Endpoint | Threshold | Derived from | Owner | Reviewed |
| --- | --- | --- | --- | --- |
| `POST /api/checkout` | p95 < 800ms | SLO in [doc], set from abandonment analysis | Payments team | 2026-06-01 |
| `GET /api/products` | p95 < 300ms | Current baseline 240ms plus 25% headroom | Catalogue team | 2026-06-01 |
| `GET /api/export` | p95 < 8s | Product decision: acceptable for an async-feeling action | Product | 2026-02-14 |

Review dates matter. A threshold set against a 2023 baseline on a system that has been rewritten twice is measuring nothing in particular.
