# GitLab CI Jobs

GitLab expresses soft gates with `allow_failure`, which is a genuine first-class amber state - better than the Actions equivalent, and worth using instead of any `|| true` construction.

## Skeleton

```yaml
stages: [lint, test, verify, security, governance]

default:
  image: node:20
  interruptible: true # supersede on new pushes
  cache:
    key:
      files: [package-lock.json]
    paths: [.npm/]
  before_script:
    - npm ci --cache .npm --prefer-offline

variables:
  GIT_DEPTH: 0 # full history: merge base for diff-based checks

workflow:
  rules:
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
```

The `workflow:` block is worth a comment explaining _why_ it is shaped this way - usually "so gates run on every MR and on the default branch, and nowhere else". A rule nobody understands gets widened during the next incident and never narrowed again.

## Blocking jobs

```yaml
lint:
  stage: lint
  script:
    - npx eslint . --max-warnings 0
    - npx prettier --check .

typecheck:
  stage: lint
  script: npx tsc --noEmit

unit:
  stage: test
  script:
    - npx vitest run --coverage --coverage.reporter=cobertura --coverage.reporter=text-summary
    - |
      if git grep -nE '\b(describe|it|test)\.(only|skip)\b' -- '*.test.*' '*.spec.*' | grep -v 'W-[0-9]\+'; then
        echo "Skipped or focused tests without a waiver id"; exit 1
      fi
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  artifacts:
    when: always
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    paths: [coverage/]

diff-coverage:
  stage: verify
  needs: [unit]
  script:
    - |
      changed=$(git diff origin/$CI_MERGE_REQUEST_TARGET_BRANCH_NAME...HEAD --name-only -- '*.ts' '*.tsx' | wc -l)
      if [ "$changed" -eq 0 ]; then echo "No changed TS files - path matching is broken"; exit 1; fi
    - pipx install diff-cover
    - diff-cover coverage/cobertura-coverage.xml
      --compare-branch=origin/$CI_MERGE_REQUEST_TARGET_BRANCH_NAME
      --fail-under=75 --markdown-report diff-coverage.md
  artifacts:
    when: always
    paths: [diff-coverage.md]

dependency-audit:
  stage: security
  script: npm audit --audit-level=critical # no `|| true`

secret-scan:
  stage: security
  image:
    name: zricethezav/gitleaks:latest
    entrypoint: ['']
  script: gitleaks detect --source . --redact --exit-code 1
```

The `coverage_report` artifact gives per-line MR annotations, which is the feature that makes developers act on a coverage number instead of arguing with it.

## Soft gates

```yaml
mutation:
  stage: verify
  script: npx stryker run
  allow_failure: true # amber in the MR, not a fake pass
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

cognitive-complexity:
  stage: lint
  script: npx eslint . --rule '{"sonarjs/cognitive-complexity":["error",15]}'
  allow_failure: true # ramp-up: soft until the backlog is cleared, then flip
```

Never write this:

```yaml
script: npx stryker run || echo "warnings" # ❌ always succeeds
allow_failure: false # ❌ and this reads as strict
```

The `|| echo` makes the job green whatever the tool says, and the `allow_failure: false` beside it actively misleads a reader. GitLab has a first-class way to say "soft"; use it.

## Diff-scoped jobs

```yaml
e2e:
  stage: verify
  image: mcr.microsoft.com/playwright:v1.50.0-jammy
  parallel: 4
  script: npx playwright test --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
  rules:
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'
      changes: ['src/**/*', 'e2e/**/*', 'package-lock.json']
  artifacts:
    when: on_failure
    paths: [playwright-report/]

evals:
  stage: verify
  script:
    - npx vitest run --config vitest.evals.config.ts --reporter=json --outputFile=results/now.json
    - node scripts/compare-evals.mjs evals/baselines/current.json results/now.json
  rules:
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'
      changes:
        ['prompts/**/*', 'evals/**/*', 'src/**/prompt*', 'src/**/retriev*', 'package-lock.json']
```

