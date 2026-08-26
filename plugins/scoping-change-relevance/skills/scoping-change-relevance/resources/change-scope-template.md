# Change Scope Report Template

Save to `.qa/change-scope-<branch-or-date>.md`, or paste as a PR comment. Keep it short enough that a reviewer reads it before the diff.

---

# Change Scope - <branch> vs <base>

**Diff:** `git diff <base>...HEAD` · <n> files, +<added> / −<removed> · <n> commits
**Excluded from tagging:** lockfiles (counted as `added-dependency`), `__snapshots__/`, `dist/`
**Overall risk:** **Escalated** - auth and a new endpoint on a critical path

## Tagged files

| File                        | File tags                 | Hunk tags                                 |
| --------------------------- | ------------------------- | ----------------------------------------- |
| `src/routes/orders.ts`      | `source`, `public-api`    | `new-endpoint`, `modified-error-handling` |
| `src/auth/session.ts`       | `source`, `auth`          | `modified-auth`, `removed-guard`          |
| `src/lib/pricing.ts`        | `source`, `critical-path` | `new-public-export`                       |
| `package.json`              | `config`                  | `added-dependency` (`stripe@18`)          |
| `prompts/summarize.md`      | `ai`                      | `modified-prompt`                         |
| `src/routes/orders.test.ts` | `test`                    | `removed-test`                            |

## Check scope

| Rank      | Practice                                              | Triggered by                            | In contract | Action                              |
| --------- | ----------------------------------------------------- | --------------------------------------- | ----------- | ----------------------------------- |
| Escalated | `sast`                                                | `modified-auth`, `removed-guard`        | MUST        | run                                 |
| Escalated | `api-testing`                                         | `new-endpoint`                          | MUST        | run + extend for the new route      |
| Escalated | `integration-testing`                                 | `new-endpoint`, `auth`, `critical-path` | MUST        | run + cover the refund path         |
| Escalated | `intent-rationale`                                    | `modified-auth`, `new-endpoint`         | SHOULD      | record an `Intent:` trailer         |
| Standard  | `unit-testing`                                        | `new-public-export`, `removed-test`     | MUST        | add tests for `computeRefund`       |
| Standard  | `coverage-rigor`                                      | `new-public-export`                     | MUST        | diff coverage ≥ 75%                 |
| Standard  | `dependency-audit`                                    | `added-dependency`                      | MUST        | audit `stripe` and its tree         |
| Standard  | `llm-eval-suite`                                      | `modified-prompt`                       | MUST        | re-run evals; expect no regressions |
| Standard  | `contract-testing`                                    | `new-endpoint` + `openapi.yaml` present | SHOULD      | update the spec, validate responses |
| Light     | `linting`, `type-safety`, `formatting`, `code-review` | any source change                       | MUST        | always                              |

**Out of scope:** `e2e-testing` (no UI-reachable change), `performance-testing` (no query or hot-path change), `visual-regression` (no component change), `dast` (nothing deployed for this branch)
**Triggered but not contracted:** `property-based-testing` - `computeRefund` has a stated invariant and would benefit. Worth raising at the next contract review.

## Flags

- **`removed-test`** - `src/routes/orders.test.ts` deleted while the route it covered was changed. Needs the replacement or a stated reason.
- **`removed-guard`** - a role check disappeared from `session.ts:41`. Confirm this is intended and covered by a test that asserts the new behaviour.
- **`secret-like-string`** - none found. Stated because its absence is worth recording on an auth change.

## Blind spots

- Failure behaviour of the new `stripe` dependency is not visible in the diff - timeouts, retries, and partial failures need a deliberate test.
- Whether the refund endpoint is reachable from the UI needs a human to confirm; if it is, `e2e-testing` moves into scope.
- The prompt change's blast radius depends on which chains consume `summarize.md` - the tag grammar cannot resolve that.
- Data-shape risk: nothing in this diff shows whether existing orders can produce a negative refund.

---

## Writing rules

- **Every in-scope practice names its trigger.** "Because it seemed relevant" is not a scope.
- **Out-of-scope gets listed too.** A scope report that only lists what to run reads as arbitrary; the exclusions are what make it defensible.
- **Flags are separate from scope.** Removed tests and removed guards need a human answer, not just a check run.
- **Blind spots are mandatory.** The grammar is mechanical, so its gaps are predictable. Naming them is the difference between a scope and a false sense of coverage.
- **Keep it under a page.** This is read before the diff, or it is not read.
