---
name: governing-quality-waivers
description: 'Turns "we will skip this check for now" into a dated, attributed, expiring waiver with a stated reason and owner, inventories the silent skips already hiding in a repo - skipped tests, disabled lint rules, ts-expect-error, continue-on-error, lowered thresholds, coverage ignores - and reports expired waivers as findings. Use when a team wants to bypass a quality gate, when skip lists and quarantined tests accumulate without owners, when an audit asks why a check is off, or when a repo needs to know what it has quietly stopped enforcing.'
argument-hint: 'The check being skipped and why, or a repo path to inventory for silent skips'
user-invocable: true
---

# Governing Quality Waivers

Use this skill when something in the quality system is being switched off - or when you need to find out how much already has been.

Every repo accumulates skips. A `test.skip` from a sprint that ended, an `eslint-disable-next-line` nobody can explain, a `continue-on-error: true` added during an incident, a coverage threshold lowered to match reality. None were wrong at the time. All of them are now invisible, unowned, and permanent.

A waiver makes the same decision visible: same skip, but with a reason, an owner, and a date. That is the entire mechanism, and it is the difference between a considered trade-off and rot.

## When to Use

- someone wants to bypass a quality gate for this change or this release
- a check is failing and the pragmatic answer is "not now"
- a repo has skip lists, disabled rules, or quarantined tests with no owners
- an audit, a handover, or a new lead asks what this project actually enforces
- a quality contract has SHOULD practices that will not be done this quarter
- a `continue-on-error` or a lowered threshold turns up in a diff

## Operating Principles

- **Skipping is allowed. Silent skipping is not.** The goal is not zero waivers; it is zero *unowned* waivers.
- **A waiver has four fields, always.** What, why, who, until when. Missing any one makes it a skip wearing a nicer name.
- **MUST is not waivable.** A mandatory practice that cannot be met means the practice is wrong, the profile is wrong, or the work is not done. Those are three real answers; "waived" is not a fourth.
- **Expiry is not optional and "never" is not a date.** An unbounded waiver is a permanent lowering of the bar, and it should be recorded as a contract change instead.
- **The owner is a person or a named team.** "The team" owns nothing.
- **The reason names the blocker, not the feeling.** "Flaky" is not a reason. "Fails when the CI runner's clock skews past the token TTL; needs a fake clock, tracked in QA-431" is.
- **An expired waiver is a finding.** Not a warning, not a nag - a finding that appears every run until it is renewed with a fresh justification or removed.
- **Renewal requires a new justification.** Rubber-stamping the old reason is how a 90-day waiver becomes a three-year one.

## Workflow

### Phase 1: Classify the request

Before writing anything, establish what kind of skip this is:

| Kind | Example | Handling |
| --- | --- | --- |
| **Not applicable** | DAST on a library with no HTTP surface | not a waiver - remove the row from the contract with a reason |
| **Deferred by maturity** | mutation testing at `crawl` | not a waiver - it is next level's contract |
| **Genuine waiver** | contract testing postponed until the schema stabilises | waiver with reason, owner, expiry |
| **Blocked work** | integration tests need infrastructure nobody has provisioned | waiver **plus** a ticket for the blocker; the waiver expiry tracks the ticket |
| **Refusal** | a MUST practice someone does not want to do | not waivable - escalate as a contract or profile question |

Getting this classification right prevents the register from filling up with rows that were never waivers, which is what makes people stop reading it.

### Phase 2: Write the entry

Use `./resources/waiver-register-template.md`. Store the register where the contract lives - `.qa/waivers.md`, or the `waivers:` block of `.qa/quality-contract.yaml`.

```yaml
- id: W-004
  scope: coverage-rigor
  paths: ['src/generated/**']
  reason: >-
    Generated OpenAPI clients. Tests would assert the generator's output, not our
    behaviour. Regenerated on every schema change; the schema itself is contract-tested.
  owner: '@maria'
  created: 2026-08-21
  expiry: 2026-12-01
  review_trigger: 'if we hand-edit anything under src/generated/'
  ticket: null
```

`review_trigger` is the field that earns its keep: an expiry catches time passing, a trigger catches the *assumption* breaking. A waiver justified by "this code is generated" should expire the moment someone edits it by hand.

