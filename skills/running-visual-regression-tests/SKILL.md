---
name: running-visual-regression-tests
description: 'Sets up and maintains visual regression testing: what to snapshot, baseline strategy, masking dynamic regions, threshold tuning, containerized baselines, and the review-and-update workflow. Use when styling regressions escape to production, when snapshots fail on every machine or every run, when baselines are being updated without being looked at, or when deciding whether visual testing is the right tool at all.'
argument-hint: 'Pages or components to cover, the current snapshot setup if any, the CI platform, and the failure being investigated'
user-invocable: true
---

# Running Visual Regression Tests

Use this skill when appearance is the thing under test and functional assertions cannot express it: a broken layout at one breakpoint, a theme token that stopped applying, a component that shifted three pixels and swallowed a button.

Visual testing has one failure mode that dominates all others: a suite so noisy that `--update-snapshots` becomes reflex. At that point the baselines record whatever the code currently does, the diffs are never read, and the suite costs money while proving nothing. Everything below exists to prevent that.

## When to Use

- styling and layout regressions reach production while the functional suite stays green
- snapshots pass locally and fail in CI on every run
- baselines get regenerated wholesale because nobody can tell signal from noise
- a design system or theme change needs a blast-radius check
- deciding whether a case belongs in a visual test, an assertion, or an accessibility check

## Operating Principles

- **A visual test earns its place only if a functional assertion cannot do the job.** Text content, disabled state, and element presence are assertions, not pixels.
- **Determinism before comparison.** Fix fonts, animation, time, data, and viewport first. Threshold tuning applied to an unstable page hides real diffs along with the noise.
- **Baselines are generated in one environment.** The container that produces them is the container that compares them.
- **Every diff is looked at by a human before it becomes a baseline.** A bulk update with no review is the failure mode, not a shortcut.
- **Snapshot the smallest surface that carries the risk.** Component snapshots localize failures; full-page snapshots turn one change into forty red tests.
- **A masked region is a documented decision.** Masking is how the suite stays quiet, and also how coverage silently disappears.

## Workflow

### Phase 0: Decide whether pixels are the right tool

Run through this before writing anything.

| The risk | Right tool |
| --- | --- |
| Wrong text, wrong label, wrong count | Assertion |
| Element missing or disabled | Assertion |
| Contrast, focus order, ARIA | `auditing-accessibility` |
| Layout broken at a breakpoint | Visual |
| Theme token stopped applying | Visual |
| Component spacing drifted | Visual, component-level |
| Chart or canvas rendering | Visual, with a fixed data seed |
| Third-party embed changed | Neither; stub it and test your side |

If most rows land outside the visual column, say so and stop. A visual suite added to compensate for missing assertions makes both worse.

### Phase 1: Stabilize the page

Nothing about thresholds until this phase is finished. `./resources/masking-and-stabilization.md` has the code for each item.

- **Fonts**: wait for `document.fonts.ready`, or self-host and preload. A late webfont swap is the single most common cause of a one-off diff.
- **Animation and transitions**: disable globally via injected CSS or `animations: 'disabled'`.
- **Time**: pin the clock so relative timestamps stop moving. See `mocking-network-and-time`.
- **Data**: seed deterministically. A list ordered by an unstable sort key produces a real diff every run.
- **Network**: stub anything that varies, including avatars, ads, and telemetry.
- **Viewport and device scale**: set explicitly per project.
- **Scrollbars and caret**: hide them; they differ across platforms and focus states.
- **Randomized content**: ids, session tokens, generated names.

The completion criterion for this phase is concrete: **the same test run three times in a row on the same commit produces zero diffs.** Do not proceed until that holds.

### Phase 2: Choose the snapshot surface

| Surface | Use for | Cost of a change |
| --- | --- | --- |
| Component / story | Design system, shared UI | One test per affected component |
| Region (`locator.screenshot`) | A card, a header, a table | Localized |
| Full page | Layout and page composition | One shared-component change reddens every page |
| Full page, `fullPage: true` | Long-scroll layouts | Highest noise; lazy-loading and sticky headers add diffs |

Default to region-level. Add full-page snapshots for a small set of layout-critical routes, and know that they will be the noisiest tests in the suite.

### Phase 3: Set the baseline policy

Decide and record, using `./resources/baseline-policy.md`:

