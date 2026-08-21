# Intent Trailer Specification

## Grammar

Trailers are the `Key: value` block at the end of a commit message - the same mechanism `Signed-off-by:` uses, understood by `git interpret-trailers` and readable via `git log --format='%(trailers)'`. No tooling and no external service required.

```
<type>(<scope>): <subject>

<body - what and why, in prose>

Intent: <rationale: why now, what constrained the shape, what was rejected>
Intent-Ref: <ADR-nnnn | TICKET-nnn | https://…>
Assisted-by: <tool>              # optional AI-provenance signal
Comprehension-Attested-by: <name> # optional teach-back record
```

Rules:

- The trailer block is the **last** paragraph, one `Key: value` per line. A blank line before it, none inside it.
- Continuation lines are indented by two spaces. Unindented text ends the block.
- `Intent:` and `Intent-Ref:` may both appear. Either alone is sufficient.
- Keys are case-insensitive in practice; write them as shown.

## Validation rules

| Rule                   | Check                                                                       | Failure is |
| ---------------------- | --------------------------------------------------------------------------- | ---------- |
| Minimum substance      | `Intent:` value ≥ 20 characters after trimming                              | malformed  |
| Not a restated subject | `Intent:` value is not a near-duplicate of the commit subject               | malformed  |
| Ref shape              | `Intent-Ref:` matches `ADR-\d+`, `[A-Z][A-Z0-9]+-\d+`, or an `https://` URL | malformed  |
| Placement              | trailer block is the final paragraph                                        | malformed  |
| Key spelling           | `Intent`, not `intent-ref`, `Intention`, or `Why`                           | malformed  |
| Coverage               | some commit in the range carries a rationale covering the high-risk paths   | undeclared |

**Malformed and undeclared are reported differently.** Malformed means someone tried and the record needs fixing - quote the rule and the corrected form. Undeclared means nothing exists and it needs writing. Treating them as the same finding is what makes an intent gate feel arbitrary.

Pattern validation only. Do not fetch the referenced ticket or URL - the gate must work offline, and a network dependency in a commit-time check is a gate that fails on a train.

## Good records

Idempotency constraint, with the rejected alternative:

```
Intent: Partial refunds must be idempotent because the payment provider
  retries webhooks up to 5 times. We key on (orderId, providerRefundId)
  rather than generating our own id, so a retry cannot double-refund.
  Rejected a queue-based dedupe - it needs a new consumer and the
  reconciliation window is 15 minutes, not seconds.
```

A deliberate, ugly-looking decision:

```
Intent: Session TTL drops from 24h to 2h following the SOC2 finding in
  SEC-88. Kept the sliding-window refresh so active users are not logged
  out mid-checkout; the shorter absolute cap is enforced separately in
  refreshSession. Rejected a global 2h hard cap - it would have broken
  the long-running import flow.
Intent-Ref: SEC-88
```

Pointing at a written decision:

```
Intent-Ref: ADR-0042
```

Sufficient on its own - `docs/adr/0042-*.md` holds the context, the alternatives, and the consequences. This is the preferred form for architectural changes, because an ADR has room for what a trailer does not.

Migration, where reversibility is the point:

```
Intent: Adds orders.refunded_at as nullable so the backfill can run
  without locking the table; the NOT NULL constraint lands in a second
  migration after the backfill completes. Reversible: dropping the column
  is safe until the constraint migration ships.
```

## Bad records, and why

| Record                                                                    | Problem                                                              |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `Intent: added the refund endpoint`                                       | restates the diff; says nothing a reader cannot see                  |
| `Intent: refactoring`                                                     | no information; also fails the length rule                           |
| `Intent: as discussed`                                                    | the discussion is what needed capturing                              |
| `Intent: see PR`                                                          | the PR body does not survive a squash-merge, and reviews get deleted |
| `Intent: fix bug`                                                         | which bug, and why this fix rather than another                      |
| `Intent-Ref: JIRA`                                                        | not a resolvable reference                                           |
| `Intent: Implements the requirements from the ticket.`                    | passes a length check, carries nothing - the classic filler shape    |
| `Intent: Refactored pricing to improve maintainability and code quality.` | generated-sounding, unfalsifiable, no constraint named               |

