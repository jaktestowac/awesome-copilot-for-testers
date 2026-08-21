---
applyTo: '{.husky,.githooks,scripts,docs/adr}/**,**/CONTRIBUTING.md,**/commitlint.config.*'
description: 'Grammar and enforcement rules for Intent, Intent-Ref, Assisted-by and Comprehension-Attested-by commit trailers: when each is required, how they are validated, and which enforcement layer they belong in.'
---

# Commit trailer rules

## Why trailers

A trailer records **why** a change was made, in the place a future reader actually starts: `git log` and `git blame`. It survives after the PR is closed, the ticket is archived and the chat thread is gone. No tooling and no external service required - trailers are the standard `Key: value` block, the same mechanism as `Signed-off-by:`.

## Grammar

```
<type>(<scope>): <subject>

<body - what changed, in prose>

Intent: <why now, what constrained the shape, what was rejected>
Intent-Ref: <ADR-nnnn | TICKET-nnn | https://…>
Assisted-by: <tool>
Comprehension-Attested-by: <name>
```

- The trailer block is the **last** paragraph. A blank line before it, none inside it.
- One `Key: value` per line; continuation lines indented by two spaces. Unindented text ends the block.
- Write trailers with `git commit --trailer "…"` or `git commit --amend --trailer "…"`. A trailer in the wrong paragraph is invisible to every parser.

## `Intent:` - required on high-risk surface

Required when a change touches: a new public export, a new endpoint, auth, a schema or migration, a removed guard/validation/test, a new external dependency or call, a published contract, or a `critical-path` module.

**Not required** for formatting, lint fixes, docs, dependency patch bumps with no API change, test-only additions, or pure renames. Say so explicitly rather than nagging - a trailer requirement on every commit produces `Intent: fix` within a week.

Validation:

| Rule | Failure |
| --- | --- |
| ≥ 20 characters after trimming | malformed |
| not a near-duplicate of the subject line | malformed |
| block is the final paragraph | malformed |
| key spelled `Intent` (not `Intention`, `Why`, `intent-ref`) | malformed |
| some commit in the range covers the high-risk paths | undeclared |

**Report malformed separately from undeclared.** One needs fixing, the other needs writing, and conflating them makes the gate feel arbitrary.

A rationale answers three questions:

1. **why now** - the trigger: a bug, a requirement, a limit that was hit
2. **what constrained the shape** - why it is not the obvious implementation
3. **what was rejected** - the alternative someone will propose in six months

Rejected as filler, even though each passes a length check: "Implements the requirements from the ticket." · "Refactored for maintainability and code quality." · "As discussed." · "See PR."

## `Intent-Ref:` - a pointer instead of prose

Accepted shapes: `ADR-\d+`, `[A-Z][A-Z0-9]+-\d+`, or an `https://` URL. **Validate the shape only - never fetch.** A commit-time check must work offline.

Prefer an ADR plus `Intent-Ref:` when alternatives were weighed and the consequences outlive the change. An ADR nothing links to is documentation; `Intent-Ref: ADR-0042` in the implementing commit is what makes it findable from `git blame`.

## `Assisted-by:` - optional AI provenance

`Assisted-by: <tool>` records that a change was AI-assisted. Adopt it or do not, per team - but if adopted, adopt it consistently, because a partially-used signal is worse than none.

Absence means **unknown**, never "human-authored". Never penalise a change for carrying the trailer; the useful figure is AI-authored *and unattested* surface, not AI-authored surface.

## `Comprehension-Attested-by:` - advisory only

Records that a named human can explain the change (see the teach-back protocol in `assessing-comprehension-debt` when that skill is available). Findings derived from it are **advisory and never block CI** - understanding cannot be proven by a signal, and a gate claiming otherwise loses credibility the first time someone notices.

## Enforcement layers

**Layer 1 - `commit-msg` hook: advisory, always `exit 0`.**

```sh
#!/bin/sh
intent=$(git interpret-trailers --parse <"$1" | sed -n 's/^Intent: //p')
[ -n "$intent" ] && [ "${#intent}" -lt 20 ] && echo "⚠  Intent: is very short. Say why, not what."
exit 0   # never block - a blocking commit-msg hook produces a --no-verify habit
```

**Layer 2 - pre-push or CI: enforcing.** Resolve high-risk surface from the diff, parse trailers across `base..HEAD`, and fail when MUST-level surface carries no valid rationale. Wire it into required checks.

Severity follows the project profile: `critical-regulated` blocks, `standard` warns, `prototype-internal` informs. Never block on `prototype-internal` - the profile exists to buy iteration speed.

## Squash-merge

Squashing rewrites the message, so trailers on intermediate commits vanish. Either put the trailer block in the PR body and enable "use PR body as the squash commit message", or require the trailer on the final commit for high-risk paths.

Verify after merge: `git log -1 --format='%(trailers)'`. A gate that passes pre-merge and loses the record at merge time produces the paperwork without the memory.

## What a check must never do

- Judge whether a rationale is *good* - that is a human call in review.
- Fetch a referenced ticket or URL.
- Block at commit time.
- Require a trailer on a low-risk change.
