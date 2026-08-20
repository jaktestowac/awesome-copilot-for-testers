# Plugin README Template

The scaffolder generates a stub. This is what a finished one contains.

---

````markdown
---
description: 'Runs session-based exploratory testing: charters, timeboxed sessions, coverage heuristics, evidence-carrying notes, and debriefs that route every finding somewhere. Bundles charter templates with worked examples per context, SFDIPOT and CRUSSPIC coverage heuristics, twelve named tours, a session note template with a coverage summary, and the PROOF debrief.'
---

# Planning Exploratory Testing Plugin

Exploratory testing gets dismissed because it is indistinguishable from unstructured clicking when nobody writes anything down. Three things make it accountable: a charter that says what the session is for, a timebox that makes coverage countable, and notes written during the session rather than reconstructed after it. This plugin supplies all three and the debrief that routes what they produce.

## What's inside

- `skills/planning-exploratory-testing/` — the workflow: frame the mission, write and prioritize charters, pick the heuristics, run the timeboxed session, debrief, route the findings, report coverage.

Bundled resources:

- `resources/charter-templates.md` — the explore/with/to-discover format, eight worked charters covering new features, sibling sweeps, third-party failure, legacy areas, release risk, quality attributes, data, and authorization, plus a charter-smells table and the sizing guide
- `resources/heuristics-cheatsheet.md` — SFDIPOT product elements, CRUSSPIC STMPL quality criteria, twelve named tours with what each finds, and input, state, and data heuristics, ending with the eight oracles that turn an observation into a finding
- `resources/session-notes-template.md` — the during-session note format with its inline conventions, the time-split table, and the cross-session coverage summary with per-area confidence
- `resources/debrief-checklist.md` — the PROOF debrief, the routing table that gives every finding a destination, and the session quality check

Generated from the repository's `skills/` directory, which is the source of truth.

Related: the `designing-functional-tests` plugin turns session findings into structured cases; `reporting-bugs` handles the defects a session produces.

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install planning-exploratory-testing
```

## Note on source of truth

The skill content is a copy of `skills/planning-exploratory-testing/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
````

---

## Section rules

### Frontmatter `description`

Consumed by the README generator for the repository-level tables. Same content as the marketplace description, or close to it.

### Opening paragraph

The problem, not the feature. A reader deciding whether to install is asking whether they have this problem.

> Exploratory testing gets dismissed because it is indistinguishable from unstructured clicking
> when nobody writes anything down.

beats

> This plugin provides exploratory testing capabilities.

The first names a situation the reader recognizes. The second could describe anything.

### "What's inside", and why the resource list matters

Two levels: the skill and its resources, each with a phrase saying what is in it.

This is the section that decides installs. Compare:

> - `resources/heuristics-cheatsheet.md` — heuristics for exploratory testing

against the version in the template above. The first is the filename restated; the second tells a reader that SFDIPOT, twelve tours, and an oracle list are in there, which is the actual reason to install.

Write the phrase as though the reader is deciding whether to open the file.

### Related

Name the neighbouring plugins and when to reach for those instead. Two plugins that overlap should each say so; a user who installs the wrong one and gets a poor result blames both.

### Installation

Copy the commands verbatim from an existing plugin README. Consistency matters more than phrasing here, and a divergent command in one README is a support question.

### Source-of-truth note

Keep it, verbatim, in every plugin README. It is the line that stops the next contributor from editing the generated copy.

## What to leave out

| Do not write | Because |
| --- | --- |
| The skill's full workflow | It is in the SKILL.md, one directory down, and it will drift |
| A changelog | Git has it |
| Configuration instructions | Skills need no configuration |
| Aspirational content | It teaches readers the README is marketing |
| A "coming soon" section | Ship it or leave it out |

## Regenerating

The scaffolder never overwrites an existing README, so hand edits are safe. After editing:

```bash
npm run generate   # repository README tables
npm run check      # verify sync
```
