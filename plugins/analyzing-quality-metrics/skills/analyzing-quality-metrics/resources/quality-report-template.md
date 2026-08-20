# Quality Report

For a recurring stakeholder report. Lead with what changed and what to do about it; put the numbers underneath.

---

# Quality report: [period]

**Audience**: [team / engineering leadership / product]
**Decisions this report supports**: [list them; if the list is empty, do not send the report]

## Headline

[Three sentences. What moved, why it probably moved, what should happen next. Someone who reads only this paragraph should not be misled by it.]

## What we recommend

1. [action, owner, expected effect on which metric]
2. [action, owner, expected effect on which metric]

## Trends

### Suite health

| Metric | This period | Last period | 6-period trend | Note |
| --- | --- | --- | --- | --- |
| Pass rate (pre-retry) | 96.2% | 94.8% | up | |
| Skipped tests | 31 | 22 | **up** | 9 added during the auth migration |
| Quarantined tests | 12 | 9 | **up** | Oldest is 94 days |
| Flake rate (30d) | 2.1% | 3.4% | down | 8 of the 12 quarantines came from the flake list |
| Suite duration p95 | 18m40s | 21m10s | down | Sharding raised from 4 to 8 |

**Interpretation**: the flake rate improved, and roughly two thirds of that improvement came from quarantining rather than fixing. Real improvement is smaller than the headline. The 94-day quarantine is past the 30-day expiry policy and should be fixed or deleted.

Note the pairing. Reporting the flake rate alone here would have been misleading and technically accurate.

### Coverage

| Area | Risk | Coverage verdict | Mutation score | Note |
| --- | --- | --- | --- | --- |
| Payment | High | Covered | 78% | |
| Refunds | High | **Thin** | 41% | Unit tests only, no integration |
| Import | Medium | **Gap** | - | No tests at any level |
| Admin | Low | Covered | 62% | |

Line coverage overall: 84%. **This measures which lines execute during tests, not which behaviours are verified.** The mutation scores above are the number that answers "do these tests prove anything".

### Defects

| Metric | This period | Last period | Trend |
| --- | --- | --- | --- |
| Escape rate | 11% | 17% | down |
| Median time to detect | 3.2 days | 6.1 days | down |
| Change failure rate | 8% | 7% | flat |
| Open defects touching high-risk areas | 4 | 6 | down |

Escape rate excludes: third-party outages (2), infrastructure incidents (1).

**Interpretation**: escape rate and time to detect both improved. Two plausible causes: the contract tests added in [month] are catching API drift before release, or this period simply had less risky change in it. The changed-line volume was 30 percent lower than last period, so the second explanation is doing some of the work. Watch the next period before claiming the contract tests caused it.

## Events on the timeline

| Date | Event | Metrics affected |
| --- | --- | --- |
| [date] | Auth migration merged | Skip count, flake rate |
| [date] | Sharding raised to 8 | Suite duration |
| [date] | CI outage, 2 days | Data gap in pass rate |

## Data gaps

- [dates]: no CI data, runner outage. Not interpolated.
- Mutation score covers 4 of 11 modules; the rest are not yet run.

## Corruption check

Run this period: [yes / no]. Findings:

- Pass rate up while skip count up. Flagged in the interpretation above.
- No metric currently appears in an individual's objectives.

---

## Charting rules

- trend line, not a single bar
- denominator visible on the chart or in its label
- events annotated as vertical markers
- gaps drawn as gaps, never bridged
- same window for anything presented side by side
- the caveat in the chart title where one exists ("Line coverage, measures execution not verification")

## What to leave out

- any metric with no decision attached
- individual-level data of any kind
- precision the measurement does not support (84%, not 84.27%)
- a metric whose definition changed mid-period without a series break

## Cadence

| Report | Cadence | Audience |
| --- | --- | --- |
| Suite health | Weekly, automated | Team |
| Full quality report | Per release or monthly | Engineering leadership |
| Corruption check | Quarterly | Whoever owns the metrics |

Automate the weekly one. A report a human assembles by hand every week stops being assembled, and then the trend has a hole in it.
