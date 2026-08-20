# Baseline Policy

Fill this in once and keep it with the visual tests. Most permanently-red visual suites are red because one of these questions was never answered.

---

## Generation environment

- **Baselines are generated in**: [container image, pinned by digest]
- **CI compares in**: [must be the same image]
- **Command to generate**: `[exact command]`
- **Laptop generation**: not permitted / permitted for [which subset]

The rule that matters: **baselines are generated in the same image that compares them.** A baseline produced on macOS and compared on a Linux runner differs on every text pixel, and no threshold fixes it honestly.

### Generating in a container

```bash
docker run --rm \
  -v "$(pwd):/work" -w /work \
  -e CI=true \
  mcr.microsoft.com/playwright:v1.56.0-noble \
  npx playwright test --grep @visual --update-snapshots
```

Pin the image tag to the same Playwright version as `package.json`. A browser version bump changes rendering, so treat it as a planned baseline refresh, not a surprise.

## Platform axes

Every axis multiplies the number of baseline files and the review burden. Add one only when the axis has produced a real defect.

| Axis | Values covered | Rationale |
| --- | --- | --- |
| Browser | [chromium] | [Firefox and WebKit rendering differences never caused an incident] |
| Viewport | [1280x720, 390x844] | [desktop and mobile layouts diverge] |
| Theme | [light, dark] | [dark theme tokens shipped separately] |
| Locale | [en-US] | [pl-PL text length overflow is covered by two specific snapshots, not the whole suite] |

Rule of thumb: total baselines = snapshots x browsers x viewports x themes x locales. Four axes at two values each is 16 files per snapshot. Justify each multiplication.

## Storage

- **Location**: [in repository under `tests/visual/__screenshots__` / hosted service]
- **Approximate size today**: [MB]
- **Growth policy**: [what triggers pruning]
- **Git LFS**: [yes / no]

In-repo storage is simpler to reason about and inflates clone size. A hosted service adds a dependency and gives a review UI. Either is fine; an undocumented choice is not.

## Update authority

- **Who may update baselines**: [role or team]
- **Required in the pull request**: rendered before-and-after images for every changed baseline
- **Bulk updates**: [prohibited / permitted only for a declared browser or design-system bump, with a named approver]

The failure this prevents: `--update-snapshots` run across the suite to clear a red build, which converts a regression into a baseline.

### Permitted bulk-update events

- Playwright or browser version bump
- Intentional design system release
- Font stack change

Each of these gets its own pull request that changes only baselines, so the diff is reviewable as a single intentional act.

## Refresh cadence

- **Browser image bump**: [quarterly / on Playwright release]
- **Full baseline audit**: [twice a year] - delete snapshots that have never failed and never caught anything

## Retention and artifacts

- **CI diff artifacts kept for**: [days]
- **Uploaded on**: failure only
- **Contains**: expected, actual, diff, plus the trace

## Coverage record

What this suite has actually caught. Keep it honest; it is the argument for continuing to pay for the suite.

| Date | Snapshot | What it caught |
| --- | --- | --- |
| [YYYY-MM-DD] | `checkout-summary.png` | [total row collapsed at 1280px after a grid change] |

If this table is empty after two quarters, the suite is a cost with no demonstrated benefit. Either the coverage is aimed at the wrong surfaces or visual testing is not the right tool here. Say so rather than letting it drift.
