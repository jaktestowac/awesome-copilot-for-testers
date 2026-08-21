# Contract Output Template

Save to `.qa/quality-contract.md`. Keep the four sections and their order - gate tooling and the trend report both read this structure.

---

# Quality Contract - <project>

**Derived:** <date> · **Derived by:** <who> · **Confirmed by:** <human who approved the triple>
**Re-derive when:** the profile changes, a new product surface ships, or at <cadence>

## 1. The triple

| Axis     | Value                                                   | Why                                                                                    |
| -------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Profile  | `standard`                                              | External users, payment data, rollback takes ~15 min. No regulatory exposure.          |
| Maturity | `walk`                                                  | CI blocks on lint, typecheck and unit tests; no diff coverage yet; flake rate unknown. |
| Stack    | TypeScript, Node 20, Vitest, Playwright, GitHub Actions | from `package.json`, `.github/workflows/ci.yml`                                        |

**Surfaces present:** `http-api` (Fastify routes in `src/routes/`), `web-ui` (React app in `apps/web/`), `wire-schema` (`openapi.yaml`)
**Surfaces confidently absent:** `ai-llm` (no model SDK, no prompt files), `cli` (no `bin` entry)

## 2. Contract

| Practice           | Level | Tool               | Exit criterion                                  | Owner    |
| ------------------ | ----- | ------------------ | ----------------------------------------------- | -------- |
| `linting`          | MUST  | ESLint flat config | `eslint .` clean, `--max-warnings 0`, in CI     | @team    |
| `unit-testing`     | MUST  | Vitest             | Suite green in CI; diff coverage ≥ 75%          | @team    |
| `api-testing`      | MUST  | Playwright API     | Contract, auth, validation, error paths covered | @backend |
| `mutation-testing` | COULD | Stryker            | Score tracked; no decrease on `src/pricing/`    | -        |
| ...                |       |                    |                                                 |          |

**Not in this contract:**

| Practice                                                | Reason                                                             |
| ------------------------------------------------------- | ------------------------------------------------------------------ |
| `dast`, `llm-eval-suite`, `prompt-injection-resistance` | `N/A` - required surface absent (`ai-llm`)                         |
| `mutation-testing`, `chaos-resilience`                  | deferred to `run` - enters the contract at the next maturity level |

## 3. Gap matrix

| Practice              | Level  | State      | Evidence                                                                                    | Verdict         |
| --------------------- | ------ | ---------- | ------------------------------------------------------------------------------------------- | --------------- |
| `linting`             | MUST   | PRESENT    | `eslint.config.js`; `ci.yml:31` runs `eslint . --max-warnings 0`                            | ok              |
| `type-safety`         | MUST   | PARTIAL    | `strict: true` in root `tsconfig.json`, but `apps/web/tsconfig.json:8` sets `strict: false` | fix             |
| `coverage-rigor`      | MUST   | MISSING    | coverage provider configured, no threshold, no diff coverage                                | **blocker**     |
| `e2e-testing`         | MUST   | PARTIAL    | `playwright.config.ts` present; `ci.yml:58` job runs on `schedule` only, not on PR          | fix             |
| `dependency-audit`    | MUST   | PARTIAL    | `ci.yml:44` runs `npm audit \|\| true` - cannot fail                                        | fix             |
| `exploratory-testing` | SHOULD | unattested | no session record for the current release                                                   | attest or waive |
| `duplication`         | SHOULD | WAIVED     | register entry: generated API clients, @lead, expires 2026-12-01                            | ok              |
| `performance-testing` | SHOULD | UNKNOWN    | k6 scripts in `perf/`; cannot see whether the nightly job gates - needs CI access           | investigate     |

**Summary:** 1 blocker · 4 to fix · 1 to attest · 1 unknown · 12 ok

## 4. Remediation plan

Ordered by risk × effort. Each item starts with a command someone can run today.

| #   | Practice              | Action                                               | First command                                                         | Effort | Exit criterion                           |
| --- | --------------------- | ---------------------------------------------------- | --------------------------------------------------------------------- | ------ | ---------------------------------------- |
| 1   | `coverage-rigor`      | Add diff-coverage gate on changed lines              | `npm i -D vitest@latest && npx vitest run --coverage --reporter=lcov` | M      | Changed lines ≥ 75% enforced in CI       |
| 2   | `dependency-audit`    | Remove `\|\| true`, gate on critical                 | edit `ci.yml:44` → `npm audit --audit-level=critical`                 | XS     | Job fails on a critical advisory         |
| 3   | `e2e-testing`         | Move the Playwright job onto `pull_request`          | edit `ci.yml:58` trigger                                              | S      | Critical journeys run on every PR        |
| 4   | `type-safety`         | Turn on `strict` in `apps/web`                       | `apps/web/tsconfig.json` → `"strict": true`, fix fallout              | M      | `tsc --noEmit` clean across all packages |
| 5   | `exploratory-testing` | Run a charter session for this release and record it | see `planning-exploratory-testing`                                    | S      | Dated session record with findings       |

**Blockers (not waivable):** `coverage-rigor`. A MUST practice in state MISSING is either fixed or the profile was wrong.

---

## Optional machine-readable sidecar

Emit `.qa/quality-contract.yaml` when gate tooling or a trend report will consume the contract. Keep it generated from the Markdown, never hand-edited in parallel.

```yaml
version: 1
derived: 2026-08-21
profile: standard
maturity: walk
surfaces:
  present: [http-api, web-ui, wire-schema]
  absent: [ai-llm, cli]
thresholds:
  diff_coverage: 75
  sast_block: [critical]
contract:
  - practice: linting
    level: must
    tool: eslint
    state: present
    evidence: ['eslint.config.js', 'ci.yml:31']
  - practice: coverage-rigor
    level: must
    tool: vitest-coverage
    state: missing
    blocker: true
  - practice: duplication
    level: should
    state: waived
    waiver: { reason: 'generated API clients', owner: '@lead', expiry: '2026-12-01' }
deferred: [mutation-testing, chaos-resilience]
not_applicable:
  - { practice: dast, reason: 'no deployed http surface in scope' }
```

## Writing rules

- **Quote evidence with a path and, where it matters, a line number.** A state without evidence is a guess wearing a table.
- **One row per practice.** No "partially covered" verdicts - the four states plus UNKNOWN are the whole vocabulary.
- **Blockers get their own line.** Burying a MUST + MISSING in row 14 of a long table is how it gets missed.
- **Owners are people or teams, not "the team".** A row owned by everyone is owned by nobody.
- **Keep the "not in this contract" section.** It is the difference between a considered decision and an oversight, and it is the first thing a reviewer looks for.
