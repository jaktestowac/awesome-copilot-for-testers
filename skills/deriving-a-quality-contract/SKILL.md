---
name: deriving-a-quality-contract
description: 'Derives a project-specific quality contract from three axes - risk profile, team maturity, and product surface - labelling each testing practice MUST, SHOULD, or COULD, then produces a PRESENT/PARTIAL/MISSING/WAIVED gap matrix with an ordered remediation plan. Use when a project has no agreed testing strategy, when a team argues about which practices are mandatory, when onboarding a legacy or inherited repository, when a quality strategy document has to be derived from evidence instead of opinion, or when someone asks "what testing should we actually be doing here".'
argument-hint: 'Repo path or product description, how critical the system is, how experienced the team is with testing, the stack, and any existing CI config'
user-invocable: true
---

# Deriving a Quality Contract

Use this skill when a team needs to know which testing practices are mandatory for **this** project, which are expected, which are optional, and which of them are actually in place today.

"We should test more" is not a strategy. A quality contract is: a named list of practices, each labelled MUST, SHOULD, or COULD for this specific project, each with an exit criterion, an owner, and a current state. The label is derived from three axes, not from taste - which is what makes the contract survive an argument.

## When to Use

- a project has no written testing strategy, or has one nobody follows
- a team disagrees about whether a practice (mutation testing, contract tests, load tests) is required
- a legacy or inherited repo needs an honest quality baseline
- a strategy document is due and the alternative is inventing one
- a quality gate is being designed and the list of things to gate on is unclear
- a client or auditor asks what quality practices this project commits to

## Operating Principles

- **Derive, do not prescribe.** The same practice is MUST for a payment service and COULD for an internal prototype. State the axes, then read the label off them.
- **Three states are a lie; four are honest.** PRESENT, PARTIAL, MISSING, WAIVED. PARTIAL is the state every audit omits and every repo is full of.
- **Configured is not verified.** A jest config proves unit testing is *set up*. It proves nothing about the change that shipped yesterday. Say which of the two you measured.
- **Drop what does not apply.** A library with no HTTP surface cannot be DAST-scanned. Removing an irrelevant practice from the contract is a feature, not a shortcut.
- **A practice with no exit criterion is a slogan.** Every row needs a testable finish line.
- **Skipping is allowed; silent skipping is not.** Anything not being done is either COULD, or WAIVED with a reason, an owner, and a date.
- **Maturity gates ambition.** A team that has no unit tests should not be handed mutation testing. Sequence the plan; do not dump it.

## Workflow

### Phase 0: Establish the three axes

Read the repo and ask what the repo cannot tell you.

**Stack and tooling** - from `package.json`, lockfiles, `tsconfig.json`, test config, CI workflows. Record the test runner, assertion style, and CI provider.

**Product surface** - what the thing actually exposes, because it decides which practices are even applicable:

| Surface | Evidence to look for |
| --- | --- |
| `web-ui` | React/Vue/Svelte/Angular deps, `public/index.html`, route components |
| `http-api` | Express/Fastify/Nest/Hono deps, `routes/`, `controllers/`, handler files |
| `wire-schema` | `openapi.*`, `swagger.*`, `*.proto`, `*.graphql`, tRPC routers |
| `ai-llm` | `openai`, `@anthropic-ai/sdk`, `ai`, `langchain`, `llamaindex`, `prompts/`, `*.prompt.*` |
| `data-store` | migration folders, ORM schema files, seed scripts |
| `library` | package `exports`/`main` with no server entry point, published to a registry |
| `cli` | `bin` field, `commander`/`yargs`/`clipanion` |

A repo has several surfaces. Record all of them with the evidence, and record what is confidently **absent** - absence is what lets you drop rows.

**Profile** - the risk class. Ask, do not guess:

- who is harmed if this breaks, and how badly
- is there regulatory, contractual, or financial exposure
- is money, personal data, or safety involved
- can a bad release be rolled back in minutes, or not at all

Map the answers onto a profile from `./resources/profiles.md` (`critical-regulated`, `standard`, `prototype-internal`) and write down the one sentence that justifies it.

**Maturity** - where the team is now, from `./resources/maturity-model.md` (`crawl`, `walk`, `run`). Read it from the repo, not from ambition: no test script at all is crawl, however senior the team.

Write the triple down and confirm it with a human before continuing. **Everything downstream is derived from it, so a wrong triple produces a confidently wrong contract.**

### Phase 1: Resolve the contract

Walk `./resources/approach-catalog.md`. For each practice:

1. Skip it if `requires-surface` names a surface this repo confidently lacks. Record it as `N/A` with the reason - do not silently omit it.
2. Skip it if its `introduced-at` maturity is above the team's current level. Record it as `deferred to <level>`, because it is the next contract, not this one.
3. Otherwise take the level for the resolved profile: **MUST**, **SHOULD**, or **COULD**.
4. Copy the exit criterion and pick the tool from the catalog's tool column.

