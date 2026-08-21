---
name: generating-quality-gate-workflows
description: 'Generates the CI workflow that enforces a quality contract: layered jobs from fast local hooks to release gates, per-practice steps for JS/TS toolchains, diff-scoped checks, sticky PR reporting, required-check wiring, and a severity policy deciding what fails the build. Use when quality practices are agreed but not enforced, when CI runs everything on every commit, when a gate reports green while the check it runs cannot fail, or when a per-change gate needs to post findings on the pull request.'
argument-hint: 'The agreed practices or the quality contract, the CI provider, the repo layout, and what should block versus warn'
user-invocable: true
---

# Generating Quality Gate Workflows

Use this skill to turn an agreed set of quality practices into CI that actually enforces them.

Two failures are common and opposite. A workflow that runs everything on every commit, so it is slow, so people stop gating on it. And a workflow full of steps that cannot fail - `|| true`, `continue-on-error`, thresholds at zero, jobs that are not required checks - so it reports green regardless. The second is worse, because it produces the *feeling* of a gate.

**A gate that cannot fail is worse than no gate.** Every rule here follows from that.

## When to Use

- a quality contract exists and nothing enforces it
- CI takes long enough that people ask to skip it
- a check runs but nobody can remember it ever failing
- a per-change gate should post findings on the PR
- a new practice needs introducing without blocking the whole team on day one
- someone asks why the build is green when the code clearly is not

## Operating Principles

- **Layer by feedback speed, not by topic.** Fast and bypassable locally; slow and mandatory in CI. Fast feedback that blocks gets disabled; enforcement that is bypassable gets bypassed.
- **No swallowed failures.** If a check is not ready to block, express that as a soft gate the provider renders as amber - never as a command that always exits zero.
- **Required, or delete it.** A job outside branch protection is advice with a CPU bill.
- **Gate on the diff.** Changed-line coverage, not a repo-wide floor. Changed paths, not the whole tree.
- **Trigger expensive jobs on what can affect them.** E2E, performance, evals and DAST get `paths:` filters derived from the change-relevance recipes.
- **Warn before blocking.** Report → warn → block on escalated paths → block everywhere. Straight to blocking on a legacy repo gets the gate reverted, and the reversal costs the credibility to try again.
- **One sticky comment per gate.** A new comment per push trains people to collapse the thread.
- **Every suppression is registered.** A `continue-on-error` or a lowered threshold carries a waiver id and an expiry in a comment.

## Workflow

### Phase 0: Take the inputs

- **The practices to enforce**, with their levels. From `.qa/quality-contract.md` if it exists; otherwise the agreed list, and say it is un-contracted.
- **The provider**: GitHub Actions or GitLab CI. They express soft gates differently, and that difference matters.
- **The repo layout**: single package or monorepo, workspace tool, where tests and coverage land.
- **The severity policy**: which practices block, which warn, and what the release path requires.

### Phase 1: Assign each practice to a layer

| Layer | Where | What belongs here | Blocking |
| --- | --- | --- | --- |
| **1 - Local** | pre-commit / pre-push hook | format, lint on staged files, typecheck, fast unit tests, secret scan | bypassable by design |
| **2 - CI, every PR** | deterministic jobs | lint with `--max-warnings 0`, strict typecheck, tests with no skips, diff coverage, duplication, SAST, dependency audit, contract checks | **yes** |
| **3 - Review** | review jobs and agents | assertion quality, standards review, security review | advisory or blocking, stated |
| **4 - Release** | pre-release pipeline | production readiness, performance thresholds, DAST, release sign-off | yes, on the release path |

The allocation rule: **anything a developer needs within seconds goes to layer 1 and must not block; anything the team relies on goes to layer 2 and must.**

### Phase 2: Write the jobs

`./resources/github-actions-jobs.md` and `./resources/gitlab-ci-jobs.md` have working per-practice steps for JS/TS: lint, typecheck, unit, diff coverage, E2E with sharding, contract validation, SAST, secret scan, dependency audit, accessibility, evals, mutation, performance.

Per-job hygiene, every time:

- pin action versions and images; a floating action is an unreviewed dependency inside the gate
- explicit `timeout-minutes`; a hung job is an unresolvable required check
- least-privilege `permissions:`, adding `pull-requests: write` only where a comment is posted
- `fetch-depth: 0` / `GIT_DEPTH: 0` wherever a merge base is needed
- cache dependencies, never test results
- no `retries` to mask flake - measure it and quarantine with an owner and a date
- concurrency groups so superseded runs cancel instead of queueing

