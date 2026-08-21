---
name: Audit quality debt and silent skips
agent: quality-debt-auditor
description: 'Audits the three debts - technical, intent and comprehension - and inventories every silent skip in the repo: skipped tests, disabled lint rules, ts-expect-error, continue-on-error, coverage ignores, lowered thresholds, raised retries and expired waivers.'
tools: ['read', 'search', 'execute', 'edit', 'todo']
---

# Task

Audit the governance layer of this repository: what it claims to enforce, what it actually enforces, and what it has quietly stopped enforcing.

Use `governing-quality-waivers` for the silent-skip inventory, `recording-change-intent` for the intent pass, and `deriving-a-quality-contract` for the technical gap.

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Repository | ✅ | The workspace, or `${input:repoPath}` |
| Audit range | ⬜ | Commit range for the intent and comprehension pass - default: the last 90 days |
| Quality contract | ⬜ | `.qa/quality-contract.md` if it exists; otherwise audit against the escalation defaults and say so |
| Previous audit | ⬜ | For trend direction |

## Steps

1. **Technical debt** - gap matrix against the contract. Missing practices, partial ones, and gates that cannot fail.
2. **Silent skips** - inventory every suppression. Tests (`.skip`, `.only`, `.todo`, empty bodies, deleted specs), lint (inline and whole-file disables, rules set to off, ignore patterns), types (`@ts-expect-error`, `@ts-nocheck`, `any`, `strict: false` per package), CI (`continue-on-error`, `|| true`, `allow_failure`, schedule-only jobs, non-required checks), coverage (ignores, excludes, thresholds below current value), leniency (`retries` with no flake measurement, huge timeouts, hard waits), security (allowlists, open advisories, `--force`, `--ignore-scripts`), hooks (`--no-verify` in scripts or docs), AI gates (skipped evals, lowered eval thresholds).
3. **Waiver health** - expired, unbounded, unowned, or renewed more than twice.
4. **Intent debt** - high-risk changes in the range with no `Intent:`/`Intent-Ref:` trailer, no ADR link, no module register entry. Report malformed records separately from missing ones.
5. **Comprehension risk** - advisory band from diff size, new-branch density, and whether a human explanation accompanied the change. Report AI provenance only if `Assisted-by:` trailers are in use; otherwise "unknown".
6. **Trend** - where a previous audit exists, report direction per debt.

## Rules

- **Count, then name.** "46 suppressions, 7 explained, 0 registered" is what moves a team.
- **Quote a path and a line for every finding.** Governance findings get argued with more than code findings.
- **Comprehension findings never block.** Report the band and the unattested surface. Understanding cannot be proven by a signal, and claiming otherwise discredits the whole report.
- **Separate "not done" from "not visible".** Anything you could not assess is UNKNOWN with what you would need.
- **Every finding gets one of three outcomes:** fix, waive with reason/owner/expiry, or delete. No fourth option.
- **Do not name individuals as the problem.** Owners are for accountability on the fix.
- Do not fix anything. Report and plan.

## Output

Grouped by debt, in this order: **technical → silent skips → waivers → intent → comprehension → trend**, each with counts first and evidence beneath. Then an ordered plan, highest-hiding and lowest-effort first, each item naming the file, the fix, and who should own it.

Start the plan with the four that hide the most: whole-file disables, `|| true` in CI, coverage exclusions over logic directories, and any committed `.only`.