The output is a table of practices with levels and exit criteria. That is the contract.

### Phase 2: Detect what is present

For each contracted practice, look for the evidence listed in `./resources/detection-signals.md` and assign one of four states:

| State | Meaning |
| --- | --- |
| **PRESENT** | Configured **and** wired into CI, with evidence for both |
| **PARTIAL** | Configured but not enforced, enforced but not on all relevant paths, or present but demonstrably stale |
| **MISSING** | No credible evidence |
| **WAIVED** | Absent by a recorded decision with reason, owner, and expiry |

Rules that keep this honest:

- Quote the evidence: a file path, a dependency name, a CI step. A state with no evidence is not a finding, it is a guess.
- A tool in `devDependencies` that no script and no workflow invokes is PARTIAL, not PRESENT.
- A CI step written as `tool || true`, `continue-on-error: true`, or `|| echo "non-blocking"` is PARTIAL - it runs and cannot fail.
- If a check exists but excludes most of the codebase, it is PARTIAL, and name the exclusion.
- When you genuinely cannot tell, write **UNKNOWN** and say what you would need. Never collapse "could not determine" into MISSING - that produces a plan for work that may already be done.

### Phase 3: Grade the gap

A MUST in state MISSING is a **blocker**. Blockers are not waivable; they are either fixed or the profile was wrong. If a blocker list is long, that is usually a signal the profile was set aspirationally - revisit Phase 0 with the human rather than issuing a 20-item blocker list.

Order everything else by risk × effort using the effort labels in the catalog (XS ≈ 1h, S ≈ half a day, M ≈ 2 days, L ≈ a week). Front-load the practices that protect the surfaces you identified as critical.

### Phase 4: Write the contract and the plan

Use `./resources/contract-template.md`. The deliverable has four parts:

1. **The triple**, with the sentence justifying each axis.
2. **The contract table** - practice, level, tool, exit criterion, owner.
3. **The gap matrix** - practice, level, state, evidence, verdict.
4. **The remediation plan** - ordered, each item with a concrete first command, an effort label, and its exit criterion.

Save to `.qa/quality-contract.md`. If the project wants a machine-readable copy for gate tooling, also emit `.qa/quality-contract.yaml` in the shape shown in the template.

Then say plainly what the contract does **not** cover: practices dropped for missing surface, practices deferred to the next maturity level, and anything marked UNKNOWN.

## Re-running It

A contract is a living artifact. On a re-run, diff against the previous one and report direction: practices that moved to PRESENT, practices that regressed, waivers that expired, blockers that remain. Hand that diff to `tracking-quality-trends` if a trend history is being kept. A contract that only ever gets written once becomes wallpaper.

## Common Failure Modes

- **Aspirational profile.** Labelling an internal admin tool `critical-regulated` produces a contract nobody can satisfy, and the whole document gets ignored.
- **Catalog dumping.** Emitting all 30 practices as MUST. If everything is mandatory, nothing is.
- **Confusing configured with verified.** The most common false PRESENT. A test runner exists; the diff is untested.
- **Silent omission.** Dropping a practice without recording why. Next quarter nobody knows whether it was considered.
- **Skipping the human confirmation on the triple.** The one step that cannot be automated, and the one most often skipped.
- **A plan with no first command.** "Introduce contract testing" is not an action. `npx openapi-typescript ./openapi.yaml -o src/types/api.ts` is.

## Resource Map

- `./resources/approach-catalog.md` - the practice catalog: tier, maturity, MUST/SHOULD/COULD per profile, tool, exit criterion, effort
- `./resources/profiles.md` - the three risk profiles, how to choose one, and their metric thresholds
- `./resources/maturity-model.md` - crawl / walk / run, entry criteria, and what each level unlocks
- `./resources/detection-signals.md` - per-practice evidence for PRESENT / PARTIAL in a JS/TS repo
- `./resources/contract-template.md` - output structure for the contract, gap matrix, and remediation plan

## Related Skills

- `scoping-change-relevance` - when the question is which contracted practices apply to one specific diff
- `governing-quality-waivers` - when a practice will not be done and the skip needs a reason, an owner, and a date
- `generating-quality-gate-workflows` - when the agreed contract has to be enforced in CI
- `tech-debt-analysis` - when the question is code, test, and dependency health rather than which practices are mandatory
- `assessing-release-readiness` - when the contract and gap matrix become evidence for a go/no-go call
- `analyzing-quality-metrics` - when the contract's metric thresholds need definitions and honest interpretation

## Definition of Done

This skill is complete when:

- the profile, maturity, and surfaces are written down with the evidence and reasoning for each
- every contracted practice carries a level, a tool, and a testable exit criterion
- every practice has a state with quoted evidence, and UNKNOWN is used where evidence was unavailable
- practices dropped for missing surface and deferred for maturity are listed, not silently omitted
- MUST + MISSING blockers are called out separately from the ordered plan
- the remediation plan is ordered and each item starts with a command someone can run today
- the human has confirmed the triple, not just received it