### Phase 3: Set the severity policy

Make it explicit and put it in the repo, not in people's heads:

| Practice level | Verdict | CI behaviour |
| --- | --- | --- |
| MUST unmet on escalated surface | BLOCK | job fails, required check red |
| MUST unmet elsewhere | BLOCK or WARN per policy | fails, or soft-fails visibly |
| SHOULD unmet | WARN | soft gate, amber, visible |
| COULD unmet | INFO | reported, never fails |
| Advisory practices (comprehension) | NUDGE | reported, never fails, ever |

Then write the escape hatch: a suppression is allowed, it needs a waiver id and an expiry in a comment, and an expired waiver fails its own check (`governing-quality-waivers`). A gate with no documented escape hatch gets an undocumented one.

### Phase 4: Wire enforcement and reporting

- Add layer-2 jobs to **branch protection required checks**. Until then, nothing is enforced.
- Post **one sticky comment per gate**, keyed on a header so each run replaces its own.
- Annotate at line level where supported - `::error file=…,line=…`, GitLab coverage reports. Annotations get fixed; log lines get scrolled past.
- Report what the gate did **not** cover: suites excluded, exclusions in scope, jobs skipped on forks.
- **Handle forks explicitly.** Secret-dependent jobs must be skipped, not failed, on fork PRs, with the key-free subset running instead and the full job required on the default branch. A red required check on every external contribution gets the check removed.

### Phase 5: Verify the gate can actually fail

The step everyone omits. For each new blocking job, prove it works:

1. Break the thing it checks, on a scratch branch.
2. Confirm the job goes red and the PR is blocked.
3. Fix it, confirm green.

Specifically verify: the changed-line count is non-zero when the diff is non-empty (path matching is the usual silent failure), the threshold is above the current value rather than below it, and the job appears in required checks.

A gate nobody has watched fail is a gate nobody knows works. This is the same rule as "every guardrail needs a test that proves it fires".

## Common Failure Modes

- **`|| true` and friends.** `npm audit || true`, `tool || echo "non-blocking"`, `set +e`. Reports green whatever happens, and `continue-on-error: false` next to it reads as strictness.
- **Not a required check.** The most common reason a correct workflow enforces nothing.
- **Shallow clone with a diff-based check.** No merge base, empty diff, green check, nothing verified.
- **Repo-wide coverage floor on a legacy repo.** Set below current so it can only detect catastrophe, or unreachable so it gets deleted.
- **Everything on every commit.** Slow, expensive, and the reason someone eventually adds `paths-ignore: ['**']`.
- **Straight to blocking.** A new gate that blocks the whole team on day one gets reverted.
- **A fresh comment per push.** Signal buried under a collapsed thread.
- **Retries as flake control.** Green suite, unfixed race, and the flake rate goes unmeasured.
- **Secrets in fork PRs.** Either a permanently red check or, worse, a workflow that exposes secrets to untrusted code.

## Resource Map

- `./resources/github-actions-jobs.md` - per-practice GitHub Actions jobs, soft gates, sticky comments, fork handling, monorepo and sharding patterns
- `./resources/gitlab-ci-jobs.md` - the GitLab equivalents: `allow_failure`, `rules`, MR notes, coverage reports, and merge-request pipelines

## Related Skills

- `deriving-a-quality-contract` - supplies the practices, levels and thresholds this workflow enforces
- `scoping-change-relevance` - supplies the `paths:` filters for expensive jobs
- `verifying-change-coverage` - the diff-coverage job in detail, including artifact merging
- `governing-quality-waivers` - the suppression register and the expiry check this workflow runs
- `creating-hooks` - layer 1: local hooks, which must stay fast and bypassable
- `testing-llm-features` - the eval job, its trigger paths and its fork-safe form
- `assessing-release-readiness` - layer 4, where the release gate reports into

## Definition of Done

This skill is complete when:

- every contracted practice is assigned to a layer, and the layer matches its feedback speed
- no gate step can silently succeed; soft gates use `continue-on-error` / `allow_failure` rather than `|| true`
- diff-based checks fetch full history and fail when path matching produces an empty changed set
- expensive jobs have `paths:` filters, timeouts, pinned versions and least-privilege permissions
- the severity policy is written into the repo, with the waiver escape hatch and an expiry check
- blocking jobs are in branch protection, and fork behaviour is explicit
- each gate posts one sticky report stating what it did and did not cover
- every new blocking job has been watched to fail and then pass