The last two are what a length-only check lets through, which is why a human reads intent records and why the reviewer's question is: **would this help someone six months from now who is about to change this code?**

## Writing one with git

```bash
# amend HEAD with a trailer
git commit --amend --trailer "Intent: <rationale>"
git commit --amend --trailer "Intent-Ref: ADR-0042"

# on a new commit
git commit -m "feat(billing): allow partial refunds" \
           -m "Support cannot resolve disputes without a full reversal." \
           --trailer "Intent: Idempotent on (orderId, providerRefundId) because the provider retries webhooks."

# check what a range carries
git log main..HEAD --format='%h %s%n  Intent: %(trailers:key=Intent,valueonly)'
```

`git commit --trailer` places the block correctly, which is worth using rather than typing trailers by hand - a trailer in the wrong paragraph is invisible to every parser.

## Layer 1 - commit-msg hook (advisory)

Fast, non-blocking, catches the typo while the author still has the context.

```sh
#!/bin/sh
# .husky/commit-msg  - warns, never blocks
msg_file="$1"
intent=$(git interpret-trailers --parse <"$msg_file" | sed -n 's/^Intent: //p')
ref=$(git interpret-trailers --parse <"$msg_file" | sed -n 's/^Intent-Ref: //p')

if [ -n "$intent" ] && [ "${#intent}" -lt 20 ]; then
  echo "⚠  Intent: trailer is very short (${#intent} chars). Say why, not what."
fi
if [ -n "$ref" ] && ! printf '%s' "$ref" | grep -qE '^(ADR-[0-9]+|[A-Z][A-Z0-9]+-[0-9]+|https?://)'; then
  echo "⚠  Intent-Ref: '$ref' does not look like an ADR id, issue key, or URL."
fi
exit 0   # always succeeds - this layer informs, it does not gate
```

`exit 0` is deliberate. A blocking commit-msg hook is the fastest route to a team-wide `--no-verify` habit, and then both layers are gone.

## Layer 2 - CI check (enforcing)

```yaml
intent-gate:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
      with: { fetch-depth: 0 }
    - name: High-risk surface needs a rationale
      run: |
        BASE="origin/${{ github.base_ref }}"
        # high-risk if the diff touches these paths or adds these shapes
        risky=$(git diff "$BASE"...HEAD --name-only \
          | grep -E '(auth|session|payment|billing|migrations)/' || true)
        shapes=$(git diff "$BASE"...HEAD -U0 \
          | grep -E '^\+.*(export (function|class|const)|app\.(get|post|put|delete)|ALTER TABLE)' || true)
        [ -z "$risky$shapes" ] && { echo "No high-risk surface - no rationale required."; exit 0; }

        intents=$(git log "$BASE"..HEAD --format='%(trailers:key=Intent,valueonly)%(trailers:key=Intent-Ref,valueonly)' | tr -d '[:space:]')
        if [ -z "$intents" ]; then
          echo "::error::High-risk surface with no Intent:/Intent-Ref: trailer."
          echo "Fix: git commit --amend --trailer \"Intent: <why>\""
          exit 1
        fi
```

This is a floor, not a finished gate: it proves _some_ rationale exists on a range containing high-risk surface. It cannot tell whether the rationale is real, which is the part a human does in review. Pair it with the "restated diff" check in review, not in CI.

## Squash-merge

Squashing rewrites the message, so trailers written on intermediate commits vanish. Two workable answers:

- Put the rationale in the **PR title/body template** with an `Intent:` trailer block at the bottom, and enable "use PR body as the squash commit message".
- Or require the trailer on the **final** commit and disable squash for changes touching high-risk paths.

Whichever you choose, verify after merge: `git log -1 --format='%(trailers)' main`. A gate that passes pre-merge and loses the record at merge time is worse than no gate, because it produces the paperwork without the memory.
