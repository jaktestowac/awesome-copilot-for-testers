# Good and Bad Unit Tests

Worked before/after pairs for the rules in `SKILL.md`.

The examples use neutral `test` / `expect` pseudocode so the point stays framework-independent.
Translate them into whatever runner and assertion style the project already uses — the shape of the problem is the same everywhere.

---

## 1. Behavior, not implementation

```js
// BAD - asserts how the work is done
test('checkout calls paymentService.process', async () => {
  const payment = createMock(paymentService);
  await checkout(cart, payment);
  expect(payment.process).toHaveBeenCalledWith(cart.total);
});

// GOOD - asserts what the caller observes
test('confirms the order when payment succeeds', async () => {
  const result = await checkout(cartWith({ price: 20 }), acceptingPayment());
  expect(result.status).toBe('confirmed');
});
```

The bad version fails the moment `checkout` is refactored to call the payment differently, even though nothing a caller cares about has changed.

---

## 2. Verify through the interface, not a side channel

```js
// BAD - bypasses the interface to check the result
test('createUser saves the user', async () => {
  await createUser({ name: 'Alice' });
  const row = await db.query('SELECT * FROM users WHERE name = ?', ['Alice']);
  expect(row).toBeDefined();
});

// GOOD - proves the behavior the interface promises
test('makes a created user retrievable', async () => {
  const user = await createUser({ name: 'Alice' });
  expect((await getUser(user.id)).name).toBe('Alice');
});
```

The bad version also couples the test to the storage schema, so a column rename breaks it.

---

## 3. Independent expected values, not recomputed ones

```js
// BAD - tautological: expected value is computed the way the code computes it
test('sums the line items', () => {
  const items = [{ price: 10 }, { price: 5 }];
  const expected = items.reduce((sum, i) => sum + i.price, 0);
  expect(calculateTotal(items)).toBe(expected);
});

// GOOD - expected value is a known literal
test('sums the line items', () => {
  expect(calculateTotal([{ price: 10 }, { price: 5 }])).toBe(15);
});
```

If the implementation's arithmetic is wrong, the bad version is wrong in exactly the same way and still passes.

---

## 4. One reason to fail

```js
// BAD - four behaviors, one test; a failure says almost nothing
test('discount works', () => {
  expect(discount(100, 'SAVE10')).toBe(90);
  expect(discount(100, 'EXPIRED')).toBe(100);
  expect(discount(0, 'SAVE10')).toBe(0);
  expect(() => discount(-1, 'SAVE10')).toThrow();
});

// GOOD - each behavior reports separately
test('applies a percentage discount for a valid code', () => {
  expect(discount(100, 'SAVE10')).toBe(90);
});

test('leaves the amount unchanged for an expired code', () => {
  expect(discount(100, 'EXPIRED')).toBe(100);
});

test('rejects a negative amount', () => {
  expect(() => discount(-1, 'SAVE10')).toThrow(RangeError);
});
```

In the bad version the first failing line hides every assertion after it.

---

## 5. Parameterize, don't loop

```js
// BAD - one test, hand-rolled loop; the report never says which input failed
test('validates postal codes', () => {
  for (const code of ['12-345', '00-001', '99-999']) {
    expect(isValidPostalCode(code)).toBe(true);
  }
});

// GOOD - the runner reports one result per row
test.each([
  ['12-345', true],
  ['00-001', true],
  ['1-2345', false],
  ['', false],
])('isValidPostalCode(%s) is %s', (code, expected) => {
  expect(isValidPostalCode(code)).toBe(expected);
});
```

Every mainstream runner has some form of this API. Use whatever the project already uses; the point is one reported result per case.

---

## 6. Specific assertions

```js
// BAD - passes for almost any return value
test('returns a user', async () => {
  expect(await getUser('u1')).toBeTruthy();
});

// GOOD - states what the value must be
test('returns the stored display name', async () => {
  expect((await getUser('u1')).displayName).toBe('Alice Nowak');
});
```

```js
// BAD - any error at all satisfies this, including a typo in the test setup
test('rejects an unknown user', async () => {
  await expect(getUser('nope')).rejects.toThrow();
});

// GOOD - pins the error type and the meaningful part of the message
test('rejects an unknown user', async () => {
  await expect(getUser('nope')).rejects.toThrow(NotFoundError);
  await expect(getUser('nope')).rejects.toThrow(/unknown user/i);
});
```

