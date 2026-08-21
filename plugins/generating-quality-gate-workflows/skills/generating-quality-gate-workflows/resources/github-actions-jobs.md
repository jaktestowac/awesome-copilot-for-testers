# GitHub Actions Jobs

## Skeleton

```yaml
name: quality
on:
  pull_request:
  push:
    branches: [main]

concurrency:
  group: quality-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  setup:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 } # merge base for diff-based checks
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
```

`concurrency` cancels superseded runs — on a busy repo it is the single biggest CI cost reduction available, and it costs one block.

## Layer 2 — blocking jobs

```yaml
  lint:
    needs: setup
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npx eslint . --max-warnings 0 # not optional: without it, warnings pass
      - run: npx prettier --check .

  typecheck:
    needs: setup
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npx tsc --noEmit

  unit:
    needs: setup
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npx vitest run --coverage --coverage.reporter=lcov --reporter=verbose
      - name: No skipped or focused tests
        run: |
          if git grep -nE '\b(describe|it|test)\.(only|skip)\b' -- '*.test.*' '*.spec.*' \
             | grep -v 'W-[0-9]\+'; then
            echo "::error::Skipped or focused tests without a waiver id"; exit 1
          fi
      - uses: actions/upload-artifact@v4
        with: { name: coverage-unit, path: coverage/ }

  diff-coverage:
    needs: unit
    runs-on: ubuntu-latest
    timeout-minutes: 10
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: actions/download-artifact@v4
        with: { name: coverage-unit, path: coverage }
      - name: Guard against empty diff
        run: |
          changed=$(git diff origin/${{ github.base_ref }}...HEAD --name-only -- '*.ts' '*.tsx' | wc -l)
          [ "$changed" -eq 0 ] && { echo "::error::No changed TS files detected — path matching is broken"; exit 1; }
      - run: pipx install diff-cover
      - run: |
          diff-cover coverage/lcov.info \
            --compare-branch=origin/${{ github.base_ref }} \
            --fail-under=75 --markdown-report diff-coverage.md
      - uses: marocchino/sticky-pull-request-comment@v2
        if: always()
        with: { header: diff-coverage, path: diff-coverage.md }

  secret-scan:
    needs: setup
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 } # full history, not just the diff
      - uses: gitleaks/gitleaks-action@v2
        env: { GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} }

  dependency-audit:
    needs: setup
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm audit --audit-level=critical # no `|| true`
```

The **empty-diff guard** in `diff-coverage` is the most valuable eight lines in this file. Without it, a monorepo path mismatch or a shallow clone produces a passing job that verified nothing, and it looks identical to success.

## Diff-scoped expensive jobs

```yaml
  e2e:
    if: |
      contains(github.event.pull_request.labels.*.name, 'run-e2e') ||
      github.base_ref == 'main'
    needs: setup
    runs-on: ubuntu-latest
    timeout-minutes: 30
    strategy:
      fail-fast: false
      matrix: { shard: [1, 2, 3, 4] }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test --shard=${{ matrix.shard }}/4
      - uses: actions/upload-artifact@v4
        if: failure()
        with: { name: playwright-report-${{ matrix.shard }}, path: playwright-report/ }
```

```yaml
  evals:
    if: github.event.pull_request.head.repo.full_name == github.repository # forks have no secrets
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: npx vitest run --config vitest.evals.config.ts --reporter=json --outputFile=results/now.json
      - run: node scripts/compare-evals.mjs evals/baselines/current.json results/now.json
```

Trigger it with a `paths:` filter on the workflow, derived from the relevance recipes:

```yaml
on:
  pull_request:
    paths:
      - 'prompts/**'
      - 'evals/**'
      - 'src/**/prompt*'
      - 'src/**/model-config*'
      - 'src/**/retriev*'
      - 'package-lock.json'
```

## Soft gates — visible, not hidden

```yaml
  mutation:
    needs: setup
    runs-on: ubuntu-latest
    timeout-minutes: 40
    continue-on-error: true # soft gate: amber, not a fake green
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npx stryker run
```

Never this:

```yaml
      - run: npx stryker run || echo "mutation warnings"   # ❌ always green
        continue-on-error: false                            # ❌ and this reads as strict
```

The difference is what a reader sees on the PR: amber says "known soft gate", green says "this passed".

## Governance jobs

```yaml
  waiver-expiry:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
      - run: node scripts/check-waivers.mjs # fails on an expired or unbounded waiver

  unregistered-suppressions:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - run: |
          added=$(git diff origin/${{ github.base_ref }}...HEAD -U0 \
            | grep -E '^\+.*(eslint-disable|@ts-expect-error|@ts-nocheck|\.skip\(|\.only\(|continue-on-error|istanbul ignore|v8 ignore)' \
            | grep -vE 'W-[0-9]+' || true)
          if [ -n "$added" ]; then
            echo "::error::Unregistered suppressions added:"; echo "$added"; exit 1
          fi

  intent-gate:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - run: bash scripts/check-intent.sh origin/${{ github.base_ref }}
```

`unregistered-suppressions` is the cheapest high-value job in this file: it stops silent-skip accumulation at the source rather than cleaning it up quarterly.

## Monorepo

```yaml
  changed-packages:
    runs-on: ubuntu-latest
    outputs: { packages: ${{ steps.detect.outputs.packages }} }
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - id: detect
        run: |
          echo "packages=$(npx turbo run build --filter='...[origin/${{ github.base_ref }}]' --dry=json \
            | jq -c '[.tasks[].package] | unique')" >> "$GITHUB_OUTPUT"

  test-changed:
    needs: changed-packages
    if: needs.changed-packages.outputs.packages != '[]'
    strategy:
      matrix: { package: ${{ fromJson(needs.changed-packages.outputs.packages) }} }
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test --workspace=${{ matrix.package }}
```

Two monorepo traps: a package matrix that resolves to empty must not report success for the whole gate, and coverage paths are package-relative while diff paths are repo-relative — normalise before intersecting, or diff coverage reports 0% and everyone panics about the wrong thing.

## Making it enforce

```bash
gh api -X PUT repos/:owner/:repo/branches/main/protection/required_status_checks \
  -f strict=true \
  -f 'contexts[]=lint' -f 'contexts[]=typecheck' -f 'contexts[]=unit' \
  -f 'contexts[]=diff-coverage' -f 'contexts[]=secret-scan' -f 'contexts[]=dependency-audit'
```

Do not list soft gates or fork-skipped jobs as required. A required check that is skipped stays pending forever and blocks every merge, which is how required checks get switched off entirely.

## Fork safety

- Use `pull_request`, never `pull_request_target`, for anything that runs PR code. `pull_request_target` runs with write permissions and repository secrets against untrusted code.
- Skip secret-dependent jobs on forks with an `if:` on the head repo, and run a key-free subset instead.
- Never interpolate untrusted input (`github.event.pull_request.title`, branch names) directly into a `run:` block — pass it through `env:` instead. Direct interpolation is a shell-injection path into your gate.
