---
name: communicating-quality-findings
description: 'Shapes QA output for the person who has to act on it: result and blocker in the first two lines, one decision per report, findings ordered by what they cost, the long artifact in a file and the decisions in the message, and magnitude stated in units the reader can count. Use when a report is accurate but nobody acts on it, when a finding set is too long to read under time pressure, when the same findings must be retold for a developer, a release manager, and an on-call engineer, or when the request mentions "too long", "make this readable", "just tell me what to do", "so what", or "summarize this for stakeholders". Pairs with unslop-answers, which makes the same report honest.'
argument-hint: 'The findings, report, or summary to shape, plus who reads it and what they have to decide'
user-invocable: true
---

# Communicating Quality Findings

Use this skill when a QA finding set is already true and still useless, because the person who has to act on it cannot get to the action.

There are two ways a report fails and they need different fixes. A **dishonest** report says the suite passed when it did not - that is `unslop-answers`. An **unactionable** report says everything correctly and gets skimmed, filed, and forgotten. That is this skill. The second failure is quieter and more common, because nothing in the report looks wrong.

This is not "be brief". A one-line report that omits the blocker is worse than the wall of text it replaced.

## When to Use

- writing a triage summary, review round-up, release recommendation, or exploratory debrief
- the finding set is long enough that ordering decides what gets fixed
- the same findings need retelling for a different audience or a different decision
- a report was sent and nothing happened
- a bug queue, gap matrix, or traceability matrix needs an accompanying message
- the request mentions "too long", "make this readable", "just tell me what to do", "so what", "TL;DR", "for the stakeholders"
- a stand-up or channel update has to carry the state of a multi-day test effort

## Fast Pass

Most output is routine and does not need the full workflow. Four checks, in this order, before sending anything:

1. **Is the blocker in the first two lines?** If there is a thing that stops the reader, that is line two. Not a bullet, not a closing note.
2. **Did any claim lose its evidence while being shortened?** A rung marker, a denominator, or a "not run" line dropped for brevity goes back in. This check outranks the other three.
3. **Is there more than one decision, or more than five things to act on?** Split the message, or move the full set to a file under `.qa/` and keep the five.
4. **Does the last line say what happens next, and who does it?** Even "open the file" counts.

For a report, a review, a release call, or anything a stakeholder reads, run the full workflow below and the nine-check gate in `./resources/pre-send-gate.md`.

## The Reader You Are Writing For

Five facts about how QA output is actually read. Every rule below traces to one of them.

1. **The reader is interrupted.** Your report is read between two other tasks, on a phone, in a channel with forty unread messages. Anything below the first screen is not read on the first pass.
2. **Reading a finding is not fixing it.** The distance between "understood" and "changed" is where findings die. A finding that does not name its first step usually stays open.
3. **The reader arrived with one question.** Ship or hold. Is my PR clear. What broke overnight. A report that answers four questions answers none of them first.
4. **Volume reads as noise.** Forty findings in discovery order get the same treatment as zero findings: none of them are acted on. Ranking is not decoration, it is the deliverable.
5. **Vague magnitude does not register.** "Slow", "some flakes", and "a few gaps" all land as "unknown". A number the reader can count changes behaviour; an adjective does not.

## Rules

### 1. Result and blocker in the first two lines

Line one is what is true now. Line two is the thing that stops the reader, if there is one. Method, scope, and process come later or not at all.

Bad: "I reviewed the checkout suite across three packages, looking at fixtures first, then the specs, and there are a number of observations worth discussing."

Good: "Checkout suite: 3 real failures, 1 blocker. Blocker: `payment.spec.ts` cannot run in CI - the Stripe test key is missing from the workflow secrets."

### 2. One decision per report

Name the decision in the first line and answer only that. A second decision becomes a second message.

Bad: a release recommendation that also proposes a fixture refactor, flags a flaky suite, and asks about next quarter's coverage target.

Good: "Recommendation: hold. One blocker, below. Separately, the fixture refactor and the flake list are worth a session this week - want either as its own write-up?"

### 3. Order findings by cost, not by discovery order

The order files were opened is not information. Rank by what each finding costs if ignored, and say what the cost is.

Bad: findings numbered 1 to 12 in the order the reviewer walked the diff, with severity noted in the last column.

Good: three sections - **blocks release**, **fix this sprint**, **noted** - ordered inside each by user impact, with the cost stated per finding.

