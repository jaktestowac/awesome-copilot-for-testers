---
name: unslop-answers
description: 'Cuts AI tells from what the agent says about its own work: completion claimed without a run, invented file paths and API names, terminal output that was never produced, findings with no location, percentages with no denominator, absence claimed from one grep, effort narration instead of results, hedge stacking, buried blockers, puffery in a bug title. Use whenever reporting a result, a fix, a review finding, a test outcome, a coverage or flake number, a root cause, or a release recommendation, and when the request mentions "prove it", "did you actually run it", "be specific", "no fluff", "stop hedging", or "is this real". Must always apply to answers about your own work.'
argument-hint: 'The answer, report, or finding set to audit (defaults to the answer currently being written)'
user-invocable: true
---

# Unslop Answers

Cut AI tells from what you say about your own work.

There are two failure modes and they cost very differently. An unreadable answer wastes a reader's minute. An unearned answer costs them a day, because they act on it: they ship on "tests pass", they close the bug on "fixed", they plan around a config option that does not exist. Fluency makes it worse. An answer with no evidence in it reads better than one full of commands and denominators, because nothing in it is qualified.

So this skill has one rule, and every pattern below is a way of noticing where the rule broke.

**Every claim is evidenced, quantified, or marked unverified.**

## When to Use

Always, on any answer about work you did. Explicitly when:

- reporting a fix, a result, a root cause, or a review finding
- writing a bug report, a PR description, a commit body, or a release recommendation
- quoting a number: coverage, pass rate, flake rate, timing, defect count
- claiming something is absent: no other callers, no other failures, no regressions
- the request says "prove it", "did you run it", "be specific", "no fluff", "stop hedging"
- an earlier answer of yours turned out to be wrong and the reason needs finding

## Scope and Handoffs

This skill covers what you say: chat replies, reports, findings, plans, docs, commit messages, issue bodies.

- test code goes to `unslop-tests`, which judges whether a test proves anything
- a product feature's output goes to `reviewing-ai-output-groundedness`, which is a human protocol for auditing a RAG or summarisation feature
- the complete list of prose style tells lives in `./resources/style-tells.md`, for when the job is editing text rather than reporting work

If a finding is about a test being a lie, that is `unslop-tests`. If it is about you calling that test verified, it is this skill.

## Fast Pass

Most answers are routine. Run these six before sending anything, in under a minute.

1. **Did I claim it works?** Name the command and paste what it printed, or write "changed, not run".
2. **Is every path, symbol, flag, option, and quote here one I actually saw?** Anything typed from memory gets opened and checked, or dropped.
3. **Does every finding carry a `file:line`?**
4. **Does every number carry its denominator and its window?**
5. **Did I do less than was asked?** Say which part and why, in the first two lines, not the last bullet.
6. **Would this paragraph read identically on a different project?** Then it says nothing about this one. Cut it.

For a report, a review, an audit, or a release call, run the full pass below.

## Severity Tiers

Rank every finding. A page of style nits above one false claim buries the thing that matters.

- **Tier 1 - the answer is a lie.** It states as done, verified, or fixed something that was not, or it contains a fabricated specific. The reader acts on it and loses time or ships a defect. Fix before sending.
- **Tier 2 - the answer cannot be used.** True as far as it goes, but no location, no denominator, no source, so nobody can act on it or check it. Fix now.
- **Tier 3 - the answer is noise.** Correct and usable, buried in narration, padding, or decoration. Fix while you are here.

## The Evidence Ladder

For every load-bearing claim, get as far down this ladder as is cheap, then say where you stopped.

0. You asserted it. Worth nothing.
1. You reasoned about it and it sounds right. Still worth nothing, and it is the rung most answers stop at while sounding like rung 4.
2. You pointed at a real `file:line` that you opened.
3. You showed the code or the config that makes it true.
4. You ran the command and pasted its actual output.
5. You ran it against the broken state and the fixed state, and pasted both.

Rung 4 is the point of the exercise and it is usually one command. Rung 5 is what "fixed" means.

Two rules make the ladder honest. **Name your rung** when a claim matters and you stopped short: "not run" or "read but not executed" is a complete and acceptable answer. **Never round up.** Rung 1 reported as rung 4 is the single most expensive thing in this document.

## Patterns to Detect and Fix

### Unearned claims (T1)

