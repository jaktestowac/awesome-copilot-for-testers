# Scoring Strategies

Pick the cheapest strategy that can actually fail. The ordering below is the recommendation, and it is the opposite of most teams' instinct.

## 1. Exact and pattern matching - free, exact

For classification, extraction, enums, ids, and any output with one right answer.

```ts
expect(result.category).toBe('billing');
expect(result.ticketId).toMatch(/^TICK-\d+$/);
expect(result.sentiment).toBeOneOf(['positive', 'neutral', 'negative']);
```

Use it wherever the output is constrained. If a feature's output cannot be exactly matched anywhere, ask whether the output should be more structured - that is usually a product improvement, not a testing limitation.

## 2. Schema validation - free, exact

Every structured output gets a schema, and the schema is the first assertion.

```ts
const Summary = z.object({
  summary: z.string().min(20).max(500),
  ticketId: z.string().regex(/^TICK-\d+$/),
  owner: z.string().nullable(), // null, never invented
  citations: z.array(z.string()).min(1),
});

const parsed = Summary.safeParse(JSON.parse(output));
expect(parsed.success, parsed.error?.message).toBe(true);
```

Two things this catches that nothing else does cheaply: format drift after a model upgrade, and invented values where `null` was correct. `owner: z.string().nullable()` plus a case where the owner is genuinely absent is how you test for confident invention.

## 3. Required and forbidden content - free

Direct encoding of the feature's promises.

```ts
expect(output).toContain(ticket.id); // always cite the source
expect(output).not.toMatch(/as an AI|I cannot|I'm sorry/i); // persona leakage
expect(output).not.toContain(otherTenant.name); // isolation
```

Keep the forbidden list per feature and grow it from real failures. It is the cheapest regression net there is.

## 4. Deterministic properties - free

Computable facts about the output:

- sentence or token count within limits
- valid JSON, valid markdown, no unclosed code fence
- every citation resolves to a document that was actually retrieved
- no numbers appear that are absent from the source (a strong hallucination check for numeric domains)
- no PII pattern where none was provided
- language matches the input language
- monotonic or bounded values where the domain requires it

The citation-resolution check deserves special mention: verifying that every cited id exists in the retrieved set catches fabricated sources deterministically, which is otherwise a job for an expensive judge.

## 5. Embedding similarity - cheap, fuzzy

For "should mean the same thing" where wording may vary.

```ts
const score = cosineSimilarity(await embed(output), await embed(reference));
expect(score).toBeGreaterThan(0.85);
```

Caveats worth knowing before relying on it:

- similarity is not correctness - a fluent, confidently wrong answer scores high against a right one
- thresholds are corpus-specific; calibrate on known-good and known-bad pairs, do not inherit a number
- negation is nearly invisible to embeddings: "the refund succeeded" and "the refund failed" sit close together

Use it as a smoke check on paraphrase-tolerant output, never as the only assertion on a factual claim.

## 6. LLM-as-judge - expensive, needs validation

Legitimate for genuinely subjective properties: tone, helpfulness, faithfulness to a source, whether an explanation would satisfy the user. Illegitimate as a default because it feels easier.

**A judge needs four things:**

1. **A written rubric with a scale.** Not "rate 1–10 for quality".

```
Score faithfulness 0–3 against the SOURCE only:
  3 - every claim is supported by the source; no additions
  2 - all claims supported, but omits something material
  1 - contains a claim not present in the source
  0 - contradicts the source
Output JSON: { "score": <0-3>, "unsupported_claims": [...] }
Judge only faithfulness. Ignore tone, length and formatting.
```

2. **A different model from the one under test.** Self-preference bias is measurable - models rate their own outputs higher.

3. **Validation against human labels.** Label 30–50 outputs by hand, run the judge, and measure agreement. Below roughly 80% agreement the judge is noise; fix the rubric or drop the strategy. Re-validate whenever the judge model or rubric changes.

4. **Temperature 0 and a pinned judge version.** A judge that drifts turns every eval into a moving target.

Make the judge's output structured and require the evidence field (`unsupported_claims`) - a score with no evidence cannot be debugged, and the evidence is what makes a failure actionable.

**Pairwise beats absolute.** "Which of these two answers is more faithful to the source, A or B?" is more stable than "score this 0–3", and it maps directly onto the question a regression gate asks: is the new output worse than the baseline? Randomise position to cancel order bias.

## 7. Human review - expensive, definitive

The final arbiter, on a sample. Use it to:

- approve golden expectations before they become golden
- validate a judge
- review a sample every release for what the suite structurally cannot see
- adjudicate the cases where reviewers disagree

Record it as an attestation (`attesting-manual-verification`, `reviewing-ai-output-groundedness`) rather than folding it into an automated score. Human review is evidence; it is not a metric.

## Combining strategies

Layer per case: one structural check plus one substantive check.

```yaml
expect:
  - type: schema # free, catches format drift
    ref: SummarySchema
  - type: contains # free, the stated promise
    value: 'TICK-42'
  - type: max-sentences # free, the stated constraint
    value: 3
  - type: citations-resolve # free, catches fabrication
  - type: rubric # expensive, the subjective part
    criteria: 'Names the blocking issue and the current owner. No invented names.'
```

Run the free checks on every case on every run. Sample the rubric checks - every case on `main`, a subset on PRs - when cost matters.

## Variance and flakiness

A case that passes and fails across runs of an unchanged system is a broken case, not a quality signal.

```ts
const runs = await Promise.all(Array.from({ length: 5 }, () => callModel(input)));
const passes = runs.filter(passesAssertions).length;
// report 5/5, 4/5, 0/5 - never average into a single "score"
```

Handling by result:

| Result                                    | Meaning                     | Action                                                                  |
| ----------------------------------------- | --------------------------- | ----------------------------------------------------------------------- |
| 5/5 or 0/5                                | stable                      | trust it                                                                |
| 4/5, 3/5                                  | unstable case               | tighten the assertion or accept a pass-rate threshold declared up front |
| varies run to run in different directions | the assertion is subjective | move to pairwise or human review                                        |

Set the gate's noise band by running the whole suite three times unchanged and measuring the spread. Gating inside that band produces the flakiest job in CI and gets the eval suite disabled - which is how a team ends up with no gate at all.

## Cost control

- **Cache by (prompt hash, model, input hash).** Unchanged cases cost nothing on re-run; this alone makes a suite affordable on every PR.
- **Tier the suite:** free deterministic checks on every PR, judge checks on `main` and on prompt changes, the full matrix nightly.
- **Cap spend per run** and fail loudly on the cap rather than silently truncating the case set - a truncated run that reports a pass is a false green.
- **Report cost per run** as a first-class result. A suite whose cost doubles is a finding, the same as one whose score drops.