### Phase 3: Set the expiry honestly

| Situation | Expiry |
| --- | --- |
| This release only | the release date |
| Waiting on a specific ticket | the ticket's target date, and name the ticket |
| Waiting on a third party | 90 days, then re-justify |
| Structural, no plan to change | do not waive - propose a contract change instead |

The last row matters. A structural exception dressed as a waiver expires, gets renewed unread, and pollutes the register. If the bar has genuinely moved, move the contract and say so out loud.

### Phase 4: Inventory the silent skips

The high-value pass, especially on an inherited repo. Work through `./resources/silent-skip-inventory.md`: skipped and quarantined tests, `.only` leaks, disabled lint rules, `@ts-expect-error` and `any` escapes, `continue-on-error` and `|| true` in CI, coverage ignores and excludes, lowered thresholds, raised retries, `--no-verify` habits, allowlisted secret-scan and audit findings.

For each finding, one of three outcomes - and no fourth:

1. **Fix it** - usually cheaper than the discussion about it
2. **Waive it** - with the four fields
3. **Delete it** - the skip protects code nobody needs

Report the count. "31 silent skips, 4 with any explanation" is the sentence that gets a team to act.

### Phase 5: Report and enforce

Findings, in order:

- **Expired waivers** - one line each: what is unguarded now, who owns it
- **Waivers with no expiry** - treat as expired
- **Silent skips** - no waiver at all
- **MUST practices with a waiver attempt** - an escalation, not a finding
- **Waivers renewed more than twice** - the bar has moved in practice; make it explicit

Enforcement worth wiring up: a CI step that fails when a waiver in the register has passed its expiry, and a review rule that a diff adding `continue-on-error`, `.skip`, or a lowered threshold must add a register entry in the same change. Both are cheap; the second is the one that stops accumulation at the source.

## Reviewing Waivers

Review the register on a fixed cadence - release, sprint, or contract re-derivation - and ask three questions per entry:

1. Is the reason still true?
2. Is the owner still here and still accountable?
3. Would we accept this waiver if it were being proposed today for the first time?

The third question is the one that clears the register. Most expired waivers survive because renewal is easier than removal, and asking whether you would *start* it today breaks that.

## Common Failure Modes

- **The register nobody reads.** A file that only ever gets appended to. Cadence and expiry enforcement are what stop this.
- **"Flaky" as a reason.** Names a symptom and hides the cause. Every flake has a mechanism; write down the mechanism.
- **Waiving a MUST.** The most common misuse. It is a contract or profile conversation, not a waiver.
- **Expiry set to a year out by default.** A year is "never" with paperwork.
- **Owner set to a team alias.** Nobody gets the notification; nobody feels the deadline.
- **Waiving the measurement instead of the risk.** Excluding a directory from coverage does not reduce risk; it reduces visibility of risk.
- **Inventory without action.** A list of 40 silent skips that produces no fixes, waivers, or deletions was an audit for its own sake.

## Resource Map

- `./resources/waiver-register-template.md` - the register format, worked entries, and the enforcement snippets for expiry checks
- `./resources/silent-skip-inventory.md` - every place a JS/TS repo hides a skip, with the search commands to find them

## Related Skills

- `deriving-a-quality-contract` - where MUST/SHOULD/COULD is set, which decides what is waivable at all
- `verifying-change-coverage` - coverage exclusions are waivers and belong in the same register
- `recording-change-intent` - the sibling discipline: a waiver records why a check is off, an intent record records why a change was made
- `analyzing-quality-metrics` - waiver count and age are quality metrics worth trending
- `tech-debt-analysis` - when silent skips are one symptom of broader debt
- `assessing-release-readiness` - expired waivers are release evidence, and belong in the go/no-go pack

## Definition of Done

This skill is complete when:

- each request is classified as N/A, deferred, waiver, blocked, or refusal - not all funnelled into "waiver"
- every waiver has scope, reason, owner, created date, and expiry, with a review trigger where an assumption underpins it
- no MUST practice carries a waiver
- the silent-skip inventory has been run and every finding resolved as fix, waive, or delete
- expired and unbounded waivers are reported as findings with what is now unguarded
- an expiry check runs in CI, or its absence is stated as the next action
- the register lives next to the contract and has a named review cadence
