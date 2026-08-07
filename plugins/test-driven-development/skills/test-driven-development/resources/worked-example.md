# A TDD Session, Cycle by Cycle

Six consecutive cycles building one small unit, so the rhythm is visible.
Examples use neutral `test` / `expect` pseudocode — translate them into whatever runner the project already uses.

**The behavior:** a shipping cost calculator. Flat rate below a free-shipping threshold, free at or above it, with a surcharge for oversized items.

---

## Phase 0 — Frame it

- **Seam:** `calculateShipping(order)` — the function a checkout caller would use
- **Loop shape:** inner loop only; the rules are pure logic
- **Out of scope:** currency conversion, carrier APIs, tax

## Phase 1 — Test list

1. empty order costs nothing
2. order below the threshold pays the flat rate
3. order exactly at the threshold ships free
4. order above the threshold ships free
5. oversized item adds a surcharge
6. oversized item still pays the surcharge on a free-shipping order

Simplest interesting case first, then outward.

---

## Cycle 1 — empty order costs nothing

### Red

```js
test('costs nothing for an empty order', () => {
  expect(calculateShipping({ items: [] })).toBe(0);
});
```

Run it. Actual output:

```
FAIL  calculateShipping is not defined
```

**Stop.** That is a mechanical failure, not a behavioral one. Create the function, then run again:

```
FAIL  expected 0, received undefined
```

Now it is red for the right reason: the behavior is missing.

### Green

Strategy: **fake it**.

```js
function calculateShipping(order) {
  return 0;
}
```

Full suite: `1 passed`.

### Refactor

Nothing to clean up. Commit.

---

## Cycle 2 — below the threshold pays the flat rate

### Red

```js
test('charges the flat rate below the free-shipping threshold', () => {
  expect(calculateShipping({ items: [{ price: 20 }] })).toBe(5);
});
```

```
FAIL  expected 5, received 0
```

Red for the right reason — and note the fake from cycle 1 is now under pressure, exactly as intended.

### Green

Strategy: **obvious implementation**, since the rule is clear.

```js
function calculateShipping(order) {
  const total = order.items.reduce((sum, i) => sum + i.price, 0);
  return total === 0 ? 0 : 5;
}
```

Full suite: `2 passed`.

> Note the expected value `5` is a literal from the spec, not `FLAT_RATE` imported from the implementation. Importing the constant would make the test tautological — it would pass even if the rate were wrong.

### Refactor

`5` now appears in the code as a bare number. Name it:

```js
const FLAT_RATE = 5;
```

Suite still green. Commit.

---

## Cycle 3 — exactly at the threshold ships free

The boundary case. This is where bugs live, so it gets its own cycle.

### Red

```js
test('ships free at exactly the free-shipping threshold', () => {
  expect(calculateShipping({ items: [{ price: 100 }] })).toBe(0);
});
```

```
FAIL  expected 0, received 5
```

### Green

```js
function calculateShipping(order) {
  const total = order.items.reduce((sum, i) => sum + i.price, 0);
  if (total === 0) return 0;
  return total >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_RATE;
}
```

Full suite: `3 passed`.

### Refactor

The `total === 0` branch looks redundant now. Check before deleting: without it, an empty order falls below the threshold and gets charged the flat rate — wrong. The branch is load-bearing, so it stays.

Deleting it and re-running would have proved the same thing in seconds. Under green, that experiment is free; guessing is what costs.

```
3 passed
```

Commit.

---

## Cycle 4 — above the threshold ships free

### Red

```js
test('ships free above the free-shipping threshold', () => {
  expect(calculateShipping({ items: [{ price: 150 }] })).toBe(0);
});
```

```
PASS
```

**It passed immediately.** That is not a green step — it is a signal. Cycle 3's `>=` already covered this. Two valid responses:

- keep the test as documentation of the boundary's other side, and note that this cycle wrote no production code
- drop it as redundant

Keep it here: `>=` versus `>` is exactly the mistake a future edit might introduce, and this test would catch it. Record in the log that no implementation was needed.

---

## Cycle 5 — oversized item adds a surcharge

### Red

```js
test('adds a surcharge for an oversized item', () => {
  expect(calculateShipping({ items: [{ price: 20, oversized: true }] })).toBe(20);
});
```

```
FAIL  expected 20, received 5
```

### Green

Strategy: **fake it** — the general rule is not obvious yet.

```js
if (order.items.some((i) => i.oversized)) return 20;
```

Full suite: `4 passed`. The fake is deliberate and cycle 6 will force it out.

### Refactor

Hold off — the shape is not clear yet with a fake in place.

---

## Cycle 6 — surcharge applies on free-shipping orders too

This is the **triangulation** test: a second data point that makes the fake impossible.

### Red

```js
test('charges only the surcharge when shipping is free', () => {
  expect(calculateShipping({ items: [{ price: 150, oversized: true }] })).toBe(15);
});
```

```
FAIL  expected 15, received 20
```

The hardcoded `20` cannot satisfy both cases. The real rule surfaces: base cost plus a fixed `15` surcharge.

### Green

```js
function calculateShipping(order) {
  const total = order.items.reduce((sum, i) => sum + i.price, 0);
  if (total === 0) return 0;

  const base = total >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_RATE;
  const surcharge = order.items.some((i) => i.oversized) ? OVERSIZE_SURCHARGE : 0;
  return base + surcharge;
}
```

Full suite: `5 passed`.

### Refactor

Now the shape is clear. Split the two decisions:

```js
function calculateShipping(order) {
  const total = orderTotal(order);
  if (total === 0) return 0;
  return baseShipping(total) + oversizeSurcharge(order);
}
```

Run after each extraction. Suite green. Commit.

---

## Phase 7 — Close

Read the suite end to end:

```
costs nothing for an empty order
charges the flat rate below the free-shipping threshold
ships free at exactly the free-shipping threshold
ships free above the free-shipping threshold
adds a surcharge for an oversized item
charges only the surcharge when shipping is free
```

That reads as the shipping policy. Someone who has never opened the implementation can state the rules from it — which is the actual deliverable.

Report:

- no fakes remain
- no test-list entries left unbuilt
- design note: `orderTotal` wanted to exist from cycle 2 onward; the loop surfaced it rather than it being guessed up front

---

## What each cycle demonstrated

| Cycle | Lesson |
| --- | --- |
| 1 | A mechanical failure is not red. Fix it, then get a real behavioral failure. |
| 2 | Expected values come from the spec, never from the implementation's own constants. |
| 3 | Boundaries get their own cycle. Also: verify a "redundant" branch before deleting it. |
| 4 | A test that passes immediately is a signal — decide deliberately whether to keep it. |
| 5 | Faking is legitimate when the next test is already queued to remove it. |
| 6 | Triangulation: the second data point is what forces the general rule. |
