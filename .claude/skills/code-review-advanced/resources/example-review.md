# Example Advanced Review

## Review Metadata

- **Scope:** `tests/auth/login.spec.ts`, `src/pages/LoginPage.ts`, `src/fixtures/user.ts`
- **Review goal:** `merge readiness, test quality, and maintainability`
- **Change type:** `feature + test automation`
- **Assumptions / missing context:** `No linked ticket was provided, so expected rate-limiting behavior and analytics requirements are inferred from the code.`

## Executive Summary

This change improves login coverage and introduces a reusable page object, which is a solid direction. The main concerns are not about syntax but about confidence: the tests rely on hard waits, the negative-path assertion is too weak, and the page object now mixes navigation, state setup, and assertions. The feature looks close, but I would not approve it yet because the current tests could still pass while the login flow regresses under timing or error conditions.

## Recommendation

**Status:** `request changes`

**Why:**

- The suite uses fixed waits instead of web-first synchronization, which is a direct flakiness risk.
- The negative login test verifies only that an error element exists, not that the application stays unauthenticated.
- The page object is taking on multiple responsibilities, which will make future auth flows harder to extend safely.

## What Looks Strong

- The author extracted selectors into a page object instead of duplicating them across tests.
- The tests cover both a successful and unsuccessful login path.
- Fixture-based test data is clearer than inline credentials scattered across the spec.

## Findings Overview

| Severity | Area            | Summary                                                                                            | Evidence                                                                   | Suggested action                                                                        |
| -------- | --------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| High     | Testing         | Hard waits make the new login tests timing-sensitive and likely flaky in CI.                       | `tests/auth/login.spec.ts` uses `waitForTimeout(3000)` after submit.       | Replace fixed waits with assertions on visible post-login state or response completion. |
| High     | Correctness     | The invalid-login test does not prove the user remains unauthenticated.                            | The test checks only that `.error-message` is visible.                     | Assert the protected landing page is not reachable and auth state remains unchanged.    |
| Medium   | Maintainability | `LoginPage` mixes navigation, form actions, and business assertions.                               | `src/pages/LoginPage.ts` includes `goto`, `loginAs`, and `expectLoggedIn`. | Split action methods from verification helpers or keep assertions in the spec layer.    |
| Low      | Security        | Test fixture naming suggests real-looking credentials that could be mistaken for reusable secrets. | `src/fixtures/user.ts` contains `admin@company.com` style values.          | Switch to clearly fake identities to reduce confusion and accidental reuse.             |

## Detailed Findings

### 1. Hard waits in the happy-path test

- **Severity:** `High`
- **Area:** `Testing`
- **Evidence:** The success scenario waits for a fixed 3000 ms after clicking submit instead of waiting on a user-visible success condition.
- **Risk:** This creates a classic CI flake: the test is slower than necessary when the app is fast and still unstable when the app is slow.
- **Recommendation:** Wait for a deterministic signal such as dashboard heading visibility, redirected URL, or authenticated API response completion.

### 2. Weak negative-path assertion

- **Severity:** `High`
- **Area:** `Correctness`
- **Evidence:** The failing-login test checks that an error banner appears, but it does not verify that the app stayed on the login page or that authenticated UI remains inaccessible.
- **Risk:** A partially broken auth flow could still pass this test if the banner renders while session state changes incorrectly.
- **Recommendation:** Add assertions that the protected route is not entered and that authenticated-only controls remain hidden.

### 3. Page object owns too much behavior

- **Severity:** `Medium`
- **Area:** `Maintainability`
- **Evidence:** `LoginPage` currently navigates, fills the form, submits, and performs business-level assertions.
- **Risk:** This will make the page object harder to reuse for other auth variants like SSO, MFA, or password reset because state checks are tightly bundled with actions.
- **Recommendation:** Keep reusable interaction methods in the page object and leave scenario-specific assertions in tests or dedicated helper methods.

## Missing or Weak Coverage

- No assertion for the preserved unauthenticated state after invalid credentials.
- No coverage for server-side auth failure or retry behavior.
- No verification that session-related UI is restored after refresh.

## Follow-up Suggestions

- Add one focused regression test for repeated failed logins if rate-limiting or lockout is expected behavior.
- Consider a shared auth helper only if multiple specs repeat the same flow after the page object responsibilities are clarified.
