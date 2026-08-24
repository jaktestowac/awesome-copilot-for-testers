---
name: Audit collection health
agent: skill-librarian
description: 'Audits a customization collection as a whole: inventory, frontmatter and structural conformance against the house conventions, description trigger quality, overlap and collision clusters between near neighbours, broken cross-references, orphaned and missing resources, drift between assets, plugin copies and generated docs, and which assets have no behavioural test.'
tools: ['read', 'search', 'execute', 'todo']
---

# Task

Audit the customization collection at `${input:collectionRoot}` as one system and return severity-ranked findings I can act on without asking a follow-up question.

Read the conventions from the collection itself before finding anything. Do not fix anything.

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| Collection root | ✅ | `${input:collectionRoot}` - the repository root, or a subdirectory to scope the audit to |
| Scope | ⬜ | `${input:scope}` - asset types to audit, or a commit range like `main...HEAD` to audit only what changed. Defaults to every asset type |
| Conventions | ⬜ | Extra house rules not written down in the collection. Anything not supplied is read from `CONTRIBUTING.md`, the validation scripts, and the counted majority pattern |

## Steps

1. **Establish the conventions.** Read `CONTRIBUTING.md` and any authoring instructions, then the validation scripts, then count the majority pattern across existing assets. Report which source each convention came from. Where the documented rule and the majority practice disagree, report both counts as INFO rather than picking one.
2. **Inventory.** Count every asset by type. List the declared name, description, and scope of each. Name anything that looks like an asset but does not parse.
3. **Check conformance.** Required frontmatter fields, folder-to-name match, naming form, house-style sections present and non-empty, body length against the collection's ceiling.
4. **Score the descriptions.** For each asset: does the description contain phrases a user would actually type, does it name a concrete trigger scenario, and for a deliberate near neighbour, does it name that neighbour and say when to prefer it.
5. **Map overlaps.** Cluster assets by shared trigger vocabulary and scope. For each cluster, say whether the pair disambiguates in both directions, one direction, or neither. Flag any asset whose scope is a strict subset of another's as a merge candidate.
6. **Verify references.** Every Resource Map path resolves; every file under `resources/` is referenced by something; every related-asset name resolves; every prompt's `agent:` target exists; every orchestration handoff resolves inside its pack.
7. **Check the pipeline.** Run the collection's validation in check or dry-run mode only. Compare source assets against vendored copies, registry entries, and generated documentation, including localized copies. Attribute what a script reported rather than presenting it as your own verification.
8. **Report the test gap.** Which assets have behavioural eval cases; which claim "always applies" or a hard scope boundary with nothing testing it; which were edited after their last recorded eval run.
9. **Report** with severity, evidence, and a first step per finding.

## Rules

- **Conventions come from the collection, never from your preferences.** Cite the source for each one - documented, script-enforced, or counted majority.
- **Count what you counted.** "41 of 50" is a finding. "Most skills" is not.
- **Open every file you cite.** Never infer an asset's contents from its name or its neighbours.
- **State the search behind an absence.** An orphan claim is only as wide as the command that looked for references, so give the command.
- **Attribute script output.** "`npm run lint` reports 18 plugin-sync errors" - not "I verified 18 plugin copies".
- **Pre-existing failures are reported as pre-existing.** If the collection's own validation already fails before this audit, say so up front and separate those findings from anything the audited change introduced.
- **Severity follows user impact.** BLOCK is broken for users; WARN degrades the collection; NUDGE is advisory. Not by how easy the fix looks.
- **Do not rank assets by quality.** Report conformance, collisions, and gaps, with evidence.
- Do not edit, create, move, or regenerate anything. No generator in write mode.

## Output

```
Collection: <root> · <counts by asset type>
Conventions read from: <sources>
Verdict: n block · n warn · n nudge · n info
Pre-existing failures: <what was already failing before this audit>

<severity>  <finding-type>  <asset:line>  <one-line action>
…

Overlap clusters: <cluster> <members> <disambiguated both ways / one way / neither>
Test gap: <n> of <n> assets have behavioural cases
Could not verify: <check> - <why> - <what would let it run>
```

Then the full findings, BLOCK first, each with: finding, severity, asset and line, evidence with counts, the convention it violates and where that convention came from, and a concrete first step.

Finish with the exact commands to re-verify, and one line stating what the audit did not cover.
