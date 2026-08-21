# Answer Audit Checklist

Run against the finished draft, before it is sent. Every box is a question about this draft, not a general principle.

## Claims

- [ ] Every sentence a reader would act on is at rung 4 of the ladder, or carries its rung
- [ ] "Fixed" appears only where the failure was seen before the change and the pass after it
- [ ] "Tests pass" states which tests ran, how many, and how many were skipped
- [ ] "Verified" is followed by the command that a reader could repeat
- [ ] Every claim of absence quotes the search behind it
- [ ] A root cause is called a hypothesis unless it reproduces on demand
- [ ] No result is passed on from a tool or a subagent without attribution or a check
- [ ] Every command that failed on the way is mentioned, not only the one that worked

## Specifics

- [ ] Every `file:line` in the draft was opened and resolves
- [ ] Every API, matcher, and method exists in the installed version
- [ ] Every flag, config key, and environment variable was checked against the real config
- [ ] Every code block containing output is a real paste, not a reconstruction
- [ ] Every link, issue number, and version was verified or dropped

## Numbers

- [ ] Every percentage names its denominator, its tool, and its metric
- [ ] Every "improved" or "faster" gives both values
- [ ] Every rate gives the run count and the window
- [ ] Every timing gives the number of runs and the spread, or is called one observation
- [ ] No number in the draft was estimated

## Findings

- [ ] Every finding has a location
- [ ] Every plural has a count, or says it was not counted
- [ ] Every severity has an impact clause: who, what they see, how often, workaround
- [ ] Every recommendation says what to do next
- [ ] "Looks good" is backed by what was read in full, sampled, and skipped
- [ ] Tier 1 findings appear above Tier 2 and Tier 3

## Honesty about scope

- [ ] Everything that was asked for is either done or named as not done
- [ ] The blocker, if there is one, is in the first two lines
- [ ] Extra changes beyond the request are listed separately from the fix
- [ ] Assumptions made on the reader's behalf are stated as assumptions
- [ ] Sampling is described as sampling

## Sources

- [ ] "Best practice", "the docs", "the standard" either link a section or are gone
- [ ] Any convention cited names the failure it prevents
- [ ] No invented consensus about what most teams do

## Calibration

- [ ] Measured facts are stated plainly, with no hedging
- [ ] Unrun claims carry no certainty language
- [ ] The measured and the guessed are visibly different in tone

## Noise

- [ ] No narration of the process
- [ ] No file or step counts standing in for a conclusion
- [ ] No "carefully", "thoroughly", "comprehensively"
- [ ] The opening does not restate the request
- [ ] The closing does not summarise the bullets above it
- [ ] No emoji status markers, no table carrying two facts, no bold label repeating its own line
- [ ] No sycophancy, no apology paragraph
- [ ] The closing states which numbers moved, or there is no closing

## The last three

- [ ] Which sentence would a reader act on, and was it actually verified
- [ ] What was not done, and where does the draft say so
- [ ] What in here was typed from memory rather than read
