# Anti-Metrics

Metrics that make things worse when tracked, and the mechanism by which each one does it.

## The rule underneath all of these

When a measure becomes a target, it ceases to be a good measure. Every proxy here is optimizable directly, and optimizing it directly is always cheaper than improving the thing it stands for. People are not being dishonest when this happens; they are responding to what is being asked.

## Never track these

### Bugs found per tester

**Mechanism**: rewards volume over depth. A tester who finds thirty cosmetic issues outscores one who finds a data-corruption defect that took a day to isolate. It also punishes testing an area that turns out to be solid, which is a valuable finding.

**Instead**: coverage against risk, and confidence per area from `planning-exploratory-testing`.

### Defects introduced per developer

**Mechanism**: makes people defensive about reproductions, discourages reporting, and pushes work toward safe changes. It also blames individuals for what is nearly always a system property.

**Instead**: change failure rate at the team level.

### Test count

**Mechanism**: incentivizes many shallow tests. One test that proves a behaviour beats twelve that assert `toBeDefined()`.

**Instead**: mutation score on high-risk modules.

### Coverage percentage as a gate

**Mechanism**: the cheapest way to raise it is to call code without asserting on it. A gate at 80 percent reliably produces a codebase at 80.4 percent with the risky parts among the uncovered 20.

**Instead**: coverage of changed lines as a review prompt rather than a hard gate, plus coverage against risk.

If a gate is politically required, gate on **coverage not decreasing** in the changed files. It is harder to game and closer to the intent.

### Automation percentage

**Mechanism**: rewards automating what is easy over what is risky. The stable, well-understood, rarely-broken areas automate quickly, so the percentage rises while the risky manual areas stay manual.

**Instead**: automation coverage of the top risk areas specifically, plus escape rate in automated areas.

### Zero known defects

**Mechanism**: creates pressure to close, downgrade, or reclassify rather than fix. The count goes to zero; the defects do not.

**Instead**: an open defect profile by impact, workaround, and detectability. See `assessing-release-readiness`.

### Sprint-boundary pass rate

**Mechanism**: makes quarantining and skipping the cheapest path to a green report on demo day.

**Instead**: pass rate trended continuously, always shown with the skip and quarantine counts.

---

## Metrics that are fine until a target is attached

These are useful to watch and harmful to target.

| Metric | Watch it | Do not target it | Because |
| --- | --- | --- | --- |
| Suite duration | yes | no | The fastest way to hit a duration target is deleting tests |
| Flake rate | yes | no | The fastest way to hit a flake target is quarantining |
| Coverage | yes | no | See above |
| Defects found | yes | no | Rewards shallow reporting |
| Velocity | not our concern | never | Not a quality metric in any form |

The distinction is whether a number appears in someone's objectives. A trend on a dashboard that prompts a conversation is healthy. The same number with a threshold attached to a performance review is not.

---

## Quarterly corruption check

Run these. Each one detects a specific way a metric has gone bad.

- [ ] **Coverage up, mutation score flat.** Tests are being written that execute code without verifying it.
- [ ] **Pass rate up, skip count up.** The bar is being cleared by removing hurdles.
- [ ] **Flake rate down, quarantine count up.** Same mechanism, different lever.
- [ ] **Suite duration down, test count down, escape rate up.** Tests that were catching things were deleted for speed.
- [ ] **Defect count down, production incidents flat.** Defects are being reclassified, not prevented.
- [ ] **Escape rate down, support ticket volume up.** Users have stopped reporting through the channel you measure.
- [ ] **A metric appears in an individual's objectives.** Retire it from reporting or remove it from the objectives; the two cannot coexist.
- [ ] **A metric nobody has acted on for two quarters.** Stop collecting it.

For any check that fires, write down what you saw and retire or redefine the metric. A corrupted metric that stays on the dashboard is worse than no metric, because it is trusted.

---

## When a stakeholder asks for a number you should not give

You will be asked for coverage percentage, bug counts, or automation percentage. Refusing outright rarely works; substituting usually does.

> "Coverage is 84 percent, and that number measures which lines run during tests, not which behaviours are verified. The number that answers your question is coverage against risk: payment and refunds are covered, the import path is a gap. Here is what closing that gap would take."

The pattern: give the number, state its caveat in one sentence, offer the metric that answers the underlying question, and attach a decision to it. Stakeholders are usually asking a legitimate question with the wrong instrument.
