---
name: testing-llm-features
description: 'Builds an offline eval suite for LLM-powered features: golden reference cases per prompt template, deterministic scoring where possible, a regression gate on prompt, model and retrieval changes, and CI wiring with promptfoo, Vitest or deepeval. Use when a product ships prompts, agents or RAG, when a model or prompt upgrade needs a regression check, when LLM output is currently verified by someone eyeballing it, or when asked how to test a feature whose output is non-deterministic.'
argument-hint: 'The feature, its prompts and model config, what "good output" means for it, and the current test/CI setup'
user-invocable: true
---

# Testing LLM Features

Use this skill when a product's behaviour depends on a model, and the current verification method is a person looking at output and deciding it seems fine.

The problem is not that LLM output is hard to assert on. It is that **the same input produces different output, and a prompt or model change can degrade quality without breaking anything**. No test in a normal suite fails. Coverage stays green. The feature just gets worse, and you find out from users.

An eval suite is the unit-test layer for this: a fixed set of cases, run on every change that could affect model behaviour, scored consistently enough that a regression is visible.

## When to Use

- a feature calls a model and there is no automated check on output quality
- a prompt, model version, temperature, tool list, or retrieval config is about to change
- a model upgrade is proposed and nobody can say what would regress
- an agent or chain has grown beyond what manual spot-checks can cover
- RAG answers are drifting and it is unclear whether retrieval or generation is at fault
- a CI gate is needed for AI behaviour, not just AI code

## Operating Principles

- **Golden cases, not vibes.** A case has an input, an expectation, and a scoring rule. "Looks good" is not an expectation.
- **Determinism where you can get it.** Pin the model version, set temperature to 0, fix seeds, freeze retrieval snapshots. Non-determinism is a property of the model; it is not an excuse for a non-reproducible test.
- **Test the assertable layer first.** Schema conformance, required fields, refusal behaviour, citation presence, tool-call shape, latency and cost. Most feature-breaking regressions are structural, and structural checks are cheap and exact.
- **Rubrics before judges.** If an LLM judges the output, it needs a written rubric with a scale, and the judge itself needs validating against human labels. An unrubriced judge is a random number with an API bill.
- **A regression is a new failure on a case that used to pass.** That is the gate. An absolute score threshold on a hard case set gates nothing useful.
- **Separate retrieval failures from generation failures.** A RAG answer can be wrong because the right document was never retrieved. Score retrieval independently or you will tune the prompt to fix an index problem.
- **Cases are a product artifact.** They encode what the feature promises. Review them like code and grow them from real failures.
- **Cost and latency are results.** A 12% quality gain for 4× the cost and 3× the latency is a product decision, so report all three.

## Workflow

### Phase 0: Map the surface

Find everything that can change model behaviour, because each is a trigger for the suite:

| Element | Where to look |
| --- | --- |
| Prompt templates | `prompts/`, `*.prompt.*`, template literals passed to the SDK |
| System prompts | client construction, agent definitions |
| Model config | model id, temperature, top_p, max tokens, stop sequences, thinking budget |
| Tool definitions | tool/function schemas, MCP servers, tool grants |
| Retrieval | chunking, embedding model, index, `topK`, reranking, filters |
| Output contract | Zod/schema on the response, structured-output config, parsing code |
| Orchestration | chain and agent-loop structure, retries, fallbacks between models |

Write down what the feature *promises* — the user-visible contract. "Summarise the ticket in ≤3 sentences, never invent a customer name, always cite the ticket id." That sentence is where the cases come from.

### Phase 1: Design the case set

`./resources/eval-case-design.md` has the taxonomy. The minimum viable set per prompt template:

| Class | Purpose | Count to start |
| --- | --- | --- |
| **Golden** | canonical inputs with known-good outputs | 5–10 |
| **Edge** | empty, huge, multilingual, malformed, contradictory input | 5 |
| **Negative** | must refuse, must not answer, must not leak | 3–5 |
| **Regression** | one case per bug ever found in production | grows forever |
| **Adversarial** | injection and jailbreak attempts | see `testing-llm-guardrails` |

Cases carry the metadata that makes a failure diagnosable: which prompt template, which capability, why the expectation is what it is. A case whose expectation nobody can justify is a case nobody will maintain.

**The regression class is the one that compounds.** Every production incident becomes a permanent case. After six months this set is the most valuable test asset the feature has, and it costs one case per incident to build.

### Phase 2: Choose scoring per case

`./resources/scoring-strategies.md` covers each in detail. Pick the cheapest one that can actually fail:

| Strategy | Use when | Cost |
| --- | --- | --- |
| Exact / regex match | classification, extraction, IDs, enum outputs | free, exact |
| Schema validation | any structured output | free, exact |
| Required / forbidden substrings | must cite the ticket id, must never say "as an AI" | free |
| Deterministic property | length limits, valid JSON, no PII pattern, citation resolves to a real source | free |
| Embedding similarity | paraphrase-tolerant equivalence | cheap, fuzzy |
| Rubric-based LLM judge | tone, helpfulness, faithfulness | expensive, needs validation |
| Human review | the final arbiter on a sample | expensive, definitive |

