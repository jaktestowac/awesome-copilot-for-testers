---
name: Analyze test results
agent: agent
description: 'Turn raw test run output — a CI log, JUnit/Playwright report, or console output — into an actionable summary: failure clusters, likely root-cause groups, flakiness suspects, and what to investigate first.'
tools: ['vscode', 'read', 'search', 'todo']
---

# Task

Your goal is to convert a noisy test run into a short list of decisions, so nobody has to scroll through hundreds of log lines.

Analyze the test results from ${input:resultsSource:path to a report/log file, pasted output, or CI log}.

Ask only for missing essentials:

- the results source, if not provided
- whether this run is from CI or local, and which branch/build
- a previous run to compare against, if trend analysis is wanted

Then do the following:

1. Parse the results: total, passed, failed, skipped, and duration. Note anything suspicious in the totals themselves (e.g., large skip counts, suites that never ran).
2. Cluster the failures by shared symptoms: same error message, same selector or endpoint, same fixture or setup step, same suite or module.
3. For each cluster, hypothesize a root-cause group: application defect, test bug, environment/infrastructure, or flakiness. Use retry patterns and timing evidence where available.
4. Identify flakiness suspects: tests that passed on retry, timing-related errors, or order-dependent failures.
5. Prioritize: which cluster blocks the release or pipeline, which is safe to defer, and which single investigation would explain the most failures.

## Output format

Return Markdown only, with:

- a run health summary in 2–3 sentences
- a failure cluster table: `Cluster | Tests affected | Shared symptom | Suspected cause | Priority`
- flakiness suspects with the evidence for each
- recommended next actions, mapped to follow-up prompts: `explain-test-failure` for the key failure, `fix-tests` for confirmed test bugs, `bug-report` for app defects

## Constraints

- Distinguish facts from hypotheses; never present a suspected cause as confirmed.
- Do not modify tests or code — this is analysis only.