### 4. The artifact goes in a file, the decisions go in the message

A matrix, a charter set, a gap table, and a bug queue are artifacts: they are complete by design and they do not shrink. Write them to `.qa/` and keep the message to what this reader must decide - at most five items.

This is the rule that stops rule 3 from destroying evidence. Never truncate the matrix to make the message short.

Bad: a 40-row traceability matrix pasted into chat, or the same matrix cut to "the top few rows" so it fits.

Good: "Full matrix: `.qa/rtm-checkout.md` (41 requirements, 12 uncovered). Three uncovered ones touch payment and need a decision this week: REQ-14, REQ-22, REQ-31."

### 5. State magnitude in units the reader can count

Give quantities you actually have: files, tests, endpoints, runs, rows, days of history. A wall-clock estimate is a guess dressed as a measurement unless something measured backs it.

Bad: "This will take a while to stabilize." Also bad: "About two hours" with nothing behind it.

Good: "9 specs to update, all in `tests/checkout/`, the same fixture change in each. The last comparable change touched 7 files and took one working day."

### 6. Every finding carries a first step

One action, precise enough to start without a follow-up question, small enough to start now.

Bad: "Error handling should be improved in the payment flow."

Good: "`src/pay/submit.ts:48` swallows the 402 and returns success. First step: rethrow, then add the 402 case to `submit.test.ts` next to the existing 500 case."

### 7. Restate the state of the work every turn

Across a multi-turn session the reader cannot hold the queue. Restate position, not narrative.

Bad: "Done. Ready for the next one?"

Good: "3 of 7 findings fixed (F1, F2, F5). Next: F3, the flaky retry in `login.spec.ts`. Blocked findings: none."

### 8. Failures stated flat

No alarm, no apology, no drama in a title. Cause, location, effect.

Bad: "Unfortunately there is a serious problem critically undermining the reliability of the checkout experience."

Good: "Checkout submits twice on double-click. `CheckoutButton.tsx:31` has no disabled state during submit. Duplicate orders in staging: 4 in the last 200 runs."

### 9. Brevity never removes the evidence rung

Cutting words is allowed. Cutting the difference between "I ran it" and "I read it" is not. If a claim did not reach a real run, it says so, however short the report is.

Bad: "Fixed."

Good: "Fixed, verified: `npx playwright test checkout` - 12 passed. The retry path is changed but not exercised; no test covers it yet."

## Where the Output Lands

The channel changes the shape, because it changes what the reader can see at once and what they can do from there.

| Channel | What is visible | What to do differently |
| --- | --- | --- |
| **Chat with the person doing the work** | Everything, but only until the next message scrolls it away | State the queue position every turn (rule 7). The artifact goes to a file, because chat is not storage |
| **PR comment** | The diff is right there | Anchor every finding to a line in the diff. Drop restated context the reviewer can see. Blocking versus non-blocking must be unambiguous |
| **Ticket or issue body** | Read once, months later, by someone with no context | Self-contained: build, environment, reproduction, evidence. No "as discussed". This is the one channel where the artifact belongs inline |
| **Team channel** | One or two lines before the reader decides to expand | The first line must survive alone. Put the decision and the ask in it; thread the detail |
| **Stand-up or status update** | Spoken or skimmed in fifteen seconds | State changed-since-last-time and blocked-on. No finding detail at all - point at where it lives |
| **Release sign-off or audit record** | Read adversarially, later, by someone checking you | Compression off. Evidence, dates, and gaps in full - precedence rule 2 |

Two rules survive every channel unchanged: the blocker goes first, and no claim loses its evidence rung.

## Precedence

When something outranks these rules, the rule loses and the shape stays.

1. **Honesty outranks shape.** `unslop-answers` wins every conflict. A shorter report that drops a denominator, a rung, or a "not done" line is a worse report.
2. **The artifact outranks the item cap.** Rule 4 exists so completeness and readability stop competing. A regulated or audited deliverable keeps every row.
3. **Destructive or irreversible action outranks brevity.** Data deletion, a production run, a migration, a force push, a security probe: confirm first, in full sentences.
4. **"Explain this to me" outranks compression.** A walkthrough, an onboarding doc, or a root-cause narrative runs as long as the topic needs. Keep the headers so the reader can skim back; drop the preamble and the closer.
5. **The house format outranks personal shaping.** A team bug template, an ADR format, a required sign-off block: fill it in as specified and apply these rules inside the fields.
6. **A rule that would delete the answer loses.** When the reader asks for options, 2 to 4 ranked options with one-line trade-offs *are* the answer. Recommendation first, then the alternatives.

