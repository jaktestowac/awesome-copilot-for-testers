# Severity Matrix

| Severity | Use when                                                                                                   | Typical impact                         |
| -------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Critical | The core flow is blocked, data is lost or corrupted, or there is a serious security or compliance exposure | Release blocker                        |
| High     | A major feature is broken and users have no realistic workaround                                           | Should block release or hotfix quickly |
| Medium   | The issue is real but users can continue with a workaround or partial degradation                          | Fix in the current cycle               |
| Low      | The issue is minor, cosmetic, or limited to low-impact paths                                               | Fix when practical                     |

## Severity reminders

- Grade the impact, not the emotional reaction.
- Intermittent bugs can still be high severity if the impact is severe.
- If unsure between two levels, explain the trade-off in one sentence.
