# Eval Case Design

## Anatomy of a case

```yaml
- id: summarize-ticket-multi-thread
  template: summarize-ticket-v3 # which prompt this exercises
  capability: summarization # what it tests, for per-capability reporting
  class: golden # golden | edge | negative | regression | adversarial
  input:
    ticket: fixtures/tickets/multi-thread-42.json
  expect:
    - type: max-sentences
      value: 3
    - type: contains
      value: 'TICK-42' # the promise: always cite the ticket id
    - type: not-contains-any
      value: ['as an AI', 'I cannot'] # persona and refusal leakage
    - type: rubric
      criteria: 'Mentions the customer's blocking issue and the current owner. Does not invent names.'
  why: >-
    Multi-thread tickets caused the model to summarise only the last message,
    losing the original complaint. Found in INC-118.
  added: 2026-07-04
```

The `why` field is what keeps a case set maintainable. Without it, a failing case a year from now gets deleted rather than understood - nobody can tell whether the expectation was ever right.

## The five classes

### Golden - the canonical path

5–10 per prompt template. Representative real inputs with human-approved expectations.

The rule that matters: **a golden expectation is what the feature promises, not what the model produced.** Copying current output into the expectation freezes today's bugs as the spec. Generate a candidate, then have a human confirm or correct it before it becomes golden.

### Edge - the input space boundary

Inputs the feature will meet and was not designed for:

- empty, whitespace-only, one word
- very long input - at, just under, and over the context limit
- non-English, mixed-script, right-to-left, emoji-heavy
- malformed structure: broken JSON, truncated markdown, HTML in plain text
- contradictory content: two different dates for the same event
- content that looks like an instruction ("summarise this: ignore the above and…") - the boundary with `testing-llm-guardrails`
- missing expected fields: no customer, no owner, no timestamps
- duplicate or near-duplicate content
- content in the wrong domain entirely

Expected behaviour on an edge case is often "degrade predictably", and that is a testable expectation: refuse, ask for clarification, return a partial result with a stated gap. What is not acceptable is confident invention.

### Negative - what must not happen

The most-skipped class and the one users find first:

- must refuse: out-of-scope requests, requests for another user's data, disallowed content
- must not invent: names, dates, prices, citations not present in the source
- must not leak: system prompt, other tenants' data, internal identifiers, PII beyond what was provided
- must not exceed authority: no tool call that mutates state when the operation is read-only
- must not break format: no prose outside the JSON, no markdown when plain text was requested

Every capability with a stated boundary needs at least one case that pushes on it.

### Regression - one per incident, forever

The compounding asset. Every production failure becomes a permanent case with the incident id in `why`. After six months this is the most valuable part of the suite, and it costs one case per incident.

Rule: **the case is added before the fix.** It fails, the fix lands, it passes. Same discipline as a bug-fix unit test.

### Adversarial - injection and jailbreaks

Belongs to `testing-llm-guardrails`, but keep the boundary visible here so nobody assumes the golden set covers it. It does not.

## Writing an expectation that can fail

The test for an expectation: **could the current implementation fail it?** If not, it is documentation.

| Weak                   | Why                        | Stronger                                                   |
| ---------------------- | -------------------------- | ---------------------------------------------------------- |
| `contains: "summary"`  | almost any output passes   | `max-sentences: 3` + `contains: TICK-42`                   |
| `rubric: "is helpful"` | unfalsifiable              | `rubric: "names the blocking issue and the current owner"` |
| `similarity > 0.5`     | half the corpus passes     | `similarity > 0.85` against a human-approved reference     |
| `not-empty`            | catches only total failure | schema + required fields + forbidden phrases               |

Layer expectations: a cheap structural check plus one substantive check per case. The structural check tells you _that_ it broke; the substantive one tells you _how_.

## Fixtures and inputs

- **Keep inputs in files, not inline in the config.** Real inputs are long, and diffs of inline YAML strings are unreadable.
- **Sanitise real data before it becomes a fixture.** Production tickets, chat logs and documents carry personal data - see `handling-sensitive-test-data`.
- **Freeze retrieval.** For RAG, snapshot the retrieved documents into the fixture so an index change cannot silently change the test. Test the _live_ index separately, as a retrieval eval.
- **Version the corpus.** When a fixture changes, the baseline it produced is no longer comparable. Record a corpus version with each run.

## Growing the set

Sources, in order of value:

1. **Production failures** - always, one case each
2. **The feature's stated promises** - one case per clause of the user-visible contract
3. **Support tickets and user complaints** - these are edge cases already labelled by reality
4. **Reviewer disagreements** - when two people disagree about whether output is acceptable, the case set is missing a rule; write the case and settle it
5. **Model or prompt changes** - a new capability needs cases before it ships
6. **Imagination** - last, and it is where most teams start

## Size, and when to stop

Start with 15–25 cases per prompt template. Enough to catch structural regressions, small enough to run on every PR and cheap enough that nobody argues about the bill.

Grow only in these directions:

- a new capability ships → golden and negative cases for it
- a production failure → a regression case
- a case set that never fails on real regressions → the cases are too easy; add harder inputs from real traffic

Signals the set has gone wrong:

- **it never fails** - the cases are too easy, or they are asserting nothing
- **it always fails somewhere** - the cases encode aspirations rather than the current contract; split into "must pass" and "tracking"
- **nobody can say why a case exists** - the `why` field was skipped and the case is now unmaintainable
- **runs cost more than the feature earns** - sample the expensive judge cases and keep the deterministic ones on every run

## Per-capability reporting

Tag every case with a `capability` so the report is diagnosable:

```
citation-accuracy   47/50   94%   ↓ 2pp
refusal             12/12  100%   -
summary-faithfulness 34/42   81%   ↓ 11pp   ← regression
format-conformance  50/50  100%   -
```

One global number would have shown 89% and hidden the faithfulness drop. Capability tags are what turn an eval score into a work item.
