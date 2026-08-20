# Onboarding Path

A staged first week for someone joining a test suite. Each stage has a checkpoint that proves it worked, so progress is observable rather than assumed.

Adapt the timings. The order matters more than the schedule.

---

# Onboarding: [suite name]

**Buddy**: [name]. Ask them anything; a question that takes you more than 15 minutes to answer alone should become a question to them and then a line in the README.

## Day 1: Green run

**Goal**: the suite passes on your machine.

1. Follow the [quickstart](../README.md#quickstart) exactly. Type nothing that is not written down.
2. Every time you have to guess, ask, or already know something the document did not say, **write it down**.
3. Run the full suite once.

**Checkpoint**: a green run, and a list of what the quickstart failed to tell you.

That list is your first contribution. Open a pull request against the README with it before the end of the day, while the gaps are still obvious to you. Nobody else in the team can see them any more.

## Day 2: Read a journey end to end

**Goal**: understand how one test actually works.

Pick one E2E test that covers a real user journey. Trace it all the way down:

- the spec file
- the fixtures it uses, and what each one sets up and tears down
- the page objects or helpers it calls
- the data it needs, and where that comes from
- the assertions, and what each one would catch

Then break it deliberately: change one assertion so it should fail, run it, and read the failure output.

**Checkpoint**: explain to your buddy what the test proves, what it would miss, and what its failure message tells someone at 2am.

The deliberate break is the important part. A test whose failure message is unreadable is a test you cannot rely on, and you only learn that by watching it fail.

## Day 3: Conventions and decisions

**Goal**: know why the suite is shaped the way it is.

1. Read the [conventions section](../README.md#conventions).
2. Read every [architecture decision record](../docs/adr/).
3. For each record, answer for yourself: what would change my mind about this?

**Checkpoint**: name one decision you would have made differently, and say what evidence would settle it. This is not a test of agreement. A newcomer who cannot find a single thing to question has not engaged with the records.

## Day 4: Add a test

**Goal**: go through the whole loop, including review.

Pick something small and real from the backlog, or ask your buddy for a genuine gap.

- put it in the right place
- follow the locator, naming, data, and tag conventions
- run it locally, and run it three times to check stability
- open a pull request

**Checkpoint**: merged, or in review with feedback you understand.

## Day 5: Read a CI failure

**Goal**: be able to triage a red build.

Find a recent failed CI run, ideally one you did not cause.

- download the trace and open it with `npx playwright show-trace`
- work out whether it was a product defect, a test defect, an environment problem, or flakiness
- reproduce it locally, using the container command if the environments differ

**Checkpoint**: state the verdict and the evidence for it.

If you cannot reproduce it locally, that is also a finding. Write down what was missing; environment parity gaps are one of the most expensive undocumented things in any suite.

---

## What you should be able to do after week one

- [ ] Get from a clean clone to a green run without asking anyone
- [ ] Say what the suite covers and what it does not
- [ ] Add a test in the right place, following the conventions, without being told
- [ ] Explain why the suite makes its two or three most contested design choices
- [ ] Read a CI failure and reach a verdict
- [ ] Find the tag glossary, the decision records, and the known gaps without searching

## Reciprocal obligation

The suite owner's side of this: **every question the newcomer had to ask becomes documentation.** A question asked twice is a documentation defect, and the second asker is evidence.

Onboarding is the only reliable audit of test documentation. Anyone who has worked on the suite for a month has lost the ability to see what is missing. Use each new joiner deliberately, and update the README while they are still able to tell you.
