---
name: Stabilize flaky tests
agent: agent
description: 'Hunt down intermittently failing tests, classify the flakiness root cause (timing, environment, data, state leakage), fix it properly, and prove stability with repeated runs. Use the fix-tests prompt for tests that fail consistently.'
tools: ['vscode', 'execute', 'read', 'edit', 'search', 'playwright/*', 'todo']
---

# Task

Your goal is to make flaky tests deterministic - not to make them pass more often.

Target: ${input:testScope:known flaky test(s), or a suite scope to screen for flakiness}

Ask only for missing essentials:

- the scope, if not provided
- any CI evidence of intermittent failures (retry logs, failure history), if available

Then do the following:

1. Reproduce the flakiness: run the suspect tests repeatedly (e.g. Playwright `--repeat-each=10`) and, separately, with parallel workers, to observe both timing and isolation failures. Record the failure rate.
2. Classify each flaky test by root cause:
   - **Timing/UI** - races with rendering, animation, or network; sleeps and hardcoded waits
   - **Test isolation** - order dependence, shared state, leaked data between tests or workers
   - **Data** - non-unique or reused test data colliding across runs or workers
   - **Environment** - CI-only conditions, resource limits, external dependencies
3. Fix the root cause, not the symptom:
   - replace sleeps with web-first assertions or waits on concrete conditions (a specific response, URL, or element state); start response waits before the triggering action
   - make each test own its state: unique per-worker data, proper setup/teardown in fixtures, no shared mutable state or `beforeAll` page sharing
   - mock unstable external dependencies instead of tolerating them
   - disable animations when they interfere with interactions
4. Prove stability: rerun each fixed test repeatedly and in parallel until it passes consistently (e.g. 10+ consecutive runs). Report the before/after failure rate.
5. If a test cannot be stabilized now, quarantine it explicitly (framework annotation plus a tracking note with your diagnosis) - never delete it or hide it behind retries.

# Guardrails

- Never stabilize by increasing global timeouts, adding retries, weakening assertions, or forcing serial execution without documenting why.
- Keep each fix minimal and explain the root cause per test in the summary.
