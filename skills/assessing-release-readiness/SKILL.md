---
name: assessing-release-readiness
description: 'Produces an evidence-backed go/no-go recommendation: exit criteria status, open-defect risk profile, coverage against risk, environment parity, rollback readiness, and the residual risk stated plainly. Use when preparing a release sign-off, when someone asks whether a build is ready to ship, or when a decision to release is being made on impressions rather than evidence.'
argument-hint: 'Release candidate or version, scope of the change, test results, open defects, exit criteria if they exist, and the rollback plan'
user-invocable: true
---

# Assessing Release Readiness

Use this skill when a decision to ship has to be made and someone needs to state what is known, what is not, and what happens if the unknown part goes wrong.

Readiness is not "all tests are green". Green means the tests that exist passed. The question is whether the evidence covers the risk, and where it does not, whether the residual risk is acceptable and recoverable. A recommendation without a stated residual risk is not a recommendation, it is a hope.

## When to Use

- a release candidate needs sign-off
- someone asks "are we ready to ship this"
- a go/no-go meeting needs an evidence pack rather than opinions
- a hotfix needs a faster version of the same judgement
- a release shipped badly and the team wants a repeatable gate next time

## Operating Principles

- **Recommend, do not decide.** The recommendation is the tester's; the decision belongs to whoever owns the consequences. Make the trade explicit so they can own it.
- **Evidence or a gap, never a blank.** Every criterion is met, not met, or unverified. Unverified is a distinct and reportable state.
- **Coverage is judged against risk, not against percentage.** Ninety percent coverage of low-risk code and none of the payment path is a no-go dressed as a go.
- **Recoverability offsets uncertainty.** A change with a tested rollback and a feature flag tolerates far more residual risk than one without.
- **Absence of evidence is a finding.** "No one tested the migration on production-sized data" belongs in the report, in bold.
- **The recommendation survives contact with the reader.** Someone who was not involved can read it and reach the same conclusion.

## Workflow

### Phase 0: Fix the scope

Establish and write down:

- the exact build: version, commit, artifact, and where it is deployed
- what changed since the last release, from the changelog or diff
- who the release affects: all users, a cohort, one region, internal only
- the release mechanism: big bang, staged rollout, feature-flagged, canary
- the deadline and what is driving it

The release mechanism materially changes the answer. A flagged change behind a 1 percent canary needs different evidence than a database migration that everyone gets at once.

### Phase 1: Check exit criteria

If exit criteria exist, take them as written. If they do not, derive a minimum set from `./resources/exit-criteria-checklist.md` and say plainly that you derived them, because criteria invented at sign-off time are weaker than criteria agreed in advance.

For each criterion record: **met**, **not met**, or **unverified**, plus the evidence. A criterion with no evidence is unverified, not met.

### Phase 2: Profile the open defects

Not a bug count. For every open defect that touches the release scope:

| Field | Why |
| --- | --- |
| Severity and priority | They are different; record both |
| Affected journey | Which user, doing what |
| Frequency | How many users hit it, how often |
| Workaround | Exists, and whether the user can find it unaided |
| Detectability in production | Would monitoring catch it, or does a customer have to tell us |
| Reversibility | Can it be fixed forward quickly, or does it need a rollback |

A low-severity defect with no workaround, on the main journey, invisible to monitoring, is worse than a high-severity one on an admin screen. Rank by the combination, not by the severity label.

### Phase 3: Map coverage against risk

Take the risk areas from `analyzing-regression-scope` when a diff is available. For each area, state the evidence and its type:

| Risk area | Evidence | Type | Verdict |
| --- | --- | --- | --- |
| Payment capture | 14 API tests, 3 E2E, 1 exploratory session | Automated + manual | Covered |
| Refund path | Unit tests only | Automated, low level | **Thin** |
| Data migration | None on production-sized data | - | **Gap** |

Three verdicts only: covered, thin, gap. Resist "partially covered", which reads as covered in a summary.

