# Trend Report Template

Written to `.qa/trends.md`, regenerated each cadence, with the previous run archived under `.qa/history/<date>/`.

---

# Quality Trend — <project>

**Period:** 2026-06-13 → 2026-08-21 (release 2026.08) · **Previous:** 2026-06-13
**Profile:** standard · **Maturity:** walk · **Commit:** `a3f91c2`

## Direction

**Degrading.** Coverage and practice count improved, but the coverage threshold was lowered in the same period and the E2E job stopped running on pull requests. Net enforcement is weaker than it was two months ago.

That paragraph is the report. Everything below supports it.

## Metrics

| Metric | Limit | Prev | Now | Goal | Dir | Caveat |
| --- | --- | --- | --- | --- | --- | --- |
| Diff coverage | 75% | 62% | 71% | 85% | ↑ 9pp | gate threshold lowered to 60% this period — see structural changes |
| Repo coverage | no decrease | 68% | 69% | — | ↑ 1pp | inside noise |
| Flake rate | < 1% | unknown | 2.4% | 0.3% | new | first period with retry telemetry; no baseline |
| Suite duration p95 | < 10 min | 7m 20s | 12m 40s | 5 min | ↑ 73% | **third consecutive rise** |
| MUST practices PRESENT | 12/12 | 10/12 | 11/12 | 12/12 | ↑ 1 | PRESENT = configured and enforced |
| Blockers open | 0 | 2 | 1 | 0 | ↓ 1 | `coverage-rigor` remains |
| Waivers (expired / oldest) | 0 / 180d | 3 (0 / 92d) | 4 (1 / 141d) | — | ↓ | W-003 expired 20 days ago |
| Suppressions (whole-file) | trending down | 39 (1) | 46 (2) | — | ↑ 7 | second whole-file disable added |
| Intent coverage | ≥ 50% | 18% | 26% | 80% | ↑ 8pp | presence only; sampled 5, two were restated diffs |
| Comprehension high band | advisory | 22% | 31% | — | ↑ 9pp | **advisory — never blocks** |

## Structural changes

The section no snapshot contains.

**Gained:**

- `dependency-audit` → PRESENT (`|| true` removed, gate now blocks on critical)
- `secret-scanning` → PRESENT (gitleaks added, full history)

**Regressed:**

- `e2e-testing` PRESENT → PARTIAL — the job moved to `schedule` on 2026-07-14, so it no longer runs on pull requests

**Thresholds and gates changed:**

| Change | When | Effect |
| --- | --- | --- |
| Diff coverage threshold 75% → 60% | 2026-07-02 | the 9pp coverage rise is measured against a weaker gate |
| `mutation` job `continue-on-error: true` | 2026-07-19 | was blocking, now soft |
| Playwright `retries: 1` → `3` | 2026-08-04 | flake now hidden rather than measured; the 2.4% reading is a floor |

**Contract edits:** `visual-regression` moved SHOULD → COULD on 2026-07-22, no waiver, no recorded reason. Check this was deliberate.

## Governance

- Waivers: 4 active, **1 expired** (W-003, `integration-testing` on `src/billing/**`, INFRA-412 still open), oldest 141 days, W-002 renewed twice
- Suppressions: +7, including a second whole-file `eslint-disable` (`src/legacy/sync.ts:1`)
- Unregistered suppressions: 39 of 46 carry no waiver id

## Findings

1. **The coverage gain is partly a threshold change.** Diff coverage rose 9pp while its gate fell 15pp. Real coverage improved; enforcement did not. Restore the threshold to 75% or record the reduction as a contract change with an owner.
2. **Suite duration has risen for three consecutive periods** (7m20 → 9m50 → 12m40). Magnitude aside, the direction is the finding — this is the period before someone asks to make the gate non-blocking.
3. **Flake is being hidden, not fixed.** `retries: 3` means the 2.4% reading is a lower bound. Cap retries at 1 and measure honestly before setting a limit.
4. **`e2e-testing` regressed five weeks ago and nothing reported it.** A snapshot would still show a Playwright config and call it present.
5. **W-003 expired 20 days ago** — `src/billing/**` has had no integration coverage since, and the blocking ticket is still open.
6. **Intent coverage is rising but thin.** Two of five sampled records were restated diffs. The number is improving faster than the practice.

## Series breaks

- **Flake rate** starts this period. Retry telemetry was added 2026-06-20; no comparable earlier value exists.
- **Diff coverage** method unchanged (diff-cover 9.2.0, unit suite only), but the **gate** changed. Values are comparable; enforcement is not.

## What this report cannot see

- Assertion quality. Coverage rose; whether the new tests assert anything was not measured this period.
- Integration-suite coverage. The diff-coverage number is unit-only, so integration-covered code reads as uncovered.
- Escaped defects. Triage labels changed in July, so the series is broken and omitted.
- Whether the comprehension band reflects real risk. It measures absence of evidence, and three high-band modules have not had a teach-back.

---

## History layout

```
.qa/
  trends.md
  quality-contract.md
  history/
    2026-05-02/{contract.md, metrics.json, gap.json}
    2026-06-13/{contract.md, metrics.json, gap.json}
    2026-08-21/{contract.md, metrics.json, gap.json}
```

`metrics.json` per run:

```json
{
  "date": "2026-08-21",
  "commit": "a3f91c2",
  "profile": "standard",
  "maturity": "walk",
  "metrics": [
    {
      "id": "diff-coverage",
      "value": 71.4,
      "limit": 60,
      "goal": 85,
      "method": "diff-cover 9.2.0, lcov from vitest 3.x, unit suite only",
      "scope": "packages/api, packages/web",
      "sample": "42 merged PRs"
    }
  ],
  "gates": [
    { "practice": "e2e-testing", "blocking": false, "changed": "2026-07-14", "was": true }
  ]
}
```

The `gates` array is what makes finding 4 possible. Recording whether each gate blocks — and when that last changed — is the difference between a trend report and a prettier snapshot.

## Writing rules

- **Lead with direction, in one paragraph, with the reason.** If a reader stops after it, they should still have the finding.
- **Never report a metric movement without its gate.** A number that improved because its threshold fell has not improved.
- **Mark noise as noise.** A ±2pp coverage move on a small release is not a finding, and labelling it as one trains people to skip the report.
- **Three periods in one direction is always a finding**, whatever the magnitude. Slow drift is what thresholds never catch.
- **Print each caveat inline.** A footnote is a caveat nobody reads.
- **Close with what you could not see.** A trend report that implies full visibility is the same failure as a gap matrix with no UNKNOWN state.
