# Go / No-Go Report

---

# Release readiness: [product] [version]

- **Build**: [version, commit sha, artifact id]
- **Deployed to**: [environment] on [date]
- **Scope**: [what changed, one paragraph, from the changelog]
- **Affects**: [all users / cohort / region / internal]
- **Mechanism**: [big bang / staged / flagged / canary]
- **Target date**: [date], driven by [reason]
- **Assessed by**: [name], on [date]

## Recommendation

> **[Go / Go with conditions / No-go / Cannot assess]**

[One paragraph. What the evidence supports, what it does not, and the single most important thing the decision-maker should weigh.]

**Conditions** (when applicable):

1. [condition, and who confirms it]
2. [condition, and who confirms it]

**Unblocking** (for a no-go):

- [exactly what would change the recommendation, and roughly how long it takes]

## 1. Exit criteria

| Criterion | Status | Evidence |
| --- | --- | --- |
| All P0 and P1 defects in scope closed | Met | [tracker query link] |
| Regression suite green on the candidate | Met | [run link], 412 passed, 0 failed, 3 skipped |
| Skipped tests reviewed | **Unverified** | No one has looked at the 3 skips |
| New acceptance criteria verified | Met | [AC verification matrix link] |
| Migration tested on production-sized data | **Not met** | Tested on 2k rows; production has 4.1M |
| Rollback executed end to end | **Not met** | Plan written, never run |

Criteria source: [agreed in sprint planning / derived at assessment time].

## 2. Open defects in scope

| Id | Summary | Sev | Journey | Frequency | Workaround | Detectable in prod | Reversible |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BUG-812 | Discount code silently ignored above 1000 PLN | Medium | Checkout | ~2% of orders | None the user can find | No alert exists | Fix forward |
| BUG-903 | Admin export truncates at 10k rows | Low | Admin | Rare | Filter and export twice | No | Fix forward |

BUG-812 is medium severity and the highest actual risk here: main journey, no workaround, invisible to monitoring, and it costs money silently.

## 3. Coverage against risk

| Risk area | Evidence | Type | Verdict |
| --- | --- | --- | --- |
| Payment capture | 14 API, 3 E2E, 1 exploratory session | Automated + manual | Covered |
| Discount calculation | 6 unit tests | Automated, unit only | **Thin** |
| Data migration | Small-dataset run only | Automated | **Gap** |
| Refund path | Untouched by this release, 8 E2E | Automated | Covered |

**Would this suite have caught the last three production incidents?** [Yes / No, and which one it would have missed.]

## 4. Operational readiness

| Area | Status | Note |
| --- | --- | --- |
| Environment parity | **Divergent** | Stage has 2k orders; production has 4.1M. Migration timing unknown. |
| Migrations | Forward tested, backward untested | Reversal script exists, never executed |
| Feature flags | Ready | `new_discount_engine` default off; both states tested |
| Configuration and secrets | Ready | Verified present in production config |
| Third-party dependencies | Ready | Payment provider API version unchanged |
| Monitoring and alerting | **Gap** | No alert on discount-application rate |
| Support readiness | Ready | Known issues sent to support on [date] |
| Rollback | **Untested** | Written, time-to-recover estimated at 20 min, never executed |

## 5. Residual risk

See `risk-register.md` for the full entries. Summary:

| Risk | Likelihood | Impact | Detection | Accepted by |
| --- | --- | --- | --- | --- |
| Migration exceeds the maintenance window on production data | Medium | High | Immediate, visible | [name] |
| BUG-812 costs revenue silently until a customer reports it | Medium | Medium | Slow, no alert | [name] |

## 6. Not assessed

- [what was outside scope, and why]
- [what could not be assessed, and what it would take]

## 7. If we ship anyway

For a "go with conditions" or an overruled no-go, state the operating plan:

- **Watch**: [which metric, which dashboard, for how long]
- **Trigger to roll back**: [specific threshold, not "if it looks bad"]
- **Who is watching**: [name, and during which hours]
- **Escalation**: [who to call]

---

# Hotfix variant

For a same-day fix, the full report is too slow. The minimum that is still honest:

## Hotfix readiness: [id]

- **Fixes**: [defect id and one line]
- **Change**: [files or components touched, one line]
- **Blast radius**: [from `analyzing-regression-scope`, or state that it was not run]
- **Evidence**: [the specific tests run, and their result]
- **Not tested**: [the honest list]
- **Rollback**: [mechanism, and whether it has been used before]
- **Recommendation**: [go / go with conditions / no-go]
- **Watching**: [metric and person]

Four lines of honest "not tested" beat a full report nobody had time to write. What must not be dropped, even under time pressure, is the "not tested" line and the rollback line.
