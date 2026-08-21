---
name: reviewing-ai-output-groundedness
description: 'Human review protocol for whether AI output is grounded in its sources: claim-by-claim attribution, hallucination classes, citation verification, sampling that is defensible, and a recorded attestation because groundedness cannot be fully automated. Also covers the responsible-AI pass - harmful output, bias, disclosure and privacy. Use when reviewing a RAG or summarisation feature, when factuality matters more than fluency, or when an eval suite needs the human check it cannot replace.'
argument-hint: 'The feature, a sample of outputs with the sources retrieved for each, and the factuality bar for this domain'
user-invocable: true
---

# Reviewing AI Output Groundedness

Use this skill when a feature states facts derived from sources, and someone has to establish whether those facts are actually in the sources.

An eval suite catches structural regressions and can approximate faithfulness with a judge. It cannot tell you whether a confident, fluent, well-cited paragraph is quietly wrong in a way that matters to this domain. That judgement is human, it is sampled rather than exhaustive, and it ends in an attestation rather than a pass.

Fluency is the trap. Ungrounded output does not look broken - it looks better than grounded output, because nothing in it is hedged.

## When to Use

- a RAG, summarisation, extraction, or research feature is going in front of users
- output is used to make a decision: medical, legal, financial, operational
- an eval suite reports high faithfulness and someone is not convinced
- users report answers that were "wrong but sounded right"
- a release needs a factuality attestation, not just a score
- a responsible-AI review is required before launch

## Operating Principles

- **A claim is the unit, not the answer.** A four-sentence answer contains eight claims, seven grounded and one invented. Reviewing "the answer" misses it every time.
- **Grounded means present in the retrieved source.** Not "true", not "plausible", not "consistent with what I know". A claim that is true but absent from the sources is still ungrounded - the system got lucky.
- **Citations are checked, not counted.** A citation that does not support the claim it is attached to is worse than none: it manufactures confidence.
- **Sample defensibly and say how.** A convenience sample of ten happy-path outputs supports no conclusion. State the size, the selection method, and the confidence you are claiming.
- **Classify, do not just flag.** Fabrication, unsupported inference, conflation, stale source, and omission need different fixes; a single "hallucination" count directs nobody.
- **Omission is a groundedness failure.** A summary that drops the one caveat that mattered is faithful to the source and useless to the reader.
- **Absence of a source is a required behaviour.** "The documents do not say" is a correct answer, and a feature that cannot produce it will invent instead.
- **The output is an attestation with limitations.** Never a percentage presented as a guarantee.

## Workflow

### Phase 0: Fix the factuality bar

Before reading a single output, write down what the domain requires - this decides what counts as a finding:

- which claim types must be exactly right: numbers, dates, names, identifiers, dosages, legal references, prices
- which may be paraphrased
- whether every claim needs a citation, or only the load-bearing ones
- what the feature must do when sources are silent or contradict each other
- who is harmed by a confident wrong answer, and how quickly it would be noticed

A summariser for internal triage and a summariser for clinical notes have the same architecture and completely different bars. The bar comes from the domain owner, not from the reviewer.

### Phase 1: Build the sample

From `./resources/groundedness-review-protocol.md`. A defensible sample needs each of:

- **random** outputs from real traffic - the baseline, and the one usually missing
- **hard** cases: long sources, contradictory sources, sparse sources, multi-document synthesis
- **high-stakes** cases: the claims that would cause harm if wrong
- **user-reported** cases: complaints are pre-labelled findings

20–30 outputs is a working review. Below ten, you are collecting anecdotes. Each output must come with **the sources actually retrieved for it** - reviewing an answer against the corpus rather than against its own retrieval measures the wrong thing and will send you tuning prompts to fix retrieval.

### Phase 2: Decompose and verify, claim by claim

For each output, split it into atomic claims and verify each against the retrieved sources:

| Verdict | Meaning |
| --- | --- |
| **Grounded** | stated in a retrieved source; cite the location |
| **Unsupported inference** | reasonable, follows from the sources, but not stated |
| **Fabricated** | not in the sources and not derivable |
| **Contradicted** | the sources say otherwise |
| **Conflated** | merges two sources or two entities into one wrong statement |
| **Stale** | correct in an outdated source that was retrieved |
| **Unverifiable** | cannot be checked from the sources available |