A green test run tells you the tests passed. Add the question the run cannot answer: **would this suite have caught the last three production incidents?** If not, say so.

### Phase 4: Check the non-code readiness

The failures that produce the worst releases are usually not code. Work through `./resources/exit-criteria-checklist.md`, the operational section:

- **Environment parity**: how the tested environment differs from production, in data volume, configuration, integrations, and scale
- **Migrations**: tested forward, tested backward, timed against production-sized data, and reversible
- **Feature flags**: default state on release, who can flip them, tested in both states
- **Configuration and secrets**: present in the target environment, not just in stage
- **Third-party dependencies**: version compatibility, quota, and whether they were notified
- **Monitoring**: alerts exist for the new failure modes, and someone receives them
- **Support readiness**: known issues communicated, documentation updated
- **Rollback**: written, tested, and with a stated time-to-recover

An untested rollback is the same as no rollback. Say it in those words.

### Phase 5: State the residual risk

The section the report exists for. For each accepted risk:

- what could go wrong, in user terms
- how likely, based on what
- how it would be detected, and how fast
- what the response is
- who accepted it

`./resources/risk-register.md` has the format. A risk with no named acceptor is not accepted, it is ignored.

### Phase 6: Recommend

One of four, stated in one sentence and then justified:

| Recommendation | Meaning |
| --- | --- |
| **Go** | Evidence covers the risk. Residual risk is stated and accepted. |
| **Go with conditions** | Ship if the listed conditions hold: flag off by default, staged rollout, extra monitoring, a named person watching |
| **No-go** | A specific, nameable gap. Say exactly what would change the answer. |
| **Cannot assess** | Evidence is insufficient to judge. Say what is missing and how long it would take to get. |

"Cannot assess" is a legitimate and underused answer. It is honest where a hedged "go with some concerns" is not.

Every no-go names its unblocking condition. A no-go without one is a veto, and it will be overruled.

Produce the report with `./resources/go-no-go-template.md`.

## Common Failure Modes

- treating a green pipeline as readiness without asking what the suite covers
- counting open bugs instead of profiling them
- omitting what was not tested, so the reader assumes it was
- a recommendation with no residual risk section, which hides the trade instead of presenting it
- exit criteria written at sign-off time to match the evidence that happens to exist
- ignoring environment parity until the migration runs against real data volumes
- a rollback plan written and never executed
- hedging: "mostly ready, some concerns", which leaves the decision-maker with nothing to act on
- a no-go with no stated unblocking condition

## Resource Map

- `./resources/go-no-go-template.md` - full report structure with a worked example, plus a short hotfix variant
- `./resources/exit-criteria-checklist.md` - default criteria across functional, quality, operational, and organizational readiness
- `./resources/risk-register.md` - residual risk format, likelihood and detectability scales, and acceptance record

## Related Skills

- `analyzing-regression-scope` - to derive the risk areas from the diff before mapping coverage
- `verifying-acceptance-criteria` - when the question is whether individual criteria are met
- `requirements-test-coverage-mapper` - when traceability from requirements to tests is the evidence in question
- `planning-exploratory-testing` - when the coverage report shows gaps a session could close before the decision
- `analyzing-quality-metrics` - when the readiness signal should be trended across releases rather than judged once
- `testing-api-contracts` - when a breaking change is part of the release scope
- `reporting-bugs` - when the readiness review surfaces defects that need filing

## Definition of Done

This skill is complete when:

- the build, scope, affected users, and release mechanism are recorded exactly
- every exit criterion is marked met, not met, or unverified, each with its evidence
- open defects are profiled by impact, workaround, detectability, and reversibility rather than counted
- every risk area carries a verdict of covered, thin, or gap
- environment parity, migrations, flags, monitoring, and rollback are each assessed
- the rollback plan is confirmed as tested, or explicitly flagged as untested
- residual risks are listed with likelihood, detection, response, and a named acceptor
- the recommendation is one of go, go with conditions, no-go, or cannot assess, and any no-go names what would change it
- the report is readable by someone who was not part of the release