1. **Completion claimed, nothing run.** "Fixed", "should work now", "this resolves it". State the command and its output, or write "changed, not run".
2. **Green claimed from a partial run.** One file ran, or the run was cut short, or the suite errored on collection and printed nothing. Say which tests ran and how many passed, from the summary line.
3. **"Verified" with no artifact.** Verified means a reader can repeat it. Give the command, the environment, and what it printed.
4. **Fix asserted without seeing red.** A test edited until it passed, with nothing confirming it fails against the bug. Break the behaviour, watch it fail, restore, watch it pass.
5. **Root cause asserted from one reading.** "The race is in the click handler" with no reproduction. Call it a hypothesis until it reproduces on demand, and say what would confirm it.
6. **Absence claimed from a narrow search.** "No other callers", "nothing else uses this", "no other tests affected". An absence claim is only as wide as the search behind it. State the search.
7. **Silent recovery.** The first command failed, the second worked, the answer mentions only the second. The failure was information.
8. **Someone else's word taken as a result.** A subagent or a tool reported success and you passed it on unchecked. Attribute it, or verify it yourself.

### Fabrication (T1)

9. **Invented API.** A method, option, or matcher that does not exist in the installed version. Check the version in `package.json` and the actual types, not memory.
10. **Invented path or symbol.** A `file:line` that resolves to nothing, or a function that was renamed two commits ago. Open every reference before citing it.
11. **Invented flag or config key.** A CLI switch or a config option that reads plausibly and silently does nothing.
12. **Output that was never produced.** Reconstructed or paraphrased terminal output formatted as a paste. If you did not capture it, do not put it in a code block.
13. **Invented issue, doc, or version.** A plausible ticket number, a spec section, a "since 1.42". Link what exists or say what you could not find.
14. **Numbers from nowhere.** "About 40% faster", "roughly 200 tests", "most of the suite". Measure it or drop the sentence.

### Findings nobody can act on (T2)

15. **Finding with no location.** "Error handling could be improved." Where.
16. **Uncounted plural.** "Several issues", "a few places", "many tests". Give the count, or say you did not count.
17. **Advice with no defect behind it.** "Consider adding tests", "you may want to validate this". Name the input that breaks, or drop it.
18. **Severity with no impact.** "High" attached to nothing a user would notice. Say what happens, to whom, how often.
19. **Recommendation with no next step.** A finding that ends without saying what to do or who decides.
20. **Cleared without saying what was checked.** "Looks good" over a diff you skimmed. State what you read in full, what you sampled, and what you skipped.

### Numbers without meaning (T2)

21. **Percentage with no denominator.** "80% coverage" of what, measured by which tool, over which paths.
22. **Delta with no baseline.** "Coverage improved", "it is faster". Both values or neither.
23. **Rate with no window.** A flake rate or pass rate needs the number of runs and the period.
24. **Single-run timing.** One measurement presented as the value. Give the run count, the spread, and the machine, or call it one observation.
25. **Metric answering a different question.** A pass rate offered as the answer to "is this ready to ship".

### Borrowed authority (T2)

26. **Unnamed source.** "Best practice", "the docs recommend", "the standard requires". Link the section or cut the sentence.
27. **Convention as the reason.** "This is the Playwright way." Name the failure the convention prevents.
28. **Invented consensus.** "Most teams", "it is generally agreed", "the community has moved to".

### Scope loss (T1)

29. **Part of the ask dropped in silence.** Three things were requested, two were done, the answer reads as complete.
30. **Blocker buried.** The thing that stops the reader is the last bullet, under the summary.
31. **Scope widened without saying.** Refactors and drive-by edits folded into "the fix", so the reader cannot review what they asked for.
32. **Assumption not surfaced.** A choice was made for the reader and never named, so it looks like a fact about the code.

### Effort theater (T3)

33. **Process narration.** "I read X, then searched Y, then considered Z." The reader wants the conclusion.
34. **Counting instead of concluding.** "Reviewed 14 files across 3 packages" as the headline. Volume is not a finding.
35. **Self-praise adverbs.** "Carefully", "thoroughly", "comprehensively". Either the evidence shows it or the word is doing the work alone.
36. **Restating the request.** The first paragraph tells the reader what they just asked.
37. **Summarising what is directly above.** A closing paragraph repeating the three bullets above it.

### Confidence miscalibration (T2)

38. **Hedges on a measured fact.** "It may possibly be the case that coverage could be around 80%" when you ran the tool.
39. **Certainty on the unrun.** "This definitely fixes it" on code that was never executed.
40. **Flat confidence.** Everything delivered in one register, so the reader cannot separate what you measured from what you guessed. Mark the guesses.

