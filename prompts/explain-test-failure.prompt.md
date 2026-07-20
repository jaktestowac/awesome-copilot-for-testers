---
name: Explain a test failure
agent: agent
description: 'Diagnose a failing test from an error message, stack trace, CI log, or trace file: classify the root cause as app defect, test bug, environment issue, or flakiness — without changing any code. Use the fix-tests prompt when you want the failure fixed.'
tools: ['vscode', 'execute', 'read', 'search', 'todo']
---

# Task

Your goal is to explain why a test is failing, not to fix it.

Analyze the failure evidence: ${input:failureEvidence:test name, error message, stack trace, CI log, or path to a report/trace file}

Ask only for missing essentials:

- the failing test name or file if not clear from the evidence
- where the failure occurred: locally, in CI, or both
- whether the failure is constant or intermittent, if known

Then do the following:

1. Read the failing test and the code or page it exercises. Follow the stack trace to the exact failing line.
2. If the test can be run safely, rerun it in isolation to confirm the failure and check for flakiness. Do not modify any files to do so.
3. Classify the root cause as one of:
   - **Application defect** — the product behaves incorrectly
   - **Test bug** — wrong assertion, stale locator, bad test data, broken setup
   - **Environment/config** — missing dependency, wrong URL, credentials, CI-only conditions
   - **Flakiness** — race condition, timing, test interdependence, unstable data
4. Explain the failure chain step by step: what the test expected, what actually happened, and why.
5. If the evidence is not conclusive, list 2–3 ranked, falsifiable hypotheses and, for each, the single check that would confirm or eliminate it.
6. State your confidence and be explicit about what you verified versus what you inferred.

## Output format

Return Markdown only, with:

- a one-paragraph verdict: root cause classification and confidence
- the failure chain explanation
- evidence cited from code, logs, or reruns
- recommended next step: fix the app (file a bug with the `bug-report` prompt), fix the test (use the `fix-tests` prompt), or adjust the environment

## Constraints

- Never edit files or "try a fix" — this is a diagnosis, not a repair.
- Do not guess: separate confirmed facts from hypotheses explicitly.
