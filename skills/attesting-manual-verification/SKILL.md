---
name: attesting-manual-verification
description: 'Records human verification - code review, exploratory sessions, UAT, accessibility passes, UX and observability reviews - as dated, attributed attestations in a register, so human-centric practices stay in the quality contract without pretending to be automated checks. Use when a strategy requires verification no tool can prove, when sign-off evidence is scattered across chats and tickets, when a gap matrix needs to distinguish "attested" from "passed", or when an audit asks who verified what and when.'
argument-hint: 'The practice verified, who verified it, against which build or scope, what the evidence is, and where the register lives'
user-invocable: true
---

# Attesting Manual Verification

Use this skill when a quality practice can only be verified by a person, and the record of that verification needs to be worth something later.

Some practices have no signal. No tool can prove a human explored the product, that a business owner accepted the feature, that a screen reader user could complete the flow, or that a reviewer understood the change. Two bad things happen as a result: the practice gets dropped from the contract because it cannot be automated, or a tool-shaped proxy gets reported as a pass - branch protection counted as "code review done".

An attestation is the honest third option: **a dated, attributed statement that a named human verified something, with the evidence attached.** It is weaker than a machine check and stronger than an assumption, and it must never be presented as either.

## When to Use

- a contract contains `manual-attestation` practices: code review, exploratory testing, UAT, manual accessibility, UX review, observability readiness, groundedness review
- a gap matrix shows a human practice and the honest state is neither PRESENT nor MISSING
- release sign-off evidence lives in chat threads and closed tickets
- an audit or handover asks who verified what, against which build
- a team wants credit for real manual work that no tool can see

## Operating Principles

- **An attestation names a person, not a process.** "Reviewed by @maria on 2026-08-19" is an attestation. "We do code review" is a policy.
- **It is scoped to a build or a change range.** An attestation with no scope drifts forward forever and quietly covers work nobody looked at.
- **Evidence, or it is an opinion.** Session notes, a charter, a recording, a defect list, a screenshot set, a sign-off message. A link is fine; nothing is not.
- **Never derive an attestation from tooling.** Branch protection requiring one approval is evidence of a *process*, not of a specific change being understood. Deriving one is the failure mode this practice exists to prevent.
- **Absence is a state, not a failure.** "Unattested" is reportable and honest. It is not the same as "not done", and it is not a blocker unless the contract says so.
- **Findings from an attested practice cap below blocking.** Unattested high-risk work is worth a nudge, not a red build - a gate that blocks on an unprovable property gets switched off, and then nothing is recorded at all.
- **Attest before merge, not after release.** An attestation collected at sign-off time is a memory exercise.
- **An expired attestation is unattested.** A UAT sign-off from three releases ago does not cover this build.

## Workflow

### Phase 1: Identify what needs attesting

From the quality contract, list every practice whose verification type is `manual-attestation`. Typically: `code-review`, `exploratory-testing`, `manual-accessibility`, `uat`, `ux-review`, `observability-readiness`, `groundedness-review`.

For each, establish three things before anybody signs anything:

- **What counts as done** - the exit criterion from the contract, in words a verifier can act on
- **Who can attest** - a role, then a name. A tester attests exploratory testing; a business owner attests UAT; the developer who wrote the change cannot attest their own review
- **What scope one attestation covers** - a release, a feature, a change range, a specific flow

### Phase 2: Do the work, then record it

The attestation is the *record*, never the work. Run the actual practice with its own skill - `planning-exploratory-testing`, `auditing-accessibility`, `code-review-advanced`, `verifying-acceptance-criteria` - then record the outcome.

Use `./resources/attestation-register.md`. Every entry carries:

| Field | Rule |
| --- | --- |
| `practice` | the contract practice name, not free text |
| `scope` | build, version, or commit range - never "current" |
| `attested_by` | a named person, not a team alias |
| `date` | when the verification happened, not when it was typed up |
| `evidence` | a link or path to notes, charters, defect lists, recordings |
| `outcome` | what was found, including "nothing" - an empty finding list is a result |
| `limitations` | what this verification did **not** cover |
| `expires` | the next build, the next release, or a date |

`limitations` is the field that makes an attestation trustworthy. "Explored checkout on Chrome desktop only; no mobile, no Safari, no guest flow" tells a release manager exactly how much weight the record carries. Without it, every attestation reads as total coverage.

### Phase 3: Record it where it survives

Two mechanisms, and they compose:

**A register file** - `.qa/attestations.md`, next to the contract. Best for release-scoped practices: UAT, exploratory sessions, accessibility passes, observability reviews.

**A commit trailer** - `Comprehension-Attested-by: <name>` for change-scoped attestation of understanding, read from `git log`. Best for per-change records, because it travels with the change. Grammar in `commit-trailers.instructions.md`.

Do not use a PR comment as the record: squash-merge discards it and reviews get deleted.

### Phase 4: Report the state

In the gap matrix, a `manual-attestation` practice has three honest states:

| State | Meaning |
| --- | --- |
| **ATTESTED** | a valid, in-scope, unexpired attestation exists - cite it |
| **UNATTESTED** | the practice is contracted, no record covers this scope |
| **STALE** | a record exists but its scope or expiry has passed |

Never PRESENT, never PASSED. Those words imply a machine verdict this practice cannot produce.

Report alongside: who attested, against what scope, the stated limitations, and - for release decisions - which contracted human practices have no record at all. That last list is usually the most useful sentence in a go/no-go pack.

## Common Failure Modes

- **Deriving attestation from tooling.** Branch protection reported as code review done; a merged PR reported as reviewed. The most common and most misleading error.
- **Team-alias attestation.** "@qa-team verified" means nobody did.
- **Unscoped records.** An attestation with no build or range silently covers everything that came after.
- **No limitations field.** Turns a partial check into an implied full one.
- **Attesting at sign-off.** Reconstructing a week later produces a record of what people remember, not what happened.
- **Self-attestation on review.** The author cannot attest their own change was reviewed.
- **Blocking on unattested work.** Makes the practice a bureaucratic obstacle, and the register empties out within a month.
- **A register nobody reads.** Attestations need a consumer - the release pack or the gap matrix - or they become filing for its own sake.

## Resource Map

- `./resources/attestation-register.md` - the register format, worked entries per practice, expiry and staleness rules, and how attestations feed a release pack

## Related Skills

- `deriving-a-quality-contract` - where practices are marked `manual-attestation` and their exit criteria are set
- `planning-exploratory-testing` - do the exploratory work; this skill records it
- `auditing-accessibility` - do the accessibility pass; this skill records it
- `verifying-acceptance-criteria` - the evidence a UAT attestation points at
- `code-review-advanced` - the review whose outcome gets attested
- `assessing-comprehension-debt` - uses per-change attestation as one of its inputs
- `assessing-release-readiness` - consumes the register as release evidence
- `governing-quality-waivers` - when a human practice will not happen at all, that is a waiver, not an absent attestation

## Definition of Done

This skill is complete when:

- every `manual-attestation` practice in the contract has a stated exit criterion, an eligible attester role, and a scope unit
- each record names a person, a scope, a date, evidence, an outcome, limitations, and an expiry
- no attestation has been derived from tooling or from the existence of a process
- the gap matrix reports ATTESTED / UNATTESTED / STALE, never PRESENT or PASSED
- unattested contracted practices are listed explicitly for the release decision
- findings from unattested work are capped below blocking, and that ceiling is stated
