# Test Automation Review Lens

Load this file when the reviewed change touches automated tests, test infrastructure, fixtures, page objects, API clients, or CI flows.

## Focus Areas

### 1. Reliability and Flakiness

Check for:

- hard waits used instead of deterministic signals
- retries masking real instability
- shared state between tests
- order-dependent tests
- hidden network or environment dependencies
- cleanup that fails silently

Questions:

- Would this still pass under slower CI timing?
- Can the test fail for reasons unrelated to the product behavior?
- Does parallel execution change the result?

### 2. Assertion Quality

Check for:

- assertions that prove business behavior rather than only element presence
- negative-path assertions that confirm the wrong thing did _not_ happen
- assertions close to the risk introduced by the change
- overreliance on snapshots for behavior verification

Questions:

- If the product were broken in the intended way, would this test actually fail?
- Does the assertion validate outcome, not just activity?

### 3. Test Isolation and Data Management

Check for:

- fixtures that mutate shared accounts or environments
- hidden coupling through seeded data, environment flags, or static IDs
- tests that need cleanup but do not own it explicitly
- magic data values with unclear meaning

Questions:

- Can the test run repeatedly and in parallel without cross-test pollution?
- Is the test data obvious, minimal, and disposable?

### 4. Abstractions in Test Code

Check for:

- page objects or helpers that bundle too many responsibilities
- helper APIs that hide important test intent
- duplicated flows that should be extracted
- extracted abstractions that are now too generic to reason about safely

Questions:

- Does the abstraction improve readability or just move complexity?
- Would a new tester know where to debug a failure?

### 5. Selector and Interaction Strategy

Check for:

- brittle selectors tied to layout or CSS implementation
- interactions that skip realistic user behavior without reason
- hidden coupling to animation timing or unstable DOM state

Questions:

- Are selectors resilient to harmless UI refactors?
- Is the interaction strategy aligned with user-observable behavior?

### 6. CI and Diagnostics

Check for:

- missing artifacts on failure (screenshots, traces, logs)
- slow setup repeated unnecessarily across tests
- environment assumptions not documented in config or fixtures
- secrets exposed through logs, snapshots, or fixture files

Questions:

- If this fails in CI, will the failure be diagnosable?
- Are runtime costs proportional to the confidence gained?

## Review Guidance

When reviewing test automation, do not treat test code as secondary.
Poorly designed tests create false confidence, slow delivery, and recurring noise in CI.
A test that passes unreliably is not a minor quality issue; it is a feedback-system defect.
