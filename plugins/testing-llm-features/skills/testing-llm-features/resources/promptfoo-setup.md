# Implementing the Suite

Two shapes. Pick promptfoo when the suite will grow and needs matrix runs across models; pick Vitest when the evals must share fixtures and helpers with the app, or when the team will not adopt another tool.

## Option A — promptfoo

`promptfooconfig.yaml`

```yaml
description: Ticket summarisation evals

prompts:
  - file://prompts/summarize-ticket-v3.md

providers:
  - id: anthropic:messages:claude-sonnet-4-5-20250929 # pinned, never `latest`
    config:
      temperature: 0
      max_tokens: 1024

defaultTest:
  options:
    cache: true
  assert:
    - type: is-json
      value: file://schemas/summary.schema.json
    - type: not-icontains-any
      value: ['as an AI', "I'm sorry, but"]

tests:
  - description: multi-thread ticket keeps the original complaint
    vars:
      ticket: file://fixtures/tickets/multi-thread-42.json
    assert:
      - type: contains
        value: TICK-42
      - type: javascript
        value: output.split(/[.!?]+/).filter(Boolean).length <= 3
      - type: llm-rubric
        value: |
          Score 0-3 for faithfulness to the ticket only:
            3 every claim supported, nothing added
            2 supported but omits the blocking issue
            1 contains a claim not in the ticket
            0 contradicts the ticket
          Ignore tone and formatting.
        threshold: 3
        provider: openai:gpt-4.1 # judge ≠ system under test

  - description: refuses to summarise another tenant's ticket
    vars:
      ticket: file://fixtures/tickets/foreign-tenant.json
    assert:
      - type: icontains
        value: 'cannot access'
      - type: not-contains
        value: 'Acme Corp'
```

```bash
npx promptfoo@latest eval --output results/latest.json
npx promptfoo@latest eval --output results/latest.json --repeat 5   # variance
npx promptfoo@latest view                                          # local report
```

## Option B — Vitest

```ts
// evals/summarize.eval.ts
import { describe, expect, it } from 'vitest';
import { summarizeTicket } from '../src/features/summarize';
import { SummarySchema } from '../src/features/summarize/schema';
import { loadCases } from './harness/load-cases';
import { judge } from './harness/judge';

const cases = loadCases('evals/cases/summarize/*.yaml');

describe('summarize-ticket-v3', () => {
  for (const c of cases) {
    it(`[${c.class}] ${c.id}`, async () => {
      const out = await summarizeTicket(c.input, { temperature: 0, seed: 42 });

      const parsed = SummarySchema.safeParse(out);
      expect(parsed.success, parsed.error?.message).toBe(true);

      for (const phrase of c.expect.contains ?? []) expect(out.summary).toContain(phrase);
      for (const phrase of c.expect.forbidden ?? []) expect(out.summary).not.toContain(phrase);
      if (c.expect.maxSentences) {
        expect(out.summary.split(/[.!?]+/).filter(Boolean).length).toBeLessThanOrEqual(
          c.expect.maxSentences,
        );
      }
      // citations must resolve to documents actually retrieved
      for (const id of out.citations) expect(c.input.retrieved.map((d) => d.id)).toContain(id);

      if (c.expect.rubric) {
        const { score, unsupportedClaims } = await judge(out.summary, c.input, c.expect.rubric);
        expect(score, `unsupported: ${unsupportedClaims.join('; ')}`).toBeGreaterThanOrEqual(3);
      }
    }, 60_000);
  }
});
```

Keep evals out of the default unit run — they cost money and need network:

```ts
// vitest.evals.config.ts
export default defineConfig({
  test: { include: ['evals/**/*.eval.ts'], testTimeout: 120_000, retry: 0 },
});
```

`retry: 0` matters. Retrying an eval until it passes is exactly the flake-hiding this suite exists to prevent.

## Determinism checklist

- [ ] Model version pinned to a dated id, never `latest` or a floating alias
- [ ] `temperature: 0`, `top_p` unset or 1, seed set where the provider supports it
- [ ] Retrieval frozen: documents snapshotted into fixtures, no live index queries
- [ ] Tool responses stubbed unless the tool call itself is under test
- [ ] Time and randomness in the app faked (`mocking-network-and-time`)
- [ ] Prompt read from a file, and its hash recorded with the result
- [ ] Case-set and corpus versions recorded with the result
- [ ] `retry: 0`

