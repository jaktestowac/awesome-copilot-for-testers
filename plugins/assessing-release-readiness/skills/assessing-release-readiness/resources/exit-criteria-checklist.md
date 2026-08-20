# Exit Criteria Checklist

Use the team's agreed criteria when they exist. When they do not, derive a set from here and label it as derived, because criteria written after the evidence are weaker than criteria written before it.

Mark each: **met**, **not met**, or **unverified**. Unverified means nobody looked, which is different from met and different from failed.

## Functional

- [ ] Every acceptance criterion in scope is verified, with evidence
- [ ] All P0 and P1 defects in scope are closed, or explicitly deferred with a named acceptor
- [ ] Deferred defects have a workaround, or their absence is recorded
- [ ] The regression suite passes on this exact build, not on a similar one
- [ ] **Skipped and quarantined tests have been reviewed**, and none of them cover this release's scope
- [ ] Manual test cases for the changed area are executed, or their omission is deliberate
- [ ] Exploratory sessions covering the risk areas are done and debriefed

The skipped-tests line is the one most often missing. A suite with 40 skips is a suite with 40 unmeasured claims.

## Quality attributes

- [ ] Performance of the changed paths measured against the previous release, not just against a threshold
- [ ] No new accessibility violations at the level the product commits to
- [ ] Security review done for changes touching auth, permissions, payment, or personal data
- [ ] Error handling verified for the new failure modes, not only the happy path
- [ ] Localization checked when text, dates, currency, or layout changed
- [ ] Browser and device matrix covered per the support policy

## Data and migration

- [ ] Migration runs forward on a production-sized dataset, and the duration is recorded
- [ ] Migration is reversible, and the reversal has been executed at least once
- [ ] Migration is idempotent, or safe to re-run after a partial failure
- [ ] Data created by the previous version renders and behaves correctly
- [ ] Backfills, if any, have a plan and a monitoring signal
- [ ] No personal data is copied into non-production environments as part of the work

## Environment parity

Record the differences rather than asserting parity.

| Dimension | Stage | Production | Material? |
| --- | --- | --- | --- |
| Data volume | | | |
| Data shape (long-lived accounts, legacy records) | | | |
| Configuration and flags | | | |
| Integrations (real vs stubbed) | | | |
| Scale and instance count | | | |
| Network and CDN | | | |
| Auth provider | | | |

Any row marked material is a limit on how much the test evidence transfers.

## Operational

- [ ] Deployment procedure documented and rehearsed
- [ ] Rollback plan written **and executed at least once**, with a measured time-to-recover
- [ ] Feature flags: default state decided, both states tested, and someone can flip them out of hours
- [ ] Configuration and secrets present in the target environment
- [ ] Monitoring covers the new failure modes; a new code path with no signal is invisible
- [ ] Alerts route to someone who is actually on duty at release time
- [ ] Log volume and cost impact considered for anything chatty that was added
- [ ] Third-party quotas and rate limits sufficient for the expected change in traffic

## Organizational

- [ ] Support has the known-issues list and the workarounds
- [ ] User-facing documentation and release notes updated
- [ ] Stakeholders know the release window and the rollback criteria
- [ ] A named person owns the release during and after the window
- [ ] The rollback decision-maker is identified and reachable

## Deriving criteria when none exist

Ask three questions and let the answers select the sections:

1. **What would make us roll this back?** Those conditions become the must-verify criteria.
2. **What did we roll back for last time?** Historical failure modes become criteria.
3. **What can we not undo?** Migrations, sent emails, external side effects, published data. Anything irreversible gets the strictest criteria in the set.

The third question deserves the most weight. Reversible mistakes tolerate uncertainty; irreversible ones do not.

## Anti-patterns

| Pattern | Why it fails |
| --- | --- |
| "Zero known defects" | Drives defects underground or postpones the release forever |
| "Coverage above 80 percent" | Measures line execution, not risk. See `analyzing-quality-metrics` |
| "All tests pass" as the only criterion | Says nothing about what the tests cover |
| Criteria written at the go/no-go meeting | They will match the evidence that happens to exist |
| Criteria with no evidence field | Unverifiable, so it becomes a checkbox exercise |
| A criterion nobody owns | Never assessed, silently assumed met |
