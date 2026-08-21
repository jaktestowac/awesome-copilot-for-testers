---
name: assessing-comprehension-debt
description: 'Measures the risk that code shipped without anyone understanding it: a teach-back attestation on high-risk changes, a risk band from changed-code complexity, diff size and whether a human explanation accompanied it, and optional AI-authorship provenance. Findings stay advisory by design. Use when an AI-assisted codebase grows faster than the team reads it, when reviews are rubber-stamped, when nobody can explain a module that ships weekly, or when leadership asks how much of the code the team can actually maintain.'
argument-hint: 'Commit range or release scope, whether AI-provenance trailers are in use, and which modules matter most'
user-invocable: true
---

# Assessing Comprehension Debt

Use this skill when code is arriving faster than anyone is reading it, and every other quality signal still looks fine.

Comprehension debt is the gap between the code that exists and the code the team actually understands. Tests pass, coverage holds, lint is clean - and nobody can explain why the pricing module works. When an agent writes the implementation *and* the tests, both signals go green without a single human forming a mental model. That is the debt this skill makes visible.

**It is advisory, permanently, on purpose.** Understanding lives in people's heads and cannot be proven by any signal. What can be measured is the *risk* of comprehension debt and the *absence of evidence* of understanding. A gate that claims to measure understanding is lying, and once someone notices, every finding it ever produced loses credibility.

## When to Use

- an AI-assisted or agent-generated codebase is growing faster than the team reads it
- reviews are fast, approvals are frequent, and nobody asks questions
- a module ships weekly and no one volunteers to explain it
- a bus-factor conversation needs evidence instead of anecdote
- a quarterly quality review should cover more than test coverage
- onboarding is slow in a codebase that looks well-tested

## Operating Principles

- **Never blocks.** Findings cap below the project's blocking threshold. State that ceiling in the report, every time.
- **Measure absence of evidence, not understanding.** Say it in those words. The band is a proxy; treat it as a prompt for a conversation, not a score.
- **The risk band is directional, not precise.** It says "this change is the shape of one nobody understands", not "nobody understands this change".
- **AI provenance is a signal, never a penalty.** The useful figure is AI-authored *and* unattested. AI-authored and well-understood is a good outcome, and if trailers are not in use the honest answer is "unknown".
- **A human explanation lowers the band.** An `Intent:` trailer or an ADR is evidence that somebody thought about it. That is exactly the behaviour to reward.
- **Teach-back beats approval.** "I approve" is a click. "I can explain what happens when the provider retries this webhook" is comprehension.
- **Never blame individuals.** A high band on a module is a system outcome: review load, delivery pressure, tooling. Naming people converts a useful signal into something nobody will run twice.
- **Trend over snapshot.** One reading is noise. Direction over a quarter is the finding.

## Workflow

### Phase 1: Establish scope and whether provenance exists

Pick the range: a release, a quarter, a module's history. Then check what signals are available:

```bash
git log <range> --format='%h %an %s'
git log <range> --format='%(trailers:key=Intent,valueonly)'
git log <range> --format='%(trailers:key=Assisted-by,valueonly)'
git log <range> --format='%(trailers:key=Comprehension-Attested-by,valueonly)'
git log <range> --numstat
```

If `Assisted-by:` trailers are not in use, provenance is **unknown** - report it as unknown and move on. Do not infer AI authorship from commit size, style, or timing; those inferences are wrong often enough to poison the whole report.

### Phase 2: Compute the risk band per change or module

Three inputs, from `./resources/risk-band-rubric.md`:

| Input | Signal |
| --- | --- |
| **Complexity added** | new branches, new conditionals, nesting depth, new cross-module calls |
| **Size** | changed lines, files touched, whether it lands as one commit or a reviewable sequence |
| **Explanation present** | an `Intent:` trailer, an ADR link, a module register entry, or a substantive review discussion |

Bands: **high** (large, branch-heavy, no explanation), **medium** (one of the three), **low** (small, or well explained, or both).

