# Risk Band Rubric

The band answers one question: **if nobody understood this change, would we be able to tell?** It is a proxy for the absence of evidence, not a measurement of understanding.

## Input 1 - complexity added

Measured on the changed code only, not the whole file.

| Signal                 | How to get it                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| New branches           | count added `if`, `else if`, `switch` cases, ternaries, `&&`/`\|\|` short-circuits, `catch`, loop conditions in the diff |
| Nesting depth          | deepest new nesting level introduced                                                                                     |
| New cross-module calls | added imports and calls reaching outside the module                                                                      |
| New async paths        | added `await`, promise chains, event handlers, retries                                                                   |
| New state              | added mutable module-level or shared state                                                                               |

Bands: **high** ≥ 8 new branches, or depth ≥ 4, or ≥ 5 new cross-module calls. **medium** 3–7 new branches. **low** ≤ 2.

`eslint-plugin-sonarjs` cognitive complexity gives a comparable per-function number if it is already configured; use it in preference to counting by hand, and record which method you used.

## Input 2 - size and reviewability

| Signal         | high                              | medium        | low                                 |
| -------------- | --------------------------------- | ------------- | ----------------------------------- |
| Changed lines  | > 400                             | 100–400       | < 100                               |
| Files touched  | > 15                              | 5–15          | < 5                                 |
| Commit shape   | one bulk commit                   | a few commits | a reviewable sequence with messages |
| Mixed concerns | refactor + feature + fix together | two of three  | one concern                         |

Size matters because review attention does not scale with diff length. Past a few hundred lines, review becomes sampling - and a bulk commit removes even the sequence a reader could have followed.

Exclusions: generated code, lockfiles, snapshots, formatting-only changes, and pure renames. A 3,000-line codegen diff is not a comprehension risk. Say what you excluded.

## Input 3 - explanation present

| Evidence                                                         | Weight   |
| ---------------------------------------------------------------- | -------- |
| `Intent:` trailer naming a constraint and a rejected alternative | strong   |
| `Intent-Ref:` to an ADR that discusses alternatives              | strong   |
| Module intent register entry covering the paths                  | strong   |
| Substantive review discussion - questions asked and answered     | moderate |
| Commit body explaining why, beyond restating the diff            | moderate |
| Ticket reference only                                            | weak     |
| Nothing, or a restated diff                                      | none     |

A restated diff counts as **none**. `Intent: refactored pricing for maintainability` is filler, and treating it as explanation is how the band gets gamed.

## Combining

| Complexity | Size   | Explanation | Band                                            |
| ---------- | ------ | ----------- | ----------------------------------------------- |
| high       | high   | none        | **high**                                        |
| high       | any    | none/weak   | **high**                                        |
| any        | high   | none        | **high**                                        |
| high       | high   | strong      | **medium** - explained, but still a lot to hold |
| medium     | medium | none        | **medium**                                      |
| high       | low    | strong      | **low**                                         |
| low        | low    | any         | **low**                                         |

Rule of thumb: two of three inputs at high, or complexity high with no explanation, gives a high band. A strong explanation moves any change down one band - which is the incentive you want.

## Worked examples

**High band.** 640 changed lines across 18 files, one commit, `refactor: tidy up billing`, 14 new branches including three new error paths, no `Intent:` trailer. Nothing here is necessarily wrong - but if nobody understood it, no signal in the repo would say so.

**Medium band.** 220 lines, 6 files, three commits with real messages, 5 new branches, commit body explains the constraint but names no alternative. Explanation is moderate, size and complexity are middling.

**Low band.** 45 lines, 2 files, one new branch, `Intent:` trailer naming the provider's retry behaviour and the rejected queue-based approach. Small, explained, and the explanation would let a stranger change it safely.

**False positive.** 500 lines adding 40 near-identical test cases from a table. Complexity high by branch count, size high, no `Intent:` - band says high, reality is a repetitive, obvious diff. Check before acting; note it and move on.

## Known false positives

Check these before reporting a high band:

- **Table-driven tests and fixtures** - repetitive, obvious, large
- **Config and IaC changes** - many lines, low conceptual load
- **Mechanical migrations** - a codemod applied across a codebase
- **Bulk renames** - enormous diffs, nothing to understand
- **Extracted code** - moving a function raises cross-module call counts without adding anything new to understand

Each of these is a case where the proxy diverges from the thing. Naming the divergence in the report is what earns the metric its credibility.

## Concentration - the finding that matters more than the band

Bands describe changes. Comprehension debt lives in **modules**, and it concentrates. For each module, compute:

- distinct authors in the last 90 days - `1` is a bus-factor finding on its own
- distinct reviewers - `0` or `1` matters more than any band
- share of changes with a high band
- whether any teach-back record exists
- date of the last change by someone other than the primary author

```
src/billing/reconciliation/
  authors 1 (@maria)   reviewers 1 (@lead, avg 4 min to approve)
  high-band changes 7/9    teach-back records 0
  last change by anyone else: never
  → highest comprehension risk in the repo, regardless of individual bands
```

That block is more actionable than any per-change band, and it is the one leadership actually responds to. It is also the one that most needs the no-blame framing: single-author modules are a staffing and review-load outcome, not a personal failing.

## AI provenance, if available

Only when `Assisted-by:` trailers are in consistent use:

| Figure                                        | Meaning                       |
| --------------------------------------------- | ----------------------------- |
| AI-authored share                             | context, not a finding        |
| AI-authored **and** unattested share          | the useful number             |
| AI-authored with high band and no explanation | the specific stack to look at |

Never infer provenance from diff size, phrasing, or commit timing. Wrong often, and once people notice you are guessing, the trailer stops being used and the honest signal is gone.

Report absence as `unknown`. Not `0%`, not "no AI use" - unknown.
