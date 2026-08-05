# Advanced Review Checklist

Use this checklist when a review needs more than syntax and style feedback.
Pick the sections that matter for the change, but always cover correctness, maintainability, testing, and risk.

## 1. Correctness

Ask:

- Does the implementation actually satisfy the intended behavior?
- Are edge cases handled explicitly: nulls, empty states, retries, timeouts, partial failures, race conditions?
- Are assumptions enforced in code or only implied by comments?
- Could the change silently break existing consumers, workflows, or fixtures?
- Are state transitions valid and reversible when failures happen?

High-signal red flags:

- branching added without tests for both sides
- error handling that logs and continues without a safe fallback
- changed return shape or side effect with no compatibility check
- feature flags or configuration paths that are only partially wired

## 2. Maintainability

Ask:

- Is the code easy to read without mentally simulating too much state?
- Are names accurate, specific, and still valid if the code evolves?
- Is logic duplicated across files or hidden inside helpers with mixed responsibilities?
- Would a new teammate know where to change this next time?
- Does the abstraction reduce complexity or merely move it?

High-signal red flags:

- helper functions that mix data transformation, I/O, and validation
- generic names like `utils`, `data`, `handle`, or `process`
- comments explaining confusing code instead of simplifying it
- multiple responsibilities bundled into a single test or function

## 3. Architecture and Design

Ask:

- Does the change respect existing boundaries and ownership?
- Are domain rules leaking into UI, test, controller, or infrastructure layers?
- Is a new dependency justified or does it increase coupling without clear value?
- Will this design make future changes easier or harder?
- Does the change centralize knowledge in the right place?

High-signal red flags:

- cross-layer imports that bypass intended seams
- shared helpers that become de facto frameworks
- domain logic hidden in test fixtures or setup code
- a refactor that improves the current case but blocks extension

## 4. Security and Privacy

Ask:

- Is untrusted input validated, sanitized, or constrained?
- Are auth, permission, tenancy, or role assumptions explicit?
- Could logs, traces, screenshots, or reports expose secrets or personal data?
- Are defaults safe when configuration is missing?
- Does the change widen access or visibility unintentionally?

High-signal red flags:

- secrets in code, fixtures, screenshots, snapshots, or logs
- user-controlled values flowing into queries, file paths, selectors, or templates
- permissions checked in UI only, not near the real boundary
- security-sensitive failures swallowed by catch-all handlers

## 5. Performance and Scalability

Ask:

- Does the code add repeated I/O, polling, heavy setup, or unnecessary allocations?
- Is work being repeated per item, test, request, or render when it could be batched?
- Are retries, waits, or timeouts used intentionally instead of as a bandage?
- Could this turn slow or flaky under larger datasets or parallel execution?

High-signal red flags:

- nested loops over growing collections
- repeated network or database setup inside hot paths
- synchronous blocking work in paths executed frequently
- test code that serializes work without need

## 6. Testing Quality

Ask:

- Are there tests for the behavior that changed, not only nearby behavior?
- Do assertions prove the intended outcome instead of just checking the happy path?
- Are negative paths and regressions covered?
- Are tests deterministic, isolated, and diagnostic when they fail?
- Is the test level appropriate: unit, integration, API, UI, or contract?

High-signal red flags:

- test added with no meaningful assertion
- snapshot updated without explaining why behavior changed
- broad mocks that hide the real integration risk
- tests that would pass even if the core logic were broken

## 7. Operability and Diagnostics

Ask:

- Will failures be observable and debuggable in CI or production?
- Are logs, errors, and trace messages specific enough to diagnose the issue?
- Does the change make incident response easier or harder?
- Are fallback behaviors explicit and safe?

High-signal red flags:

- generic errors like `Something went wrong`
- missing context in logs around retries or failures
- hidden background work with no visibility
- cleanup logic that fails silently

## 8. Review Output Rules

When converting checklist notes into findings:

- one finding per distinct risk
- include evidence, not just opinion
- prefer the smallest safe recommendation
- separate must-fix issues from follow-up improvements
- mention strengths that should be preserved