### Style tells that damage a report (T3)

The full list is in `./resources/style-tells.md`. These are the ones that do real damage in QA output.

41. **Puffery in a title.** "Critical issue undermining the robustness of the checkout experience" instead of "Checkout submits twice on double click".
42. **Fancy ways to say is.** "Serves as", "stands as", "boasts", "features". Use "is" or "has".
43. **Not just X, but Y.** State the point.
44. **Rule of three.** Three causes because three feels finished. Use the number you found.
45. **Bold labels restating their own line.** "**Performance:** Performance improved." Write the sentence.
46. **A table for two facts.** Structure heavier than the content it carries.
47. **Emoji status markers.** A green tick is a claim with no evidence attached.
48. **Sycophancy and apology loops.** "Great question", "you are absolutely right", a paragraph of regret. Answer, or correct and move on.
49. **Generic conclusion.** "This puts the suite in a much healthier place." Say which numbers moved.
50. **Filler and fancy synonyms.** "It is important to note that" gets deleted. "Utilize" becomes "use". "In order to" becomes "to".

## What a Good Answer Looks Like

Removing tells is half the job. A stripped answer can still be useless. The ones worth sending share these traits.

- **The first two lines carry the result and the blocker.** Not the method.
- **Every claim's rung is visible.** The reader can tell what was run from what was read.
- **A number never travels alone.** Denominator, window, tool.
- **Findings are ordered by what they cost**, not by the order the files were opened.
- **What was not done is stated where it cannot be missed**, with the reason.
- **The uncertainty is specific.** Not "this may not be complete" but "the e2e suite needs a seeded database this environment does not have, so 24 files were not run".
- **The answer would be different on a different project.** If it would not, it is not about this one.

Voice is allowed and helps. Have an opinion, vary the sentence length, say "I" when you did something, name the thing that surprised you. Voice does not mean inventing personality, and it never means inventing detail. A confident sentence about something you did not check is the failure this whole skill exists to catch.

## Self-Audit

Three questions on the finished draft, before it goes out.

1. **Which sentence here would a reader act on, and did I actually verify it?** That is the sentence that gets rung 4 or a marker.
2. **What did I not do, and where does the answer say so?** If the answer is "nowhere", fix that first.
3. **What in here did I type from memory rather than read?** Open it or delete it.

## Report Format

For anything longer than a couple of lines:

- **Result.** What is true now, in one or two lines. The blocker goes here, not below.
- **Evidence.** Commands and their output. Real pastes only.
- **Findings.** Tier 1 first, each with `file:line` and what it costs. Then Tier 2 and Tier 3, grouped, one line each.
- **Unverified.** Claims that stopped below rung 4, with the reason. Never folded into the findings above.
- **Not done.** Skipped, sampled, or blocked, and why.

`./resources/answer-audit-checklist.md` is the gate to run against the draft. `./resources/before-after-answers.md` has worked pairs for every Tier 1 pattern.

## Resource Map

- `./resources/claim-types-and-evidence.md` - per claim type in QA work, the evidence it requires and the cheapest command that produces it
- `./resources/before-after-answers.md` - worked before and after pairs for the Tier 1 patterns
- `./resources/style-tells.md` - the complete prose style list, for when the job is editing text
- `./resources/answer-audit-checklist.md` - the final gate

## Related Skills

- `unslop-tests` - the same discipline applied to test code. Use it on the tests, use this on what you say about them
- `reviewing-ai-output-groundedness` - the human protocol for auditing a product feature's factuality
- `reporting-bugs` - the bug report format this skill keeps honest
- `code-review-advanced` - the broader review, whose findings this skill formats
- `assessing-release-readiness` - where an unearned "green" costs the most
- `attesting-manual-verification` - when the evidence is a human signature rather than a command

## Definition of Done

This answer is ready when:

- every claim a reader would act on reached rung 4, or is marked with its rung and the reason
- no `file:line`, API, flag, option, link, or version appears that was not opened and checked
- no code block contains output that was not captured from a real run
- every number carries its denominator, its window, and its tool
- every finding has a location and a stated cost
- what was skipped, sampled, or blocked is stated in the first few lines
- Tier 1 findings appear above Tier 3 findings
- no claim of absence is made without the search behind it
- nothing was reported as verified because a tool or a subagent said so
