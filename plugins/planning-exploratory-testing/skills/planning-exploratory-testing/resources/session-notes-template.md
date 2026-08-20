# Session Notes

Written during the session, not reconstructed after. Notes made from memory lose the detours and the surprises, which are the parts a scripted approach could not have produced.

---

# Session: [charter title]

- **Charter**: Explore [target] with [resources] to discover [information]
- **Heuristics**: [SFDIPOT elements, tours, quality criteria named up front]
- **Tester**: [name]
- **Date and timebox**: [YYYY-MM-DD], [45 / 60 / 90] minutes
- **Build**: [version, commit, or deployment id]
- **Environment**: [URL, environment name, browser, device, network profile]
- **Accounts and data**: [roles, seeded fixtures, account ids]

## Time split

| Activity | Share |
| --- | --- |
| Test design and execution | [%] |
| Bug investigation and reporting | [%] |
| Setup and environment | [%] |

Estimate at the end. When setup exceeds roughly 30 percent, that is itself a finding worth reporting.

## Notes

Chronological. One line per observation, with the time.

```
09:04  Seeded account acc-2214, two saved cards, one expired 2024-06.
09:07  Checkout with default (expired) card -> generic "Payment failed", no mention of expiry.
09:09  Retry with the same card -> same message. No prompt to choose another card.
09:12  QUESTION: is the customer expected to know to go to Settings to change the default?
09:15  Changed card in Settings, returned to checkout via back button -> old card still selected.
09:16  BUG-1 candidate: checkout caches the payment method across a settings change.
09:22  Hard refresh -> correct card appears. Evidence: har/checkout-stale-card.har, screenshot 09-15.png
09:26  DETOUR: following the caching thread instead of the expiry messaging. Dropping the 3G part of the charter.
09:41  Same caching behaviour on the address selector. Wider than payment.
09:48  Could not reproduce on a fresh session. Needs the settings-change-then-back sequence. 3 of 4 attempts.
```

Conventions that make notes readable later:

- `BUG-n` for a defect candidate
- `QUESTION:` for something needing a requirement owner
- `DETOUR:` when leaving the charter, and what was dropped to do it
- `BLOCKED:` when the environment stops the session
- `IDEA:` for a test worth running later but not now
- evidence filename inline, next to the observation it supports

## Bugs found

| Ref | Summary | Severity | Reproducible | Evidence | Filed as |
| --- | --- | --- | --- | --- | --- |
| BUG-1 | Checkout keeps the previously selected card after it is changed in Settings | High | 3 of 4 attempts, needs back-button return | `har/checkout-stale-card.har`, `09-15.png` | [issue link] |

Route these through `reporting-bugs` rather than pasting the note into a tracker.

## Questions raised

| Question | Who can answer | Blocking |
| --- | --- | --- |
| Should an expired default card be surfaced before checkout? | Product owner | No |
| Is the settings-to-checkout cache intentional for performance? | Frontend lead | Yes, decides whether BUG-1 is a bug |

## Coverage reached

| Area | Depth | Confidence |
| --- | --- | --- |
| Payment method selection | Deep | Medium; caching behaviour understood, edge cases open |
| Expired card messaging | Shallow | Low; only the generic path seen |
| Throttled network behaviour | Not covered | None; dropped for the caching detour |

Confidence is the tester's judgement, stated plainly. "Low" with a reason is more useful than a percentage.

## Automation candidates

| Scenario | Why it deserves a permanent test | Level |
| --- | --- | --- |
| Change default card in Settings, return to checkout, verify the new card is selected | Regression-prone, cheap to automate, money path | E2E |
| Expired card produces a specific error mentioning expiry | Contract with the payment provider, currently generic | API + E2E |

Not every finding earns a test. State the reason for each one that does.

## Next charter

- [what should be explored next, and why]

---

# Coverage summary across sessions

For a report spanning several sessions, aggregate rather than concatenating notes.

## Sessions

| Charter | Priority | Status | Minutes | Tester |
| --- | --- | --- | --- | --- |
| Saved payment methods | Must | Done | 60 | [name] |
| Address autocomplete under failure | Must | Done | 45 | [name] |
| Bulk import failure modes | If time | Not run | - | - |

- Charters planned: [n], run: [n], outstanding: [n]
- Total session time: [n] minutes
- Aggregate split: design [%], investigation [%], setup [%]

## Areas and confidence

| Area | Sessions | Confidence | Basis |
| --- | --- | --- | --- |
| Checkout payment | 2 | Medium | Two deep sessions, one open question blocking |
| Bulk import | 0 | None | Not explored this cycle |

## Deliberately not covered

- [area], because [reason: out of scope, no environment, deferred to next cycle]

This section is what makes the report usable in a release decision. Hand it to `assessing-release-readiness`.
