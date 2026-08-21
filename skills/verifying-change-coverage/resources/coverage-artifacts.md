# Coverage Artifacts

## Producing one

| Runner              | Command                                                                      | Output                                               |
| ------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------- |
| Vitest              | `vitest run --coverage --coverage.reporter=lcov --coverage.reporter=json`    | `coverage/lcov.info`, `coverage/coverage-final.json` |
| Jest                | `jest --coverage --coverageReporters=lcov --coverageReporters=json`          | `coverage/lcov.info`                                 |
| Node test runner    | `node --experimental-test-coverage --test-reporter=lcov`                     | stdout, redirect it                                  |
| Playwright (E2E)    | instrument the app under test with `c8`/`istanbul`, collect via CDP or `nyc` | `coverage/` after merge                              |
| Vitest browser mode | `--coverage.provider=v8`                                                     | `coverage/lcov.info`                                 |

Coverage providers differ: `v8` counts what the engine executed and needs no instrumentation; `istanbul` instruments the source and gives richer branch data. On changed-line analysis, `istanbul` usually gives the better branch picture; `v8` is faster and fine for line coverage.

## LCOV, the parts that matter

```
SF:src/lib/pricing.ts     ← source file, path relative to the run root
DA:12,3                   ← line 12 executed 3 times
DA:13,0                   ← line 13 never executed
BRDA:20,0,0,5             ← line 20, block 0, branch 0, taken 5 times
BRDA:20,0,1,0             ← line 20, block 0, branch 1, never taken  ← partial branch
LF:120  LH:98             ← lines found / hit
BRF:40  BRH:31            ← branches found / hit
end_of_record
```

For diff coverage you need `SF`, `DA`, and `BRDA`. `DA:<line>,0` is an uncovered line; a `BRDA` with `0` taken on a changed line is a partial branch - the line ran, one path never did.

## Cobertura, the parts that matter

```xml
<class filename="src/lib/pricing.ts">
  <lines>
    <line number="12" hits="3" branch="false"/>
    <line number="20" hits="5" branch="true" condition-coverage="50% (1/2)"/>
    <line number="13" hits="0" branch="false"/>
  </lines>
</class>
```

`condition-coverage="50% (1/2)"` is the partial-branch signal. Note that `filename` may be relative to a `<source>` root declared at the top of the document - resolve it before matching against diff paths.

## What counts as an executable changed line

The most common cause of a wrong diff-coverage figure. **Exclude** from the denominator:

- blank lines and comments
- `import` / `export ... from` statements
- pure type constructs: `interface`, `type`, `declare`, generic parameters
- decorators with no runtime effect in this build
- lines that exist only after transformation and have no source counterpart

**Include:**

- statements, expressions, and assignments
- function and method bodies
- conditional and loop headers
- `return` statements, including early returns
- object and array literals containing computed values

The practical rule: if the runner's own report lists the line in `DA`/`<line>`, it is executable - the report's own opinion beats your parse of the source. Take the intersection of "added in the diff" and "present in the coverage report" as the denominator.

## Merging across suites

Unit tests do not execute the same lines as integration or E2E tests. A unit-only artifact makes integration-covered code look untested, which produces false findings and destroys trust in the gate on day one.

Two options:

**Merge, then intersect** - the accurate path:

```bash
# istanbul-based
npx nyc merge coverage-unit coverage-merged/unit.json
npx nyc merge coverage-int  coverage-merged/int.json
npx nyc report --temp-dir coverage-merged --reporter=lcov

# or with the raw json-summary/json reports
npx istanbul-merge --out merged.json coverage-unit/coverage-final.json coverage-int/coverage-final.json
```

**Report per suite** - acceptable if merging is impractical, but then say so: "diff coverage 62% from unit tests only; integration coverage not measured." A qualified number is usable; an unqualified wrong number is not.

## Monorepo path pitfalls

Nearly every first attempt fails here.

- Coverage paths are relative to the **run root** (the package), diff paths are relative to the **repo root**. `src/lib/pricing.ts` vs `packages/api/src/lib/pricing.ts` intersects to nothing, and nothing intersecting reports as 0% covered.
- Normalise both sides to repo-root-relative POSIX paths before matching. On Windows, also normalise separators.
- With per-package coverage runs you get several artifacts; map each to its package prefix before merging.
- Symlinked workspaces (`pnpm`) can produce paths through `node_modules/.pnpm`. Resolve real paths first.

Sanity check before trusting any figure: pick one file you know is tested and confirm it appears in the artifact with non-zero hits. If it does not, the paths are wrong, not the tests.

## Source maps

Coverage is collected on what ran (compiled or transformed output) and must be mapped back to source. `v8` providers with `inline-source-map` handle this; a mis-set `sourcemap: false` in the build produces coverage attributed to the wrong lines - usually a suspicious cluster at the top of each file.

Tell: coverage that marks lines 1–5 hit and everything else cold, in every file. That is a source-map failure, not a test failure.

## Staleness

An artifact from a previous commit produces a confidently wrong answer, and the shape of the error is misleading - lines that do not exist yet appear uncovered while genuinely new code goes unmentioned. Guard against it:

- generate coverage in the same job that runs the diff analysis
- record the commit SHA alongside the artifact and compare before use
- never read a committed `coverage/` directory from the repository

## Tooling worth knowing

- `diff-cover` (Python, works on any LCOV/Cobertura + git diff) - the reference implementation of this analysis
- Codecov / Coveralls patch coverage - hosted equivalents with PR annotations
- `nyc` / `istanbul-merge` / `istanbul-lib-coverage` - for merging and programmatic access
- `monocart-coverage-reports` - useful for Playwright and browser coverage collection

Using one of these is preferable to hand-rolling the intersection. Hand-roll only when a tool cannot be added, and then verify against a file whose coverage you already know.
