---
name: unslop-tests
description: 'Cuts AI tells from test code: tests that pass without proving anything, tautological assertions, mock-only tests, hardcoded waits, coverage theater, vague names, swallowed errors, retries used as fixes. Use whenever test code is written, changed, or reviewed, including tests produced as a side effect of a feature task, and when the request mentions "review these tests", "are these tests any good", "this test always passes", "this suite is flaky", or "clean up these tests". Must always apply to test code.'
argument-hint: 'Test files, paths, or a diff to audit (defaults to the working diff against the base branch)'
user-invocable: true
---

# Unslop Tests

Cut AI tells from test code.

A generated test suite reads well, runs green, and often proves nothing. That combination is the whole problem: the suite looks like coverage, gets reviewed like coverage, and fails to notice the bug it was written for. This skill names the tells so they can be caught by sight, then proves the important ones by running code.

Style slop wastes a reader's time. Test slop hides defects. Treat it accordingly.

## Process

1. Read the test code in scope.
2. Scan for the patterns below. Tag each finding with its tier.
3. Fix. Preserve what the test was trying to prove; if it was trying to prove nothing, say so instead of polishing it.
4. Prove every Tier 1 finding by running code. Break the behavior, watch the test, paste the output.
5. Self-audit: "which of these tests would still pass if I deleted the feature?" Fix what survives.

## Scope

Use the files or diff the caller gives you. Otherwise use the working diff against the base branch, default `main`, including uncommitted changes.

When auditing a whole suite rather than a diff, say how much of it you actually read. A sampled audit reported as a full one is its own kind of slop.

## Severity tiers

Not all tells are equal. Rank every finding.

- **Tier 1 - the test is a lie.** It passes while the behavior is broken, or it hides a real defect. Blocks the change. Must be proven by execution, not by reading.
- **Tier 2 - the test will fail for the wrong reason.** It passes today and breaks on an unrelated refactor, a slow CI machine, or a different timezone. Fix now or file it.
- **Tier 3 - the test is unreadable.** It works, but its failure output tells nobody what broke. Fix while you are in the file.

Report tiers in that order. A page of naming nits above one silently passing test buries the thing that matters.

## Patterns to detect and fix

Examples use neutral `test` / `expect` pseudocode. `./resources/framework-spellings.md` has how each tell is spelled in Vitest, Jest, Playwright, and Mocha.

### Assertions that prove nothing

1. **Tautological assertion** (T1). The expected value is computed the way the code computes it, so the test cannot disagree with the code. `expect(total(items)).toBe(items.reduce((s, i) => s + i.price, 0))`. Use a literal from an independent source: the spec, a worked example, a number a human calculated. If you cannot write the literal without running the code, you do not yet know what the function should return.
2. **Assertion that cannot fail** (T1). `expect(result).toBeDefined()`, `toBeTruthy()`, `not.toBeNull()`, `expect(list.length).toBeGreaterThanOrEqual(0)`, `expect(true).toBe(true)`. These pass for almost any return value. Assert the value.
3. **Type check standing in for a behavior check** (T1). `expect(typeof id).toBe('string')`, `expect(Array.isArray(rows)).toBe(true)`. The type system already promises this. Assert what the string is and what is in the array.
4. **Snapshot as the only assertion** (T1). A large snapshot committed without being read passes forever, then turns red across twenty files on one unrelated change. Assert the field that carries the behavior. Keep snapshots for output whose exact shape is the contract, and keep them small enough that a reviewer reads the diff.
5. **"It throws" without saying which error** (T2). `expect(fn).toThrow()` also passes when `fn` throws because the function name is misspelled. Assert the error type and the load-bearing part of the message.
6. **try/catch that can pass silently** (T1). An assertion inside `catch` with nothing forcing the `try` to throw. The day the call stops throwing, the test goes green. Assert on the rejection directly, or declare the expected assertion count.
7. **Unawaited async** (T1). A missing `await` on the act or on a promise-returning assertion. The test function returns, the runner reports a pass, and the assertion runs after nobody is listening.
8. **Coverage theater** (T1). The code is called, nothing meaningful is asserted, a percentage moves. Delete it or give it something to prove.
9. **Assertion on an unchecked step** (T2). A setup call whose failure is ignored, so the real failure surfaces three lines later as a confusing message about undefined.

### Scope and structure