`rules:changes` is GitLab's `paths:` filter. It only works on merge-request and branch pipelines - on a scheduled pipeline it evaluates as true, so pair it with a pipeline-source condition or an expensive job will run on every schedule.

## Governance jobs

```yaml
waiver-expiry:
  stage: governance
  script: node scripts/check-waivers.mjs

unregistered-suppressions:
  stage: governance
  script:
    - |
      added=$(git diff origin/$CI_MERGE_REQUEST_TARGET_BRANCH_NAME...HEAD -U0 \
        | grep -E '^\+.*(eslint-disable|@ts-expect-error|@ts-nocheck|\.skip\(|\.only\(|allow_failure|istanbul ignore)' \
        | grep -vE 'W-[0-9]+' || true)
      if [ -n "$added" ]; then echo "Unregistered suppressions:"; echo "$added"; exit 1; fi
  rules:
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'

intent-gate:
  stage: governance
  script: bash scripts/check-intent.sh origin/$CI_MERGE_REQUEST_TARGET_BRANCH_NAME
  rules:
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'
```

## Sticky MR note

```yaml
report:
  stage: governance
  when: always
  needs: [diff-coverage]
  script:
    - |
      BODY=$(cat diff-coverage.md)
      # find an existing note with our marker and update it, else create one
      NOTE_ID=$(curl -sf --header "PRIVATE-TOKEN: $QE_MR_TOKEN" \
        "$CI_API_V4_URL/projects/$CI_PROJECT_ID/merge_requests/$CI_MERGE_REQUEST_IID/notes" \
        | jq -r '[.[] | select(.body | startswith("<!-- quality-gate -->"))][0].id // empty')
      PAYLOAD=$(jq -n --arg b "<!-- quality-gate -->
      $BODY" '{body:$b}')
      if [ -n "$NOTE_ID" ]; then
        curl -sf -X PUT --header "PRIVATE-TOKEN: $QE_MR_TOKEN" -H 'Content-Type: application/json' \
          -d "$PAYLOAD" "$CI_API_V4_URL/projects/$CI_PROJECT_ID/merge_requests/$CI_MERGE_REQUEST_IID/notes/$NOTE_ID"
      else
        curl -sf -X POST --header "PRIVATE-TOKEN: $QE_MR_TOKEN" -H 'Content-Type: application/json' \
          -d "$PAYLOAD" "$CI_API_V4_URL/projects/$CI_PROJECT_ID/merge_requests/$CI_MERGE_REQUEST_IID/notes"
      fi
  rules:
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'
```

The HTML-comment marker is what makes the note sticky: find it, update it, do not append. `$CI_JOB_TOKEN` can post notes on GitLab 16+; a project access token with `api` scope (`$QE_MR_TOKEN`) is the fallback for older instances.

## Making it enforce

- **Settings → Merge requests → Pipelines must succeed.** Without it, the pipeline is advice.
- **"Skipped pipelines are considered successful" must be off**, or a `rules`-skipped pipeline counts as a pass.
- Do not put required gates behind `when: manual` - a manual job that nobody runs blocks nothing.
- Use merge-request pipelines (not branch pipelines) so `CI_MERGE_REQUEST_TARGET_BRANCH_NAME` resolves; diff-based jobs silently misbehave without it.

## Monorepo

```yaml
.package-template:
  script: npm test --workspace=$PACKAGE
  rules:
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'
      changes: ['packages/$PACKAGE/**/*', 'package-lock.json']

test:api:
  extends: .package-template
  variables: { PACKAGE: api }

test:web:
  extends: .package-template
  variables: { PACKAGE: web }
```

Explicit per-package jobs are more readable than dynamic child pipelines and they show up individually in the MR - which matters, because a single collapsed "tests" job hides which package actually failed.