## Persistence

When a reader asks for this shaping, it applies to every response for the rest of the session, not only the next one. It does not lapse when the topic changes, and it survives a switch from writing a report to writing code.

Stop when the reader says "stop shaping", "normal reporting", or names a house format that conflicts. Confirm in one line, then return to the default style.

## Workflow

### Phase 0: Name the reader and the decision

Before shaping anything, fix two things in one sentence each:

- **who reads this** - the developer fixing it today, the release manager deciding, the on-call engineer at 02:00, the auditor in six months
- **what they must decide or do** - ship or hold, fix now or next sprint, roll back or wait, sign or reject

If the answer is "several readers with several decisions", that is several messages. See `./resources/audience-renderings.md` for one finding set rendered for four readers.

### Phase 1: Split artifact from decisions

Sort the material into two piles:

- **artifact** - matrices, queues, charters, full finding lists, evidence pastes. Goes to a file under `.qa/`, complete.
- **decisions** - what this reader must act on. At most five, each with a cost and a first step.

### Phase 2: Rank by cost

For each decision item, state what it costs if ignored: who is affected, how often, how badly. Sort by that, not by severity labels alone. A "high" with no stated impact ranks below a "medium" that duplicates customer orders.

### Phase 3: Shape and gate

Write the message: result, blocker, ranked decisions, pointer to the artifact, one next step. Then run `./resources/pre-send-gate.md` against the draft. The gate is nine checks and takes under a minute.

## Common Failure Modes

Ordered by cost. The first three make the report actively misleading; the rest make it ignored.

1. **Compression that eats evidence.** The report gets short by dropping the denominator, the rung, and the "not done" line. This is the failure this skill itself causes when rule 9 is ignored, and it is the reason `unslop-answers` outranks everything here.
2. **Invented magnitude.** Rule 5 asks for counts you have, not for confident-sounding numbers. A made-up estimate is a Tier 1 problem in `unslop-answers`, not a formatting choice.
3. **The blocker in the last bullet.** Everything above it reads as good news, so the reader acts on a green report that was never green.
4. **Severity used as a substitute for cost.** A "critical" label with no stated user impact ranks nothing, so the reader re-does the ranking or ignores it.
5. **A recommendation with no addressee.** "This should be fixed" names nobody, so nothing happens.
6. **The matrix pasted into chat.** Rule 4 exists because this is the default behaviour, and it wastes the matrix.
7. **Findings sorted by the tool that found them.** Lint output order, file order, and spec order are not the reader's priority order.
8. **One report for three audiences.** The developer reads the exec summary, the manager reads the stack trace, neither acts.

## Resource Map

- `./resources/audience-renderings.md` - one finding set rendered for the developer, the release manager, the on-call engineer, and the auditor
- `./resources/before-after-reports.md` - worked before and after pairs for each of the nine rules, in real QA output shapes
- `./resources/pre-send-gate.md` - the nine-check gate to run against a draft before sending

## Related Skills

- `unslop-answers` - the honesty half of the pair. It wins every conflict with this skill; run it first, then shape
- `reporting-bugs` - the bug report format these rules apply inside
- `assessing-release-readiness` - the go/no-go call, the highest-stakes single-decision report
- `analyzing-quality-metrics` - where the denominators and windows for rule 5 come from
- `tracking-quality-trends` - trend reporting, where "which way is this going" is the one decision
- `documenting-test-suites` - the long-form counterpart, exempt from compression by precedence rule 4
- `testing-agent-skills` - use it to check that this shaping actually survives to turn ten, and that it never deletes a confirmation step

## Definition of Done

This output is ready when:

- the first two lines carry the result and the blocker
- the report answers exactly one decision, and says where the other decisions went
- decisions in the message number five or fewer, and the full artifact is in a file under `.qa/`
- findings are ordered by stated cost, not by discovery order or by label alone
- every finding has a location and a first step someone can start without asking a question
- every quantity is a count that was actually taken, with its denominator and window
- no claim lost its evidence rung to make the report shorter
- what was skipped, sampled, or blocked appears in the first few lines
- the shape fits where the output lands: a PR comment anchors to the diff, a ticket stands alone, a channel message survives on its first line
- a reader who reads only the first line and the last line knows what is true and what to do next
