# Debrief Checklist

Every session ends with a debrief. Fifteen minutes, ideally with a second person. Without it, what the tester learned stays in the tester's head and the session produces only its bug list.

## PROOF

Cover these five, in this order.

### Past: what happened

- What did the session actually cover, compared with the charter?
- Where did it go off-charter, and why?
- What was set up, and how long did that take?

### Results: what was learned

- Was the charter's "to discover" question answered? If not, what is still open?
- What is now known about this area that was not known before?
- What behaves differently from expectation, whether or not it is a bug?

### Obstacles: what got in the way

- Environment, data, access, tooling, missing documentation
- Time lost, and to what
- What would make the next session over this area cheaper

Obstacles are a reportable output, not a complaint. "40 percent of the session went to seeding an account" is the strongest available argument for fixing the seeding.

### Outlook: what remains

- What is still unexplored in this area?
- What should the next charter be?
- What changed in the risk picture as a result of this session?

### Feelings: confidence

- How much do you trust this area now?
- Where is your unease, even where you cannot yet name a defect?

Record this verbatim. "I do not trust the refund path and I cannot say why yet" is a legitimate finding and often precedes the incident. A status report that flattens it into "testing complete" throws away the most informative signal in the session.

## Routing the findings

Every item from the session leaves the debrief with a destination.

| Finding type | Destination | Test before routing |
| --- | --- | --- |
| Reproducible defect | `reporting-bugs`, then the tracker | Reproduced at least twice, evidence attached |
| Intermittent defect | Tracker, with the attempt count and the conditions tried | At least three reproduction attempts recorded |
| Behaviour with no oracle | Requirement owner as a question | Stated as a question, not a bug |
| Requirement gap | Requirement owner, and `verifying-acceptance-criteria` | Named the criterion it contradicts or the one that is missing |
| Repeatable high-value scenario | Automation candidate list | Stated why it deserves a permanent test |
| Environment or tooling obstacle | Team backlog | Quantified: minutes lost, frequency |
| Area still unknown | Next charter | Written as a charter, not a note |
| Security-shaped observation | `testing-application-security`, and stop probing further without authorization | Nothing exploited beyond observation |

An item with no destination is an item that will be lost. If a finding does not fit any row, write it in the "questions" section rather than dropping it.

## Debrief questions worth asking

For the person who ran the session:

- What surprised you?
- What did you nearly not test?
- What would you do differently with another hour?
- What is the worst thing that could be wrong in this area and would you have found it?
- If you had to ship this tomorrow, what would you check first?
- What did you assume that you did not verify?

The fourth is the most useful one. It converts a session summary into a risk statement, which is what the release decision needs.

## Session quality check

The debrief is also where the session's own quality is judged.

- [ ] Notes were written during the session, not afterwards
- [ ] Every observation that became a bug has evidence attached
- [ ] Detours are recorded, including what was dropped for them
- [ ] The charter question is answered or explicitly open
- [ ] The time split is estimated
- [ ] Confidence per area is stated
- [ ] Every finding has a destination
- [ ] The next charter is written

A session that fails several of these is not a failed session; it is a session whose output needs reconstructing while it is still fresh. Do that now rather than a week later.

## Reporting upward

What a stakeholder needs from a set of sessions, in three lines:

1. **Coverage**: charters run against charters planned, and which areas were left uncovered
2. **Risk**: the areas with low confidence and what would reduce that
3. **Blockers**: what stopped the sessions from covering more

Resist the urge to lead with bug counts. Bug count measures the session's luck and the code's state at once, and separates neither. See `analyzing-quality-metrics` for why this metric misleads.
