# Charter Templates

A charter is a mission for one timeboxed session. It states where to look, what to look with, and what to find out. It never says which buttons to press.

## The format

> **Explore** [target]
> **With** [resources]
> **To discover** [information]

Each clause does work:

- **Target** bounds the session. One area, not a feature set.
- **Resources** constrain it usefully: a role, a data condition, a device, a network profile, a tool. The constraint is what makes the session different from the last one over the same area.
- **To discover** is the completion criterion. A reader should be able to tell whether the session answered it.

## Worked charters

### New feature, requirements still moving

> **Explore** the saved-payment-method flow
> **With** a returning customer who has two cards, one expired
> **To discover** how the UI behaves when the default card cannot be charged, and whether the failure is recoverable without leaving checkout

### After a bug fix, sweeping for siblings

> **Explore** all currency-formatted fields in the order history
> **With** a `pl-PL` locale account and orders in EUR, PLN, and USD
> **To discover** whether the rounding bug fixed in the order total appears anywhere else that formats money

### Integration with a system you do not own

> **Explore** the address autocomplete integration
> **With** the provider throttled to 3G and then blocked entirely
> **To discover** whether the form remains usable and submittable when the provider is slow or absent

### Legacy area with no documentation

> **Explore** the bulk import screen
> **With** the largest CSV file we have seen in production, plus one with a malformed row in the middle
> **To discover** what the failure modes are, what the user is told, and whether partial imports leave consistent data

### Risk sweep before a release

> **Explore** the top three user journeys on the release candidate
> **With** a fresh account, a long-standing account, and an account mid-subscription-change
> **To discover** anything that would embarrass us on release day, prioritizing the paths the changelog touched

### Cross-cutting quality attribute

> **Explore** the checkout flow on a mid-range Android device over a throttled connection
> **With** Chrome DevTools network throttling and CPU 4x slowdown
> **To discover** whether any step becomes unusable, and where the perceived delay is worst

### Data-oriented

> **Explore** the customer search
> **With** names containing apostrophes, non-Latin scripts, right-to-left text, and 255-character values
> **To discover** where search, display, and export disagree about the same record

### Authorization-oriented

> **Explore** the admin panel routes
> **With** a standard-user session token replayed against admin endpoints
> **To discover** whether any route relies on the UI hiding it rather than on server-side checks

Hand findings from this last one to `testing-application-security` and read its authorization gate before running it.

## Charter smells

| Smell | Why it fails | Fix |
| --- | --- | --- |
| Numbered steps in the charter | It is a test case, and it removes the exploring | State the mission, let the tester design in the moment |
| "Explore the application" | Unbounded, so the session ends when interest ends | Pick one area |
| "To discover bugs" | Every charter discovers bugs; says nothing | Name the specific risk or question |
| No resource clause | Two sessions over the same area repeat each other | Add a role, a data condition, or an environment |
| Expected results listed | Presumes the answer, so the surprise gets filtered out | Delete them |
| Three areas joined by "and" | Notes become unusable | Split into three charters |
| Written after the session | It is a report, not a charter | Write it first, even briefly |

## Prioritizing

Sort charters into three buckets and record which is which:

- **Must run** - the risk is real, the area changed, and the cost of a miss is high
- **Run if time** - meaningful coverage, lower stakes
- **Backlog** - worth doing eventually; not this cycle

Prioritize by **risk**, which is roughly impact times uncertainty:

| Signal | Raises priority |
| --- | --- |
| Changed in this release | yes |
| Touched by a shared component or config change | yes |
| Carries money, personal data, or permissions | yes |
| Historically defect-dense | yes |
| No automated coverage | yes |
| Recently rewritten or migrated | yes |
| Third-party dependency involved | yes |
| Stable for a year, untouched, well covered | no |

Five well-aimed charters beat twenty that tile the surface evenly. Even tiling is what a test case inventory is for.

## Sizing

| Timebox | Use for |
| --- | --- |
| 45 min (short) | A narrow charter, a sibling sweep after a fix, a quick smoke of a candidate |
| 60 min (normal) | The default |
| 90 min (long) | A complex area needing setup, or a first pass at something unfamiliar |

Beyond 90 minutes, note-taking quality falls and the charter has usually drifted. Split it.

Budget realistically: a 60-minute session where 25 minutes go to environment setup covers about half a session. Track the split and report it; it is often the strongest argument for fixing the test environment.
