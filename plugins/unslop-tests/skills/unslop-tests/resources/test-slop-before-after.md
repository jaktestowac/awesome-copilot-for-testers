# Test Slop, Before and After

Worked pairs for every Tier 1 pattern in `SKILL.md`. Tier 1 means the test passes while the behavior is broken.

The examples use neutral `test` / `expect` pseudocode. Translate into whatever runner the project already uses; the shape of the problem is identical everywhere.

Each pair ends with **the break** - the one-line change to production code that the bad version does not notice and the good version does. That line is what you run in the mutation check.

---

## 1. Tautological assertion

```js
// BAD - the expected value is computed the way the code computes it
test('sums the line items', () => {
  const items = [{ price: 10 }, { price: 5 }];
  const expected = items.reduce((sum, i) => sum + i.price, 0);
  expect(calculateTotal(items)).toBe(expected);
});

// GOOD - the expected value is a literal from a worked example
test('sums the line items', () => {
  expect(calculateTotal([{ price: 10 }, { price: 5 }])).toBe(15);
});
```

**The break:** change `calculateTotal` to `reduce((sum, i) => sum + i.price * 1.0, 0)` and then to `* 1.2`. The bad test follows the implementation to whatever it now returns, because both sides changed together. The good test goes red at 18.

A variant worth watching for: the expected value is a literal, but it was produced by running the code and pasting the output. That is the same bug written more subtly. It turns a specification into a characterization test, and nobody reading it later can tell which one they are looking at.

---

## 2. Assertion that cannot fail

```js
// BAD - passes for {}, for null-ish shapes, for the wrong user entirely
test('finds the user', async () => {
  const user = await findUser('u-1');
  expect(user).toBeDefined();
  expect(user).toBeTruthy();
});

// GOOD - names the value it expects
test('returns the stored name for a known id', async () => {
  expect(await findUser('u-1')).toMatchObject({ id: 'u-1', name: 'Ada' });
});
```

**The break:** make `findUser` return the first user in the table regardless of id. The bad test passes. The good test fails on the id.

---

## 3. Type check standing in for a behavior check

```js
// BAD - the type system already promises this
test('generates an invoice number', () => {
  const number = nextInvoiceNumber(2024, 41);
  expect(typeof number).toBe('string');
  expect(number.length).toBeGreaterThan(0);
});

// GOOD - asserts the format that downstream systems depend on
test('formats the invoice number as year and zero-padded sequence', () => {
  expect(nextInvoiceNumber(2024, 41)).toBe('2024-0041');
});
```

**The break:** drop the zero padding. The bad test passes on `'2024-41'`, which the accounting import then rejects.

---

## 4. Snapshot as the only assertion

```js
// BAD - 180 lines of committed output nobody read
test('renders the order summary', () => {
  expect(renderSummary(order)).toMatchSnapshot();
});

// GOOD - asserts the fields that carry the behavior
test('shows the discounted total and the discount reason', () => {
  const summary = renderSummary(orderWith({ subtotal: 100, coupon: 'SAVE10' }));
  expect(summary.total).toBe('90.00');
  expect(summary.notes).toContain('SAVE10');
});
```

**The break:** apply the coupon twice. The bad test fails, but so do the other nineteen snapshot tests in the file, and the reviewer accepts the whole batch to make CI green. The good test fails alone and points at the number.

Snapshots are not banned. They earn their place when the exact output *is* the contract, when they are small enough that a reviewer reads the diff, and when someone read the first one before committing it.

---

## 6. try/catch that can pass silently

```js
// BAD - if withdraw stops throwing, nothing runs and the test passes
test('rejects an overdraft', async () => {
  try {
    await withdraw(account, 500);
  } catch (e) {
    expect(e.message).toContain('insufficient');
  }
});

// GOOD - the rejection itself is the assertion
test('rejects a withdrawal above the balance', async () => {
  await expect(withdraw(accountWith({ balance: 100 }), 500)).rejects.toThrow(
    InsufficientFunds,
  );
});
```

**The break:** remove the balance check from `withdraw`. The bad test passes, silently, and the account goes negative in production.

If the runner has no rejection matcher, declare the count: `expect.assertions(1)`. Then a missing throw fails the test instead of skipping it.

---

## 7. Unawaited async

```js
// BAD - the test function returns before either assertion runs
test('archives the order', () => {
  archiveOrder('o-1');
  expect(getOrder('o-1').status).toBe('archived');
});

// GOOD
test('archives the order', async () => {
  await archiveOrder('o-1');
  expect((await getOrder('o-1')).status).toBe('archived');
});
```

