# Test Debt Catalogue

Load this file when the analysis target includes automated tests, test infrastructure, fixtures, page objects, API clients, or CI workflows.
Use it alongside the general debt taxonomy, not instead of it.

## Table of Contents

- [Synchronization Debt](#1-synchronization-debt)
- [Assertion Debt](#2-assertion-debt)
- [Isolation and Data Debt](#3-isolation-and-data-debt)
- [Abstraction Debt in Test Code](#4-abstraction-debt-in-test-code)
- [CI Fitness Debt](#5-ci-fitness-debt)
- [Security and Privacy Debt in Tests](#6-security-and-privacy-debt-in-tests)
- [Review rule](#review-rule)

## 1. Synchronization Debt

**Typical signals**

- fixed waits and sleeps
- retries compensating for poor synchronization
- polling loops without clear timeout strategy
- missing readiness checks after navigation or state change

**Real harm**

- flaky CI
- inflated runtime
- harder diagnosis because timing noise hides real failures

**Evidence to capture**

- hardcoded waits
- retry-heavy config
- comments like "give it time" or "stabilize CI"

## 2. Assertion Debt

**Typical signals**

- tests that only check page load or URL change
- no assertion after important actions
- overly broad assertions that pass on incorrect outcomes
- swallowed assertion failures or conditional assertions

**Real harm**

- false confidence
- regressions that slip through "green" suites

**Evidence to capture**

- weak assertions close to critical behaviors
- tests whose intent is broader than what they verify

## 3. Isolation and Data Debt

**Typical signals**

- shared mutable fixtures or accounts
- tests depending on execution order
- weak cleanup or polluted environments
- hidden coupling through seeded data or global state

**Real harm**

- parallel failures
- difficult re-runs
- inconsistent local versus CI behavior

**Evidence to capture**

- beforeAll-heavy setups
- static IDs and shared users
- cross-test assumptions not documented in code

## 4. Abstraction Debt in Test Code

**Typical signals**

- page objects or helpers with too many responsibilities
- helper APIs that hide important business intent
- duplicated setup across many test files
- generic helpers nobody can safely change

**Real harm**

- tests become harder to debug
- simple feature changes require broad test rewrites
- knowledge concentrates in a few maintainers

**Evidence to capture**

- oversized page objects
- duplicated helper patterns
- abstractions that mix navigation, assertions, and environment setup

## 5. CI Fitness Debt

**Typical signals**

- long suite runtime with poor prioritization
- broad retries used as a stability strategy
- artifacts missing when failures occur
- no tagging or grouping strategy for targeted runs

**Real harm**

- slow feedback loops
- expensive pipelines
- low signal-to-noise ratio in failures

**Evidence to capture**

- workflow config
- reporter setup
- runtime-heavy setup repeated too often

## 6. Security and Privacy Debt in Tests

**Typical signals**

- secrets or real credentials in fixtures
- real personal data in snapshots or test files
- globally disabled TLS checks
- logs or artifacts that expose sensitive data

**Real harm**

- security exposure
- compliance risk
- accidental propagation of unsafe practices

**Evidence to capture**

- committed secrets or realistic credentials
- fixture data with PII-like values
- insecure test-only shortcuts that bleed into shared config

## Review rule

A test suite that passes unreliably is not healthy.
Treat unstable or weak tests as delivery-system debt, not as minor QA polish.
