# The Mutation Check

Rung 4 of the evidence ladder: break the behavior the test claims to cover, run the test, and see whether it notices.

A test written after the code has never been seen failing. This is the only thing that proves it can.

## The loop

1. Pick the one behavior the test claims to prove.
2. Break that behavior in production code with the smallest possible edit.
3. Run only that test.
4. Record what happened.
5. Restore the code. `git diff` must be empty of production changes before you move on.
6. Run the test again and confirm it is green.

Step 5 is not optional and it is the step people skip. Leaving a deliberate break in the tree is a worse outcome than the slop you set out to fix. If you have to stop mid-audit, restore first.

## Picking what to break

The edit should change behavior, not delete the code. A deleted function throws, and a throw is caught by almost any test, which proves nothing about the assertion.

Good breaks, roughly in order of how often they expose a weak assertion:

| Kind | Example |
| --- | --- |
| Off by one | `>=` becomes `>`, `length - 1` becomes `length` |
| Inverted condition | `if (isActive)` becomes `if (!isActive)` |
| Swapped arguments | `transfer(to, from)` |
| Wrong constant | a rate of `0.2` becomes `0.3`, a limit of `100` becomes `1000` |
| Dropped step | remove the validation call, keep the return |
| Wrong field | return `user.email` where `user.username` was expected |
| Removed guard | delete the null check, delete the permission check |
| Reordered effects | write to the database before validating |

Bad breaks, which produce a red test that means nothing:

- Deleting the whole function body.
- Renaming an export, so the import fails.
- Introducing a syntax or type error.
- Breaking something the test does not claim to cover.

## Running one test

```bash
# Vitest
npx vitest run path/to/file.test.ts -t "returns null when the user is soft-deleted"

# Jest
npx jest path/to/file.test.ts -t "returns null when the user is soft-deleted"

# Playwright
npx playwright test path/to/file.spec.ts -g "returns null when the user is soft-deleted"

# Mocha
npx mocha path/to/file.test.js --grep "returns null when the user is soft-deleted"
```

Quote the command and the result counts in the report, not a summary. "1 failed, 0 passed" is evidence. "the test correctly fails" is not.

## When the file is too slow to iterate on

End-to-end suites make this loop expensive. Options, in order of preference:

1. Run the single test by name, with the browser reused and any global setup cached.
2. Break the behavior at the lowest layer that the test still goes through, usually a pure function, so no rebuild is needed.
3. Stub the boundary to return the wrong value instead of editing production code. This proves the assertion, not the wiring, so say which one you proved.
4. If none of that is cheap, mark the finding unproven and say why. That is an honest result. A confident writeup with no execution behind it is not.

## The isolation check

Different from the mutation check and worth running on anything you touched. Each configuration accuses a different cause.

```bash
# alone - finds dependence on other tests in the file
npx vitest run path/to/file.test.ts

# random order - finds order dependence and shared state
npx vitest run --sequence.shuffle

# concurrency off - finds resource contention
npx vitest run --no-file-parallelism

# repeated - finds real races
npx vitest run path/to/file.test.ts --repeat 50
```

| It fails when | Suspect |
| --- | --- |
| Run alone but passes in the suite | It depends on state another test creates |
| In the suite but passes alone | It leaks or reads shared state |
| Only in random order | Order dependence |
| Only with parallelism on | Shared resource: port, file, database row, fixture directory |
| Only on CI | Timing, timezone, locale, cold cache, or a machine slower than yours |
| One run in fifty | A real race in the product, not in the test |

The last row is the important one. That is a defect report, not a test problem.

## When a mutation-testing tool is available

Where the project already runs one, that is the systematic version of this check and it should be the source of the numbers. Use it on the module under audit rather than the whole repo, and report surviving mutants with the assertion that should have caught each one.

Do not introduce a mutation-testing tool as part of a test cleanup. Propose it separately.

## What to write down

For each Tier 1 finding:

```
Finding: tautological assertion
Where:   src/billing/total.test.ts:24
Break:   src/billing/total.ts:11, tax rate 0.23 -> 0.5
Command: npx vitest run src/billing/total.test.ts -t "sums the line items"
Result:  1 passed, 0 failed   <- did not notice
Fixed:   expected value replaced with the literal 123.00
Re-run:  1 failed, 0 passed with the break; 1 passed, 0 failed after restore
```

Six lines, and the finding is proven rather than argued.
