# Wiring Diff Coverage Into CI

## GitHub Actions

```yaml
name: diff-coverage
on:
  pull_request:

jobs:
  diff-coverage:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write # needed for the sticky comment
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # required: a shallow clone has no merge base

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci

      - name: Test with coverage
        run: npx vitest run --coverage --coverage.reporter=lcov --coverage.reporter=text-summary

      - name: Diff coverage
        id: diff
        run: |
          pipx install diff-cover
          diff-cover coverage/lcov.info \
            --compare-branch=origin/${{ github.base_ref }} \
            --fail-under=75 \
            --markdown-report diff-coverage.md

      - name: Comment
        if: always()
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          header: diff-coverage
          path: diff-coverage.md
```

`fetch-depth: 0` is the step everyone omits first. Without full history there is no merge base, `git diff origin/main...HEAD` returns nothing, and the job passes with 0 changed lines - a green check that verified nothing. Assert the changed-line count is non-zero before trusting a pass.

## GitLab CI

```yaml
diff-coverage:
  stage: test
  rules:
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'
  variables:
    GIT_DEPTH: 0
  script:
    - npm ci
    - npx vitest run --coverage --coverage.reporter=cobertura --coverage.reporter=text-summary
    - pipx install diff-cover
    - diff-cover coverage/cobertura-coverage.xml
      --compare-branch=origin/$CI_MERGE_REQUEST_TARGET_BRANCH_NAME
      --fail-under=75
      --markdown-report diff-coverage.md
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  artifacts:
    when: always
    paths: [diff-coverage.md]
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
```

The `reports.coverage_report` block gives GitLab per-line MR annotations, which is the feature that makes developers act on the number instead of arguing with it.

## Merging suites before gating

Gate on the union of what all suites executed, or the number punishes code that integration tests cover:

```yaml
- run: npx vitest run --coverage --coverage.reporter=json --coverage.reportsDirectory=cov/unit
- run: npx vitest run --config vitest.integration.ts --coverage --coverage.reporter=json --coverage.reportsDirectory=cov/int
- name: Merge
  run: |
    npx istanbul-merge --out cov/merged.json cov/unit/coverage-final.json cov/int/coverage-final.json
    npx nyc report --temp-dir cov --reporter=lcov --report-dir coverage
```

If merging is genuinely impractical, gate on the unit artifact and **label the number**: "diff coverage, unit suite only". A labelled partial truth is fine; an unlabelled one gets quoted in a release meeting.

## Sticky comment, not a new one per push

One updating comment per PR. A fresh comment on every push trains people to collapse the thread, and the signal is gone. Key the comment on a header (`header: diff-coverage` above) so each run replaces its own.

Content worth including, in this order:

1. verdict and the number
2. per-file table, worst first
3. the uncovered ranges with their classification
4. what the number does **not** cover (suites not included, exclusions in scope)

## Local pre-push, same command

Keep the local and CI commands identical, so a developer can reproduce a CI failure without pushing:

```bash
# package.json
"scripts": {
  "coverage:diff": "vitest run --coverage --coverage.reporter=lcov && diff-cover coverage/lcov.info --compare-branch=origin/main --fail-under=75"
}
```

Two enforcement layers, deliberately different in strength:

- **Local (bypassable):** fast, advisory, informative. A local hook that blocks on a slow coverage run gets disabled within a week.
- **CI (non-bypassable):** the actual gate, wired into required checks.

Fast feedback that blocks gets disabled. Enforcement that is bypassable gets bypassed. Put each in the layer where it survives.

## Making it stick

- Add the job to branch protection required checks - an unrequired check is advice.
- Never write `|| true`, `continue-on-error: true`, or `--fail-under=0` on this job. Any of them makes it report green regardless, which is worse than not having it.
- If the job is too slow, cut suite time or split the job. Do not cut the gate.
- Fail the job when the changed-line count is zero but the diff is non-empty - that means the path matching broke, and it is otherwise indistinguishable from success.