Anything unpinned turns a regression gate into a coin flip, and the first false positive is what gets the job disabled.

## Baseline and regression comparison

Commit the baseline so the comparison is reviewable in the diff:

```
evals/
  cases/
  baselines/
    summarize-v3.claude-sonnet-4-5-20250929.json   # per prompt × model
```

```js
// scripts/compare-evals.mjs
import { readFileSync } from 'node:fs';
const base = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const now = JSON.parse(readFileSync(process.argv[3], 'utf8'));

const was = new Map(base.results.map((r) => [r.id, r.pass]));
const regressions = now.results.filter((r) => was.get(r.id) === true && r.pass === false);
const newPasses = now.results.filter((r) => was.get(r.id) === false && r.pass === true);
const brandNew = now.results.filter((r) => !was.has(r.id));

console.log(`regressions ${regressions.length} · fixed ${newPasses.length} · new ${brandNew.length}`);
for (const r of regressions) console.error(`REGRESSION ${r.id}\n  expected: ${r.expected}\n  got: ${r.actual}`);
if (regressions.length) process.exit(1);
```

A regression is a case that **used to pass and now fails**. Gate on that, not on an absolute score — a score threshold on a deliberately hard case set either blocks forever or gates nothing.

Refresh the baseline in its own commit, reviewed on purpose. A baseline refreshed in the same commit as a prompt change hides the regression it was supposed to catch.

## CI job

```yaml
name: evals
on:
  pull_request:
    paths:
      - 'prompts/**'
      - 'evals/**'
      - 'src/features/**/prompt*'
      - 'src/**/model-config*'
      - 'src/**/retriev*'
      - 'package-lock.json'

jobs:
  evals:
    runs-on: ubuntu-latest
    if: github.event.pull_request.head.repo.full_name == github.repository # forks have no secrets
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci

      - name: Run evals
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }} # judge
        run: npx vitest run --config vitest.evals.config.ts --reporter=json --outputFile=results/now.json

      - name: Compare against baseline
        run: node scripts/compare-evals.mjs evals/baselines/summarize-v3.claude-sonnet-4-5-20250929.json results/now.json

      - uses: marocchino/sticky-pull-request-comment@v2
        if: always()
        with:
          header: evals
          path: results/summary.md
```

The `paths` filter is the trigger list from `scoping-change-relevance`: prompts, model config, retrieval, tool definitions, and the lockfile (an SDK bump changes behaviour). Everything else does not need to pay for an eval run.

**Forks:** they cannot read secrets, so the job must be skipped rather than failed — a red required check on every external PR gets the check removed. Run the deterministic, key-free subset on forks if you have one, and require the full run on `main`.

## Cost control

```ts
// evals/harness/cache.ts — key on everything that changes behaviour
const key = sha256(JSON.stringify({ promptHash, model, temperature, input, corpusVersion }));
```

- cache by that key; unchanged cases are free on re-run
- tier the suite: deterministic checks on every PR, judge checks on prompt changes and `main`, full matrix nightly
- cap spend per run and **fail on the cap** — a truncated run reporting a pass is a false green
- report cost per run in the sticky comment; a doubling is a finding

## Reporting shape

```
Evals — summarize-ticket-v3 · claude-sonnet-4-5-20250929 · cases v14 · corpus v3

  citation-accuracy        47/50   94%   ↓ 2pp
  refusal                  12/12  100%   —
  summary-faithfulness     34/42   81%   ↓ 11pp   ← REGRESSION
  format-conformance       50/50  100%   —

  REGRESSION  summarize-ticket-multi-thread
    expected: ≤3 sentences, mentions the blocking issue
    got:      5 sentences, omits the blocking issue, invented owner "J. Smith"

  variance     2 unstable cases (4/5) — see below
  cost         $0.42 (budget $2.00) · p50 1.9s · p95 4.1s
  gaps         prompts/classify-intent.md has no cases
```

Per capability, never one number. The global figure here is 89% — high enough to pass any aggregate threshold, and it would have hidden an 11-point faithfulness drop plus an invented name.
