# Prioritization Matrix

Use this rubric to keep debt scoring consistent.
The goal is not mathematical precision; the goal is disciplined prioritization.

## 1. Severity

| Level | Meaning | Typical signal |
| --- | --- | --- |
| **S1** | Actively dangerous or blocking | security exposure, tests that cannot fail meaningfully, architecture preventing delivery |
| **S2** | Major drag on quality or velocity | recurring flaky suite, repeated regression source, blocked upgrade path |
| **S3** | Noticeable friction | duplication, awkward abstractions, repeated manual work |
| **S4** | Minor or cosmetic | low-risk cleanup that improves clarity but not delivery materially |

## 2. Risk of Remediation

| Level | Meaning | Typical characteristics |
| --- | --- | --- |
| **Low** | Safe, localized change | isolated module, good test safety net, small blast radius |
| **Medium** | Some coordination required | shared module, partial regression risk, moderate coupling |
| **High** | Non-trivial blast radius | cross-cutting refactor, behavioral uncertainty, weak test safety |

## 3. Effort

| Level | Meaning |
| --- | --- |
| **XS** | Minutes to a couple of hours |
| **S** | Small change set, usually within one PR |
| **M** | Multi-file change or some coordination |
| **L** | Multi-step effort across several areas |
| **XL** | Strategic initiative or staged program of work |

## 4. ROI

| Level | Meaning |
| --- | --- |
| **Low** | Nice cleanup, but modest business or engineering value |
| **Medium** | Meaningful reduction in friction, bugs, or maintenance cost |
| **High** | Major reduction in delivery drag, production risk, or test unreliability |

## 5. Time Horizon

| Level | Meaning |
| --- | --- |
| **Tactical** | Days |
| **Short-term** | Weeks |
| **Strategic** | Months |

## 6. Decision Buckets

| Bucket | When to use |
| --- | --- |
| **Fix Now** | High current cost or risk, and deferring is more dangerous than acting |
| **Fix Soon** | Important, but needs prep work, better timing, or more evidence |
| **Accept for Now** | Known debt, consciously deferred with rationale and revisit trigger |

## Practical heuristics

- **High ROI + Low/Medium effort** usually means quick win.
- **High severity + High remediation risk** usually needs staged work, not avoidance.
- **Low severity + High effort** is often a defer candidate unless it unlocks other work.
- **Test debt with high flakiness cost** should often be prioritized ahead of cosmetic code cleanup.
- **Blocked upgrades** often deserve more priority than they first appear because the cost compounds over time.

## Suggested sorting order

When presenting the debt register, sort primarily by:

1. severity
2. business or delivery impact
3. ROI
4. effort

This keeps the report focused on the most consequential debt, not merely the easiest cleanup.
