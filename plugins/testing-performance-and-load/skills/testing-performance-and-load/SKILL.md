---
name: testing-performance-and-load
description: 'Designs and runs performance and load tests: workload modelling from real traffic, thresholds tied to SLOs, warmup and ramp shapes, percentile-based analysis, and lightweight CI perf checks with k6 or Artillery. Use when a feature has latency or throughput requirements, when "it feels slow" needs to become a number, when a launch needs a capacity check, or when a performance result needs interpreting rather than just collecting.'
argument-hint: 'System under test, the concern (latency, throughput, capacity, endurance), real traffic data if available, and the SLO or target if one exists'
user-invocable: true
---

# Testing Performance and Load

Use this skill when a system's speed or capacity is in question and the answer needs to be a number someone can act on.

Most performance testing produces numbers nobody uses. The two causes are always the same: **a workload that does not resemble reality**, and **a result reported as an average**. A test that hammers one endpoint with a flat 500 virtual users tells you how the system responds to something that will never happen, and a mean response time of 200ms is compatible with one user in twenty waiting four seconds.

## When to Use

- a feature has a stated latency or throughput requirement
- "the app feels slow" needs to become a measurement
- a launch, campaign, or migration needs a capacity check
- a performance regression is suspected between two releases
- a performance result exists and needs interpreting
- a CI check should catch obvious regressions before they ship

## Operating Principles

- **Model the workload before writing the script.** Test shape comes from real traffic: which endpoints, in what ratio, with what think time, at what concurrency.
- **Percentiles, never averages.** Report p50, p95, p99. The mean describes nobody's experience and hides the tail entirely.
- **A threshold without an SLO is a guess.** Derive the number from what users need or what the business promised, and say which.
- **One variable per run.** Comparing two runs that differ in load, data volume, and code changes tells you nothing about any of them.
- **Environment differences invalidate the number, not just weaken it.** A result from a quarter-size environment is a shape, not a capacity.
- **Find the bottleneck, do not just report the symptom.** "p95 is 3 seconds" is an observation; "p95 is 3 seconds because the product query has no index on `category_id`" is a finding.

## Workflow

### Phase 0: Name the question

Different questions need different tests. Pick one per run.

| Question | Test type | Shape |
| --- | --- | --- |
| Is it fast enough under normal load? | Load test | Steady state at expected concurrency |
| Where does it break? | Stress test | Ramp until failure |
| Does it survive a sudden surge? | Spike test | Step change up, then down |
| Does it degrade over hours? | Soak test | Steady load for 4 to 24 hours |
| Did this release make it slower? | Regression comparison | Identical shape, two builds |
| How much capacity do we have? | Capacity test | Ramp to the SLO breach point |

A test that tries to answer all six answers none. If "it is slow" is all you have, start with a load test at expected concurrency and let the result narrow the question.

### Phase 1: Model the workload

The phase that decides whether the result means anything. Work through `./resources/workload-model.md`.

From real traffic where possible:

- **Endpoint mix**: the actual ratio, from access logs or analytics. Reads usually outnumber writes by an order of magnitude, and synthetic tests usually get this wrong.
- **Concurrency**: derived from throughput and think time, not guessed. `concurrent users ≈ arrival rate × session duration`.
- **Think time**: real users pause. A test with zero think time is a different system entirely.
- **Data distribution**: most requests hit a small hot set. A test with uniformly random ids has a cache hit rate nothing like production.
- **Session shape**: users log in, browse, and act. A test that only calls the checkout endpoint skips the state that makes checkout slow.
- **Peak profile**: daily peak, weekly peak, and the campaign or event shape if there is one.

When real traffic is unavailable, state the assumptions explicitly and mark the result as assumption-dependent. An assumed workload is workable; an unstated one is not.

### Phase 2: Set thresholds from the SLO

Each threshold traces to something: a user need, a documented SLO, a competitor benchmark, or a current baseline you intend to hold.

`./resources/thresholds-and-slos.md` covers deriving them. The shape:

```js
thresholds: {
  'http_req_duration{name:checkout}': ['p(95)<800', 'p(99)<2000'],
  'http_req_failed': ['rate<0.001'],
  'checkout_completed': ['count>0'],
}
```

Rules:

- **per-endpoint, not global.** A global p95 mixes a health check with a report export and describes neither.
- **include an error rate threshold.** A fast 500 is not a pass, and a load test with no error threshold will report one as success.
- **include at least one business-outcome counter.** "Requests succeeded" is not the same as "orders were created", and a test that never completes a checkout can look perfect.

### Phase 3: Prepare the environment

Record every difference from production before running anything. The differences bound what the result can claim.

