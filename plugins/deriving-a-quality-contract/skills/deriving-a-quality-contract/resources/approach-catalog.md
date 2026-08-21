# Practice Catalog (JS/TS)

Thirty quality practices, each with its tier, the maturity level at which it enters the contract, its requirement level per profile, a default tool, an exit criterion, and a rough effort to introduce.

**How to read a row.** `Tier` says which gate layer enforces it. `From` is the maturity level at which the practice enters the contract — below that it is deferred, not missing. `Proto / Std / Crit` are the requirement levels per profile: **M** = MUST, **S** = SHOULD, **C** = COULD, **—** = not in the contract. `Surface` names a product surface the practice requires; a repo that confidently lacks it drops the row as `N/A`. Effort: XS ≈ 1h, S ≈ half a day, M ≈ 2 days, L ≈ a week.

**Verification type** matters for enforcement: `signal` practices are detected from configuration, `automated` practices produce a machine verdict, and `manual-attestation` practices can only ever be *attested* by a human — they must never be reported as auto-passed. See `attesting-manual-verification`.

---

## Tier 1 — Dev gate (local hooks and fast CI)

| Practice | From | Proto | Std | Crit | Surface | Default tool | Exit criterion | Effort |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `linting` | crawl | M | M | M | any | ESLint flat config | `eslint .` clean with `--max-warnings 0` in CI | XS |
| `type-safety` | crawl | M | M | M | any | `tsc --noEmit`, `strict: true` | Typecheck clean in CI; no new `any` or `@ts-expect-error` without a comment | S |
| `formatting` | crawl | S | M | M | any | Prettier | Format check runs in CI; no formatting-only diffs in review | XS |
| `unit-testing` | crawl | S | M | M | any | Vitest / Jest | Unit tests green in CI; diff coverage ≥ profile threshold | S |
| `secret-scanning` | crawl | M | M | M | any | gitleaks | No secrets in history or diff; scan blocks on finding | XS |
| `dependency-audit` | crawl | C | M | M | any | `npm audit` / osv-scanner / Dependabot | No known critical vulnerabilities; renewals tracked | XS |
| `no-skipped-tests` | crawl | C | M | M | any | ESLint rule / CI grep | No `.skip`, `.only`, or quarantined test without a waiver | XS |
| `coverage-rigor` | walk | — | M | M | any | Vitest/Jest coverage + diff coverage | Changed lines meet the profile threshold; repo coverage does not decrease | M |
| `duplication` | walk | — | S | M | any | jscpd / SonarQube | Duplication does not increase more than 3% per change | S |
| `cognitive-complexity` | walk | — | S | M | any | `eslint-plugin-sonarjs` | No new function above the agreed complexity ceiling | S |

## Tier 2 — Feature testing (CI, every PR)

| Practice | From | Proto | Std | Crit | Surface | Default tool | Exit criterion | Effort |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `integration-testing` | walk | C | M | M | any | Vitest + Testcontainers / supertest | Cross-module and DB paths covered with real collaborators, green in CI | M |
| `api-testing` | walk | C | M | M | `http-api` | Playwright API / supertest | Endpoint contract, auth, validation, and error paths covered | M |
| `contract-testing` | walk | — | S | M | `wire-schema` | openapi validators / Pact | Responses validate against the published schema; breaking changes fail the build | M |
| `e2e-testing` | walk | C | M | M | `web-ui` | Playwright Test | Critical user journeys green in CI on every PR | M |
| `visual-regression` | run | — | C | S | `web-ui` | Playwright snapshots | Baselines reviewed and current; masked regions documented | M |
| `accessibility-automation` | walk | — | S | M | `web-ui` | `@axe-core/playwright` | No new WCAG 2.2 AA violations on key flows | S |
| `sast` | walk | C | M | M | any | CodeQL / Semgrep | No critical findings (also no high, on `critical-regulated`) | S |
| `dast` | run | — | C | S | `http-api` | OWASP ZAP baseline | Baseline scan clean against a deployed environment | M |
| `property-based-testing` | run | — | C | S | any | fast-check | Invariants of core logic hold across generated inputs | M |
| `mutation-testing` | run | — | C | S | any | Stryker | Mutation score tracked; no decrease on critical modules | L |
| `performance-testing` | run | — | S | M | `http-api`, `web-ui` | k6 / Lighthouse CI | Thresholds tied to stated SLOs pass at the modelled load | L |
| `chaos-resilience` | run | — | C | S | `http-api` | fault injection at the boundary | Documented failure modes degrade as designed | L |
| `flake-control` | walk | — | M | M | any | retry telemetry + quarantine register | Flake rate under the profile threshold; every quarantine has an owner and a date | M |

