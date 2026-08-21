# Detection Signals (JS/TS)

What counts as evidence that a practice is in place. Two signals matter and they are different: **configured** (the tool exists and is set up) and **enforced** (CI fails when it fails). PRESENT needs both.

## The state rules

| State | Requires |
| --- | --- |
| **PRESENT** | A configured signal **and** an enforced signal, both quoted |
| **PARTIAL** | Configured but not enforced, enforced but scoped away from most code, or demonstrably stale |
| **MISSING** | Neither signal found after looking in the places listed below |
| **WAIVED** | Absent by a recorded decision — reason, owner, expiry |
| **UNKNOWN** | Could not be determined (no CI access, generated config, monorepo indirection). Say what you would need. |

`UNKNOWN` exists because collapsing "could not tell" into `MISSING` produces a plan for work that may already be done, and destroys trust in the whole matrix the first time someone spots it.

## The enforcement traps

Check these before calling anything PRESENT. Each one is a check that runs and cannot fail:

- `continue-on-error: true` on the step or job
- `|| true`, `|| exit 0`, `|| echo "non-blocking"` appended to the command
- `--max-warnings` absent from an ESLint step, so warnings pass silently
- `set +e` in the surrounding script
- The job is not in the branch protection required-checks list
- The step runs only on a branch or schedule that is not the PR
- Thresholds set to `0` — a coverage gate at 0% is decoration

A step matching any of these is PARTIAL. Quote the exact line.

## Per-practice signals

### Dev gate

| Practice | Configured | Enforced | PARTIAL tells |
| --- | --- | --- | --- |
| `linting` | `eslint.config.*`, `.eslintrc*`, `eslint` in devDeps | CI step running `eslint` | no `--max-warnings 0`; large `ignorePatterns`; many inline `eslint-disable` |
| `type-safety` | `tsconfig.json` with `strict: true` | CI step running `tsc --noEmit` | `strict: false`, `skipLibCheck` plus loose flags, many `@ts-expect-error` |
| `formatting` | `.prettierrc*`, `prettier` in devDeps | CI `prettier --check` or a lint-staged hook | formatter installed but only run manually |
| `unit-testing` | `vitest.config.*` / `jest.config.*`, test files present | CI step running the suite | tests exist but only for utils; suite not in CI; `.skip` clusters |
| `secret-scanning` | `.gitleaks.toml`, gitleaks/trufflehog in CI, GitHub secret scanning on | CI step blocking | scans the diff but never the history; findings allowlisted without expiry |
| `dependency-audit` | `npm audit` step, `osv-scanner`, Dependabot/Renovate config | CI step with a severity gate | audit runs with `|| true`; alerts open for months |
| `no-skipped-tests` | lint rule (`no-only-tests`, `vitest/no-disabled-tests`) | CI enforcement | `.skip` present with no register |
| `coverage-rigor` | coverage provider config, `thresholds` block | CI gate on thresholds or diff coverage | repo-wide percentage only, no diff coverage; thresholds below current value |
| `duplication` | `jscpd` config, Sonar project | CI step | reported to a dashboard nobody gates on |
| `cognitive-complexity` | `eslint-plugin-sonarjs` or `complexity` rule enabled | lint step blocking | rule set to `warn` |

### Feature testing

| Practice | Configured | Enforced | PARTIAL tells |
| --- | --- | --- | --- |
| `integration-testing` | tests using real DB/HTTP, Testcontainers, `supertest` | CI job with services | integration tests exist but are excluded from the default run |
| `api-testing` | `request`-based specs, Playwright `apiRequest` fixtures | CI job | happy path only; no auth or validation cases |
| `contract-testing` | `openapi.*` plus a validator, Pact broker config | CI job | schema exists but nothing validates against it |
| `e2e-testing` | `playwright.config.*`, `e2e/` or `tests/` specs | CI job on PR | E2E only on a nightly schedule; `retries` high enough to hide flake |
| `visual-regression` | snapshot files, `toHaveScreenshot` usage | CI job with a baseline strategy | baselines generated locally, so they never match CI |
| `accessibility-automation` | `@axe-core/playwright`, `axe-core` in devDeps | CI job | axe imported but results not asserted |
| `sast` | `codeql-analysis.yml`, `semgrep.yml`, Sonar | CI job with a severity gate | scan uploads results; no gate |
| `dast` | ZAP action, a scan target URL | CI or scheduled job with a gate | scan runs against localhost with no app deployed |
| `property-based-testing` | `fast-check` in devDeps and used in specs | part of the suite | dependency present, zero usages |
| `mutation-testing` | `stryker.conf.*` | CI job or tracked score | config present, last run months old |
| `performance-testing` | k6/artillery scripts, `lighthouserc.*` | CI job with thresholds | scripts exist, no thresholds, results not compared |
| `flake-control` | retry config plus a quarantine register or dashboard | rate tracked against a threshold | `retries: 3` with no measurement — that is flake *hiding* |