- **Sizing**: instance count, CPU, memory, relative to production
- **Data volume**: a database with 2,000 rows and one with 4 million behave differently, and the difference is not linear
- **Data shape**: long-lived accounts, large carts, deep histories
- **Caches**: cold or warm, and warmed how
- **Dependencies**: real, stubbed, or rate-limited. A stubbed dependency that responds in 1ms removes the queueing that production has.
- **Network**: the load generator's location relative to the system
- **Autoscaling**: enabled or fixed, and with what policy

Then decide where the load generator runs. A generator on the same machine as the system under test competes with it for CPU, and the result measures the contention.

### Phase 4: Warm up, then measure

- **Warmup**: run at low load until JIT compilation, connection pools, and caches settle. Exclude the warmup from the results, and say how long it was.
- **Ramp**: reach target load over minutes, not instantly, unless the spike is the subject.
- **Steady state**: long enough for the metric to stabilize. Ten minutes is usually the minimum for anything meaningful.
- **Ramp-down**: watch for errors during the descent; connection pool problems often surface here.

Monitor the system, not only the client. Client-side response times tell you something is slow; server CPU, memory, database connections, queue depth, and GC pauses tell you why. A run with no server-side observation produces a symptom and no cause.

### Phase 5: Analyze

Report distributions.

- **p50** is the typical experience
- **p95** is the experience of a noticeable minority
- **p99** is where the timeouts and abandonments live
- **max** is one data point, and it is usually a GC pause or a cold start

Look for the shapes in `./resources/perf-report-template.md`:

- **the knee**: throughput plateaus while response time climbs; that is the capacity limit
- **the sawtooth**: periodic latency spikes, usually GC or a cache expiry
- **the drift**: response time climbing over a soak; usually a leak or unbounded growth
- **the cliff**: sudden failure past a threshold, usually a pool or a connection limit

Correlate every latency feature with a server-side metric before naming a cause. A hypothesis without a correlating metric is a guess, and performance work built on a guessed bottleneck is expensive.

### Phase 6: Report and act

Use `./resources/perf-report-template.md`. It requires:

- the workload model, so the reader can judge whether it resembles reality
- environment differences from production, stated up front
- results as percentiles per endpoint, with the error rate
- the bottleneck, with the evidence for it
- what the result does **not** tell you
- a recommendation

Add a lightweight CI check when there is something worth protecting: a short run at modest load, thresholds set generously enough not to be flaky, and a comparison against the last release. Recipes in `./resources/k6-recipes.md`. Its job is catching an order-of-magnitude regression, not measuring capacity.

## Common Failure Modes

- reporting the average, which describes nobody and hides the tail
- a flat load with no think time and no ramp, which no real traffic resembles
- uniformly random test data, giving a cache behaviour production never has
- testing one endpoint in isolation when the slowness comes from contention between several
- no error rate threshold, so a run that returned 500s at speed is reported as a pass
- a test that never completes a business transaction while every request succeeds
- results from an environment a quarter the size, presented as capacity
- no warmup, so the first minute's cold-start latency poisons the percentiles
- naming a bottleneck from client-side numbers alone
- a CI perf gate so tight it flakes, then gets disabled and never re-enabled

## Resource Map

- `./resources/workload-model.md` - deriving the endpoint mix, concurrency, think time, and data distribution from real traffic, with a worked example
- `./resources/thresholds-and-slos.md` - deriving thresholds from SLOs, percentile choice, error budgets, and per-endpoint targets
- `./resources/k6-recipes.md` - k6 scripts for load, stress, spike, and soak shapes, plus the CI regression check and an Artillery equivalent
- `./resources/perf-report-template.md` - report structure, the four curve shapes and what each means, and a worked example

## Related Skills

- `assessing-release-readiness` - when a performance result feeds a go/no-go decision
- `analyzing-quality-metrics` - when performance should be trended across releases rather than measured once
- `testing-api-contracts` - when the endpoints under load also need shape verification
- `designing-test-data` - when the load test needs a realistic hot set and data distribution
- `handling-sensitive-test-data` - when load test data is derived from production traffic
- `automating-ci-test-pipelines` (planned) - for running the CI regression check and storing its history
- `tech-debt-analysis` - when the bottleneck is structural rather than a single query

## Definition of Done

This skill is complete when:

- the question is one of load, stress, spike, soak, regression, or capacity, and only one
- the workload model states endpoint mix, concurrency, think time, and data distribution, with its source or its assumptions
- thresholds are per-endpoint and each traces to an SLO, a user need, or a stated baseline
- an error rate threshold and at least one business-outcome counter are included
- environment differences from production are recorded before the run
- warmup is excluded from the results and its duration stated
- results are reported as percentiles, never as averages
- every latency finding is correlated with a server-side metric before a cause is named
- the report says what the result does not tell you
