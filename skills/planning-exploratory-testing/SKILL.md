---
name: planning-exploratory-testing
description: 'Runs session-based exploratory testing: writes charters, timeboxes sessions, applies coverage heuristics and tours, captures notes as evidence, debriefs, and converts findings into bug reports and automation candidates. Use when a feature needs testing before requirements settle, when scripted cases keep passing while users hit problems, when a release needs a risk sweep with limited time, or when the request mentions charters or exploratory sessions.'
argument-hint: 'Feature, area, or build to explore, the risks or questions in play, time available, and any prior session notes'
user-invocable: true
---

# Planning Exploratory Testing

Use this skill when the useful question is "what do we not know about this yet", and a list of pre-written test cases cannot ask it.

Exploratory testing is not unscripted clicking. It is **simultaneous learning, test design, and execution**, made accountable by three things: a charter that says what the session is for, a timebox that makes coverage measurable, and notes that make the session reviewable by someone who was not there. Without those three it is indistinguishable from a demo, which is why it gets dismissed.

## When to Use

- a feature is testable but its requirements are still moving
- scripted regression passes while users keep reporting problems
- a release needs a risk sweep and there is not time to write cases first
- a bug was found and its neighbourhood needs sweeping for siblings
- a third-party integration, migration, or legacy area has no coverage and no documentation
- an automation suite needs candidate scenarios grounded in real observed behaviour

## Operating Principles

- **A charter is a mission, not a script.** It names an area, a purpose, and often a specific risk. It never lists steps.
- **Timeboxed, so coverage is countable.** Sessions are 45, 60, or 90 minutes. "We explored for a while" cannot be planned against or reported.
- **Notes are evidence.** What was tried, what happened, what was questioned. Written during the session, not reconstructed afterwards.
- **Bugs are a by-product, not the objective.** The deliverable is information about risk. A session that found no bugs but mapped an area is a successful session, and the notes prove it.
- **Follow the surprise.** When something is unexpected, chase it and record the detour. That is the mechanism working.
- **The charter's questions get answered or explicitly left open.** An unanswered question that nobody wrote down is lost coverage.

## Workflow

### Phase 0: Frame the mission

Establish before any charter is written:

- what changed, or what area is under-known
- what would hurt most if it were broken (feeds charter priority)
- who the users are and what they are trying to accomplish
- what environment, data, and accounts are available
- how much time exists in total

If the area is a diff or a release candidate, take the blast radius from `analyzing-regression-scope` rather than re-deriving it.

### Phase 1: Write the charters

The house format, from `./resources/charter-templates.md`:

> **Explore** [target]
> **With** [resources: roles, data, tools, devices]
> **To discover** [information: risks, behaviours, inconsistencies]

Charter quality rules:

- one area per charter; a charter covering "the whole checkout" produces notes nobody can act on
- name the resource, because it constrains the session usefully: "with an expired card", "on a throttled 3G connection", "as a read-only admin"
- the "to discover" clause is the completion criterion; make it something a reader can tell was answered
- **prioritize before writing more.** Five charters aimed at real risk beat twenty aimed at surface area

Split charters into three buckets: **must run**, **run if time**, and **backlog**. Say which bucket each is in.

### Phase 2: Choose the heuristics

Pick the lenses for each charter from `./resources/heuristics-cheatsheet.md` rather than improvising in the moment. The usual starting set:

- **SFDIPOT** to derive coverage across structure, function, data, interfaces, platform, operations, and time
- **CRUSSPIC STMPL** for quality criteria beyond "does it work"
- **Tours** (money, landmark, back-alley, saboteur, obsessive-compulsive) when a charter needs a repeatable angle
- **Boundary and state heuristics** for input-heavy and workflow-heavy areas

Name the heuristics in the charter. It makes the session repeatable by someone else and reviewable afterwards.

### Phase 3: Run the session

Timebox strictly. During the session:

- take notes continuously, in the format from `./resources/session-notes-template.md`
- record **setup**, **test ideas tried**, **observations**, **questions**, **bugs**, and **detours**
- capture evidence as you go: screenshots, HAR files, console output, request ids, exact timestamps
- when a surprise appears, follow it, and write down that you did and what you dropped to do it
- when blocked, record the blocker and switch charters rather than burning the box

Track the session's time split as you go, roughly: **test design and execution**, **bug investigation and reporting**, **setup and environment**. The split is the most useful number in the debrief.

### Phase 4: Debrief

Every session ends with a debrief, using `./resources/debrief-checklist.md`. Cover, in order:

- **Past**: what happened in the session
- **Results**: what was learned about the area
- **Obstacles**: what got in the way
- **Outlook**: what is still unexplored and what the next charter should be
- **Feelings**: the tester's confidence in the area, stated plainly

The last one is not a soft extra. "I do not trust the refund path and I cannot say why yet" is a valid, actionable finding, and it is the one a status report loses.

### Phase 5: Convert the output

A session produces four kinds of output. Route each:

| Output | Goes to |
| --- | --- |
| Reproducible defect | `reporting-bugs` |
| Non-reproducible observation | Logged with evidence and a repro attempt count; do not discard |
| Repeatable high-value scenario | Automation candidate list, then `designing-functional-tests` |
| Requirement gap or ambiguity | Back to the requirement owner; feeds `verifying-acceptance-criteria` |
| Area still unknown | The next charter |

Automation candidates need a stated reason: it is high risk, it is expensive to check by hand, it will regress. Not everything found by exploring deserves a permanent test.

### Phase 6: Report the coverage

Report in sessions and charters, not in feelings. The coverage summary in `./resources/session-notes-template.md` gives:

- charters planned, run, and outstanding
- session count and total time
- the time split across design, investigation, and setup
- areas covered, with a confidence level per area
- areas deliberately not covered, with the reason

That last line is what makes an exploratory report usable in a release decision. Hand it to `assessing-release-readiness`.

## Common Failure Modes

- charters that are scripts: numbered steps and expected results, which is a test case wearing a charter's name
- no timebox, so coverage cannot be counted and sessions run until interest runs out
- notes written from memory after the session, which lose the surprises and the detours
- measuring the session by bug count, which rewards shallow sweeps and punishes deep ones
- exploring the area that is easy to reach rather than the area that carries risk
- the tester learned something important and it stayed in their head because there was no debrief
- every finding turned into an automated test, including the ones that will never regress
- exploratory results reported as "we tested it and it looked fine", which no release decision can use

## Resource Map

- `./resources/charter-templates.md` - charter format, worked examples per context, and charter smells
- `./resources/heuristics-cheatsheet.md` - SFDIPOT, CRUSSPIC STMPL, tours, and input, state, and data heuristics
- `./resources/session-notes-template.md` - during-session note format, coverage summary, and a worked example
- `./resources/debrief-checklist.md` - the PROOF debrief, questions to ask, and the routing decision per finding

## Related Skills

- `designing-functional-tests` - when exploratory findings should become structured cases or a regression slice
- `analyzing-regression-scope` - when the area to explore should be derived from a diff
- `reporting-bugs` - when a session finding becomes a defect report
- `designing-test-data` - when a charter needs deliberate inputs prepared in advance
- `verifying-acceptance-criteria` - when exploration exposes a gap between built and specified behaviour
- `assessing-release-readiness` - when session coverage feeds a go/no-go decision
- `testing-application-security` - when a charter targets authorization or input handling

## Definition of Done

This skill is complete when:

- every charter names a target, its resources, and what it should discover, and none of them contain steps
- charters are prioritized by risk into must-run, if-time, and backlog
- each session is timeboxed and its heuristics are named up front
- notes were written during the session and carry evidence for every observation
- every charter's "to discover" question is answered or explicitly recorded as open
- each session has a debrief covering past, results, obstacles, outlook, and confidence
- findings are routed to bugs, automation candidates, requirement questions, or the next charter
- the coverage report states what was not covered and why