10. **God test** (T2). One test logs in, searches, checks out, and opens the receipt. The first failure hides everything after it, and the name cannot say what broke. Split by behavior, or keep one long path deliberately and say why.
11. **Multi-assert sprawl** (T3). Five unrelated behaviors in one test, so a failure says nothing specific. If the name needs "and", split the test.
12. **Loop-hidden cases** (T3). `for (const c of cases) expect(fn(c.in)).toBe(c.out)`. The failure never says which input broke. Use the runner's parameterized API so each row reports as its own test.
13. **Conditional in a test** (T2). `if (result.items.length) expect(...)`. A branch that can skip the assertion is a test that can pass by accident. Assert the precondition, then assert the behavior.
14. **Testing the library** (T3). Asserting that the HTTP client parses JSON or that the date library adds days. Test your use of it, not it.
15. **Test that depends on another test** (T2). State created by an earlier test, or an order the runner does not guarantee. Run the file in reverse or in isolation to find these.

### Determinism

16. **Hardcoded wait** (T2). `waitForTimeout(2000)`, `sleep(500)`, a bare `setTimeout` in a test body. Too slow when the machine is fast, flaky when CI is loaded. Wait for the condition, not the clock.
17. **Real clock** (T2). `new Date()` inside the expectation, or `Date.now()` compared against another `Date.now()`. Freeze time or inject a clock. Anything asserting on "today" breaks at midnight in some timezone.
18. **Unseeded randomness** (T2). `Math.random()`, a data faker with no seed, a generated UUID inside the assertion. Seed it or inject the generator, and record the seed in the failure output.
19. **Format-dependent assertion** (T2). Asserting a locale-formatted number, a currency string, or a timezone-rendered date. Pin the locale and timezone, or assert on the structured value instead of the rendered string.
20. **Retry as the fix** (T1). `retries: 3`, a per-test retry, a raised timeout on something that flakes. Containment, not a fix. The race is still in the product and the suite now reports it as a pass. Reproduce, diagnose, fix the cause.

### Test doubles

21. **Mock-only test** (T1). Every collaborator is stubbed, so the only thing proven is that the stubs were called. Check it directly: if you deleted the unit under test and asserted on the mocks, would it still pass?
22. **Mocking what you own** (T2). Substituting internal collaborators freezes the current design and makes every refactor a test rewrite. Mock at real boundaries only: clock, network, storage, other people's services.
23. **Stub that lies** (T2). The stub returns a shape the real dependency never produces, so the test passes against a fiction. Pin the shape with a contract test against the real thing, or generate the stub from the real schema.
24. **Assertion on the call instead of the outcome** (T2). `expect(save).toHaveBeenCalledWith(order)` as the whole test. It proves a call happened, not that anything is now true. Assert what a caller can observe.

### Naming and readability

25. **Name that describes the code** (T3). `calls getUserById`, `works correctly`, `should handle edge cases`, `test 1`, `happy path`. State the behavior and the condition: `returns null when the user is soft-deleted`. A reader should know what broke from the failure line alone.
26. **Comment restating the assertion** (T3). `// check that the total is 100` above `expect(total).toBe(100)`. Delete it. Keep a comment only when it says why 100 is the right number.
27. **Ceremonial comment blocks** (T3). `// Arrange`, `// Act`, `// Assert` labelling three one-line sections. Blank lines already show the structure. Keep the labels only where a section is long enough to need them.
28. **Unnamed load-bearing value** (T3). `expect(items).toHaveLength(7)` says nothing about why seven is right. Name it, or derive it visibly from the input.
29. **Setup nobody reads** (T3). A twenty-field fixture where two fields matter. Use a factory with overrides so each test states only what it cares about.

### Data

30. **Real credentials or personal data in fixtures** (T1). A real email, token, customer name, or account number. Committed once means present in history forever. Use obviously synthetic values.
31. **Shared mutable fixture** (T2). One object built at module scope and mutated by several tests. Rebuild per test.
32. **Data assumed to exist** (T2). A hardcoded id from a seeded database or a manually created account. The test passes on one machine. Create what it needs, or make the fixture explicit and owned.

### Containment and suppression

33. **Skip with no owner** (T1). A `skip`, a commented-out test, or a deleted assertion with no issue link and no name attached. Coverage quietly removed.
34. **`only` left in** (T1). One focused test silently disables the rest of the file, and CI reports green.
35. **Suppressed type or lint error in a test** (T2). An ignore comment over the line that would have caught the wrong argument. The suppression is usually pointing at the bug.

### Browser and end-to-end tells