### AI/LLM surface

| Practice | Configured | Enforced | PARTIAL tells |
| --- | --- | --- | --- |
| `llm-eval-suite` | `promptfooconfig.*`, `evals/`, `*.eval.ts`, deepeval/ragas | CI job gating on regressions | eval cases exist but run only locally; no golden expectations |
| `llm-output-guardrails` | Zod/Valibot schema on model output, moderation call, PII filter | tests covering rejection paths | schema parses on the happy path only; failures logged and ignored |
| `prompt-injection-resistance` | red-team config, adversarial fixtures, garak/pyrit | CI job | a handful of ad-hoc "ignore previous instructions" cases, no corpus |
| `groundedness-review` | review protocol doc, sampling record | attestation entry | claimed in a doc, no dated record |

### Human-centric (`manual-attestation`)

These cannot be detected — only attested. Look for a dated record, not a tool:

| Practice | Evidence of attestation |
| --- | --- |
| `code-review` | branch protection requiring an approving review; review history on merged PRs |
| `exploratory-testing` | charter and session notes for the current release |
| `manual-accessibility` | a dated keyboard/screen-reader pass record with findings |
| `uat` | a business sign-off record against acceptance criteria |
| `observability-readiness` | a dated readiness review naming detectable failure modes |

Rules: branch protection requiring one approval is evidence of `code-review` as a **process**, not evidence that a specific change was understood. Never mark a `manual-attestation` practice PRESENT from tooling alone — the highest state tooling can justify is PARTIAL, and the honest state is "attested on <date> by <person>" or "unattested".

### Governance

| Practice | Configured | Enforced |
| --- | --- | --- |
| `intent-rationale` | `Intent:`/`Intent-Ref:` trailers in `git log`, ADR directory, module intent register | commit-msg hook plus a CI check on high-risk surface |
| `comprehension-attestation` | `Comprehension-Attested-by:` trailers, teach-back record | advisory only — never enforced |
| `waiver-governance` | a waiver register with reason, owner, expiry per entry | expired waivers reported as findings |
| `release-readiness` | a go/no-go record per release | required before a release tag |

## Where to look

```
package.json                 scripts, dependencies, devDependencies, engines
package-lock.json            actual installed tool versions
eslint.config.*  .eslintrc*  tsconfig*.json  .prettierrc*
vitest.config.*  jest.config.*  playwright.config.*  stryker.conf.*
promptfooconfig.*  evals/  prompts/
.github/workflows/*.yml      the enforcement layer — read every step, not just names
.gitlab-ci.yml  azure-pipelines.yml  Jenkinsfile
.husky/  .lintstagedrc*  lefthook.yml     local gate layer
.github/dependabot.yml  renovate.json
sonar-project.properties  .gitleaks.toml  codecov.yml
turbo.json  nx.json  pnpm-workspace.yaml   monorepo indirection — the real config may be per package
```

In a monorepo, detect per package. A root-level `strict: true` that every package overrides is a false PRESENT, and one well-tested package does not make the repo tested.

## Staleness

A configured practice can be dead. Signals it is:

- lockfile pins a tool version several majors behind the config format in use
- the last snapshot or baseline update predates a major UI rewrite
- a CI job's workflow file references branches that no longer exist
- the eval suite's golden cases reference a model that has been retired

Stale is PARTIAL, and the remediation is different from MISSING: revive and re-baseline rather than introduce.
