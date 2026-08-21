# Risk Profiles

The profile is the risk class of the system. It decides the requirement level of every practice in the catalog and the metric thresholds that go with it. Pick exactly one, and write down the sentence that justifies it.

## Choosing a profile

Ask these five questions. Answers push upward, never downward — one serious "yes" is enough to move a profile up.

| Question | Pushes toward |
| --- | --- |
| Who is harmed by a defect, and how badly? | External paying users or the public → higher |
| Is there regulatory, contractual, or audit exposure? (finance, health, public sector, GDPR-heavy, SOC2) | Any → `critical-regulated` |
| Does it touch money, personal data, credentials, or safety? | Any → higher |
| How fast can a bad release be undone? | Not in minutes → higher |
| Would a silent wrong answer be worse than an outage? | Yes → higher |

The last question is the one teams forget. A crash gets paged; a wrong balance gets invoiced.

## `critical-regulated`

Regulated, safety-relevant, or money-moving systems. Failures are expensive, externally visible, or legally consequential.

- Most automated practices are MUST. Human-centric practices are MUST but attested, never auto-passed.
- Intent debt is enforced: high-risk changes must carry a recorded rationale.
- Waivers need a named owner and a short expiry; MUST practices are non-waivable, full stop.
- Release evidence is expected to survive an audit, meaning it is written down and dated.

Metric thresholds: diff coverage ≥ 80%, no critical or high SAST findings, no known high-severity vulnerable dependencies, mutation score tracked with a floor, performance thresholds tied to stated SLOs.

## `standard`

The default. Normal business logic and APIs, real users, ordinary oversight. Most product work lives here.

- Core dev-gate practices are MUST; deeper verification is SHOULD; exotic techniques are COULD.
- Intent debt is recommended, not enforced — a WARN, not a blocker.
- Waivers are allowed on SHOULD practices with reason, owner, and expiry.

Metric thresholds: diff coverage ≥ 75%, no critical SAST findings, no known critical vulnerable dependencies, flake rate < 1%, suite duration monitored.

## `prototype-internal`

Prototypes, spikes, internal tools with a handful of known users, anything explicitly disposable. Choosing this profile is a statement that the code is not load-bearing.

- A thin MUST set: lint, typecheck, a few tests on the logic that matters, secret scanning.
- Most verification practices are COULD. Optimise for iteration speed and for not leaking credentials.
- The honest risk: prototypes get promoted. Record the promotion trigger — "if this gets external users, re-derive at `standard`" — inside the contract, so the upgrade has a tripwire instead of a surprise.

Metric thresholds: no coverage floor, secret scanning still MUST, dependency audit advisory.

## Metric override table

Thresholds are contract terms, not defaults to inherit silently. State them in the contract even where they match.

| Metric | `prototype-internal` | `standard` | `critical-regulated` |
| --- | --- | --- | --- |
| Diff coverage (changed lines) | none | ≥ 75% | ≥ 80% |
| Repo coverage direction | none | must not decrease | must not decrease |
| SAST | advisory | block critical | block critical + high |
| Dependency audit | advisory | block critical | block critical + high |
| Secret scan | block | block | block |
| Flake rate | none | < 1% | < 0.5% |
| Mutation score | none | tracked | tracked with a floor |
| Accessibility | none | WCAG 2.2 AA on key flows | WCAG 2.2 AA, attested |

## Anti-patterns

- **Aspirational profiling.** Choosing `critical-regulated` because it sounds responsible. The result is an unsatisfiable contract that gets ignored, which is strictly worse than an honest `standard`.
- **Defensive profiling.** Choosing `prototype-internal` for something with paying users so the gates stay quiet. Name it and re-derive.
- **Per-practice profiling.** Mixing profiles row by row until the contract means nothing. One profile per contract; use waivers for genuine exceptions.
- **Monorepo single-profiling.** A repo containing a payment service and a docs site does not have one profile. Derive per package and say so.
