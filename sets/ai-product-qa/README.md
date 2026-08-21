# AI Product QA - Resource Set

A themed bundle for testing products that **ship an LLM** - prompts, agents, RAG, tool-calling - as opposed to using AI to write tests.

It exists because the usual suite cannot see the failures that matter here. The same input produces different output. A prompt or model change degrades quality without breaking a single test. Coverage stays green while the feature gets worse, and the first person to notice is a user. On top of that, anything the model _reads_ is an input channel: a retrieved document, a tool result, or another user's profile field can carry instructions.

Three suites, distinct and complementary: **evals** for normal input, **guardrails** for wrong output, **red team** for hostile input.

## Contents

| Resource                                                                           | Type         | Purpose                                                                                                                                                |
| ---------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [testing-llm-features](../../skills/testing-llm-features/)                         | Skill        | Offline eval suite: golden cases per prompt template, cheapest-scoring-first, pinned determinism, regression gate against a committed baseline         |
| [testing-llm-guardrails](../../skills/testing-llm-guardrails/)                     | Skill        | Runtime controls and the adversarial suite - schema, PII, moderation, rendering, tool authorization, caps, and injection through every content channel |
| [reviewing-ai-output-groundedness](../../skills/reviewing-ai-output-groundedness/) | Skill        | The human review no eval replaces: claim-by-claim attribution, citation verification, omission, and a responsible-AI pass                              |
| [llm-feature-test-engineer](../../agents/llm-feature-test-engineer.agent.md)       | Custom agent | Builds all three suites and wires the gate; opens with the authorization gate before any adversarial work                                              |
| [design-llm-eval-suite](../../prompts/design-llm-eval-suite.prompt.md)             | Prompt       | Feature and quality bar in, eval suite and CI gate out                                                                                                 |
| [test-llm-guardrails](../../prompts/test-llm-guardrails.prompt.md)                 | Prompt       | Trust-boundary map, guardrail coverage table, adversarial pass scored on effect                                                                        |
| [llm-evals.instructions.md](../../instructions/llm-evals.instructions.md)          | Instructions | Rules for `evals/`, `prompts/` and promptfoo configs: determinism, golden-case discipline, judge rubrics, cost control                                 |

Pairs naturally with [handling-sensitive-test-data](../../skills/handling-sensitive-test-data/) for fixtures built from real content, and [testing-application-security](../../skills/testing-application-security/) for the wider security scope.

## Before the adversarial work

Injection and jailbreak testing is security testing. The guardrails skill opens with an authorization gate, and it is not decorative: confirm in writing that the system is yours or that you have the owner's permission, name the target environment, agree a window, and know who to notify on a finding. If any of that is missing, the honest move is to stop and say what is needed.

## The rules that carry the most weight

- **Pin the model to a dated version.** `latest` makes every result unattributable and every regression unexplainable.
- **Gate on regressions, not on an absolute score.** A case that used to pass and now fails is a signal; a threshold on a hard case set either blocks forever or gates nothing.
- **Cheapest scoring that can actually fail.** Schema, required content, citations-resolve - most real regressions trip a free check. An LLM judge without a rubric is a random number with an API bill.
- **Prompt instructions are not controls.** "Never reveal the system prompt" is a hope. A check in the tool handler is a control.
- **Score adversarial results on effect, not on wording.** A refusal message means nothing if the tool call went through.
- **Test the channels the model reads, not just the chat box.** Poisoned retrieval, hostile tool output, and stored user content are how the realistic attack arrives.
- **Groundedness ends in an attestation with limitations**, never a bare percentage.

## How to use

1. Install the agent into `.github/agents/`, the prompts into `.github/prompts/`, and the instructions file into `.github/instructions/`.
2. Run `/design-llm-eval-suite`. Supply the feature and - this one is required - what "good output" means as a sentence. Without a stated promise the suite ends up asserting that the output is non-empty.
3. Let it build the cheap deterministic layer first, then golden cases, then the gate. Measure the noise band before turning the gate on.
4. Run `/test-llm-guardrails` once authorization is confirmed. Expect the guardrail coverage table to produce findings before a single adversarial case runs - prompt-only tool authorization and fail-open moderation are the usual two.
5. Run a groundedness review on a sample before launch, and feed every fabricated or contradicted claim back into the eval suite as a permanent regression case. That feedback loop is what makes the human review compound instead of evaporate.

## What this set will not do for you

- It will not tune your prompts. It builds the measurement; the feature owner decides what to change.
- It will not test a third party's model or infrastructure.
- It will not settle bias, fairness or policy questions. The responsible-AI pass is a tester's observation of output and behaviour, and it says so.
- It will not prove factuality by automation. That part is sampled, human, and recorded with its limitations.
