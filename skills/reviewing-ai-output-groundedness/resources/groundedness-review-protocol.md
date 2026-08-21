# Groundedness Review Protocol

## Sampling

A sample nobody can describe supports no conclusion. State size, selection method, and the confidence you claim.

| Stratum                      | Why                                                                             | Share of a 25-output sample |
| ---------------------------- | ------------------------------------------------------------------------------- | --------------------------- |
| **Random from real traffic** | the only unbiased view of normal behaviour                                      | 10                          |
| **Hard cases**               | long sources, contradictory sources, sparse retrieval, multi-document synthesis | 6                           |
| **High-stakes**              | claims that cause harm if wrong: numbers, dosages, prices, legal references     | 5                           |
| **User-reported**            | complaints are findings someone already labelled                                | 4                           |

Rules:

- **Each output comes with the sources actually retrieved for it.** Reviewing against the whole corpus measures a different system and misdirects every fix.
- Random must be genuinely random - sample by row id or timestamp, not "the ones in the demo".
- Below ten outputs, call the result "spot check", not "review".
- Record what the sample excluded: languages, tenants, time periods, query types. That list is half of the limitations section.
- Never carry a sample across a model or prompt change; results do not transfer.

## Claim decomposition

Split each output into **atomic claims** - one verifiable assertion each.

Output:

> The refund policy allows returns within 30 days of delivery. Digital goods are excluded. Customers on the Pro plan get 60 days, and refunds are processed within 3 business days.

Claims:

1. Returns are allowed within 30 days of delivery.
2. Digital goods are excluded from returns.
3. Pro plan customers get 60 days.
4. Refunds are processed within 3 business days.

Four claims, four separate verdicts. Reviewing "the answer" would have graded this as correct if three of the four were right - and claim 3 or 4 is exactly where the invented detail lives.

Decomposition rules: split on conjunctions and on separate facts; keep a claim's qualifiers attached (30 days _of delivery_ is one claim, and dropping "of delivery" changes its truth); treat a number, a date, or a name as its own claim when it is load-bearing.

## Verdict classes

| Verdict                   | Definition                                 | Example                                                     |
| ------------------------- | ------------------------------------------ | ----------------------------------------------------------- |
| **Grounded**              | stated in a retrieved source               | "30 days" appears in policy.md §2                           |
| **Unsupported inference** | follows from the sources but is not stated | sources say Pro has "extended returns"; output says 60 days |
| **Fabricated**            | not in the sources, not derivable          | "3 business days" appears nowhere                           |
| **Contradicted**          | the sources say otherwise                  | sources say 14 days; output says 30                         |
| **Conflated**             | two sources or entities merged wrongly     | the Pro _shipping_ SLA presented as the refund window       |
| **Stale**                 | correct in an outdated retrieved source    | the 2024 policy was retrieved and quoted                    |
| **Unverifiable**          | not checkable from available sources       | "most customers prefer"                                     |

Record the location for every **Grounded** verdict. If you cannot point at where it is, it is not grounded - it is unverified, and the distinction is the whole review.

**Fabricated numbers are the highest-severity class in almost every domain.** A wrong qualitative claim gets questioned; a wrong figure gets used.

## Citation verification

For each citation, three checks in order:

1. **Exists** - the cited document is real
2. **Retrieved** - it was in this query's retrieval set, not hallucinated from training
3. **Supports** - it actually makes the claim it is attached to

Check 3 is the one that fails. A citation pointing at a real, retrieved document that discusses the topic but not the claim manufactures confidence and passes every automated check - including a citation-resolution assertion, which only proves the id exists.

Report citation accuracy as: `18/22 claims cited · 15/18 citations support their claim · 2 cite a retrieved document making a different point · 1 cites a document not retrieved`.

## Omission check

Read the sources, then the output, and ask what should have carried over and did not:

- caveats and conditions ("only for orders placed before X")
- exceptions and exclusions
- dates and validity windows
- contradictions between sources that the output silently resolved by picking one
- uncertainty the sources expressed and the output dropped

Omission is faithful and wrong: nothing in the output is ungrounded, and the reader is still misinformed. In summarisation it is the most common real-world failure, and it is invisible to any check that only inspects what is present.

The severe pattern: **the output silently resolved a contradiction between two sources.** The correct behaviour is to surface the conflict. Picking one and stating it flatly is a failure even when the chosen source is right.

## Retrieval versus generation

For every non-grounded claim:

| Was the supporting document retrieved? | Diagnosis          | Fix                                                     |
| -------------------------------------- | ------------------ | ------------------------------------------------------- |
| No, and it exists in the corpus        | retrieval          | chunking, embedding, `topK`, reranking, query rewriting |
| No, and it does not exist              | coverage           | the feature must say "the sources do not cover this"    |
| Yes, output misread it                 | generation         | prompt, model, output constraints                       |
| Yes, output contradicts it             | generation, severe | prompt constraint plus a permanent eval case            |

Report the split as a headline: `9 ungrounded claims: 5 retrieval · 3 generation · 1 coverage`. That single line usually redirects the team's next two weeks.

## Worksheet

```
Output #7  ·  query: "what's the refund window for Pro customers?"
Retrieved: policy-2026.md (chunks 2,3) · pro-plan-terms.md (chunk 1) · shipping-sla.md (chunk 4)

# Claim                                    Verdict         Source           Note
1 Returns within 30 days of delivery       grounded        policy §2.1      exact
2 Digital goods excluded                   grounded        policy §2.4      exact
3 Pro customers get 60 days                CONTRADICTED    pro-terms §1     terms say 45
4 Refunds processed in 3 business days      FABRICATED      -                nowhere in retrieval
5 (citation) claim 4 cites shipping-sla.md  BAD CITATION    shipping-sla §4  document is about delivery, not refunds

Omission: policy §2.2 limits returns to unopened items - dropped entirely.
Attribution: claim 3 generation (source was retrieved, misread) · claim 4 fabrication
Severity: HIGH - a wrong refund window and an invented SLA, both quoted with a citation
Eval cases to add: refund-window-pro (contradiction), refund-sla-absent (must say unknown)
```

One output, five rows, two eval cases, and a clear fix direction. That density is what a claim-level review buys over a per-answer score.

## Aggregating

```
Groundedness review - refund assistant · claude-sonnet-4-5-20250929 · 2026-08-21
Sample 25 outputs (10 random · 6 hard · 5 high-stakes · 4 user-reported) · 143 claims

  grounded              118  83%
  unsupported inference   9   6%
  fabricated              7   5%   ← 4 of them numbers
  contradicted            5   3%
  conflated               2   1%
  stale                   2   1%

  citations           98/143 claims cited · 84/98 support their claim
  omissions           6 outputs dropped a material caveat
  attribution         14 retrieval · 8 generation · 1 coverage

  Factuality bar: every number exact, every claim cited. NOT MET.
  Limitations: English only; single tenant; no multi-turn conversations;
               sample predates the 2026-08-19 prompt change.
```

The limitations block is not a disclaimer, it is part of the result. A reader who does not know the sample was single-tenant and English-only will over-generalise the 83%, and that over-generalisation is the actual risk this review was run to reduce.
