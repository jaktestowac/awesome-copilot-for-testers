---
applyTo: '{evals,prompts}/**,**/*.eval.{ts,js},**/promptfooconfig.{yaml,yml,json}'
description: 'Rules for LLM eval suites and prompt files: golden-case discipline, pinned determinism, cheapest-scoring-first, judge rubrics, regression gating against a baseline, and cost control.'
---

# LLM eval rules

## Goal

An eval suite exists to make a **regression visible**. A case that cannot fail, or a score that moves on its own, defeats the purpose.

## Determinism - non-negotiable

- Pin the model to a **dated version** (`claude-sonnet-4-5-20250929`). Never `latest` or any floating alias - it makes results unattributable across runs.
- `temperature: 0` unless the feature's value depends on variation. Leave `top_p` at 1.
- Set a seed where the provider supports one.
- **Freeze retrieval.** Snapshot retrieved documents into fixtures. Never query a live index from an eval; test the live index separately as a retrieval eval.
- Stub tool responses unless the tool call itself is under test.
- `retry: 0`. Retrying an eval until it passes is the flake-hiding the suite exists to prevent.
- Record `model`, prompt hash, case-set version and corpus version with every result.

## Cases

- Every case has `id`, `template`, `capability`, `class` (golden / edge / negative / regression / adversarial), and a **`why`** field. A case whose reason nobody recorded gets deleted rather than understood a year later.
- **Golden expectations are human-approved.** Never paste current model output into an expectation - that freezes today's bugs as the spec.
- Every prompt template needs at least one **negative** case (must refuse, must not invent, must not leak, must not break format). The untested boundary is the one users find.
- Every production failure becomes a **permanent regression case**, added *before* the fix so it goes red first.
- Keep inputs in fixture files, not inline in YAML. Sanitise anything derived from real data - see `handling-sensitive-test-data`.

## Assertions - cheapest strategy that can actually fail

In this order: exact/regex match → schema validation → required and forbidden content → deterministic property (sentence count, valid JSON, citations resolve to retrieved documents, no numbers absent from the source) → embedding similarity → rubric judge → human review.

- Layer one structural check and one substantive check per case. The structural one says *that* it broke; the substantive one says *how*.
- Ban unfalsifiable assertions: `not-empty`, `contains: "summary"`, `similarity > 0.5`, `rubric: "is helpful"`.
- Assert on `null` where invention is the risk - a nullable field plus a case where the value is genuinely absent is how you test for confident invention.

## LLM-as-judge

Only for genuinely subjective properties, and only with all four of:

1. a written rubric with a **numbered scale** and explicit instruction to ignore everything else,
2. a **different model** than the one under test (self-preference bias is real),
3. **validation against 30–50 human labels** - below ~80% agreement the judge is noise,
4. temperature 0 and a pinned judge version.

Require structured judge output with an evidence field (`unsupported_claims`). A score with no evidence cannot be debugged. Prefer pairwise ("is A or B more faithful to the source?") over absolute scoring, with randomised position.

## Gating

- Gate on **regressions**: a case that passed on the committed baseline and now fails. Not on an absolute score.
- Commit the baseline per prompt × model, and refresh it in **its own reviewed commit** - never in the same commit as a behaviour change.
- Measure the noise band (three runs, unchanged system). The gate must sit outside it.
- Trigger CI on changes to prompts, model config, tool definitions, retrieval config, output schema and the lockfile. Nothing else needs to pay for a run.
- Forks cannot read secrets: **skip** the job on forks rather than failing it, and require the full run on the default branch.

## Reporting

- Per **capability**, never one global number. `citation-accuracy 94% · refusal 100% · faithfulness 81% ↓11pp` is actionable; `89%` is not.
- Split **retrieval** from **generation** for RAG, or prompts get tuned to fix index bugs.
- Report **cost and p95 latency** against budget. A doubling in cost is a finding.
- Report unstable cases as `4/5`, never averaged into a score.

## Cost control

- Cache on `(promptHash, model, temperature, input, corpusVersion)`.
- Tier the suite: deterministic checks every PR, judge checks on prompt changes and the default branch, full matrix nightly.
- Cap spend per run and **fail on the cap** - a truncated run reporting a pass is a false green.

## Prompt files

- One template per file, versioned in the filename or frontmatter (`summarize-ticket-v3`) so a baseline can name what produced it.
- Delimit and label untrusted content as data. Retrieved documents, tool results and user fields are inputs, not instructions.
- No credentials, internal URLs, or other tenants' data in a system prompt - treat prompt extraction as inevitable and size the risk by what the prompt contains.
- A prompt change without an eval run is an unverified behaviour change.
