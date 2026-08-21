---
name: scoping-change-relevance
description: 'Classifies a diff into file tags and hunk tags — new public export, new endpoint, modified auth, SQL string, migration, added dependency, touched prompt — then maps each tag to the quality practices it makes relevant, producing a defensible per-change check scope instead of running everything or guessing. Use when deciding what to test for a specific pull request, when a full regression run is too slow to gate on, when a pre-push or PR gate needs a scope someone can argue with, or when asked "which checks does this change actually need".'
argument-hint: 'Base branch or commit range (e.g. main...HEAD), plus the repo path or the diff itself'
user-invocable: true
---

# Scoping Change Relevance

Use this skill to decide, from the diff alone, which quality practices a specific change makes relevant — and to be able to defend the answer.

Running every check on every commit is slow, so teams stop gating on it. Running whatever the author felt like is fast and arbitrary. The middle path is a **tag grammar**: derive tags mechanically from the diff, map tags to practices with a fixed recipe table, and the scope becomes reproducible. Two people scoping the same diff should land on the same list.

## When to Use

- a pre-push or PR gate needs to run a subset of checks, chosen defensibly
- a reviewer needs to know what this diff puts at risk before reading it
- a slow suite has made "run everything" politically impossible
- an agent needs a deterministic scope rather than a judgement call
- a change looks trivial and you want to check whether it actually is

## Operating Principles

- **Tags come from the diff, not from the author.** "It's just a refactor" is a claim; `new-public-export` is evidence.
- **Added lines drive hunk tags.** Read `+` lines. Removed lines matter for deletions of tests and guards, and nothing else here.
- **Relevance is a filter, not a discount.** A practice out of scope is out of scope *for this change*; it does not become optional for the project.
- **Any auth, secret, migration, or dependency signal wins.** These escalate immediately. There is no "small auth change".
- **Under-tagging is the expensive error.** A false positive costs a check run. A false negative ships the defect. When a rule nearly matches, tag it.
- **Deleted guards are changes.** A removed test, a removed validation, a loosened type — those are risk-increasing edits, not neutral cleanup.
- **Path is not proof.** A file under `auth/` is auth-relevant; a file elsewhere that verifies a token is too. Read the hunk.

## Workflow

### Phase 0: Pin the diff

```bash
git diff --name-status <base>...HEAD      # three-dot: compares against the merge base
git diff <base>...HEAD -- <path>          # per-file hunks
git log <base>..HEAD --oneline
```

Use `main...HEAD` for a branch, `HEAD` for uncommitted work. Confirm the base ref resolves and the diff is non-empty before going further — a bad ref silently produces an empty scope, which reads as "nothing to check".

Exclude non-source noise from tagging, but **list what you excluded**: lockfiles are excluded from hunk tagging yet are themselves a `added-dependency` signal; snapshots, generated clients, and build output are excluded; docs are excluded unless they are the deliverable.

### Phase 1: Assign file tags

Apply the path rules in `./resources/tag-rules.md` to every changed path. File tags describe *where* the change landed: `source`, `test`, `config`, `infra`, `public-api`, `schema`, `auth`, `critical-path`, `db-migration`, `ai`, `secret-suspect`, `generated`.

A path can carry several tags. A path that looks like both test and source is a test.

### Phase 2: Assign hunk tags

For each changed source file, read the added lines and apply the content rules in `./resources/tag-rules.md`. Hunk tags describe *what changed*: `new-public-export`, `new-endpoint`, `modified-auth`, `secret-like-string`, `sql-string`, `exec-call`, `db-migration`, `modified-error-handling`, `modified-request-schema`, `added-dependency`, `modified-prompt`, `removed-test`, `loosened-type`, `new-external-call`.

Do this by reading, not only by pattern matching. The patterns are a floor: they catch the common shapes and miss anything expressed unusually. If a hunk introduces a new public capability by any route, it is `new-public-export`.

### Phase 3: Resolve relevant practices

Apply `./resources/relevance-recipes.md`. Each practice declares the tags that make it relevant; a practice is in scope if any of its declared tags is present. Record, per practice, **which tag triggered it** — that is what makes the scope reviewable.

Then subtract: a practice not in the project's quality contract is not in scope. If a contract exists (see `deriving-a-quality-contract`), intersect with it and note practices that *would* have been triggered but are not contracted. That list is useful evidence next time the contract is reviewed.

### Phase 4: Rank and report

Use `./resources/change-scope-template.md`. Rank by escalation:

| Rank | Trigger |
| --- | --- |
| **Escalated** | `modified-auth`, `secret-like-string`, `sql-string`, `exec-call`, `db-migration`, `critical-path`, `new-endpoint` |
| **Standard** | `new-public-export`, `modified-error-handling`, `modified-request-schema`, `added-dependency`, `ai` |
| **Light** | `test`-only, `config`-only, docs, formatting |

State the **blind spots** explicitly: what the tags cannot see. A pure-rename diff that changes behaviour through a config default, a change whose risk lives in the data rather than the code, a removal whose consequence is elsewhere in the system. The tag grammar is mechanical and therefore blind in known ways — name them rather than implying coverage.

## Worked Example

```
git diff main...HEAD --name-status
M  src/routes/orders.ts
M  src/auth/session.ts
A  src/lib/pricing.ts
M  package.json
M  prompts/summarize.md
D  src/routes/orders.test.ts
```

**File tags:** `src/routes/orders.ts` → `public-api`, `source` · `src/auth/session.ts` → `auth`, `source` · `src/lib/pricing.ts` → `source`, `critical-path` (pricing) · `package.json` → `config` · `prompts/summarize.md` → `ai` · `src/routes/orders.test.ts` → `test`

**Hunk tags:** `new-endpoint` (`app.post('/orders/:id/refund')`) · `modified-auth` (session TTL and role check) · `new-public-export` (`export function computeRefund`) · `added-dependency` (`stripe`) · `modified-prompt` · `removed-test`

**Scope:**

| Rank | Practice | Triggered by |
| --- | --- | --- |
| Escalated | `api-testing` | `new-endpoint`, `public-api` |
| Escalated | `sast` | `modified-auth` |
| Escalated | `integration-testing` | `new-endpoint`, `auth`, `critical-path` |
| Escalated | `intent-rationale` | `new-endpoint`, `new-public-export` on a critical path |
| Standard | `unit-testing` | `new-public-export`, `removed-test` |
| Standard | `contract-testing` | `new-endpoint` + `wire-schema` present in the repo |
| Standard | `dependency-audit` | `added-dependency` |
| Standard | `llm-eval-suite` | `modified-prompt` |
| Standard | `e2e-testing` | `public-api` + `critical-path` reachable from the UI |
| Light | `linting`, `type-safety` | any `source` |

**Flagged:** `removed-test` on the file covering the endpoint being changed. A deleted test is not a neutral edit — require the replacement or a reason.

**Blind spots:** the `stripe` integration's failure behaviour is not visible in the diff; whether the refund path is reachable from the UI needs a human to confirm; the prompt change's blast radius depends on which chains consume it.

## Common Failure Modes

- **Tagging paths and stopping.** File tags alone miss `new-endpoint` in a file that already existed. Hunk tags are where the risk is.
- **Trusting the commit message.** "chore: tidy up" over an auth change is not rare.
- **Reading only `+` lines.** Deleted tests and removed validation are risk-increasing and invisible if you skip removals.
- **Silent exclusions.** Filtering out generated files without saying so; then a genuinely hand-edited "generated" file goes unchecked.
- **Turning the scope into a discount.** Presenting "only 3 practices apply" as good news, rather than as the deliberate consequence of what the diff touched.
- **Ignoring the lockfile.** A dependency bump with no `package.json` change is still a dependency change.
- **Monorepo blindness.** A change in a shared package is a change to every consumer; tag the blast radius, not just the edited path.

## Resource Map

- `./resources/tag-rules.md` - the file-path and hunk-content rules, with the patterns and the intent behind each tag
- `./resources/relevance-recipes.md` - practice → triggering tags, the mapping that turns tags into a check scope
- `./resources/change-scope-template.md` - output structure for the scope report

## Related Skills

- `analyzing-regression-scope` - when the question is blast radius and what to retest, reasoned rather than derived from tags
- `deriving-a-quality-contract` - when the set of practices that could be in scope has not been agreed yet
- `verifying-change-coverage` - when the scope is known and the question is whether the changed lines are actually executed
- `recording-change-intent` - when the tags mark the change as high-risk surface needing a recorded rationale
- `code-review-advanced` - when the tagged risks should drive a code-level review
- `generating-quality-gate-workflows` - when this scope should drive which CI jobs run

## Definition of Done

This skill is complete when:

- the diff and base ref are pinned and stated, and exclusions are listed
- every changed path carries its file tags
- every changed source file has been read for hunk tags, additions and removals
- each in-scope practice names the tag that triggered it
- the scope is ranked, with escalations called out separately
- removed tests, removed validation, and loosened types are flagged explicitly
- blind spots the tag grammar cannot see are stated, not implied
