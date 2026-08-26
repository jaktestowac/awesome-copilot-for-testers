# Relevance Recipes

Practice → the tags that make it relevant. A practice enters the scope if **any** of its listed tags is present in the change. Record which tag fired; that is what makes the scope reviewable rather than assertive.

Practice names match the catalog in `deriving-a-quality-contract/resources/approach-catalog.md`.

## Always relevant to any source change

| Practice      | Trigger                                                    |
| ------------- | ---------------------------------------------------------- |
| `linting`     | any `source` or `test` file                                |
| `type-safety` | any `source` or `test` file, and always on `loosened-type` |
| `formatting`  | any tracked text file                                      |
| `code-review` | every change, without exception                            |

These are the floor. They are cheap, and a change that is too small to lint is too small to matter.

## Test-level practices

| Practice                   | Relevant when                                                                                                                                                           |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `unit-testing`             | `new-public-export`, `modified-error-handling`, `modified-request-schema`, `removed-test`, `loosened-type`, or any `source` change on `critical-path`                   |
| `coverage-rigor`           | `new-public-export`, `removed-test`, or any `source` change when the contract sets a diff-coverage threshold                                                            |
| `integration-testing`      | `new-endpoint`, `db-migration`, `modified-auth`, `new-external-call`, `modified-error-handling`, or a file tagged `public-api`, `auth`, `critical-path`, `db-migration` |
| `api-testing`              | `new-endpoint`, `modified-request-schema`, or a file tagged `public-api` (requires the `http-api` surface)                                                              |
| `contract-testing`         | any change to a `schema` file, `new-endpoint`, or `modified-request-schema` on a published surface (requires `wire-schema`)                                             |
| `e2e-testing`              | `critical-path`, `new-endpoint` reachable from the UI, `removed-guard`, or a change to a shared UI component (requires `web-ui`)                                        |
| `visual-regression`        | changed component styles, design tokens, or layout files (requires `web-ui`)                                                                                            |
| `accessibility-automation` | changed markup, component structure, ARIA attributes, focus handling, or routing (requires `web-ui`)                                                                    |
| `regression-suite`         | `critical-path`, `db-migration`, changes to shared modules, or a release-candidate branch                                                                               |
| `property-based-testing`   | new or changed pure logic with a stated invariant - parsers, pricing, date arithmetic, permission resolution                                                            |
| `mutation-testing`         | changed modules already inside the mutation-testing scope                                                                                                               |
| `flake-control`            | `test` changes, raised `retries`, or a new `.skip`                                                                                                                      |

## Security practices

| Practice           | Relevant when                                                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sast`             | `modified-auth`, `sql-string`, `exec-call`, `secret-like-string`, `new-endpoint`, `removed-guard`, `removed-validation`, or any file tagged `auth` |
| `secret-scanning`  | `secret-like-string`, any `config` or `secret-suspect` file, `infra` changes                                                                       |
| `dependency-audit` | `added-dependency`, lockfile changes, or a changed base image in `infra`                                                                           |
| `dast`             | `new-endpoint`, `modified-auth`, `removed-guard` on a deployed surface (requires `http-api`)                                                       |

`modified-auth` triggering `sast` is deliberately broad. Auth changes are the category where a two-line diff most often turns into an incident.

## Performance and operations

| Practice                  | Relevant when                                                                                                                       |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `performance-testing`     | changed queries, `sql-string`, new N+1 shapes, changed caching, `new-external-call` on a hot path, changed bundle-affecting imports |
| `observability-readiness` | `new-endpoint`, `modified-error-handling`, `new-external-call`, `infra` changes, new failure modes                                  |
| `production-readiness`    | `infra`, `config`, `db-migration`, or a release-candidate branch                                                                    |
| `chaos-resilience`        | `new-external-call`, changed retry/timeout/circuit-breaker configuration                                                            |

## AI/LLM practices

Only when the repo has the `ai-llm` surface.

| Practice                      | Relevant when                                                                                                                                                   |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `llm-eval-suite`              | `modified-prompt`, changed model id or parameters, changed retrieval or chunking config, changed tool definitions, changed output schema                        |
| `llm-output-guardrails`       | `modified-prompt`, `modified-request-schema` on model output, changed moderation or PII handling, a new surface that renders model output                       |
| `prompt-injection-resistance` | `modified-prompt`, a new tool grant, a new untrusted input path into a prompt (retrieval, user content, webhook, file upload), changed system-prompt boundaries |
| `groundedness-review`         | changed retrieval, changed sources, changed summarisation or citation behaviour                                                                                 |

The rule worth stating: **a new tool grant is always in scope for injection testing.** Expanding what the model can _do_ expands what an injection can achieve, even when no prompt text changed.

## Governance practices

| Practice                    | Relevant when                                                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `intent-rationale`          | any escalation tag, `new-public-export` on `critical-path`, `db-migration`, `modified-auth`, or a change flagged high-risk by the contract |
| `comprehension-attestation` | large diffs, high new-branch counts, or high-risk surface with no accompanying explanation (advisory only)                                 |
| `waiver-governance`         | `disabled-check`, a new `.skip`, a new `eslint-disable`, a lowered threshold, a new `continue-on-error`                                    |
| `release-readiness`         | a release-candidate branch or tag                                                                                                          |

## Scope subtraction

After resolving, subtract in this order:

1. **Not in the contract** → out of scope. Note it as "would have been triggered, not contracted" - that list is the best input to the next contract review.
2. **Required surface absent** → `N/A`.
3. **Deferred by maturity** → out of scope for now.
4. **Waived** → out of scope, and cite the waiver entry with its expiry.

Never subtract because a check is slow or inconvenient. That is a waiver decision with an owner, not a scoping decision.

## Tuning

The recipes are a starting point, and two columns are worth tuning per project:

- **`critical-path`** - replace the default commerce paths with what actually earns or endangers.
- **Practice availability** - if a practice does not exist in the project yet, relevance still fires. A triggered practice with no implementation is a gap finding, not a silent pass.

Keep the tuned version in the repo next to the contract, so the scope is reproducible by anyone rather than dependent on who ran it.