36. **Brittle locator** (T2). A long CSS or XPath chain, `nth(0)`, generated class names, or text that a copy edit will change. Use a role, label, or test id.
37. **`slow()` or a raised timeout as a flake fix** (T1). Same as pattern 20, wearing different clothes.
38. **Screenshot or trace as the assertion** (T3). Capturing artifacts is not asserting. Nobody looks at a passing run's screenshots.
39. **Asserting only on the URL** (T3). `expect(page.url()).toContain('/checkout')` proves navigation, not that checkout works. Assert something on the page.
40. **Logging in through the UI in every test** (T3). Slow, and it makes the login form a dependency of every unrelated failure. Set up the session once, outside the test.

## What good test code looks like

Removing tells is half the job. A test stripped of every pattern above can still be pointless. The tests worth keeping share these traits.

- **One reason to fail, and the name says which.** The failure line is the bug report.
- **The expected value came from outside the implementation.** A spec, a worked example, a number someone computed by hand. Never from running the code and pasting what came out.
- **It has been seen red.** Not assumed red. Broken on purpose, watched fail, restored.
- **The boundaries are the ones that actually break.** Chosen because the rule changes there, not because zero and one are traditional.
- **The setup states only what matters.** A reader can tell which input drives the behavior.
- **It survives a rename.** Restructure the internals without changing behavior and the test still passes.
- **When it fails on CI, the output is enough to act on.** No "expected true, received false".

## Prove the Tier 1 findings

A test-quality writeup that sounds right is worthless. It reads as convincing whether or not it is true. So do not hand back the reading. For every Tier 1 finding, get as far down this ladder as is cheap and say where you stopped.

1. You said the test is weak. Worthless on its own.
2. You pointed at the line. A real `file:line`.
3. You showed by reading that the assertion cannot tell pass from fail.
4. You broke the behavior the test claims to cover, ran the test, and it stayed green. Paste the command and the output.
5. You fixed the test, broke the behavior again, and watched it go red. Then restored the code and watched it go green.

Rung 4 is the whole point and it is usually one edit and one command. Any Tier 1 finding you did not get to rung 4, mark unproven and do not report it as settled. Do not round up.

`./resources/mutation-check.md` has the per-runner commands, how to choose which behavior to break, and what to do when the whole file is too slow to iterate on.

Two more checks worth running on anything you changed:

- **Isolation check.** Run the file alone, then in a random order, then with concurrency off and on. Each configuration accuses a different cause.
- **Refactor check.** Rename internals without changing behavior. The test must still pass.

## Report format

Lead with what is broken, not with what you read.

- **Tier 1, proven.** Each one: the tell, `file:line`, what you broke, the command, the output showing it stayed green, and the fix.
- **Tier 1, unproven.** Same, with the reason you could not run it.
- **Tier 2 and Tier 3.** Grouped, one line each, `file:line` and the tell by name.
- **Cleared.** Patterns you checked that this suite does not have. Short.
- **Coverage of this audit.** Which files you read, and which you sampled or skipped.
- **Design findings.** Untestable seams, boundaries in the wrong place, a unit that needed six mocks. These are findings to raise, not code to quietly restructure inside a test cleanup.

`./resources/audit-report-template.md` has the shape filled in.

Do not reshape production code to make a test honest without saying so. Hard-to-test code is a finding, and fixing it is its own change.

## Resource Map

- `./resources/test-slop-before-after.md` - worked before/after pairs for every Tier 1 pattern
- `./resources/mutation-check.md` - how to run the break-it check per runner, and how to pick what to break
- `./resources/framework-spellings.md` - how each tell is written in Vitest, Jest, Playwright, and Mocha, with the fix
- `./resources/audit-report-template.md` - the report shape

## Related Skills

- `writing-unit-tests` - the authoring workflow. Use it to write the tests, use this skill to judge them afterwards
- `writing-unit-tests-quick` - the compact authoring path for routine tests
- `test-driven-development` - when the test should come first, which removes several of these patterns by construction
- `designing-test-data` - when the fixtures and boundary values need real design
- `code-review-advanced` - the broader review; this skill is its test lens
- `static-code-analysis-typescript` - when the production code, not the test, is the real problem

## Definition of Done

This skill is complete when:

- the scope is stated, including what was read in full versus sampled
- every finding carries a tier and a real `file:line`
- every Tier 1 finding reached rung 4 of the ladder with its output pasted, or is marked unproven with a reason
- fixed tests were seen failing against broken behavior and passing against working behavior, with both outputs quoted
- the isolation check ran on anything touched: alone, in random order, and with concurrency toggled
- no flake was closed by a retry, a raised timeout, or a skip
- no test was deleted without saying what coverage went with it
- no production code was reshaped inside the cleanup; testability problems were raised as findings
- the report leads with Tier 1 and does not bury it under naming nits
