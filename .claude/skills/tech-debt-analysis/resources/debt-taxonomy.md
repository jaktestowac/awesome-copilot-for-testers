# Debt Taxonomy and Signal Guide

Use this guide to scan a codebase through distinct debt lenses.
A signal is not automatically a debt item; it becomes debt when there is observable cost, risk, repeated friction, or hidden complexity.

## Table of Contents

- [Architecture Debt](#architecture-debt)
- [Code Debt](#code-debt)
- [Test Debt](#test-debt)
- [Dependency Debt](#dependency-debt)
- [Process-and-ci-debt](#process-and-ci-debt)
- [Operational Debt](#operational-debt)
- [Documentation-and-knowledge-debt](#documentation-and-knowledge-debt)

## Architecture Debt

**Typical signals**

- cyclic or cross-layer dependencies
- leaky abstractions and too many implementation details exposed
- one concept spread across many files with unclear ownership
- large modules that own multiple unrelated responsibilities
- domain logic hidden in UI, controllers, fixtures, or scripts

**Evidence to capture**

- import relationships
- repeated boundary violations
- modules that must change together
- number of files touched for a small behavior change

**Questions**

- Does this design make the next change easier or harder?
- Where is the real boundary supposed to be?
- What complexity is leaking into callers?

## Code Debt

**Typical signals**

- duplication and copy-paste drift
- excessive branching or deeply nested logic
- misleading naming or inconsistent patterns
- dead code, feature-flag leftovers, or zombie utilities
- helpers that combine unrelated responsibilities

**Evidence to capture**

- repeated snippets or workflows
- long functions and condition-heavy paths
- mismatched naming versus behavior
- old code paths still shipped but no longer used

**Questions**

- Is this hard to read, hard to change, or both?
- Would a new team member know where to fix this?
- Does the abstraction simplify or merely relocate complexity?

## Test Debt

**Typical signals**

- critical behaviors with no meaningful tests
- hard waits, retries, and order-dependent tests
- weak assertions that prove little
- slow or flaky suites that teams stop trusting
- over-reliance on one test layer for every concern

**Evidence to capture**

- repeated timeouts and sleep-based synchronization
- skipped tests, muted failures, or broad snapshots
- CI reruns or retry-heavy workflows
- coverage concentrated in easy paths but weak on risky ones

**Questions**

- Would the suite catch the failure mode that matters?
- Does the test suite increase confidence or just produce activity?
- What part of delivery is slowed down because the tests are unreliable?

## Dependency Debt

**Typical signals**

- large version gaps and blocked upgrades
- abandoned libraries or risky transitive chains
- duplicated libraries serving similar purposes
- platform coupling that makes migration difficult

**Evidence to capture**

- outdated lockfile or manifest entries
- dependencies with security issues or support gaps
- comments about postponed upgrades or compatibility freezes
- tooling versions that prevent runtime or framework updates

**Questions**

- What is blocked by staying here?
- Is the cost security, delivery speed, migration risk, or all three?
- Is the dependency still earning its place?

## Process and CI Debt

**Typical signals**

- pipelines that are slow, flaky, or noisy
- manual release or setup steps
- duplicated CI logic across workflows
- weak feedback loops with poor failure diagnosis

**Evidence to capture**

- long-running or retry-heavy jobs
- duplicated steps in multiple workflows
- missing caches, missing parallelism, or excessive artifact generation
- tribal knowledge required to re-run or debug CI locally

**Questions**

- Does the feedback loop help the team move faster or train them to ignore failures?
- Which steps fail often but teach little?
- Where is automation missing or misleading?

## Operational Debt

**Typical signals**

- weak logging and missing diagnostics
- unclear recovery procedures
- poor error handling and hidden failure modes
- missing observability in critical paths

**Evidence to capture**

- generic errors, swallowed exceptions, or silent fallbacks
- lack of logs, traces, or metrics around fragile operations
- manual recovery instructions shared verbally but not documented

**Questions**

- If this fails in production or CI, how quickly could the team diagnose it?
- Are operators depending on luck, heroics, or undocumented habits?

## Documentation and Knowledge Debt

**Typical signals**

- missing onboarding and setup docs
- outdated README or architectural notes
- no ADRs for major design decisions
- team knowledge trapped in one or two people

**Evidence to capture**

- gaps between documentation and implementation
- setup steps missing from docs but required in practice
- unexplained conventions or decision history
- areas where only tribal knowledge connects the pieces

**Questions**

- What would break if the most experienced maintainer left tomorrow?
- Which decisions are invisible until they hurt somebody?
- Is the cost mainly onboarding, correctness, or resilience?
