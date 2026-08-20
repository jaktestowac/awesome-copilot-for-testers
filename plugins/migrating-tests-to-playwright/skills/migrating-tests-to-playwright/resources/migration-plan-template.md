# Migration Plan

---

# [Source framework] to Playwright

- **Source suite**: [path], [n] tests, [runtime], [flake rate]
- **Target**: Playwright [version]
- **Owner**: [name]
- **Started**: [date] | **Projected finish**: [date, updated honestly each report]
- **Architecture decision**: [link to the ADR fixing the target shape]

## Why

[Two or three sentences. The reason has to survive being read at the 60 percent mark, when the migration is expensive and the old suite still works.]

## Inventory

| Class | Count | Note |
| --- | --- | --- |
| Port | 90 | Reliable, meaningful assertions |
| Rewrite | 20 | Flaky or over-mocked; intent survives, code does not |
| Merge | 12 into 5 | Duplicate coverage |
| Drop | 30 | Removed features, permanently skipped, or prove nothing |
| Defer | 8 | Real coverage, low risk, expensive to port |
| **Source total** | **160** | |
| **Target total** | **~115** | |

Triage evidence: [link to the `unslop-tests` audit of the source suite].

The drop list is not a loss. State the coverage it removes in the "Deliberately dropped" section below so the decision is visible rather than silent.

## Slices

| # | Slice | Source tests | Target tests | Status | Parity | Deleted |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | Toolchain proof (login smoke) | 3 | 3 | Done | [link] | [commit] |
| 1 | Checkout (highest risk) | 28 | 22 | Done | [link] | [commit] |
| 2 | Flaky account settings | 19 | 14 | In progress | - | - |
| 3 | Catalog and search | 34 | 28 | Not started | - | - |
| 4 | Admin | 41 | 30 | Not started | - | - |
| 5 | Notifications | 25 | 18 | Not started | - | - |

Slice order: thin proving slice, then highest risk, then most flaky, then the rest by cohesion.

**A slice is not done until its "Deleted" cell has a commit.**

## Progress

| Metric | Start | Now | Target |
| --- | --- | --- | --- |
| Source tests remaining | 160 | 119 | 0 |
| Playwright tests | 0 | 39 | ~115 |
| Source suite runtime | 22 min | 16 min | - |
| Playwright suite runtime | - | 3m 40s | under 8 min |
| Source flake rate (30d) | 8.2% | 7.9% | - |
| Playwright flake rate (30d) | - | 0.4% | under 1% |
| CI jobs running | 1 | 2 | 1 |

The last row is the one to watch. It returns to 1 only when the last slice lands, and it is the honest measure of whether the migration is finishing.

## Deliberately dropped coverage

One list, maintained across every slice. This is what stops the migration from quietly reducing coverage.

| Area | Source tests dropped | Why | Accepted by |
| --- | --- | --- | --- |
| Legacy PDF export | 6 | Feature removed in [release] | [name] |
| IE11 compatibility | 11 | Out of the support policy since [date] | [name] |
| Password strength meter | 4 | Covered by unit tests on the same function | [name] |
| Bulk import | 8 | Deferred, not dropped; tracked in [issue] | [name] |

## Both-suites overlap policy

While two suites run:

- **The source suite is not extended.** New tests are written in Playwright, in the target shape, even for areas not yet migrated.
- **A defect in a not-yet-migrated area** gets its regression test in Playwright, which pulls that slice forward.
- **The source suite is not maintained beyond keeping it green.** No refactors, no new page objects, no new helpers.
- **Overlap deadline**: [date]. Past this date, the migration is escalated rather than allowed to drift.

Without an overlap deadline, the two-suite state becomes permanent. Set one and report against it.

## Risks

| Risk | Mitigation |
| --- | --- |
| Migration stalls at partial completion | Slices end in deletions; the CI job count is reported weekly |
| New suite has thinner coverage than believed | Parity gate requires the deliberate-break check per slice |
| Team learns Playwright while under delivery pressure | The thin proving slice comes first; the ADR fixes conventions before scale |
| Source suite rots during the overlap | Overlap deadline, and no extension of the source suite |

## Report format

Weekly, three lines:

> Slice 2 of 5 in progress. 39 of ~115 target tests written, 41 source tests deleted.
> Two CI jobs still running; overlap deadline [date], on track.
> Blocked on: nothing / [specific thing].

A migration that stops being reported is a migration that stops.

---

## Estimating

Rough per-test figures for a first estimate, to be replaced with real numbers after the proving slice:

| Class | Effort per test |
| --- | --- |
| Port, simple | 15 to 30 min |
| Port, complex flow | 1 to 2 h |
| Rewrite | 2 to 4 h |
| Merge | 1 to 2 h for the merged result |
| Drop | 5 min, mostly the decision |

Add, once per migration:

- architecture decision and conventions: 1 to 2 days
- CI setup, reporting, and artifacts: 1 to 2 days
- auth and data fixtures: 1 to 3 days, and this one is usually underestimated
- the team's Playwright learning curve: real, and largest during the first slice

Recalibrate after the proving slice. An estimate built from these figures and never revised is a schedule nobody believes by week three.
