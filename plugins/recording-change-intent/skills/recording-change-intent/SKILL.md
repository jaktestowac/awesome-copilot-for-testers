---
name: recording-change-intent
description: 'Requires an externalised rationale for high-risk changes - new public exports, new endpoints, auth edits, migrations, removed guards - recorded as an Intent commit trailer, an ADR reference, or a module intent register, and reports high-risk changes that carry none. Use when agent-generated or AI-assisted changes ship without a recorded why, when reviewers cannot tell what a diff was for, when a codebase is losing its decision history, or when setting up an intent gate alongside test and coverage gates.'
argument-hint: 'Commit range or PR, and where rationale is expected to live (commit trailers, ADRs, issue tracker)'
user-invocable: true
---

# Recording Change Intent

Use this skill when a change carries risk and the reason for it exists only in someone's head, a chat thread, or a ticket nobody will find again.

Tests prove a change *works*. Coverage proves it was *executed*. Neither records why it was made, which constraint forced the odd shape, or what was considered and rejected. That is **intent debt**, and it is the one debt an agent structurally cannot pay down: a coding agent can write the implementation, the tests, and the docs, but it cannot supply the human reason the work was commissioned. As AI-assisted output grows, intent debt grows with it while every other quality signal keeps looking healthy.

The fix is small and unfashionable: on high-risk changes, require the rationale to be written down somewhere durable and linked to the change.

## When to Use

- an AI-assisted or agent-generated change touches auth, money, schema, or public surface
- reviewers routinely ask "why is this like this" and nobody knows
- a codebase's decisions live in closed tickets and departed colleagues
- a per-change gate needs an intent check next to its test and coverage checks
- an ADR practice exists but nothing links ADRs to the commits that implement them
- a post-incident review cannot reconstruct why a change was made

## Operating Principles

- **Intent is *why*, not *what*.** The diff already says what changed. `refactor: extract computeRefund` is a restated diff, not a rationale.
- **Only high-risk surface needs it.** Demanding a rationale on every typo fix trains people to write filler, and filler is worse than silence because it looks like compliance.
- **A human writes it.** An agent can draft it from context and must hand it to a human to confirm or replace. A generated rationale nobody read is intent theatre.
- **Durable and linked.** In the commit, in an ADR the commit references, or in a register keyed by module. Not in a PR description that a squash-merge will discard, and not in chat.
- **A malformed record is not a missing one.** Report them differently: one needs writing, the other needs fixing, and conflating them makes the gate feel arbitrary.
- **Two layers, different strengths.** Fast advisory feedback at commit time; real enforcement at push or CI. Fast feedback that blocks gets disabled; enforcement that is bypassable gets bypassed.
- **Constraints and rejected alternatives are the valuable part.** "Why not the obvious way" is what a future reader actually needs.

## Workflow

### Phase 1: Decide whether this change needs a rationale

Take the tags from `scoping-change-relevance`, or apply the rules in `./resources/high-risk-surface-rules.md` directly. High-risk surface is:

- a **new public export** - a new capability other code can now call
- a **new endpoint** or externally reachable operation
- a **modified auth** path - anything touching who can do what
- a **schema or migration** change, especially an irreversible one
- a **removed guard, removed validation, or removed test**
- a **new external dependency or call** that adds a failure mode
- a change to a module the contract marks `critical-path`

Everything else: no rationale required. Say so explicitly, so the gate is visibly proportionate rather than universally nagging.

### Phase 2: Check what rationale already exists

Any one of these covers the change:

| Mechanism | Looks like | Best for |
| --- | --- | --- |
| `Intent:` trailer | free-text rationale in the commit message trailer block | the normal case |
| `Intent-Ref:` trailer | `ADR-0042`, `QA-431`, or a URL | a decision already written down elsewhere |
| ADR | a document in `docs/adr/` that this change implements | architectural decisions with alternatives |
| Module intent register | an entry in `.qa/intent.md` covering these paths | stable module-level "why this exists" |
| Intent waiver | a path-scoped register entry | genuinely mechanical high-risk changes (bulk renames, codegen) |

```bash
git log <base>..HEAD --format='%H%n%B'          # read the whole message, trailers included
git log <base>..HEAD --format='%(trailers:key=Intent,valueonly)'
git log <base>..HEAD --format='%(trailers:key=Intent-Ref,valueonly)'
```

Trailers are the standard `Key: value` block at the end of a commit message - the same mechanism as `Signed-off-by:`. No tooling, no external service, and they survive rebase and squash if written into the final message. See `./resources/intent-trailer-spec.md`.

### Phase 3: Classify each high-risk change

| Status | Meaning | Action |
| --- | --- | --- |
| **Covered** | a valid rationale covers this surface | nothing |
| **Undeclared** | high-risk surface, no rationale anywhere | write one |
| **Malformed** | a trailer exists but fails its rule - too short, unresolvable ref, wrong key | fix it, and quote the exact problem |
| **Restated diff** | a rationale that only says what the diff says | rewrite it; this is the most common failure |
| **Waived** | covered by a path-scoped intent waiver | cite the waiver and its expiry |

