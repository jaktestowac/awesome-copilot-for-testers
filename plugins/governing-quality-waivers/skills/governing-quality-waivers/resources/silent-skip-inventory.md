# Silent Skip Inventory (JS/TS)

Every place a repo quietly stops enforcing something. Run the whole list on an inherited repo; run the relevant sections when a specific gate looks healthier than the code.

Adjust paths for a monorepo, and exclude `node_modules`, `dist`, and `coverage` from every search.

## Tests

```bash
# skipped, quarantined, focused
rg -n "\b(describe|it|test)\.(skip|todo|failing)\b|\bxit\(|\bxdescribe\(" --glob '!node_modules'
rg -n "\b(describe|it|test)\.only\b|\bfdescribe\(|\bfit\(" --glob '!node_modules'   # .only leaks silence the whole file
rg -n "test\.fixme|@fixme|@quarantine|@flaky" --glob '!node_modules'

# tests that assert nothing
rg -n "expect\(true\)|expect\(1\)\.toBe\(1\)|assert\(true\)" --glob '!node_modules'
rg -Un "(it|test)\((.|\n)*?\{\s*\}\s*\)" --glob '!node_modules'          # empty bodies

# tests deleted in this branch
git diff origin/main...HEAD --diff-filter=D --name-only -- '*.test.*' '*.spec.*'
```

What to look for: a `.skip` with no comment and no ticket; a `.only` that has been committed (it disables every other test in the file, and CI usually still passes); a describe block skipped "temporarily" whose git blame is over a year old.

## Lint

```bash
rg -n "eslint-disable(-next-line|-line)?" --glob '!node_modules' | rg -v "--"   # disables with no reason
rg -n "eslint-disable\b" --glob '!node_modules'                                  # whole-file disables - the loudest ones
rg -n "\"off\"|: *0\b" eslint.config.* .eslintrc*                                # rules switched off in config
rg -n "ignorePatterns|\"ignore\"" eslint.config.* .eslintrc* .eslintignore
```

A whole-file `/* eslint-disable */` at the top of a source file is the highest-value find in this section: it silences every rule, forever, invisibly.

## Types

```bash
rg -n "@ts-expect-error|@ts-ignore|@ts-nocheck" --glob '!node_modules'
rg -n ": *any\b|as any|as unknown as" --glob '!*.test.*' --glob '!node_modules'
rg -n "\"strict\": *false|\"noImplicitAny\": *false|\"strictNullChecks\": *false" -g 'tsconfig*.json'
rg -n "\"skipLibCheck\": *true" -g 'tsconfig*.json'   # fine alone, a smell next to other loosened flags
```

`@ts-nocheck` is the type equivalent of a whole-file eslint-disable. A per-package `tsconfig.json` overriding a strict root is the monorepo version, and it is easy to miss.

## CI

```bash
rg -n "continue-on-error" .github/ .gitlab-ci.yml
rg -n "\|\| *true|\|\| *exit 0|\|\| *echo" .github/ .gitlab-ci.yml
rg -n "allow_failure" .gitlab-ci.yml
rg -n "if: *false|when: manual" .github/ .gitlab-ci.yml
rg -n "set \+e" .github/ scripts/
rg -n "on:\s*schedule" -A5 .github/workflows/   # jobs that no longer run on PRs
```

The pattern that hides best: `tool || echo "non-blocking during ramp-up"` next to `continue-on-error: false`. The step always succeeds, and the `false` reads as strictness. Also check branch protection - a job that is not a required check is advice with a CPU bill.

## Coverage

```bash
rg -n "istanbul ignore|v8 ignore|c8 ignore" --glob '!node_modules'
rg -n "coverage" -A15 vitest.config.* jest.config.*   # read the exclude list and the thresholds
rg -n "thresholds?" -A8 vitest.config.* jest.config.*
```

Two things to compare: the threshold against the _current_ value (a threshold set just below current can only detect catastrophe), and the exclude list against the directories where the logic lives.

## Test-runner leniency

```bash
rg -n "retries" playwright.config.* vitest.config.* jest.config.*
rg -n "testTimeout|timeout: *[0-9]{5,}" --glob '!node_modules'
rg -n "waitForTimeout|sleep\(|setTimeout.*await" --glob '*.spec.*' --glob '*.test.*'
rg -n "test\.slow\(|maxFailures|bail" playwright.config.*
```

`retries: 3` with no flake measurement is not flake control, it is flake hiding - the suite goes green and the underlying race stays. Hard waits are the same trade in miniature.

## Security and dependencies

```bash
rg -n "audit-level|--force|--legacy-peer-deps|--ignore-scripts" package.json .github/
rg -n "allowlist|\[allowlist\]" .gitleaks.toml
rg -n "\"overrides\"|\"resolutions\"" package.json      # pinned-down advisories
ls .snyk .npmrc 2>/dev/null
gh api repos/:owner/:repo/dependabot/alerts --jq '.[] | [.state, .security_advisory.severity] | @tsv' 2>/dev/null
```

A gitleaks allowlist entry with no comment is indistinguishable from a real secret someone decided to live with. Open Dependabot alerts older than the profile's tolerance are waivers nobody wrote down.

## Git and local hooks

```bash
cat .husky/pre-commit .husky/pre-push 2>/dev/null
rg -n "no-verify" --glob '!node_modules' -g '!*.lock'   # in scripts or docs: an institutionalised bypass
git config --get core.hooksPath
```

`--no-verify` documented in a CONTRIBUTING file or wired into a script is a bypass that has become policy.

## AI/LLM gates

```bash
rg -n "\.skip|only" --glob '**/evals/**' --glob '*.eval.*'
rg -n "threshold|passRate|assert" promptfooconfig.* 2>/dev/null
rg -n "temperature|model:" --glob '**/prompts/**' --glob '*.eval.*'
```

An eval suite that runs but asserts nothing, or whose threshold was lowered after a model swap, is the newest member of this family and the least likely to be noticed.

## Reporting the inventory

```
Silent skip inventory - <repo>, <date>

  Tests            9 skipped (2 with a ticket), 1 committed .only, 3 empty bodies
  Lint            14 inline disables (4 with a reason), 1 whole-file disable
  Types            6 @ts-expect-error (1 with a reason), strict:false in apps/web
  CI               2 continue-on-error, 1 `npm audit || true`, e2e job runs on schedule only
  Coverage         3 istanbul ignores, src/services/** excluded, threshold 40% vs current 71%
  Leniency         retries: 3 with no flake measurement
  Security         2 gitleaks allowlist entries with no comment, 4 open critical alerts
  Hooks            --no-verify documented in CONTRIBUTING.md

  Total 46 suppressions · 7 carry any explanation · 0 in a waiver register
```

Then resolve each: **fix**, **waive**, or **delete**. An inventory that ends at the count is an audit for its own sake - the number exists to justify the next hour of work, not to be admired.

Highest-value first: the whole-file disables, the `|| true` in CI, the `src/services/**` coverage exclusion, and the committed `.only`. Those four hide the most.
