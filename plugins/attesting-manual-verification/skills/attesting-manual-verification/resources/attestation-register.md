# Attestation Register

Lives next to the quality contract: `.qa/attestations.md`, with a machine copy under `attestations:` in `.qa/quality-contract.yaml` if gate tooling reads it.

---

# Attestation Register - <project>

**Current scope:** release 2026.08 (build `a3f91c2`) · **Reviewed:** 2026-08-21

| Practice                  | Scope           | Attested by           | Date       | Outcome                                      | Limitations                                                         | Expires         | State                                                                      |
| ------------------------- | --------------- | --------------------- | ---------- | -------------------------------------------- | ------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------- |
| `exploratory-testing`     | build `a3f91c2` | @piotr                | 2026-08-19 | 3 defects (QA-441/442/443), 1 usability note | Chrome desktop only; no mobile, no Safari, no guest checkout        | next release    | ATTESTED                                                                   |
| `uat`                     | release 2026.08 | @anna (product owner) | 2026-08-20 | Accepted with QA-442 deferred                | Refund flow accepted on staging data, not production-shaped volumes | this release    | ATTESTED                                                                   |
| `manual-accessibility`    | checkout flow   | @maria                | 2026-07-02 | 2 blockers fixed, 1 AA contrast issue open   | Keyboard + NVDA on Windows; no VoiceOver, no zoom testing           | release 2026.07 | **STALE** - scope was the previous release                                 |
| `code-review`             | all merged PRs  | -                     | -          | -                                            | -                                                                   | -               | UNATTESTED - branch protection exists, but that is a process, not a record |
| `observability-readiness` | release 2026.08 | -                     | -          | -                                            | -                                                                   | -               | UNATTESTED                                                                 |

## Findings

- **`manual-accessibility` is stale.** The last pass covered release 2026.07 and the checkout flow has changed since. Either re-run it or waive it for this release with an owner and a date.
- **`code-review` is unattested at the change level.** Branch protection requiring one approval proves the process exists; it does not record that any specific high-risk change was understood. If per-change evidence is wanted, use `Comprehension-Attested-by:` trailers.
- **`observability-readiness` has no record** and the release adds a new endpoint and a new external dependency - both new failure modes.

## Machine-readable form

```yaml
attestations:
  - practice: exploratory-testing
    scope: 'build:a3f91c2'
    attested_by: '@piotr'
    date: 2026-08-19
    evidence: '.qa/sessions/2026-08-19-checkout-charter.md'
    outcome: '3 defects (QA-441, QA-442, QA-443), 1 usability note'
    limitations: 'Chrome desktop only; no mobile, no Safari, no guest checkout'
    expires: 'next-release'
```

## Per-practice guidance

### `code-review`

- **Attests:** a named human other than the author reviewed this change and can explain it.
- **Evidence:** the review itself; for high-risk changes, a `Comprehension-Attested-by:` trailer that survives the merge.
- **Do not derive it** from branch protection, from a merged state, or from an approving click with no comments.
- **Scope:** per change range. A release-level "all PRs were reviewed" attestation says nothing about the one that mattered.

### `exploratory-testing`

- **Attests:** timeboxed session-based testing happened against a named build.
- **Evidence:** charter, session notes, defect list, screen recording (see `planning-exploratory-testing`).
- **Limitations to state:** browsers, devices, roles, data variants, and flows not covered. This is the field release managers actually read.
- **Scope:** per build. Exploratory findings do not transfer across builds.

### `uat`

- **Attests:** the business owner accepts the feature against its acceptance criteria.
- **Evidence:** the criteria, the result per criterion (`verifying-acceptance-criteria`), and the acceptance message with a name.
- **Limitations to state:** environment, data realism, which criteria were deferred rather than met.
- **Attester:** the business owner or their named delegate. Not QA, not the developer.

### `manual-accessibility`

- **Attests:** a human verified flows with keyboard and a screen reader.
- **Evidence:** the pass record, findings, and which assistive technology and platform combination was used (`auditing-accessibility`).
- **Limitations to state:** the AT/platform combinations not tried, zoom and reflow, cognitive-load checks not performed.
- **Note:** an automated axe run is not this attestation. Automation catches roughly a third of WCAG issues, and none of the ones about whether the flow makes sense.

### `ux-review`

- **Attests:** someone judged whether the flow is usable, not merely functional.
- **Evidence:** review notes, annotated screenshots, findings with severity.

### `observability-readiness`

- **Attests:** a human confirmed the failure modes that matter are detectable in production.
- **Evidence:** the list of failure modes with, for each, the log/metric/trace/alert that would reveal it - and any with nothing.
- **Limitations to state:** failure modes accepted as undetectable, and by whom.

### `groundedness-review`

- **Attests:** a human checked AI output against its sources, claim by claim, on a sample.
- **Evidence:** the sample, the per-claim verdicts, the hallucination classes found (`reviewing-ai-output-groundedness`).
- **Limitations to state:** sample size and how it was selected; a convenience sample is not a random one.

## Expiry and staleness

| Expiry value   | Means                                        |
| -------------- | -------------------------------------------- |
| `this-release` | valid for the named release only             |
| `next-release` | carries forward once, then must be renewed   |
| a date         | valid until that date regardless of releases |
| `scope-change` | invalid as soon as the attested area changes |

Staleness rules:

- An attestation whose **scope** has changed is stale, even if its date is recent. A checkout accessibility pass does not survive a checkout redesign.
- An attestation whose **attester** has left is stale for audit purposes - nobody can answer questions about it.
- **A stale attestation is worse than none**, because it reads as coverage. Treat it as UNATTESTED and say why.

## Feeding a release pack

`assessing-release-readiness` should be able to lift this straight in:

```
Human verification for release 2026.08

  ATTESTED    exploratory-testing  @piotr 2026-08-19  (Chrome desktop only)
  ATTESTED    uat                  @anna  2026-08-20  (staging data volumes)
  STALE       manual-accessibility  last pass covered 2026.07, checkout changed since
  UNATTESTED  observability-readiness  - release adds a new endpoint and dependency
  UNATTESTED  code-review (per-change)  - process exists, no per-change record

  Residual risk from human verification: accessibility of the redesigned checkout
  is unverified this release, and no one has confirmed the new refund endpoint's
  failure modes are detectable in production.
```

That last paragraph is the point of the whole register. Two lines that a release decision can actually use, derived from records rather than from impressions.
