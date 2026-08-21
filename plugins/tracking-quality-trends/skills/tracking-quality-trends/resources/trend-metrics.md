# Trend Metrics

Six to eight metrics, each with a limit, a goal, an owner, an action at the limit, a caveat, and a known gaming risk. If a candidate metric cannot fill all six columns, it is a number, not a metric.

## Code and test metrics

### Diff coverage

- **Limit / goal:** ≥ 75% / ≥ 85% (per profile)
- **Measure:** `diff-cover coverage/lcov.info --compare-branch=origin/main`, per PR, aggregated per period
- **Caveat:** proves execution, not assertion quality
- **Gaming risk:** high — assertion-free tests satisfy it. Always pair with a periodic assertion-quality review (`unslop-tests`)
- **Action at limit:** the diff-coverage gate blocks; a period average below the limit means the gate is being waived too often

### Repo coverage direction

- **Limit:** must not decrease · **Goal:** slow rise
- **Measure:** coverage summary per run
- **Caveat:** a large denominator absorbs new gaps; this metric goes flat while new code goes untested
- **Note:** track direction only. An absolute repo-coverage target on a legacy codebase is unreachable or meaningless.

### Flake rate

- **Limit / goal:** < 1% / < 0.3%
- **Measure:** runs that passed only after a retry ÷ total runs, from CI history or a reporter
- **Caveat:** only measurable if retries are recorded. `retries: 3` with no telemetry means flake is being hidden, and the honest reading is "unknown"
- **Gaming risk:** medium — quarantining flaky tests improves the rate without fixing anything. Track the quarantine count beside it
- **Action at limit:** stop adding tests to the suite until it is under control; an untrusted suite teaches people to ignore red

### Suite duration (p95)

- **Limit / goal:** < 10 min / < 5 min for the PR gate
- **Measure:** CI job duration, p95 over the period
- **Caveat:** rising duration predicts shortcuts — skipped hooks, `--no-verify`, requests to make jobs non-blocking
- **Action at limit:** parallelise or split before anyone proposes weakening the gate

### Escaped defects

- **Limit / goal:** trending down
- **Measure:** defects found in production ÷ defects found in total, per period
- **Caveat:** depends on consistent triage; a change in how bugs are labelled breaks the series
- **Note:** the most meaningful outcome metric here and the slowest to move. Do not read a single period.

## Contract and governance metrics

### Contracted practices PRESENT

- **Limit / goal:** all MUST practices PRESENT
- **Measure:** the gap matrix from `deriving-a-quality-contract`
- **Caveat:** PRESENT means configured *and* enforced — recheck for fake gates each run
- **Note:** report as `MUST 11/12 · SHOULD 6/9 · COULD 2/7`, never as a single percentage

### Blockers open

- **Limit / goal:** 0 / 0
- **Measure:** count of MUST practices in state MISSING
- **Action at limit:** any non-zero value is the top line of the report

### Waivers: count, expired, oldest

- **Limit / goal:** 0 expired, none older than 180 days
- **Measure:** the waiver register
- **Caveat:** count alone hides age; a stable count of four can be four increasingly stale waivers
- **Note:** track renewals too. A waiver renewed three times is a contract change that never got made.

### Suppressions total

- **Limit / goal:** trending down
- **Measure:** the silent-skip inventory (`governing-quality-waivers`), same commands each run
- **Caveat:** raw count treats a whole-file `eslint-disable` the same as one inline disable. Track "whole-file and whole-directory suppressions" as a second, smaller number
- **Gaming risk:** low, which is unusual and part of why it is worth tracking

### Intent coverage on high-risk changes

- **Limit / goal:** ≥ 50% / ≥ 80% (per profile)
- **Measure:** high-risk changes carrying a valid rationale ÷ high-risk changes
- **Caveat:** measures presence, not quality. A period of `Intent: refactor` records would score well and mean nothing — sample and read a few

### Comprehension risk band

- **Limit:** none — advisory
- **Measure:** share of changes in the high band; modules with a single author and no reviewer
- **Caveat:** measures absence of evidence, not understanding. **Never gate on it**

## AI/LLM metrics

### Eval pass rate per capability

- **Limit / goal:** no regressions against baseline
- **Measure:** the eval suite, split by capability
- **Caveat:** never aggregate. A global 89% can hide an 11-point drop in one capability
- **Note:** a method break happens on every model or case-set change. Record both versions with the reading

### Eval cost and p95 latency

- **Limit / goal:** per budget
- **Measure:** recorded per run by the suite
- **Caveat:** a cost rise can be a quality *gain* someone paid for. Read it beside the pass rate, never alone

### Adversarial findings open

- **Limit / goal:** 0 effective findings
- **Measure:** the red-team suite, split into effective and latent
- **Note:** track untested channels as a separate number. Three untested content channels matter more than the pass rate on the tested ones

## Metrics not to trend

| Candidate | Why not |
| --- | --- |
| Test count | grows by writing bad tests; says nothing about coverage of risk |
| Lines of code | not a quality property in either direction |
| Bugs found by QA | rises when the product gets worse *and* when testing gets better |
| Commits or PRs per developer | activity, not quality, and it changes behaviour the moment it is displayed |
| Story points delivered | not a quality metric, and it will be read as one |
| Aggregate "quality score" | combines incomparable things and hides every movement inside it |

The rule: **if a metric would change someone's behaviour in a way you would not want, do not display it.** Test count is the clearest example — it goes up reliably the moment it appears on a dashboard, and none of that rise is quality.

## Measurement discipline

Record with every reading:

```json
{
  "metric": "diff-coverage",
  "value": 71.4,
  "unit": "percent",
  "date": "2026-08-21",
  "commit": "a3f91c2",
  "method": "diff-cover 9.2.0, lcov from vitest 3.x, unit suite only",
  "scope": "packages/api, packages/web",
  "sample": "42 merged PRs this period"
}
```

The `method` and `scope` fields are what let a future reader distinguish a real change from a measurement change. Without them, the first tooling upgrade silently invalidates the whole series and nobody notices for two quarters.

When the method changes: **do not backfill.** Start a new series, keep the old one visible, and mark the break in the report. A visible discontinuity is honest; a smooth line built from two different methods is not.
