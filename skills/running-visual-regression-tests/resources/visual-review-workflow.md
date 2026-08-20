# Visual Review Workflow

The process that keeps `--update-snapshots` from becoming a reflex. Every failing snapshot gets a verdict before any baseline is written.

## The three verdicts

| Verdict | Meaning | Action |
| --- | --- | --- |
| **Intended** | The code change was meant to change this appearance | Update the baseline in this pull request, with the diff image in the description |
| **Regression** | The appearance changed and should not have | File a bug, do not update the baseline, block the change |
| **Noise** | Neither; the suite is unstable | Back to stabilization; a threshold change is the last resort and gets recorded |

There is no fourth option. "Probably fine" is a regression until someone looks.

## Per-failure procedure

1. **Open the triplet.** Expected, actual, and diff, from the CI artifacts. Looking only at the diff image misses changes that the diff renders faintly.
2. **Name what changed.** In words: "the total row wrapped to two lines", "the primary button lost its border radius". If you cannot describe it, you have not looked closely enough to give a verdict.
3. **Trace it to a cause.** Which change in this pull request produces it? A diff nobody can trace to a change in the diff is usually noise, sometimes a shared-component change, and occasionally the interesting one.
4. **Give the verdict.** Record it against the snapshot name.
5. **Act on the verdict** per the table above.

## Pull request checklist

For any pull request that touches a baseline file:

- [ ] Every changed baseline has a verdict of **intended**, stated in the description
- [ ] The before-and-after images are visible to the reviewer without downloading artifacts
- [ ] The count of changed baselines is proportionate to the code change (a two-line CSS change that moves forty baselines needs an explanation)
- [ ] No baseline was updated for a test unrelated to this change
- [ ] Any new mask or raised threshold is recorded in the mask register or config comment
- [ ] The design change was reviewed by whoever owns the design, when the change is user-visible

### Description template

```markdown
## Visual changes

| Snapshot | Verdict | What changed | Approved by |
| --- | --- | --- | --- |
| `order-summary.png` | Intended | Total row moved below the divider per DES-412 | @designer |
| `checkout-full.png` | Intended | Knock-on from the order summary change | @designer |

<details>
<summary>Before and after</summary>

![before](url) ![after](url)

</details>
```

## Escalation to a bug

When the verdict is **regression**, hand off to `reporting-bugs` with:

- the three images attached
- the snapshot name and the test file
- the pull request or commit that introduced it
- the viewport, browser, and theme from the failing project
- what the change breaks for a user, in behavioural terms, not "pixels differ"

A visual bug report that says only "snapshot mismatch" gets closed as a test problem. Say what a user would experience.

## When the verdict is noise

Work down this list in order. Stop at the first one that fixes it.

1. Re-run three times on the same commit. Intermittent means Phase 1 stabilization is incomplete; go back to `masking-and-stabilization.md`.
2. Identify the varying element. The diff image usually localizes it.
3. Pin the source: fixed clock, seeded data, stubbed image, awaited font.
4. If it cannot be pinned, mask it and add a row to the mask register with what that stops covering.
5. Only if none of the above applies, raise `threshold` on that single snapshot with a comment naming the cause and the date.

Raising a global threshold is not on this list. A global loosening applies to every snapshot, including the ones that were working.

## Handling a design system release

A design system version bump legitimately changes many baselines at once. Keep it reviewable:

1. A dedicated pull request that changes only baselines and the dependency.
2. Baselines regenerated in CI, not locally.
3. A contact sheet of every changed snapshot in the description.
4. Spot-check a sample by hand: at least every layout-critical page, plus any snapshot whose diff area exceeds a few percent.
5. Design owner approval on the pull request.

The alternative, mixing a design system bump with feature work, produces a diff where nobody can tell which changes were intended.

## Quarterly audit

- **Never failed, never caught anything**: candidate for deletion. Record the decision.
- **Fails on unrelated pull requests more than a third of the time**: the surface is too broad. Split into region snapshots.
- **Masked more than twice**: the surface is wrong. Reconsider what is being covered.
- **Slowest snapshots**: full-page shots on long pages; consider whether the risk justifies them.
- **Update the coverage record** in `baseline-policy.md` with what the suite caught this quarter.
