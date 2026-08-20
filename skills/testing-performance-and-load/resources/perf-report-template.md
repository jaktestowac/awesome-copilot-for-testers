# Performance Report

---

# [System] performance: [scenario]

- **Question**: [load / stress / spike / soak / regression / capacity]
- **Build**: [version, commit]
- **Run date**: [YYYY-MM-DD], duration [x], tool [k6 x.y]
- **Run by**: [name]

## Verdict

> [One paragraph. Does it meet the target, where it does not, and what to do. Someone who reads only this should not be misled.]

## 1. Workload

[Link to the model, plus the summary.]

- Endpoint mix: [source, or "assumed"]
- Concurrency: [n] VUs, derived from [arrival rate] x [session duration]
- Think time: [range and distribution]
- Data: [hot set, distribution]
- Journeys: browse [%], shop [%], buy [%]

**Model source**: [access logs, date range / assumed, because ...]

## 2. Environment

| Dimension | Production | Test | Material |
| --- | --- | --- | --- |
| App instances | 12 | 3 | yes |
| Database rows (orders) | 4.1M | 180k | **yes** |
| Cache state | warm | warmed for 5m, excluded | no |
| Payment provider | real, ~400ms | stubbed, 5ms | **yes** |
| Autoscaling | 2 to 20 | fixed at 3 | yes |

Load generator: [where it ran, and whether it was resource-constrained].

## 3. Results

Percentiles per endpoint. Warmup excluded.

| Endpoint | Requests | p50 | p95 | p99 | max | Errors | Threshold | Pass |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GET /api/products` | 412,000 | 88ms | 241ms | 604ms | 3.1s | 0.01% | p95<300 | yes |
| `GET /api/search` | 58,000 | 210ms | 1.4s | 4.2s | 12.8s | 0.3% | p95<800 | **no** |
| `POST /api/checkout` | 19,400 | 340ms | 720ms | 1.9s | 6.4s | 0.02% | p95<800 | yes |

Business outcomes:

| Counter | Value | Threshold | Pass |
| --- | --- | --- | --- |
| Orders created | 19,396 | > 100 | yes |
| Checkout success rate | 99.98% | > 99% | yes |

Achieved throughput: [n] rps against a target of [n] rps. Dropped iterations: [n].

## 4. Shapes observed

Name the curve, then correlate it with a server-side metric before assigning a cause.

| Shape | Looks like | Usual cause | Seen here |
| --- | --- | --- | --- |
| **Knee** | Throughput plateaus while latency climbs | Capacity limit: CPU, pool, or a lock | Yes, at ~1,900 VUs |
| **Sawtooth** | Regular latency spikes on a fixed period | GC pauses, cache expiry, a cron job | No |
| **Drift** | Latency or memory climbing steadily over time | Leak, unbounded cache, connection accumulation | No (20m run, too short to tell) |
| **Cliff** | Sudden failure past a point, not gradual | Connection pool, file descriptors, a hard limit | Yes, at ~2,400 VUs |
| **Bimodal** | Two clusters in the distribution | Cache hit vs miss, or two code paths | Yes, on search |

## 5. Bottleneck

State the evidence, not just the conclusion.

> **Search p95 breaches its threshold at 1.4s against a target of 800ms.**
>
> Evidence:
> - Bimodal distribution: a cluster at ~180ms and one at ~2.1s, roughly 70/30.
> - Database CPU reaches 94% during the peak stage; the app instances stay under 40%.
> - Slow query log shows `SELECT ... FROM products WHERE category_id = ? AND name ILIKE ?`
>   averaging 1.8s, with a sequential scan on `products`.
> - `EXPLAIN` confirms no index covering `(category_id, name)`.
>
> The fast cluster is served from the query cache; the slow cluster is the sequential scan.
>
> **Not yet confirmed**: whether adding the index moves the bottleneck elsewhere. It should be
> re-run after the change rather than assumed fixed.

Client-side numbers alone can localize a symptom. Naming a cause requires a server-side metric that moves with it.

## 6. Capacity

Only when a capacity test was run.

- **SLO breach point**: ~1,900 concurrent VUs, where search p95 crosses 800ms
- **Failure point**: ~2,400 VUs, connection pool exhaustion
- **Peak production load**: 1,200 VUs
- **Headroom**: about 1.6x to SLO breach, 2x to failure
- **Scaled to production sizing**: **not transferable.** This environment has 3 of 12 instances and 4 percent of the data. Per-instance shape transfers; absolute capacity does not.

## 7. What this does not tell you

The section that stops the number being over-quoted.

- Payment provider latency was stubbed at 5ms against a real 400ms. Connection-holding under load is therefore unobserved, and pool exhaustion may occur earlier in production than at the 2,400 VU point found here.
- Database has 4 percent of production's rows. Query plans change above roughly 1M rows, so search may be worse in production than measured, not better.
- Autoscaling was disabled. Real scaling behaviour, including cold-start latency during scale-out, is unmeasured.
- 20-minute run: too short to detect drift or leaks.
- CDN absent, so static asset delivery is not represented.

## 8. Recommendations

| # | Action | Owner | Expected effect | Blocks release |
| --- | --- | --- | --- | --- |
| 1 | Add a composite index on `products(category_id, name)` | Backend | Search p95 to roughly 250ms; re-measure to confirm | **Yes** |
| 2 | Re-run with the payment provider delayed to 400ms | QA | Reveals pool behaviour under realistic dependency latency | Yes |
| 3 | Run an 8-hour soak before the campaign | QA | Detects drift, which this run cannot | No |
| 4 | Add a CI regression check on checkout and products p95 | QA | Catches order-of-magnitude regressions per release | No |

## 9. Comparison with the previous run

| Endpoint | Previous p95 | This p95 | Change |
| --- | --- | --- | --- |
| `GET /api/products` | 238ms | 241ms | flat |
| `GET /api/search` | 890ms | 1.4s | **+57%** |
| `POST /api/checkout` | 710ms | 720ms | flat |

Comparable? [yes / no, and what differed]. Only one variable should differ between compared runs. If load, data volume, and code all changed, the comparison attributes nothing.
