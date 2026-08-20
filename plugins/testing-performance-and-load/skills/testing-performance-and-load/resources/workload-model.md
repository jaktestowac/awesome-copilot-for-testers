# Workload Model

The model decides whether the result means anything. Write it down before the script.

---

# Workload model: [system], [scenario]

## Source

- [ ] Access logs, [date range]
- [ ] Analytics, [tool and range]
- [ ] APM traces, [tool and range]
- [ ] **Assumed**, because [reason]

Mark assumptions loudly. An assumed model is workable; an unstated one produces a number that gets quoted as fact.

## Endpoint mix

From real traffic, over a representative window that includes a peak.

| Endpoint | Method | Share of requests | Note |
| --- | --- | --- | --- |
| `/api/products` | GET | 42% | Catalogue browsing |
| `/api/products/{id}` | GET | 27% | |
| `/api/cart` | GET | 14% | Polled by the header component |
| `/api/cart/items` | POST | 9% | |
| `/api/search` | GET | 6% | Most expensive per request |
| `/api/checkout` | POST | 2% | The one that matters commercially |

Two things a synthetic model usually gets wrong:

- **The read/write ratio.** Real traffic is heavily read-dominated; hand-built scenarios are not.
- **The polling endpoints.** A header component polling the cart every 30 seconds can dominate request volume and never appears in a user journey description.

## Concurrency

Derive it; do not pick a round number.

```
concurrent users ≈ arrival rate (sessions/second) × average session duration (seconds)
```

| Input | Value | Source |
| --- | --- | --- |
| Peak sessions per hour | 18,000 | Analytics, [date] |
| Arrival rate | 5/s | Derived |
| Average session duration | 240s | Analytics |
| **Concurrent users at peak** | **1,200** | Derived |
| Requests per session | 24 | Access logs |
| **Peak request rate** | **120 rps** | Derived |

Test at peak, and at 1.5x or 2x peak for headroom. Testing at "500 users" because it sounds like a lot produces a number with no relationship to anything.

## Think time

Real users pause between actions. Zero think time turns a load test into a throughput benchmark of a workload nobody generates.

| Action | Think time | Distribution |
| --- | --- | --- |
| Browse to product | 3 to 12s | Uniform-ish |
| Add to cart | 1 to 4s | |
| Checkout form | 20 to 90s | Long tail; people leave and come back |

Use a distribution, not a constant. Constant think time produces synchronized waves of requests that create artificial contention.

```js
sleep(randomIntBetween(3, 12));
```

## Data distribution

The difference between a realistic cache hit rate and a meaningless one.

| Aspect | Production | Test plan |
| --- | --- | --- |
| Product access | Top 5% of products get 60% of views | Weighted selection from a hot set |
| Search terms | Long tail, 200 terms cover 80% | Sample from a real term list |
| Cart size | Median 2 items, p95 8, max seen 140 | Distribution, plus one large-cart scenario |
| Account age | Half the sessions are on accounts over a year old | Seed accounts with history |

Uniformly random ids across a million products give a near-zero cache hit rate and a database working set nothing like production. This single choice can change results by an order of magnitude.

## Session shape

Users do not call one endpoint. Model the journey.

```
Browse (70% of sessions)
  home -> category -> product -> product -> exit

Shop (25%)
  home -> search -> product -> add to cart -> cart -> exit

Buy (5%)
  home -> category -> product -> add to cart -> cart -> checkout -> confirmation
```

Weight the virtual users accordingly. A test where every user checks out generates a write load the system will never see, and misses the read contention that makes checkout slow in production.

## Peak profile

| Pattern | Shape | Test as |
| --- | --- | --- |
| Daily peak | 3x baseline for 2 hours, weekday evenings | Load test at peak |
| Weekly peak | Sunday evening, 1.4x the daily peak | Load test at 1.4x |
| Campaign | 8x within 5 minutes of the email send | Spike test |
| Batch job | Nightly reindex overlapping late traffic | Load test with the job running |

The last row is the one teams forget. Background jobs contend for the same database, and a load test run at 10am against an idle system misses it entirely.

## Environment delta

Everything here bounds what the result can claim.

| Dimension | Production | Test | Material |
| --- | --- | --- | --- |
| App instances | 12 | 3 | yes; scale the target load accordingly and say so |
| Database size | 4.1M orders | 180k | **yes; query plans differ above roughly 1M rows** |
| Cache | Warm, 94% hit rate | Cold at start | yes; warm it up and exclude the warmup |
| Payment provider | Real, ~400ms | Stubbed, 5ms | **yes; removes queueing that exists in production** |
| CDN | Yes | No | yes for static assets, not for API results |
| Autoscaling | Enabled, 2 to 20 | Fixed at 3 | yes; the test cannot show scaling behaviour |

A stubbed slow dependency is the most commonly missed one. Replacing a 400ms external call with a 5ms stub removes the connection-holding that produces pool exhaustion under load, which is often the real bottleneck.

## What this model does not cover

- [e.g. mobile app traffic, which uses a different API version]
- [e.g. the admin panel, excluded as internal-only]
- [e.g. WebSocket connections, not modelled]

---

## Worked derivation

> Analytics show 18,000 sessions in the peak hour on Sunday evenings. Sessions average 4 minutes,
> so roughly 1,200 users are concurrent at peak. Access logs give 24 requests per session, which
> is 120 rps.
>
> Of those sessions, 5 percent reach checkout. The endpoint mix above comes from a full Sunday's
> access log. Product access follows a hot-set distribution: the top 5 percent of products account
> for 60 percent of views, so the script selects from a weighted list rather than uniformly.
>
> Test plan: load test at 1,200 VUs for 20 minutes after a 5-minute warmup, then a second run at
> 2,400 VUs for headroom. The environment has 3 app instances against production's 12, so a
> per-instance comparison is the only valid one, and the absolute capacity number is not
> transferable.
>
> The payment provider is stubbed at 5ms against a real 400ms. This removes connection-holding
> under load, so pool exhaustion cannot be observed in this run. Flagged as a gap; a separate
> run with an injected 400ms delay is planned.
