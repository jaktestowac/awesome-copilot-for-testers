---
name: Design an LLM eval suite
agent: llm-feature-test-engineer
description: 'Designs and implements an offline eval suite for an LLM feature: golden, edge and negative cases per prompt template, the cheapest scoring strategy that can actually fail, pinned determinism, a regression gate against a committed baseline, and the CI job that runs it.'
tools: ['read', 'search', 'edit', 'execute', 'web', 'todo']
---

# Task

Build the eval suite that catches quality regressions in this LLM feature before users do.

Use the `testing-llm-features` skill for case design, scoring strategies and the implementation shapes.

## Inputs

| Input | Required | Notes |
| --- | --- | --- |
| The feature | ✅ | What it does and where its code lives: `${input:feature}` |
| What "good output" means | ✅ | The promise to the user, in one or two sentences: `${input:qualityBar}` |
| Prompts and model config | ⬜ | Read from the repo if not supplied |
| Existing eval or test setup | ⬜ | promptfoo config, `evals/`, or nothing |
| Cost budget per run | ⬜ | Affects how much judge scoring is affordable |

If the quality bar is missing, **ask for it**. Without a stated promise there is nothing to assert against, and the suite will end up asserting that the output is non-empty.

## Steps

1. **Map the surface** - prompt templates, system prompts, model id and parameters, tool definitions, retrieval config, output schema, chain structure. List everything that can change model behaviour; each becomes a CI trigger path.
2. **Write the promise down** - the user-visible contract, as a sentence. Every case traces back to a clause of it.
3. **Design the case set** - 15–25 per prompt template: golden (canonical, human-approved expectations), edge (empty, huge, multilingual, malformed, contradictory, missing fields), negative (must refuse, must not invent, must not leak, must not break format). Add a regression case for every past production failure.
4. **Pick scoring per case**, cheapest first: exact match → schema → required/forbidden content → deterministic property (length, valid JSON, citations resolve, no invented numbers) → embedding similarity → rubric judge → human review.
5. **Implement** in promptfoo or Vitest. Pin the dated model version, temperature 0, seeds fixed, retrieval frozen into fixtures, `retry: 0`, response cache keyed on prompt hash + model + input + corpus version.
6. **Measure the noise band** - run the suite three times unchanged and record the spread. The gate must sit outside it.
7. **Wire the gate** - commit a baseline per prompt × model, compare on every run, fail on cases that used to pass and now fail. Trigger on prompt, model config, tool, retrieval and lockfile changes.

## Rules

- **Golden expectations are human-approved.** Copying current model output into the expectation freezes today's bugs as the spec.
- **A judge needs a rubric with a scale, a different model than the one under test, and validation against 30–50 human labels.** Below roughly 80% agreement it is noise.
- **Gate on regressions, not on an absolute score.** A threshold on a hard case set either blocks forever or gates nothing.
- **Never `latest` as a model id.** A floating alias makes every result unattributable.
- **Report per capability, not one number.** A global 89% can hide an 11-point faithfulness drop.
- **Split retrieval from generation** for RAG, or you will tune prompts to fix an index bug.
- **Cost and latency are results.** Report them alongside quality, against budget.
- Never put real user data in a fixture - see `handling-sensitive-test-data`.

## Output

1. The surface map and the promise sentence.
2. The case set: counts by class and capability, with the case files written.
3. The scoring choice per case class, and the judge rubric if one is used.
4. The determinism checklist, confirmed item by item.
5. The suite files, the baseline, and the comparison script.
6. The CI job, with its trigger paths and the fork-safe behaviour.
7. First run results per capability, plus cost, p95 latency, and any unstable cases.
8. Gaps: prompt templates with no cases, capabilities with no negative case.
