---
name: documenting-test-suites
description: 'Writes the documentation a test suite needs to be usable by someone who did not build it: run instructions, environment setup, tag glossary, ownership, fixture and data notes, and architecture decision records. Use when onboarding someone into a suite, when "how do I run these" keeps being asked, when a test architecture decision needs recording, or when a suite is inherited with no documentation.'
argument-hint: 'Test suite path, its stack and runners, the CI setup, and who the readers are'
user-invocable: true
---

# Documenting Test Suites

Use this skill when a test suite is understandable only to the person who wrote it.

Test documentation has one job: get a competent stranger from a fresh clone to a passing local run, and then let them change something without breaking a convention they could not have known about. Everything that does not serve that is decoration.

The discipline that keeps it useful is knowing what **not** to write. A document that restates what the code already says goes stale within a sprint and then actively misleads. Document what the reader cannot find by looking: the unwritten convention, the reason behind a choice, the gotcha no config file confesses.

## When to Use

- a new joiner needs to run the suite and there is no path from clone to green
- "how do I run just the API tests" is a recurring question
- a suite has been inherited and nobody knows why it is shaped the way it is
- a test architecture decision was made and will be re-argued in six months
- tags exist and their meanings live in one person's head
- fixtures and seed data have rules that only surface when you break them

## Operating Principles

- **Write what the environment cannot tell you.** A list of npm scripts belongs in `package.json`; the reason two of them exist belongs in the README.
- **Optimize for the first hour.** The most valuable page gets a stranger to a green run. Everything else is secondary.
- **Every command in the docs is copy-pasteable and has been run.** An untested command is a broken promise with a trust cost.
- **Decisions get a record, not a comment.** Why page objects and not fixtures, why this runner, why the suite is split this way. Those get re-litigated without a record.
- **Ownership is named.** A suite with no owner has no maintainer, and the documentation is where that becomes visible.
- **State what is not covered.** A reader who assumes coverage that does not exist is worse off than one who knows the gap.

## Workflow

### Phase 0: Identify the readers

Different readers need different documents. Name them before writing:

| Reader | Needs | Document |
| --- | --- | --- |
| New joiner | Clone to green run | README quickstart |
| Developer adding a test | Conventions, fixtures, where things go | README conventions plus the architecture record |
| Someone debugging CI | Environment, secrets, artifacts, how to reproduce locally | README CI section |
| Reviewer | Tag meanings, what is expected in a pull request | Tag glossary, contribution notes |
| Future maintainer | Why the suite is like this | Architecture decision records |

A single document serving all five serves none. Split by reader, and link.

### Phase 1: Write the quickstart first

The highest-value section, and the one to validate hardest.

It contains, in order:

1. **Prerequisites** with exact versions: Node, package manager, Docker, browsers
2. **Install**, one command
3. **Environment setup**: which file to copy, which values are needed, where non-secret values come from and who to ask for the secrets
4. **Start dependencies**: the app under test, the database, the mock server
5. **Run**, one command
6. **Expected result**: how many tests, roughly how long, what a green run looks like
7. **First troubleshooting entries**: the three failures a newcomer actually hits

Point six is skipped almost always and it is what tells a stranger whether their run went right.

**Validation gate for this phase**: follow your own quickstart on a clean clone, in a fresh shell, with no environment variables set, and record every place you had to know something the document did not say. That list is the actual content of the section.

### Phase 2: Document the conventions

Only the ones a reader would otherwise get wrong.

- where a new test goes, by type
- naming conventions for files, suites, and test titles
- the locator or selector policy, and what is banned
- fixture and helper rules: what belongs where, what must not be shared
- data rules: seeding, cleanup, whether tests may share an account, whether parallel-safe
- assertion conventions the team has settled on
- what a pull request touching tests is expected to include

Each entry answers a question a reviewer has asked more than once. If no one has ever asked, it probably does not need writing.

### Phase 3: Write the tag glossary

Tags are a control surface. When their meanings are undocumented, they decay into personal shorthand and CI filters start excluding things nobody intended.

`./resources/tag-glossary-template.md` gives one row per tag: what it means, who runs it, where it runs, and who may add it.

### Phase 4: Record the decisions

For each significant choice, write a short record using `./resources/test-adr-template.md`:

- the decision
- the context that forced it
- the alternatives that were genuinely considered
- the consequences, including the ones the team is unhappy about
- the conditions that would justify revisiting

Candidates worth a record: runner choice, page objects versus fixtures, mocking policy, parallelization strategy, environment strategy, why a suite was split, why a whole approach was abandoned.

The alternatives section is the load-bearing part. A record that lists only the chosen option gets overturned by the next person who thinks of an alternative, because nothing tells them it was already considered and rejected.

### Phase 5: Document the CI reality

What someone needs when a run is red and they were not the one who broke it:

- which workflows run, when, and against what
- how the suite is sharded and how to read a merged report
- where artifacts live: traces, videos, screenshots, coverage, and how long they are kept
- which secrets exist, what they are for, and who administers them
- how to reproduce a CI failure locally, including the container command if the environments differ
- the retry policy and what a retried pass means in the report

### Phase 6: State the gaps

A short, honest section:

- areas with no coverage, and whether that is deliberate
- known flaky and quarantined tests, with their expiry dates
- tests that are skipped and why
- what the suite does not attempt to verify

This is the section that stops the suite from being trusted for more than it does. It also feeds `assessing-release-readiness` directly.

### Phase 7: Prune

Documentation rots. Before finishing, delete:

- anything the environment already states, unless the lookup is genuinely expensive
- steps for a tool the suite no longer uses
- commands that have not been run since they were written
- history that is not a decision record

Then add a line saying when the document was last verified against a real run, and by whom.

## Common Failure Modes

- a README that lists every npm script and none of the reasons any of them exist
- a quickstart written from memory by the person who set the environment up two years ago
- commands that no longer work, which teach a newcomer that the docs cannot be trusted
- documenting the framework rather than this suite, which the framework's own docs already do better
- decisions recorded as "we use page objects" with no context and no alternatives
- a tag glossary that is a list of tags with no meanings
- no ownership, so nobody updates it
- no gaps section, so readers assume the suite covers more than it does

## Resource Map

- `./resources/test-readme-template.md` - full README structure with a worked example and the validation gate
- `./resources/test-adr-template.md` - decision record format, worked examples, and the list of decisions worth recording
- `./resources/tag-glossary-template.md` - tag table, naming rules, and the CI filter mapping
- `./resources/onboarding-path.md` - a staged first-week path for someone joining the suite, with checkpoints

## Related Skills

- `designing-test-automation-architecture` (planned) - when the structure being documented should be redesigned first
- `creating-instructions` - when a convention should be enforced by agent instructions rather than only written down
- `analyzing-quality-metrics` - when metric definitions need a permanent home the team can cite
- `assessing-release-readiness` - which consumes the coverage gaps section directly
- `testing-api-contracts` - when spec gaps found during contract testing need writing up
- `handling-sensitive-test-data` - when the data rules being documented involve personal data

## Definition of Done

This skill is complete when:

- the readers are named and each has a document aimed at them
- the quickstart was followed on a clean clone and every missing assumption it exposed is now written down
- every command in the documentation has been executed as written
- the expected result of a successful run is stated, including rough count and duration
- conventions cover only the things a reader would otherwise get wrong
- every tag has a meaning, a runner, and an owner
- significant decisions have records that include the rejected alternatives
- coverage gaps, skips, and quarantines are listed honestly
- the suite has a named owner and the document has a last-verified date
