# Pre-Send Gate

Run this against the finished draft, before it goes out. Nine checks, one pass, under a minute.

The gate is ordered by what a failure costs. Stop and fix at the first failure in checks 1 to 3 - a report that fails those does damage rather than nothing.

## The checks

| # | Check | Fails when | Fix |
| --- | --- | --- | --- |
| 1 | **Evidence survived the edit** | A claim lost its rung, its denominator, or its "not run" marker while the draft was being shortened | Restore the marker. Length is negotiable, the rung is not |
| 2 | **The blocker is in the first two lines** | The thing that stops the reader is below the summary, in a bullet, or in a closing note | Move it to line two. Everything above a blocker reads as good news |
| 3 | **What was skipped is stated early** | Part of the ask was not done, or a suite did not run, and the report reads as complete | Say which part and why, in the first few lines |
| 4 | **One decision** | The reader is asked to decide more than one thing | Keep the decision this report exists for. Name the others, park them, offer them separately |
| 5 | **Five or fewer decision items** | The message carries more than five things to act on | Move the full set to a file under `.qa/`, keep the five that need a decision now, link the file |
| 6 | **Ordered by stated cost** | Findings appear in discovery order, file order, tool-output order, or by label with no impact stated | Re-sort by what each costs if ignored, and write the cost next to it |
| 7 | **Every finding has a location and a first step** | A finding names no `file:line` (or no URL, endpoint, or screen), or no action a reader could start now | Add both. A finding with neither is a complaint |
| 8 | **Every quantity is a real count** | A number appears with no denominator, no window, or no measurement behind it - including time estimates | Add the denominator and window, or replace the number with the count you actually have |
| 9 | **First line and last line carry the report** | Reading only those two lines does not tell the reader what is true and what to do next | Rewrite the first line as the result and the last line as one action |

## Deletions

Before sending, delete these outright:

1. The opening sentence if it announces what you are about to say, restates the request, or describes your method.
2. The closing sentence if it recaps the bullets above it or asks "anything else?".
3. Any "by the way" sidebar. If it matters, it is a separate message.
4. Any adverb praising your own work: "carefully", "thoroughly", "comprehensively".
5. Any hedge that carries no uncertainty. Keep the hedge that marks a real unknown - deleting that one manufactures confidence.
6. Any severity label with no impact stated next to it.
7. Any emoji used as a status claim. A green tick is a claim with no evidence attached.

## Two-line test

The last thing to run. Read only the first line and the last line of the draft.

- Does the first line say what is true now?
- Does the last line say what happens next, and who does it?

If either answer is no, the draft is not shaped yet, however good the middle is.

## When to skip the gate

Skip checks 4, 5, and 6 - and only those - when the output is:

- a matrix, register, charter set, or full finding list written to a file as an artifact
- an audit or compliance record, where completeness is the point
- a walkthrough or explanation the reader explicitly asked for

Checks 1, 2, 3, 7, 8, and 9 apply to every output, always. Those six are honesty and actionability, not shaping.