**The break:** you do not even need one. The bad test passes against an `archiveOrder` that throws.

How to find these: the runner usually warns about an unhandled rejection somewhere unrelated, often attributed to the *next* test in the file. Treat any cross-test unhandled rejection warning as a missing await until proven otherwise. A lint rule for floating promises in test files catches the rest.

---

## 8. Coverage theater

```js
// BAD - the module is imported and called, nothing is proven
test('exports work', () => {
  expect(() => buildReport(sampleData)).not.toThrow();
});

// GOOD
test('groups rows by month and totals each group', () => {
  const report = buildReport([
    { date: '2024-01-04', amount: 10 },
    { date: '2024-01-29', amount: 5 },
    { date: '2024-02-02', amount: 7 },
  ]);
  expect(report).toEqual([
    { month: '2024-01', total: 15 },
    { month: '2024-02', total: 7 },
  ]);
});
```

**The break:** group by year instead of month. The bad test passes. It was never a test, it was a smoke check with a coverage side effect.

Delete these rather than improving them, unless the module has no other test at all. A "does not throw" check earns its place only as a deliberate smoke test, named as one.

---

## 20 and 37. Retry as the fix

```js
// BAD - the race is still in the product, the suite now calls it a pass
// config: { retries: 2 }
test('shows the new comment', async () => {
  await postComment('nice');
  await page.waitForTimeout(1000);
  expect(await commentCount()).toBe(1);
});

// GOOD - wait for the condition the product actually satisfies
test('shows the new comment once the post settles', async () => {
  await postComment('nice');
  await expect(commentList()).toHaveText(['nice']);
});
```

**The break:** you do not need one. Run the bad test a hundred times with retries off and count the failures. That number is the defect rate you were about to ship.

A retry is a legitimate tool in exactly one shape: a known-flaky external dependency, with the retry scoped to that one test, an issue link in a comment, and an owner. Retries configured globally hide new races forever.

---

## 21. Mock-only test

```js
// BAD - every collaborator stubbed; only the stubs are proven
test('checks out the cart', async () => {
  const payments = mock({ charge: () => ({ ok: true }) });
  const inventory = mock({ reserve: () => true });
  const mailer = mock({ send: () => undefined });

  await checkout(cart, { payments, inventory, mailer });

  expect(payments.charge).toHaveBeenCalled();
  expect(inventory.reserve).toHaveBeenCalled();
  expect(mailer.send).toHaveBeenCalled();
});

// GOOD - fake at the boundary, assert what a caller observes
test('confirms the order and reserves the stock when payment succeeds', async () => {
  const inventory = inMemoryInventory({ 'sku-1': 3 });
  const result = await checkout(cartWith({ sku: 'sku-1', qty: 2 }), {
    payments: acceptingPayments(),
    inventory,
    mailer: nullMailer(),
  });

  expect(result.status).toBe('confirmed');
  expect(inventory.available('sku-1')).toBe(1);
});
```

**The break:** make `checkout` reserve the stock *before* charging, and return `confirmed` even when the charge fails. The bad test passes, because all three calls still happen. The good test fails on the status.

The quick diagnostic: delete the unit under test, assert on the mocks directly, and see whether the test still passes. If it does, the test was about the mocks.

---

## 30. Real credentials or personal data in fixtures

```js
// BAD - in git history forever, and someone's real inbox
const user = { email: 'j.kowalski@realcompany.com', token: 'ghp_S3cr3t...' };

// GOOD
const user = { email: 'user-1@example.test', token: 'test-token-0001' };
```

**The break:** none needed. This one is found by reading, and the fix is not "remove it in the next commit". A committed secret is a rotation task, not an edit. Report it as one.

Use `example.com`, `example.test`, and obviously synthetic ids. If the fixture must look realistic, generate it with a seeded faker so it is reproducible and clearly fake.

---

## 33 and 34. Skips and `only`

```js
// BAD - coverage silently removed, nobody owns it
test.skip('applies the loyalty discount', ...);
// test('rejects an expired card', ...);

// BAD - one focused test, whole file disabled, CI still green
test.only('applies the loyalty discount', ...);

// GOOD
// Skipped: discount engine rewrite in progress. Owner: @kkijas. See #482.
test.skip('applies the loyalty discount', ...);
```

**The break:** none needed, and that is the point. These are found by grep, and they belong in CI as a hard failure rather than in a review checklist.

- `only` should never reach the base branch. Fail the build on it.
- A `skip` lands only with an issue link and an owner in a comment on the line above.
- A commented-out test is a deleted test pretending otherwise. Delete it properly and say what coverage went with it.