- **Where baselines are generated**: a container image pinned by digest, matching the CI runner. Locally generated baselines and CI comparison is the second most common cause of permanent redness.
- **Which platforms have baselines**: one per project (browser, viewport, theme, locale). Every added axis multiplies the file count and the review burden.
- **Where baselines live**: in the repository with the tests, or in a hosted service. In-repo is simpler and grows the repository; state which you chose.
- **Who may update them**: the rule that stops reflex updates. A pull request that changes baselines carries the rendered before-and-after in its description.

### Phase 4: Configure comparison

Start strict and loosen only against observed noise.

```ts
expect: {
  toHaveScreenshot: {
    maxDiffPixelRatio: 0.001,
    threshold: 0.2,          // per-pixel colour tolerance
    animations: 'disabled',
    caret: 'hide',
    scale: 'css',
  },
},
```

Rules for loosening:

- change one knob at a time and record which noise it addressed
- prefer masking a known-dynamic region over raising the global ratio
- a `maxDiffPixelRatio` above roughly 0.01 hides a missing button; if you need that much, go back to Phase 1
- never set a per-test tolerance without a comment naming the source of the noise

Config snippets, including the anti-aliasing and platform-difference cases, are in `./resources/visual-config-recipes.md`.

### Phase 5: Run the review workflow

The workflow in `./resources/visual-review-workflow.md`, in short:

1. CI produces the diff triplet (expected, actual, diff) as artifacts on failure.
2. A human opens the diff and reaches a verdict: **intended change**, **regression**, or **noise**.
3. Intended changes get their baselines updated in the same pull request as the code change, with the diff image visible to the reviewer.
4. Regressions become bugs. Hand off to `reporting-bugs`.
5. Noise goes back to Phase 1. Raising a threshold to silence noise is the last resort, and it is recorded.

The verdict is mandatory per failing test. "Updated all snapshots" without per-test verdicts is the anti-pattern this skill is written to prevent.

### Phase 6: Keep the suite affordable

Review periodically:

- snapshots that have never caught a regression and never failed: candidates for deletion
- snapshots that fail on more than a third of unrelated pull requests: too broad, split or mask
- total suite runtime and artifact storage
- baseline count per platform axis; drop axes that never diverge

A visual suite is worth its cost when it has caught something. Write down what it has caught.

## Common Failure Modes

- running `--update-snapshots` across the whole suite to clear a red build
- generating baselines on a developer laptop and comparing them on a Linux CI runner
- raising the diff ratio until the suite goes quiet, then discovering it no longer detects a missing element
- full-page snapshots of every route, so one header change produces forty failures with one cause
- masking a region and never recording why, until nobody knows what stopped being covered
- visual tests standing in for assertions the suite should have had
- baselines committed without the diff image visible in the pull request
- no artifact upload on failure, so the only way to see the diff is to reproduce it locally

## Resource Map

- `./resources/masking-and-stabilization.md` - fonts, animation, time, data, scrollbars, masking, and the three-identical-runs gate
- `./resources/baseline-policy.md` - where baselines are generated and stored, platform axes, update authority, containerized generation
- `./resources/visual-config-recipes.md` - Playwright config and per-test options, Docker baseline generation, CI artifact upload
- `./resources/visual-review-workflow.md` - the per-failure verdict process, pull request checklist, and escalation to a bug

## Related Skills

- `mocking-network-and-time` - when snapshot instability comes from live data or a moving clock
- `stabilizing-flaky-tests` (planned) - when the instability is timing rather than rendering
- `auditing-accessibility` - when the concern is contrast, focus, or semantics rather than appearance
- `ui-playwright-test-developer` (planned) - when the visual checks sit inside a wider browser suite
- `automating-ci-test-pipelines` (planned) - for baseline containers, artifact retention, and sharding the visual suite
- `reporting-bugs` - when a diff is confirmed as a regression

## Definition of Done

This skill is complete when:

- every visual test exists because an assertion could not cover the risk, and the alternative was considered
- three consecutive runs on an unchanged commit produce zero diffs
- baselines are generated in a pinned container that matches the comparison environment
- the snapshot surface is as small as the risk allows, and full-page snapshots are a deliberate short list
- comparison starts strict; every loosened threshold names the noise it addresses
- every masked region has a recorded reason and a note of what it stops covering
- failures produce expected, actual, and diff artifacts in CI
- each failing snapshot carries a per-test verdict of intended, regression, or noise before any baseline is written
