# Quality Governance - Resource Set

A themed bundle for the layer above test writing: deciding **which** quality practices this project actually commits to, detecting whether they are enforced, recording the exceptions honestly, and making the direction visible over time.

It exists because most quality problems are not "we need more tests". They are "nobody agreed what mandatory means here", "the gate reports green but cannot fail", "we switched that check off during an incident in March", and "nobody can explain the module that ships weekly".

The set is aimed at leads, QE architects, and anyone who has to defend a quality position to a client or an auditor.

## Contents

| Resource                                                                                            | Type         | Purpose                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [deriving-a-quality-contract](../../skills/deriving-a-quality-contract/)                            | Skill        | Derives MUST/SHOULD/COULD per practice from risk profile × maturity × product surface, then a PRESENT/PARTIAL/MISSING/WAIVED gap matrix and an ordered plan |
| [scoping-change-relevance](../../skills/scoping-change-relevance/)                                  | Skill        | Tags a diff and resolves which contracted practices this specific change makes relevant                                                                     |
| [verifying-change-coverage](../../skills/verifying-change-coverage/)                                | Skill        | Diff coverage on changed lines instead of repo-wide percentages, with risk-based escalation                                                                 |
| [governing-quality-waivers](../../skills/governing-quality-waivers/)                                | Skill        | Dated, attributed, expiring waivers - plus the inventory of silent skips already in the repo                                                                |
| [recording-change-intent](../../skills/recording-change-intent/)                                    | Skill        | An externalised human rationale on high-risk changes, via `Intent:` trailers, ADRs or a module register                                                     |
| [assessing-comprehension-debt](../../skills/assessing-comprehension-debt/)                          | Skill        | The advisory measure of code nobody has attested to understanding, with a teach-back protocol                                                               |
| [attesting-manual-verification](../../skills/attesting-manual-verification/)                        | Skill        | Human verification recorded as dated attestations, so manual practices stay in the contract without faking automation                                       |
| [generating-quality-gate-workflows](../../skills/generating-quality-gate-workflows/)                | Skill        | The CI that actually enforces the contract - layered, diff-scoped, with no swallowed failures                                                               |
| [tracking-quality-trends](../../skills/tracking-quality-trends/)                                    | Skill        | Direction per metric, plus the structural changes a snapshot never shows                                                                                    |
| [quality-contract-architect](../../agents/quality-contract-architect.agent.md)                      | Custom agent | Derives and maintains the contract; confirms the triple with a human before resolving anything                                                              |
| [change-gate-reviewer](../../agents/change-gate-reviewer.agent.md)                                  | Custom agent | Read-only per-diff gate: scope, verify, and return findings with remediation briefs                                                                         |
| [quality-debt-auditor](../../agents/quality-debt-auditor.agent.md)                                  | Custom agent | Audits all three debts - technical, intent, comprehension - each with its honest ceiling                                                                    |
| [derive-quality-contract](../../prompts/derive-quality-contract.prompt.md)                          | Prompt       | One-shot contract derivation, routed to the architect                                                                                                       |
| [scope-change-gate](../../prompts/scope-change-gate.prompt.md)                                      | Prompt       | Per-change scope, coverage and intent check                                                                                                                 |
| [audit-quality-debt](../../prompts/audit-quality-debt.prompt.md)                                    | Prompt       | Three-debt audit plus the silent-skip inventory                                                                                                             |
| [record-change-intent](../../prompts/record-change-intent.prompt.md)                                | Prompt       | Drafts an `Intent:` trailer for the author to confirm                                                                                                       |
| [quality-gate-workflows.instructions.md](../../instructions/quality-gate-workflows.instructions.md) | Instructions | Rules for CI gate files: no `\|\| true`, soft gates as soft gates, required checks, diff scoping                                                            |
| [commit-trailers.instructions.md](../../instructions/commit-trailers.instructions.md)               | Instructions | Grammar and enforcement layers for `Intent`, `Intent-Ref`, `Assisted-by`, `Comprehension-Attested-by`                                                       |

## The idea behind it

**Three debts, three different ceilings.** Technical debt is measurable, so it can block a build. Intent debt is checkable, so it can block where the risk profile demands it. Comprehension debt cannot be proven by any signal - understanding lives in people's heads - so it stays advisory forever. Matching the enforcement strength to what each debt can honestly support is what keeps the whole set credible.

The one that matters most for AI-assisted teams: **intent debt is the debt an agent structurally cannot pay down.** An agent can write the implementation, the tests and the docs; it cannot supply the human reason the work was commissioned. As agent output grows, that gap grows while every other quality signal keeps looking healthy.

## How to use

**First run, on a project with no agreed strategy:**

1. Install the three agents into `.github/agents/`, the four prompts into `.github/prompts/`, and the skills wherever your agent discovers them.
2. Run `/derive-quality-contract`. Answer the criticality questions - the profile they set drives every requirement level. Confirm the triple.
3. Read the blockers. If there are more than a handful, the profile was probably aspirational; re-derive.
4. Run `/audit-quality-debt` to find what the repo has quietly stopped enforcing. Expect more suppressions than anyone predicted.
5. Fix, waive or delete each finding. Register every waiver with a reason, an owner and an expiry.
6. Generate the CI gates. Roll them out report → warn → block on escalated paths → block everywhere.

**Per change, once the contract exists:** `/scope-change-gate` before pushing, `/record-change-intent` when it touches high-risk surface.

**Per cadence:** re-derive the contract, re-run the audit, and write the trend report. Read the previous trend report first - a trend report that does not reference its predecessor is a snapshot with a date on it.

## What this set will not do for you

- It will not decide how critical your system is. It asks; a human answers.
- It will not grant a waiver. A waiver needs someone who accepts the risk.
- It will not prove anyone understands the code. It measures the absence of evidence and says so in those words.
- It will not make a gate stick. Only branch protection does that.