## Tier 3 — AI/LLM product surface

Only in the contract when the repo ships an LLM feature. If the `ai-llm` surface is absent, every row here is `N/A`.

| Practice | From | Proto | Std | Crit | Surface | Default tool | Exit criterion | Effort |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `llm-eval-suite` | walk | S | M | M | `ai-llm` | promptfoo / deepeval | Golden cases per prompt template run in CI; no regressions merge | M |
| `llm-output-guardrails` | walk | S | M | M | `ai-llm` | Zod schema + moderation + PII checks | Every model output crossing a trust boundary is validated at runtime and tested | M |
| `prompt-injection-resistance` | walk | C | M | M | `ai-llm` | promptfoo red-team / garak | Adversarial suite runs in CI; no successful escalation in the corpus | M |
| `groundedness-review` | walk | C | S | M | `ai-llm` | human review protocol (`manual-attestation`) | Sampled outputs reviewed claim-by-claim against sources; attested | M |

## Tier 4 — Human-centric (`manual-attestation` — never auto-passed)

| Practice | From | Proto | Std | Crit | Surface | Default tool | Exit criterion | Effort |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `code-review` | crawl | S | M | M | any | PR review + `code-review-advanced` | Every change reviewed by someone who did not write it; attested | XS |
| `exploratory-testing` | walk | C | S | M | `web-ui`, `http-api` | session-based charters | Charter sessions run per release with notes as evidence; attested | S |
| `manual-accessibility` | walk | — | S | M | `web-ui` | keyboard + screen-reader pass | Key flows verified by a human; automation gaps named; attested | M |
| `uat` | walk | — | S | M | any | scripted business acceptance | Business owner signs off against acceptance criteria; attested | M |
| `observability-readiness` | walk | C | S | M | `http-api`, `web-ui` | logs, metrics, traces, alerts review | The failure modes that matter are detectable in production; attested | M |

## Tier 5 — Release and governance

| Practice | From | Proto | Std | Crit | Surface | Default tool | Exit criterion | Effort |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `regression-suite` | walk | C | M | M | any | tagged suite in CI | Regression pack green on the release candidate; scope justified by the diff | M |
| `release-readiness` | walk | C | M | M | any | `assessing-release-readiness` | Exit criteria stated, defects profiled, residual risk written down | S |
| `production-readiness` | run | — | S | M | any | readiness checklist | Config, monitoring, error handling, scalability, rollback verified | M |
| `intent-rationale` | walk | — | S | M | any | `Intent:` commit trailer / ADR | Every high-risk change carries a recorded human rationale | S |
| `comprehension-attestation` | run | — | C | S | any | teach-back attestation (advisory) | Risk band reported; high-risk unattested surface surfaced, never blocked | S |
| `waiver-governance` | crawl | S | M | M | any | waiver register | Every skipped practice has a reason, an owner, and an expiry | XS |

---

## Extending the catalog

Add a row only if all six columns can be filled honestly. A practice without an exit criterion cannot be gated, and a practice without a default tool turns into a research project the first time someone tries to adopt it.

Rows are deliberately absent for anything the repo cannot support: language-specific practices for other stacks (a Java or .NET project needs its own tool column) and organisation-specific gates (licence policy, export control) that vary too much to default.

## Level assignment rationale

The pattern behind the columns, so new rows stay consistent:

- **MUST at every profile** — cheap, fast, and catches a class of defect nothing else catches: linting, typecheck, secret scanning.
- **MUST from `standard` up** — the practices whose absence makes a real product unmaintainable: unit tests, coverage rigour, integration and API tests, code review, regression suite, release readiness.
- **MUST only at `critical-regulated`** — the practices that only pay for themselves under audit or high blast radius: DAST, performance thresholds, manual accessibility, UAT, production readiness, intent rationale.
- **COULD everywhere** — high-cost, high-skill techniques that reward a mature suite and punish an immature one: mutation testing, chaos, property-based testing, visual regression.

An LLM surface is the exception to the cost curve: `llm-eval-suite` is MUST from `standard` because without it, prompt and model changes regress silently and no other practice in the catalog will notice.