A high band means: *if nobody understands this, we would not be able to tell.* That is all it means, and saying so plainly is what keeps the metric usable.

### Phase 3: Check teach-back attestation on high-risk surface

For changes on high-risk surface (`recording-change-intent` has the rules), look for a record that a named human can explain it:

- a `Comprehension-Attested-by: <name>` trailer, author-side or reviewer-side
- an entry in the attestation register (`attesting-manual-verification`)

Status is **FULL** (attested), **NONE** (high-risk surface, no record), or **N/A** (not high-risk surface).

Where a record is missing and it matters, run the teach-back in `./resources/teach-back-protocol.md`: four questions, ten minutes, and the answers tell you more than the band ever will. The protocol's value is not the record - it is that the conversation happens.

### Phase 4: Report the picture

- **Risk bands** by module, with the inputs that produced each one
- **Attestation status** on high-risk surface, and the specific changes with none
- **Provenance**, if known: AI-authored share, and the share that is AI-authored and unattested
- **Trend** against the previous assessment, per module
- **Concentration** - comprehension debt clusters. A module where one person authored everything and nobody reviewed it is the finding, regardless of any band
- **The ceiling**, stated explicitly: these findings are advisory and do not fail the build

Then the only recommendations worth making: which specific modules deserve a teach-back session, which deserve a walkthrough written down, and which deserve a second pair of eyes on the next change.

## What This Skill Cannot Do

Worth stating in the report, because the temptation to over-read the number is strong:

- It cannot tell you whether a person understands code. Only whether evidence exists.
- It cannot distinguish elegant-and-obvious from complex-and-opaque. A high band on genuinely well-written code is a false positive; check before acting.
- It cannot detect understanding that lives in a conversation, a diagram, or a head. Absence of a trailer is not absence of thought.
- It cannot be used for performance assessment, and using it that way guarantees the trailers become theatre.

## Common Failure Modes

- **Letting it block.** The single failure that discredits the whole practice.
- **Treating the band as a verdict.** "High band" is a prompt to have a conversation, not a defect.
- **Inferring AI authorship.** From commit size, from phrasing, from the hour of the day. Wrong often, and corrosive when it is.
- **Penalising `Assisted-by:`.** Teams stop using the trailer, and the one honest signal disappears.
- **Naming individuals.** Converts a system signal into a personnel matter, and the next assessment never happens.
- **Confusing approval with comprehension.** A merged PR with an approving click is not evidence of understanding.
- **Reporting one number for the repo.** Comprehension debt concentrates; an average hides exactly the module you needed to see.
- **Skipping the teach-back.** The band is the cheap proxy; the conversation is the actual value.

## Resource Map

- `./resources/risk-band-rubric.md` - the three inputs, how to compute each, band boundaries, worked examples, and known false positives
- `./resources/teach-back-protocol.md` - the four questions, how to run a ten-minute session, what a weak answer looks like, and how to record the outcome

## Related Skills

- `recording-change-intent` - an `Intent:` record is an input to the band, and the sibling debt this one pairs with
- `attesting-manual-verification` - where a teach-back record lives and how it expires
- `governing-quality-waivers` - the third governance record: why a check is off
- `tech-debt-analysis` - code and architecture health, as opposed to whether anyone understands it
- `documenting-test-suites` - the usual remediation when a suite is unmaintainable by anyone who did not build it
- `code-review-advanced` - where a teach-back conversation naturally belongs
- `analyzing-quality-metrics` - for trending the band honestly, with its caveats attached

## Definition of Done

This skill is complete when:

- the scope is stated and the available signals are established, with provenance marked unknown where trailers are not in use
- every change or module in scope has a band with the three inputs that produced it
- teach-back status on high-risk surface is FULL / NONE / N/A, with the specific unattested changes named
- concentration is reported, not just averages
- the trend against a previous assessment is included where one exists
- the advisory ceiling is stated explicitly in the report
- recommendations are specific sessions and walkthroughs, not "improve documentation"
- no individual is named as the cause of a band
