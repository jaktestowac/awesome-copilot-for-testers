---
name: Scope and gate this change
agent: change-gate-reviewer
description: 'Tags a diff into file and hunk tags, resolves which quality practices the change makes relevant, verifies diff coverage and intent rationale, and returns severity-ranked findings with implementable remediation briefs.'
tools: ['read', 'search', 'execute', 'todo']
---

# Task

Review the change between a base ref and `HEAD`: scope it, verify it, and return findings I can act on without asking a follow-up question.

Use `scoping-change-relevance` for the tag grammar and the relevance recipes, `verifying-change-coverage` for coverage, and `recording-change-intent` for the rationale check.

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Base ref | ✅ | `${input:baseRef}` - e.g. `main`, or `HEAD` for uncommitted work |
| Coverage artifact | ⬜ | Path to LCOV/Cobertura, or the command that produces it |
| Quality contract | ⬜ | `.qa/quality-contract.md` if it exists - otherwise run against escalation defaults and label the result un-contracted |

## Steps

1. **Pin the diff.** `git diff <base>...HEAD --name-status` and `git log <base>..HEAD --oneline`. Confirm the ref resolves and the diff is non-empty. List what you excluded from tagging.
2. **Tag the files** by path: `source`, `test`, `config`, `infra`, `public-api`, `schema`, `auth`, `critical-path`, `db-migration`, `ai`, `secret-suspect`, `generated`.
3. **Tag the hunks** by reading added *and removed* lines: `new-public-export`, `new-endpoint`, `modified-auth`, `secret-like-string`, `sql-string`, `exec-call`, `db-migration`, `modified-error-handling`, `modified-request-schema`, `added-dependency`, `modified-prompt`, `new-external-call`, `removed-test`, `removed-validation`, `loosened-type`, `removed-guard`, `disabled-check`.
4. **Resolve relevant practices** from the tags, then intersect with the contract. Record which tag triggered each practice.
5. **Verify coverage** on changed lines if an artifact exists. Group uncovered lines and classify each group - untested logic, untested integration, defensive, instrumentation, unreachable, hard to reach. No artifact means INFO plus "produce one", never a coverage figure.
6. **Check intent** if any escalation tag is present: is there an `Intent:`/`Intent-Ref:` trailer, an ADR link, or a module register entry covering this surface?
7. **Report** with severity.

## Rules

- **Read the hunks, do not just match paths.** A `new-endpoint` in a pre-existing file is invisible to path tagging.
- **Read removals.** A deleted test, a removed validation, a loosened type, a new `continue-on-error` - these are risk-increasing edits and the ones reviews miss.
- **Escalate on any auth, secret, SQL, exec, migration or removed-guard signal.** There is no small auth change.
- **Every finding carries a brief:** practice, severity, touched lines, repo conventions (runner, naming, location, style, mocking - read from the repo), what changed that needs covering, acceptance criteria, and a concrete first step.
- **State what is out of scope and why.** A list of only what to run reads as arbitrary.
- **Name the blind spots** the tag grammar cannot see: config-driven behaviour, data-shape risk, blast radius through shared packages.
- Do not fix anything. Findings and briefs only.

## Output

```
Verdict: BLOCK · n block · n warn · n nudge · n info
Scope:   n files · tags: …
Relevant: …
Out of scope: … (with reasons)

<severity>  <practice>  <file>  <one-line action>
…

Flags: removed tests, removed guards, disabled checks
Blind spots: …
```

Then the full briefs, BLOCK first, and the exact command to re-verify once they are addressed.
