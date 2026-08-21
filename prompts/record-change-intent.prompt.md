---
name: Record the intent behind a change
agent: agent
description: 'Finds the high-risk surface in a change range, checks whether a rationale already exists in commit trailers, ADRs or a module intent register, and drafts an Intent trailer for the author to confirm - why now, what constrained the shape, what was rejected.'
tools: ['read', 'search', 'execute', 'edit', 'todo']
---

# Task

Make sure this change carries a recorded reason, and that the reason is worth reading.

Use the `recording-change-intent` skill for the trailer grammar, the high-risk surface rules and the validation rules.

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Change range | ✅ | `${input:range}` - e.g. `main..HEAD`, or `HEAD~1..HEAD` |
| Why this change was made | ⬜ | If you can tell me, this becomes the rationale rather than a draft |
| Where rationale lives here | ⬜ | Commit trailers, `docs/adr/`, an issue tracker, `.qa/intent.md` |

## Steps

1. **Find the high-risk surface** in the range: new public exports, new endpoints, modified auth, schema or migration changes, removed guards or validation or tests, new external dependencies or calls, contract changes, and anything under a `critical-path` module. If there is none, say so and stop - no rationale is required.
2. **Look for existing rationale**, in all four places:
   - `git log <range> --format='%(trailers:key=Intent,valueonly)'`
   - `git log <range> --format='%(trailers:key=Intent-Ref,valueonly)'`
   - an ADR under `docs/adr/` that this change implements
   - a `.qa/intent.md` module register entry covering the touched paths
3. **Classify each high-risk change**: covered, undeclared, malformed (a trailer that fails its rule), restated-diff (a rationale that only says what the diff says), or waived by a path-scoped intent waiver.
4. **Draft what is missing.** From the diff, the branch name, the linked ticket and the surrounding code, write a rationale answering three questions:
   - **why now** - the trigger: a bug, a requirement, a limit that was hit
   - **what constrained the shape** - why it is not the obvious implementation
   - **what was rejected** - the alternative someone will propose in six months
5. **Hand the draft over.** Mark it clearly as a draft and give me the exact command to apply it:

   ```bash
   git commit --amend --trailer "Intent: <rationale>"
   git commit --amend --trailer "Intent-Ref: ADR-0042"
   ```

## Rules

- **Intent is why, not what.** The diff already says what changed. `refactor: extract computeRefund` is a restated diff, not a rationale.
- **A human confirms it.** You draft; the author confirms or rewrites. A generated rationale nobody read is intent theatre, and it is the exact failure this practice exists to prevent - so never commit one as final.
- **Report malformed separately from missing.** One needs fixing, the other needs writing. Quote the failing rule and the corrected form.
- **Reject filler.** "Implements the requirements from the ticket" passes a length check and carries nothing. The test: would this help someone six months from now who is about to change this code?
- **Only high-risk surface needs a record.** Say explicitly when a change needs nothing - that is what keeps the practice from being read as a tax.
- **Do not fetch tickets or URLs.** Validate the reference shape only; the check must work offline.

## Output

1. High-risk surface found, with the rule that made each item high-risk - or a clear "none, no rationale required".
2. Existing rationale, and what it covers.
3. Per change: covered / undeclared / malformed / restated / waived.
4. Drafted rationales, marked as drafts, with the `git commit --amend --trailer` command for each.
5. A note on squash-merge if this repo squashes: where the trailer must live to survive, and how to verify after merge.
