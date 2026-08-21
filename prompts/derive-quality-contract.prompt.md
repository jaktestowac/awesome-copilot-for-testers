---
name: Derive a quality contract
agent: quality-contract-architect
description: 'Derives which testing practices are MUST, SHOULD or COULD for this specific project from its risk profile, team maturity and product surfaces, then reports a PRESENT/PARTIAL/MISSING/WAIVED gap matrix and an ordered remediation plan.'
tools: ['read', 'search', 'execute', 'edit', 'todo']
---

# Task

Derive this project's quality contract and report the gap between the contract and reality.

Use the `deriving-a-quality-contract` skill for the catalog, the profiles, the maturity model and the detection signals. Do not invent a practice list.

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Repository | ✅ | The workspace, or a path: `${input:repoPath}` |
| How critical is this system | ✅ | Who is harmed by a defect, and how badly: `${input:criticality}` |
| Regulatory or contractual exposure | ⬜ | Finance, health, public sector, SOC2, GDPR-heavy |
| Rollback speed | ⬜ | Can a bad release be undone in minutes, or not at all |
| Team experience with testing | ⬜ | Read from the repo if not supplied |
| Known out-of-scope areas | ⬜ | Practices already ruled out, and by whom |

If the criticality answer is missing, **ask for it before resolving anything**. It sets the profile, and the profile sets every requirement level in the contract.

## Steps

1. **Detect the triple.** Stack and tooling from manifests and CI. Product surfaces (`web-ui`, `http-api`, `wire-schema`, `ai-llm`, `data-store`, `library`, `cli`) with the evidence for each, and which are confidently absent. Maturity from the repo as it is, not from the team's ambition.
2. **Propose the profile** with the one sentence that justifies it, then **stop and confirm the triple with me** before continuing.
3. **Resolve the contract.** Drop practices whose required surface is absent (record as N/A with the reason). Defer practices above the current maturity (record as next level). Label the rest MUST / SHOULD / COULD.
4. **Detect current state** per practice: PRESENT (configured *and* enforced), PARTIAL, MISSING, WAIVED, or UNKNOWN. Quote a path, a dependency, or a CI step with a line number for every state.
5. **Grade the gap.** MUST + MISSING is a blocker and is not waivable. Order everything else by risk × effort.
6. **Write the artifacts** to `.qa/quality-contract.md`, plus `.qa/quality-contract.yaml` if gate tooling will read it.

## Rules

- **Configured is not verified.** A test runner in `package.json` proves the practice exists, not that recent changes were tested. Say which you measured.
- **Catch the fake gates.** `continue-on-error: true`, `|| true`, `|| echo "non-blocking"`, ESLint without `--max-warnings 0`, a job that is not a required check, a threshold set below the current value. Each is PARTIAL, and quote the line.
- **Never mark a manual practice PRESENT from tooling.** Code review, exploratory testing, UAT, accessibility, observability readiness are attested or unattested - with a date and a name, or nothing.
- **Use UNKNOWN.** Where you cannot determine a state, say so and say what you would need. Do not collapse it into MISSING.
- **No aspirational profiling.** An unsatisfiable contract gets ignored, which is worse than an honest `standard`.
- In a monorepo, derive per package if the packages differ in criticality, and say so.

## Output

1. The triple, with the evidence and one-sentence justification per axis.
2. Blockers - MUST practices in state MISSING - on their own lines.
3. The contract table: practice, level, tool, exit criterion, owner.
4. The gap matrix: practice, level, state, evidence, verdict.
5. Gap summary as counts: `n blockers · n to fix · n to attest · n unknown · n ok`.
6. The remediation plan, ordered, each item starting with a command I can run today.
7. What the contract does not cover: N/A practices, deferred practices, everything UNKNOWN.
8. The re-derivation trigger - what change should cause this contract to be rebuilt.