Then check the citations separately: does each cited source exist, was it retrieved, and does it actually support the specific claim it is attached to? A citation that points at a real document making a different point is the most damaging failure mode in the set, because it survives every automated check.

Finally check **omission**: what did the sources say that the output should have carried and did not? Caveats, conditions, exceptions, dates, and "this applies only to X" clauses are the usual casualties.

### Phase 3: Separate retrieval from generation

For every ungrounded claim, ask which layer failed:

| Failure | Diagnosis |
| --- | --- |
| The right document was never retrieved | **retrieval** - fix the index, chunking, or query |
| The document was retrieved and misread | **generation** - fix the prompt or the model |
| The document was retrieved and correct, output contradicts it | **generation**, and the worst kind |
| No document exists | **coverage** - the feature should say so, and should not answer |

Skipping this is how teams spend weeks on prompt engineering to fix an indexing bug.

### Phase 4: Responsible-AI pass

While the sample is open, run the checklist in `./resources/responsible-ai-checklist.md`: harmful or unsafe content, bias across groups where the domain makes that meaningful, privacy leakage into output, disclosure (does the user know this is AI-generated and that it can be wrong), appropriate refusal, and whether confidence is calibrated to the evidence.

Confidence calibration is the one most often missed: output that hedges on well-supported claims and states thin ones flatly is actively misleading, even when every claim is technically grounded.

### Phase 5: Attest

Record the review as an attestation, never as a score (`attesting-manual-verification`):

- what was reviewed: feature, model, sample size, selection method, date
- claim-level results by verdict class
- citation accuracy, checked rather than counted
- omissions found
- retrieval versus generation attribution
- responsible-AI findings
- **limitations** - what the sample could not cover
- the factuality bar, and whether it was met

Then feed what is mechanisable back into the eval suite: every fabricated or contradicted claim becomes a permanent regression case (`testing-llm-features`). That is how a human review compounds instead of evaporating.

## Common Failure Modes

- **Reviewing answers instead of claims.** One invented detail in an otherwise correct paragraph reads as correct.
- **Grading against your own knowledge.** True-but-absent is ungrounded. The system guessed and got away with it.
- **Counting citations.** Three citations that do not support their claims is worse than zero.
- **Reviewing against the corpus, not the retrieval.** Measures the wrong system and misdirects the fix.
- **A convenience sample.** Ten happy-path outputs from a demo, presented as evidence.
- **Ignoring omission.** The most common real-world failure in summarisation, and invisible if you only check what is present.
- **No factuality bar.** Without one, every reviewer applies their own, and results are not comparable across reviews.
- **Reporting a percentage as a guarantee.** "96% grounded" with no limitations, no sample method, and no claim-class breakdown.
- **Not feeding findings back into evals.** The same failure gets rediscovered by hand next quarter.

## Resource Map

- `./resources/groundedness-review-protocol.md` - sampling design, claim decomposition, the verdict classes with examples, citation and omission checks, the review worksheet
- `./resources/responsible-ai-checklist.md` - harm, bias, privacy, disclosure, refusal, and confidence calibration, scoped to a tester's judgement

## Related Skills

- `testing-llm-features` - the automated layer; findings here become permanent eval cases there
- `testing-llm-guardrails` - runtime controls and adversarial resistance, as opposed to factuality
- `attesting-manual-verification` - where this review's attestation lives and how it expires
- `reporting-bugs` - filing individual groundedness failures with evidence
- `assessing-release-readiness` - the attestation is release evidence, with its limitations attached
- `handling-sensitive-test-data` - real outputs and sources often contain personal data

## Definition of Done

This skill is complete when:

- the factuality bar is written down and came from the domain owner
- the sample is stated with size and selection method, and includes random, hard, high-stakes and user-reported cases
- every output is reviewed claim by claim, against the sources actually retrieved for it
- each ungrounded claim carries a verdict class and a retrieval-versus-generation attribution
- citations are verified for support, not counted
- omissions are recorded as findings
- the responsible-AI pass is run and its findings reported
- the result is an attestation with explicit limitations, not a bare percentage
- every fabricated or contradicted claim has become a regression case in the eval suite
