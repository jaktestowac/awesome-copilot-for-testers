# Residual Risk Register

Every risk the release carries knowingly. A risk that is not written down is not accepted, it is forgotten.

## Entry format

---

### R-[n]: [short name]

- **What could go wrong**: [in user terms, not system terms. "Customers are charged twice", not "idempotency key collision"]
- **Why we think it might**: [the evidence gap, the untested path, the known defect]
- **Likelihood**: [High / Medium / Low] because [basis]
- **Impact**: [High / Medium / Low] because [who is affected and how badly]
- **Detection**: [how we would find out, and how fast]
- **Response**: [what we do when it happens, and who does it]
- **Time to recover**: [measured, or estimated and labelled as an estimate]
- **Accepted by**: [name and role]
- **Accepted on**: [date]

---

## Scales

Use these so two people mean the same thing.

### Likelihood

| Level | Meaning |
| --- | --- |
| High | We expect this to occur in the first days after release |
| Medium | Plausible under normal traffic; depends on a condition we know exists |
| Low | Requires an unusual combination we have not observed |

State the basis. "Low, because it needs a user with more than 10k orders and there are four such accounts" is assessable. "Low" alone is a guess with a label.

### Impact

| Level | Meaning |
| --- | --- |
| High | Money lost, data corrupted or exposed, a core journey unusable, regulatory exposure |
| Medium | A journey degraded with a workaround, or a non-core feature broken |
| Low | Cosmetic, or affects an internal-only path |

### Detection

The dimension most often left out, and the one that decides how bad a Medium/Medium risk really is.

| Level | Meaning |
| --- | --- |
| Immediate | An alert fires; someone is paged |
| Fast | Visible on a dashboard someone checks daily |
| Slow | Surfaces through support tickets |
| Blind | Only found by chance or by an audit |

**Blind detection promotes a risk one level.** A medium-impact defect that nobody can see is not a medium risk.

## Ranking

Rank by the combination, not by impact alone:

1. Blind detection, any impact above Low
2. High impact, any likelihood, slow detection
3. High likelihood, medium impact, no workaround
4. Everything else

The reason: a big obvious failure gets fixed in an hour. A small invisible one runs for a quarter.

## Acceptance

An entry without a named acceptor is incomplete. The acceptor is the person who owns the consequence: usually a product owner or engineering manager, not the tester who wrote the register.

State the trade in one sentence in the acceptance note so it is legible later:

> Accepted the migration-duration risk to hit the campaign date, on the basis that the maintenance window can be extended by an hour and the reversal script exists.

Six months later, that sentence is what makes the decision reviewable. "Accepted by [name]" alone is not.

## Worked entries

---

### R-1: Migration exceeds the maintenance window

- **What could go wrong**: The site stays in maintenance mode past the announced window; customers cannot order during a campaign morning.
- **Why we think it might**: The migration was timed on 2k rows and ran in 40 seconds. Production has 4.1M rows and the operation is not linear in row count.
- **Likelihood**: Medium, because the query plan changes above roughly 1M rows and nobody has profiled it at that size.
- **Impact**: High, because it lands on a campaign launch morning.
- **Detection**: Immediate. The migration runner reports progress and the window is being watched.
- **Response**: Abort and run the reversal script; postpone to the following night.
- **Time to recover**: Estimated 20 minutes, not measured. The reversal has never been executed.
- **Accepted by**: [name], Engineering Manager
- **Accepted on**: 2026-08-20

---

### R-2: Discount codes silently ignored above 1000 PLN (BUG-812)

- **What could go wrong**: A customer applies a valid discount, is charged the full amount, and only notices on the receipt.
- **Why we think it might**: Confirmed defect, reproducible, present in the candidate.
- **Likelihood**: Medium. Roughly 2 percent of orders exceed 1000 PLN, and about a third of those use a code.
- **Impact**: Medium per customer, and it is a trust and refund cost rather than an outage.
- **Detection**: **Blind.** There is no alert on discount-application rate. We would learn from support tickets, days later.
- **Response**: Fix forward in the next patch; support issues manual refunds against a saved query.
- **Time to recover**: Patch in about two days; refunds are manual.
- **Accepted by**: [name], Product Owner
- **Accepted on**: 2026-08-20

Note the promotion rule: blind detection makes R-2 rank above several higher-impact risks that would be caught in minutes.

---

## After the release

Close the loop. For each entry, record within a week:

- did it occur
- was detection as fast as predicted
- was the response as effective as planned
- what would you change in the next register

A register that is never reviewed after release trains the team to write optimistic likelihoods. Feed the results into `analyzing-quality-metrics` so the prediction quality itself becomes visible over time.