"Restated diff" deserves the separate row. `Intent: added the refund endpoint` passes any mechanical check and carries no information. A human reviewing intent records should reject it as they would reject an assertion-free test.

### Phase 4: Draft, then hand over

Where a rationale is missing, draft one from the evidence available - the diff, the linked ticket, the branch name, the surrounding code, the conversation. Then hand it to the author with the draft clearly marked as a draft, because a rationale the author has not confirmed is not a rationale.

A good record answers three questions in a few lines:

1. **Why now** - the trigger. A bug, a requirement, a limit that was hit.
2. **What constrained the shape** - the reason it is not the obvious implementation.
3. **What was rejected** - the alternative someone will otherwise propose in six months.

```
feat(billing): allow partial refunds on settled orders

Support desk cannot resolve disputes on settled orders without a full
reversal, which breaks the monthly reconciliation report.

Intent: Partial refunds must be idempotent because the provider retries
  webhooks up to 5 times; we key on (orderId, providerRefundId) rather
  than generating our own id, so a retry cannot double-refund. Rejected
  a queue-based approach - it would have needed a new consumer and the
  reconciliation window is 15 minutes, not seconds.
Intent-Ref: ADR-0042
```

More examples, including bad ones and why they fail, in `./resources/intent-trailer-spec.md`.

### Phase 5: Report

- **Undeclared high-risk surface** - file, what makes it high-risk, and what a rationale should answer
- **Malformed records** - the exact rule that failed and the corrected form
- **Restated-diff records** - quoted, with what is missing
- **Severity by profile** - `critical-regulated`: undeclared MUST surface is a blocker. `standard`: a warning. `prototype-internal`: informational.
- **Low-risk changes needing nothing** - say this out loud; it is what keeps the gate credible

## Enforcement Layers

**Layer 1 - commit-msg hook (advisory, bypassable).** Warns when an `Intent:` trailer is too short or an `Intent-Ref:` looks malformed. Never blocks. Its job is to catch the typo while the author still has context.

**Layer 2 - pre-push or CI (enforcing).** Parses trailers on the commits in the range, resolves high-risk surface from the diff, and fails when MUST-level surface has no valid rationale. Wired into required checks. Hook snippets and a CI job are in `./resources/intent-trailer-spec.md`.

Roll it out warn-first, like any gate: report for one iteration, then warn, then block on the escalated surface only (auth, migrations, endpoints), then everywhere the contract says MUST.

## Common Failure Modes

- **Restating the diff.** "Refactored the pricing module." The single most common failure, and the reason a length check alone is insufficient.
- **Requiring it everywhere.** A rationale on every commit produces `Intent: fix` within a week.
- **Accepting an agent's draft unread.** The mechanism exists precisely because the human reason cannot be generated. An unreviewed generated rationale is the failure mode this skill is designed to prevent.
- **Rationale only in the PR description.** Squash-merge discards it, and the repo keeps the code without the reason.
- **Bare ticket references.** `Intent-Ref: JIRA-1234` with no accessible ticket is a dead link with extra steps. Reference something durable, or write the reason inline.
- **Confusing malformed with missing.** They need different fixes and reporting them identically makes the gate feel capricious.
- **Blocking at commit time.** The layer that must stay fast, made slow and mandatory, gets `--no-verify`'d - see `governing-quality-waivers`.

## Resource Map

- `./resources/intent-trailer-spec.md` - the trailer grammar, validation rules, good and bad examples, the commit-msg hook and the CI job
- `./resources/high-risk-surface-rules.md` - what counts as high-risk surface, per-profile severity, and the module intent register format

## Related Skills

- `scoping-change-relevance` - supplies the tags that identify high-risk surface in a diff
- `governing-quality-waivers` - the sibling record: why a check is off, versus why a change was made
- `assessing-comprehension-debt` - an `Intent:` record is an input to the comprehension risk band
- `code-review-advanced` - where a human judges whether a rationale is real or restated
- `deriving-a-quality-contract` - where `intent-rationale` is set to MUST, SHOULD, or COULD for this project
- `reporting-bugs` - the same discipline applied to defects: evidence and reasoning, written down once, findable later

## Definition of Done

This skill is complete when:

- high-risk surface in the change range is identified with the rule that made it high-risk
- existing rationale has been looked for in all of trailers, ADRs, and the module register
- each high-risk change is classified covered, undeclared, malformed, restated, or waived
- malformed records quote the failing rule and the corrected form
- drafted rationales are marked as drafts and handed to a human, never committed as final
- low-risk changes are explicitly recorded as needing nothing
- severity follows the project's profile rather than a fixed level