---

## 7. Names that survive a failure report

```js
// BAD - names the method, not the behavior
test('calculateShipping', () => { ... });
test('calculateShipping 2', () => { ... });

// GOOD - the CI log alone tells you what broke
test('charges flat rate shipping below the free threshold', () => { ... });
test('waives shipping at exactly the free threshold', () => { ... });
```

Rule of thumb: if the name contains "and", it is two tests.

---

## 8. Controlled time, not real time

```js
// BAD - passes today, fails in December, and depends on the machine's timezone
test('marks the trial as expired', () => {
  const trial = createTrial({ startedAt: new Date('2026-01-01') });
  expect(isExpired(trial)).toBe(true);
});

// GOOD - time is an input
test('marks the trial expired 31 days after it started', () => {
  const trial = createTrial({ startedAt: '2026-01-01' });
  expect(isExpired(trial, { now: '2026-02-01' })).toBe(true);
});

// ALSO GOOD - freeze the clock when the signature cannot change
test('marks the trial expired 31 days after it started', () => {
  withFrozenClock('2026-02-01', () => {
    expect(isExpired(createTrial({ startedAt: '2026-01-01' }))).toBe(true);
  });
});
```

---

## 9. Fake timers, not real delays

```js
// BAD - adds a real second to every run and still flakes on a loaded machine
test('retries after the backoff', async () => {
  const call = withRetry(failingOnce(), { delayMs: 1000 });
  await sleep(1100);
  expect(await call).toBe('ok');
});

// GOOD - the test controls the clock
test('retries after the backoff', async () => {
  useFakeTimers();
  const call = withRetry(failingOnce(), { delayMs: 1000 });
  await advanceTimersBy(1000);
  expect(await call).toBe('ok');
});
```

---

## 10. Assert rejections explicitly

```js
// BAD - if the call unexpectedly succeeds, the test passes anyway
test('rejects an invalid payload', async () => {
  try {
    await submit(invalidPayload);
  } catch (err) {
    expect(err).toBeInstanceOf(ValidationError);
  }
});

// GOOD - a missing rejection fails the test
test('rejects an invalid payload', async () => {
  await expect(submit(invalidPayload)).rejects.toBeInstanceOf(ValidationError);
});
```

The bad shape is one of the most common silent-pass bugs in async suites.

---

## 11. Small factories over sprawling fixtures

```js
// BAD - the test's intent is buried in irrelevant setup
test('blocks checkout for a suspended account', () => {
  const user = {
    id: 'u1', name: 'Alice', email: 'alice@example.com', createdAt: '2025-01-01',
    address: { street: 'Main 1', city: 'Kraków', zip: '30-001', country: 'PL' },
    preferences: { newsletter: false, theme: 'dark' }, status: 'suspended',
  };
  expect(canCheckout(user)).toBe(false);
});

// GOOD - only the field under test is visible
test('blocks checkout for a suspended account', () => {
  expect(canCheckout(aUser({ status: 'suspended' }))).toBe(false);
});
```

`aUser()` supplies realistic defaults; each test overrides only what it is about.

---

## 12. Targeted assertions over whole-object snapshots

```js
// BAD - any unrelated field change breaks this, and nobody reads the diff
test('maps the order response', () => {
  expect(mapOrder(rawOrder)).toMatchSnapshot();
});

// GOOD - asserts the fields the mapping is responsible for
test('maps the order total into minor units', () => {
  expect(mapOrder(rawOrder).totalCents).toBe(1999);
});

test('defaults a missing currency to EUR', () => {
  expect(mapOrder({ ...rawOrder, currency: undefined }).currency).toBe('EUR');
});
```

Snapshots are acceptable when the whole shape genuinely is the contract, and only when the snapshot is small enough to review in a diff.

---

## Red flags when reviewing an existing suite

- the test name describes a method, not a behavior
- assertions on call counts, call order, or private fields
- `sleep`, `setTimeout`, or a real network call inside a unit test
- expected values built with the same helper the implementation uses
- one test with more than a handful of assertions across unrelated behaviors
- a `try/catch` around the act step with the assertion only in the `catch`
- a fixture object shared and mutated across tests
- the test changes every time the implementation is refactored, but never when behavior changes
