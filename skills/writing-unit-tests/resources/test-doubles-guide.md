# Test Doubles Guide

How to substitute dependencies without coupling the test to the implementation.
Examples use neutral pseudocode; translate to the project's existing mocking approach.

## The five doubles

| Double    | What it does                                      | Use it when                                                        |
| --------- | ------------------------------------------------- | ------------------------------------------------------------------ |
| **Dummy** | Filler that is never actually used                | A signature requires an argument the behavior ignores              |
| **Stub**  | Returns canned values                             | The unit needs an answer from a boundary to proceed                |
| **Spy**   | A stub that also records how it was called        | The call itself is the observable outcome (e.g. an email was sent) |
| **Fake**  | A working lightweight implementation              | You need realistic behavior - in-memory store, fake clock          |
| **Mock**  | Pre-programmed with expectations that it verifies | Rarely. Only when the interaction _is_ the contract                |

Default to **stub** and **fake**. Reach for a spy only when the side effect is the whole point, and treat a mock with strict call-order expectations as a smell.

## The boundary rule

Substitute only what you do **not** own:

- external APIs and third-party services
- databases and message queues
- the file system
- the clock, randomness, ID generation
- anything nondeterministic or slow

Do **not** substitute:

- your own modules, classes, and internal collaborators
- private helpers of the unit under test
- pure functions - just call them
- value objects and data structures - build real ones

The moment a test stubs an internal collaborator, it stops testing behavior and starts freezing the current design. The tell: a pure refactor turns the suite red.

## Assert on outcomes, not on calls

```js
// BAD - the assertion is about the mock, not the behavior
test('sends the welcome email', async () => {
  const mailer = createMock(emailService);
  await registerUser({ email: 'a@example.com' }, mailer);
  expect(mailer.send).toHaveBeenCalledTimes(1);
});

// GOOD - a fake makes the outcome observable
test('sends a welcome email to the new address', async () => {
  const mailbox = createFakeMailbox();
  await registerUser({ email: 'a@example.com' }, mailbox);
  expect(mailbox.messagesTo('a@example.com')).toEqual([{ subject: 'Welcome' }]);
});
```

When the call genuinely is the contract - "this must not be charged twice" - asserting on the call is legitimate. Assert on the arguments that carry meaning, not on invocation counts you do not care about.

## Designing so you need fewer doubles

### Inject dependencies instead of constructing them

```js
// Hard to test - the dependency is created inside
function processPayment(order) {
  const client = new PaymentClient(process.env.PAYMENT_KEY);
  return client.charge(order.total);
}

// Easy to test - the boundary is a parameter
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}
```

The same move applies to clocks, ID generators, and config: pass them in, default them for production callers.

### Separate decisions from effects

Push branching logic into a pure function and keep I/O in a thin shell around it:

```js
// The decision is pure - test it exhaustively with no doubles at all
function nextRetryDelay(attempt, policy) { ... }

// The shell just performs the effect - covered by one thin test
async function retryRequest(send, policy) {
  const delay = nextRetryDelay(attempt, policy);
  await wait(delay);
  return send();
}
```

Most "we need heavy mocking" pain comes from decisions tangled with effects. Untangling them removes the need for doubles entirely.

### Prefer specific operations over one generic gateway

```js
// GOOD - each operation stubs to one shape, no conditionals in test setup
const api = {
  getUser: (id) => ...,
  getOrders: (userId) => ...,
  createOrder: (data) => ...,
};

// BAD - the stub needs its own if/else to decide what to return
const api = {
  request: (endpoint, options) => ...,
};
```

A stub that needs branching logic is a test with logic in it, which is exactly what the core rules forbid.

## Verifying the double still matches reality

A stub encodes an assumption about a boundary you do not control. That assumption rots.

- keep one integration test that exercises the real boundary, so drift gets caught somewhere
- build stub responses from real captured payloads rather than hand-written guesses
- when the provider ships a change, update the stubs deliberately - a green unit suite proves nothing about a changed contract

State this explicitly when handing over a heavily stubbed unit suite: it proves the unit's logic, not the integration.

## Review questions

- Would this double still be needed if the dependency were injected?
- Is this collaborator something we own? If yes, why is it substituted?
- Does the assertion describe an outcome, or just that a function was called?
- Does the stub contain conditionals? If so, the interface it stands in for is too generic.
- If the real dependency changed its contract tomorrow, would anything in the suite notice?
