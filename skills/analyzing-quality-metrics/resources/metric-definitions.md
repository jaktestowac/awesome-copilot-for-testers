# Metric Definitions

Each entry fixes the formula, the source, the window, what is excluded, the known distortions, and the decision it supports. Copy the ones you use into the team's own documentation so there is one definition, not one per person.

---

## Suite health

### Pass rate

- **Formula**: passed / (passed + failed), per run
- **Source**: CI test reporter (JUnit XML, Playwright JSON, `blob` reports merged)
- **Window**: per run, trended weekly
- **Excludes**: skipped tests, which is exactly why it must be reported next to the skip count
- **Distortions**: rises when tests are skipped, quarantined, or deleted; rises when retries are counted as passes
- **Report with**: skipped count, quarantined count, flake rate
- **Decision**: is this build shippable

Count a retried test as a **flake**, not as a pass. A pass rate computed after retries is the number that hides the problem.

### Flake rate

- **Formula**: tests with both a pass and a fail on the same commit / total tests, over the window
- **Source**: CI history keyed by commit sha; needs retained runs
- **Window**: 14 or 30 days
- **Excludes**: failures on different commits (those are regressions, not flakes)
- **Distortions**: falls when flaky tests are quarantined rather than fixed, so it must be read alongside quarantine count
- **Report with**: quarantine count and the age of the oldest quarantined test
- **Decision**: is our suite trustworthy; which tests to fix first

Rank individual tests by flake count, not just the aggregate. Suites usually have a short head: a handful of tests produce most of the noise.

### Quarantine count and age

- **Formula**: count of tests currently skipped or tagged as quarantined; age of each since quarantine
- **Source**: repository grep for the skip and quarantine markers, plus git blame for the date
- **Window**: current
- **Distortions**: none worth noting, which makes it a good honesty check on pass rate
- **Decision**: how much of the suite's claimed coverage is fictional

A quarantined test older than a quarter is a deleted test with maintenance costs. Set an expiry at quarantine time and enforce it.

### Suite duration

- **Formula**: wall-clock time from job start to results available, per stage
- **Source**: CI job timings
- **Window**: per run, trended
- **Excludes**: nothing; include queue time and report it separately, because developers experience it
- **Distortions**: falls when tests are deleted, so pair it with escape rate
- **Report with**: escape rate, test count
- **Decision**: is the feedback loop fast enough

Report the p95, not the mean. The mean hides the runs that make people stop waiting for CI.

### Time to first failure signal

- **Formula**: commit pushed to first red signal
- **Source**: CI timestamps
- **Decision**: whether fast checks run before slow ones

Often more actionable than total duration. A 40-minute suite that fails at minute 3 is a different experience from one that fails at minute 38.

---

## Coverage

### Line and branch coverage

- **Formula**: executed lines / total lines, per the coverage tool
- **Source**: `c8`, `istanbul`, `vitest --coverage`
- **Window**: per run
- **Excludes**: generated code, vendored code, config; document the exclusion list
- **Distortions**: **measures execution, not verification.** A test with no assertions raises it. So does a test that calls a function and ignores the result.
- **Report with**: mutation score, or at minimum assertion density
- **Decision**: where coverage is absent, not whether coverage is sufficient

Always print the caveat with the number. Coverage is a good absence detector and a poor presence detector: 0 percent on the payment module is real information, 85 percent overall is not.

### Coverage of changed lines

- **Formula**: covered changed lines / total changed lines, per pull request
- **Source**: coverage report intersected with the diff
- **Decision**: does this change carry tests

More actionable than total coverage and much harder to game by adding tests to easy files.

### Mutation score

- **Formula**: mutants killed / mutants generated
- **Source**: Stryker
- **Window**: per module, run on a schedule; too slow for every commit
- **Excludes**: equivalent mutants, which need manual dismissal
- **Distortions**: expensive; run it on high-risk modules rather than the whole codebase
- **Decision**: do the existing tests actually verify behaviour

The honest counterweight to line coverage. High coverage with low mutation score is the signature of a suite that executes everything and proves nothing. See `unslop-tests`.

### Coverage against risk

- **Formula**: not numeric. For each risk area: covered, thin, or gap.
- **Source**: judgement, from `analyzing-regression-scope` plus the test inventory
- **Decision**: where to invest test effort

The most useful coverage metric and the only one that is not a percentage. Resist converting it into one.

---

## Defects

### Defect escape rate

- **Formula**: defects found in production / total defects found, per release
- **Source**: issue tracker, with an environment-found field
- **Window**: per release, trended over the last 6 to 12
- **Excludes**: third-party outages, infrastructure incidents, and anything no test could have caught. Record the exclusions.
- **Distortions**: depends on production defects being reported at all; a fall may mean users gave up reporting
- **Report with**: total defect count and production traffic
- **Decision**: is quality improving; where to invest test effort

The single most informative quality metric available to most teams, and the one that needs the most disciplined definition.

### Defect density by area

- **Formula**: defects per module or feature, over the window, normalized by size or by change volume
- **Source**: issue tracker with a component field
- **Distortions**: reflects where people look as much as where defects are; a heavily used feature reports more
- **Decision**: where to invest test effort; which areas to explore

### Time to detect

- **Formula**: commit merged to defect first reported
- **Source**: git plus the issue tracker
- **Decision**: is the safety net catching things early or late

A defect caught in CI has a time to detect of minutes. One caught by a customer has weeks. The distribution is more informative than the average.

### Time to resolve

- **Formula**: reported to deployed fix
- **Excludes**: time spent waiting on a third party; track that separately or the number measures someone else

### Change failure rate

- **Formula**: deployments causing an incident or a rollback / total deployments
- **Source**: deployment log plus incident record
- **Window**: monthly
- **Decision**: is the delivery process safe at its current speed

One of the four DORA metrics and the one that keeps the other three honest.

---

## Reporting rules

| Rule | Reason |
| --- | --- |
| Always show the denominator | "12 defects" is not a fact until you know 12 out of how many, over what |
| Same window for compared metrics | A weekly figure next to a quarterly one invites a false comparison |
| Annotate the timeline | Refactors, migrations, freezes, and tooling changes explain most step changes |
| Mark data gaps | Interpolating over a CI outage manufactures a trend |
| Note definition changes | A tooling migration that changes how flakes are counted breaks the series; start a new one rather than pretending it continues |
| Round honestly | 87.3 percent coverage implies a precision the measurement does not have |