The ordering is the advice. Teams reach for an LLM judge first because it feels closest to "quality", and end up with a noisy score they cannot debug. Most real regressions trip a free check.

### Phase 3: Implement the suite

Two viable shapes, both in `./resources/promptfoo-setup.md`:

- **promptfoo** — config-driven, good matrix support across prompts and models, built-in assertion types, decent reporting. The default choice for a suite that will grow.
- **Vitest + the SDK** — the eval suite as ordinary tests. Better when evals must share fixtures with the app, or when the team will not adopt another tool.

Non-negotiables whichever you pick:

- pin the exact model version (`claude-sonnet-4-5-20250929`, not `latest`) — a floating alias makes every run unreproducible
- temperature 0 unless the feature's value depends on variation
- freeze retrieval: snapshot the documents, do not query a live index
- record model, prompt hash, and case-set version with every result
- cache responses so a re-run of unchanged cases is free
- run N times on cases where variance matters, and report the distribution, not one sample

### Phase 4: Gate on regressions

The gate is comparative:

| Condition | Verdict |
| --- | --- |
| A case that passed on the baseline now fails | **BLOCK** — this is the whole point |
| Aggregate score drops beyond the noise band | **WARN** — investigate before merging |
| New cases fail | **INFO** — they were added because they fail |
| Cost or latency regresses beyond budget | **WARN** |
| Flaky case (passes and fails across N runs) | fix the case or the determinism, do not average it away |

Establish the noise band empirically: run the suite three times on an unchanged system and see how much the score moves. Anything inside that band is not a signal, and gating on it produces the flakiest CI job in the repo.

Store the baseline as a committed artifact so the comparison is reviewable in the diff. See `./resources/promptfoo-setup.md` for the CI job, the trigger paths, and the API-key-free path for forks.

### Phase 5: Report

- **Regressions** — case, what it asserted, baseline versus now, the actual output
- **Score by capability** — not one global number; "citation accuracy 94%, refusal 100%, summary faithfulness 81%" is actionable
- **Retrieval versus generation** — for RAG, always split
- **Cost and latency** — per case and total, against budget
- **Variance** — which cases are unstable across runs
- **Coverage gaps** — prompt templates with no cases, capabilities with no negative case

## Common Failure Modes

- **Evals only in a notebook.** They exist, they are never run in CI, and the regression ships anyway.
- **LLM judge with no rubric.** Produces a number that moves for unrelated reasons and cannot be debugged.
- **Judging with the model under test.** Self-preference is real; use a different model, or a deterministic check.
- **Floating model alias.** `latest` silently changes the system under test between runs.
- **One aggregate score.** Masks a 40% drop in citation accuracy behind a 3% total move.
- **Golden outputs copied from model output.** Recording what the model *did* rather than what it *should do* freezes today's bugs into the expectations. Golden outputs need a human's approval.
- **No negative cases.** The feature that must refuse is never tested for refusing, and the first jailbreak is found by a user.
- **Tuning the prompt to fix a retrieval miss.** Weeks of prompt work on an indexing bug.
- **Cases that grow only from imagination.** Every production failure should become a case; that is where the good cases come from.

## Resource Map

- `./resources/eval-case-design.md` - case taxonomy, how to write a golden expectation, case metadata, growing the set from incidents
- `./resources/scoring-strategies.md` - each scoring method, when to use it, LLM-judge rubrics and how to validate a judge
- `./resources/promptfoo-setup.md` - promptfoo and Vitest implementations, determinism settings, CI job, baseline comparison, cost control

## Related Skills

- `testing-llm-guardrails` - runtime output validation and the adversarial suite: injection, jailbreaks, tool abuse
- `reviewing-ai-output-groundedness` - the human review protocol for factuality, and the attestation an eval suite cannot replace
- `designing-test-data` - building the input corpora these cases consume
- `analyzing-quality-metrics` - defining and trending eval pass rate, variance, and cost as real metrics
- `unslop-tests` - the same discipline applied to test code: an eval that cannot fail is worse than no eval
- `scoping-change-relevance` - which changes should trigger the suite (`modified-prompt`, model config, tool grants, retrieval)

## Definition of Done

This skill is complete when:

- every prompt template has golden, edge, and negative cases with justified expectations
- scoring is the cheapest method that can actually fail, and any LLM judge has a written rubric and validation against human labels
- the model version, temperature, seeds, and retrieval snapshot are pinned and recorded with results
- the suite runs in CI on prompt, model, tool, and retrieval changes, and gates on regressions against a committed baseline
- the noise band is measured, so the gate does not fire on variance
- retrieval and generation failures are reported separately for RAG features
- cost and latency are reported alongside quality
- every past production failure has a permanent regression case
