---
applyTo: '{.github/workflows,.github/actions}/**,.gitlab-ci.yml'
description: 'Rules for CI quality gates: gate layers, no swallowed failures, soft gates expressed as soft gates, diff-scoped checks, required-check wiring, and sticky PR reporting.'
---

# Quality gate workflow rules

## Goal

A gate that **cannot fail is worse than no gate**, because it reports green and nobody looks again. Every rule here follows from that.

## Layers

Keep the layers separate and put each check where it survives:

| Layer | Where | Contains | Blocking |
| --- | --- | --- | --- |
| 1 - Local | pre-commit / pre-push hook | format, lint on staged files, typecheck, fast unit tests, secret scan | bypassable by design |
| 2 - CI, every PR | deterministic jobs | lint `--max-warnings 0`, strict typecheck, tests with no skips, diff coverage, duplication, SAST, dependency audit | **yes** |
| 3 - Agentic review | review jobs or agents | assertion quality, standards review, security review | advisory or blocking, stated explicitly |
| 4 - Release | pre-release | production readiness, performance thresholds, DAST, readiness sign-off | yes, on the release path |

Fast feedback that blocks gets disabled. Enforcement that is bypassable gets bypassed. Layer 1 is fast and skippable; layer 2 is the real gate.

## Never swallow a failure

Banned in any gate step:

```yaml
- run: eslint .                    # ❌ no --max-warnings 0: warnings pass silently
- run: npm audit || true           # ❌ always succeeds
- run: mypy src || echo "warnings" # ❌ always succeeds
  continue-on-error: false         # ❌ and this reads as strict
- run: vitest run --coverage --coverage.thresholds.lines=0   # ❌ a 0 threshold is decoration
```

If a check is not ready to block, **express that as a soft gate** rather than hiding it behind a passing command:

```yaml
# GitHub Actions
- name: Mutation score (soft)
  run: npx stryker run
  continue-on-error: true # visible as a soft failure, not a fake pass
```

```yaml
# GitLab CI
mutation:
  script: npx stryker run
  allow_failure: true # first-class soft gate
```

The difference matters: `continue-on-error`/`allow_failure` shows an amber result, while `|| true` shows green. One is a stated trade-off; the other is a lie.

## Required checks

- A job that is not in the branch-protection required list is **advice with a CPU bill**. Add it, or delete the job.
- Do not gate on a job that only runs on `schedule` or `workflow_dispatch` - it will never be present on a PR.
- Do not gate on a job that is skipped for forks; make forks run the key-free subset instead, and require the full job on the default branch.

## Diff-scoped checks

- Gate coverage on **changed lines**, not on a repo-wide floor. Repo coverage gets a separate, weaker rule: it must not decrease.
- Use `fetch-depth: 0` (GitHub) or `GIT_DEPTH: 0` (GitLab) for anything that needs a merge base. A shallow clone silently produces an empty diff - a green check that verified nothing.
- **Fail the job when the changed-line count is zero but the diff is non-empty.** That means path matching broke, and it is otherwise indistinguishable from success.
- Use `paths:` filters to trigger expensive jobs (evals, E2E, performance) only on the changes that can affect them.

## Determinism and hygiene

- Pin action versions (`actions/checkout@v4`) and container images by tag or digest; a floating action is an unreviewed dependency in the gate.
- Set an explicit `timeout-minutes` on every job. A hung job is an unresolvable required check.
- Set least-privilege `permissions:` per job; add `pull-requests: write` only where a comment is posted.
- Never `echo` a secret, and never pass one into a step that runs untrusted PR code.
- Cache dependencies, never test results.
- No `retries` in CI test config to mask flake - measure the flake rate instead and quarantine with an owner and a date.

## Reporting

- One **sticky comment per gate**, keyed on a header so each run replaces its own. A new comment per push trains people to collapse the thread.
- Report the verdict, the per-file detail worst-first, and - explicitly - what the check did **not** cover: suites excluded, exclusions in scope, checks skipped.
- Annotate at the line level where the provider supports it (`::error file=…,line=…`, GitLab coverage reports). An annotation gets fixed; a log line gets scrolled past.

## Rolling out a new gate

Report → warn → block on escalated paths (auth, migrations, endpoints, critical path) → block everywhere. Introducing a gate straight into blocking on a legacy repo is how gates get reverted, and the reversal costs the credibility to try again.

## Waiver discipline

Any suppression added to a workflow - `continue-on-error`, a lowered threshold, an allowlisted advisory, a skipped path - carries a comment with its waiver id and expiry:

```yaml
- run: npm audit --audit-level=critical # W-007: transitive advisory, no patch, expires 2026-10-01
```

An unregistered suppression in CI is a silent skip. See `governing-quality-waivers`.
