# Getting to Green

How to choose an implementation strategy, how big a step to take, and what to do when the loop stalls.
Examples use neutral pseudocode; translate to the project's runner.

## The three strategies

### Obvious implementation

Write the real thing directly. Use it when you know exactly how the behavior works and it fits in a few lines.

```js
// Test: "returns the full name"
function fullName(user) {
  return `${user.firstName} ${user.lastName}`;
}
```

Risk: overconfidence. If you type the "obvious" implementation and the test does not pass, that is data - drop to a smaller step rather than debugging your way forward.

### Fake it

Return a constant that satisfies the current test, and let a later test force the real logic.

```js
// Test: "an empty cart totals zero"
function cartTotal(cart) {
  return 0; // deliberate fake - cycle 2 will force this out
}
```

Use it when the general rule is not clear yet, when you want a green baseline to refactor from, or when you are unsure enough that a wrong guess would cost a long debugging detour.

**A fake is only legitimate while a queued test will remove it.** Mark it in the code and name that test on the list. A fake with nothing scheduled to kill it is just a bug with a passing test.

### Triangulation

When a fake needs generalizing, write a second test with different data that the constant cannot satisfy. The implementation has no choice but to become general.

```js
// Cycle 1
test('sums a single item', () => {
  expect(cartTotal([{ price: 10 }])).toBe(10);
});
// Faked: return 10;

// Cycle 2 - triangulation
test('sums several items', () => {
  expect(cartTotal([{ price: 10 }, { price: 5 }])).toBe(15);
});
// Now the fake is impossible; the real sum has to appear.
```

Pick the second data point to make the fake _impossible_, not merely awkward. Two cases that a slightly cleverer constant would still satisfy have not triangulated anything.

## Choosing between them

| Signal                                                  | Strategy                            |
| ------------------------------------------------------- | ----------------------------------- |
| You could write the code from memory                    | Obvious implementation              |
| You can describe the rule but not encode it yet         | Fake it, then triangulate           |
| The rule genuinely depends on cases you have not seen   | Fake it, add the cases to the list  |
| You tried obvious implementation and it failed          | Revert, fake it, take smaller steps |
| Two data points already exist and the fake is straining | Triangulate now                     |

There is no prize for using the advanced strategy. Obvious implementation is correct most of the time; the other two exist for when it stops being obvious.

## Step size

Step size is a dial, not a doctrine.

**Take bigger steps when:** the domain is familiar, the change is local, the suite is fast, and the last few cycles went green first try.

**Take smaller steps when:** the API is new to you, the logic is fiddly (dates, money, concurrency, encoding), you are in unfamiliar code, or you just had a cycle that fought back.

The feedback is direct: **repeated failure to reach green means the last step was too big.** Not "try harder" - split it.

A useful split heuristic: if the behavior needs more than one `if` to satisfy, there is probably a smaller behavior hiding inside it that deserves its own cycle.

## The revert protocol

When two or three attempts do not reach green:

1. **Stop editing.** Every further change makes the broken state harder to reason about.
2. **Revert to the last green commit.** Not the code you like - the state the suite verified. This is why cycles commit at green.
3. **Write down what you learned** from the failed attempt before it evaporates.
4. **Take a smaller step** at the same seam, or a different first case.

Reverting ten minutes of work feels expensive and almost always costs less than debugging forward from a state nothing verifies. If you find yourself reluctant to revert, that reluctance is the signal that the step was far too big.

## When the test is hard to write

A test that resists being written is diagnostic. Read the resistance:

| Symptom                                          | Likely design problem                                    |
| ------------------------------------------------ | -------------------------------------------------------- |
| Setup needs many objects before the act step     | The unit has too many collaborators                      |
| You must stub things you own to get it running   | Decisions and effects are tangled                        |
| The assertion has to reach into internal state   | The behavior is not exposed at any usable seam           |
| The test needs real time, network, or filesystem | A boundary is missing - nothing separates logic from I/O |
| You cannot name the test without "and"           | The unit does more than one thing                        |

Say these out loud when they happen. Design findings are a deliverable of the loop, not a distraction from it - and they are far cheaper to act on now than after the implementation hardens.

## Anti-patterns in the green step

- **Implementing the next test too** - writing code no current test demands, on the grounds that you know it is coming
- **Cleaning up while going green** - mixing structure change with behavior change, so a failure has two candidate causes
- **Weakening the test** - loosening an assertion to reach green instead of fixing the behavior
- **Debugging forward** - layering fixes on a broken state instead of reverting to the last green
- **Silent faking** - a hardcoded value with no note and no queued test to remove it
- **Skipping the full-suite run** - the new test passes, and a regression in a neighbour goes unnoticed for several cycles
