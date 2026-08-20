# Tag Glossary

Tags are a control surface: they decide what runs, when, and for whom. Undocumented, they decay into personal shorthand and CI filters start excluding things nobody intended.

One row per tag. A tag with no row does not exist.

---

# Tags

| Tag | Meaning | Runs where | Who may add it |
| --- | --- | --- | --- |
| `@smoke` | The suite that must pass before anything else is worth running. Under 60 seconds total. | Every push, first job | Anyone, with review |
| `@critical` | Covers a journey whose failure blocks a release | Every push, nightly | QA lead |
| `@regression` | Full suite. The default for a new test. | Nightly, pre-release | Anyone |
| `@visual` | Snapshot comparison | Nightly, and on demand | Anyone |
| `@slow` | Takes over 30 seconds by itself | Nightly only | Anyone |
| `@flaky` | Known unstable, quarantined, has an expiry date | Reported, never blocks | QA lead only |
| `@payments` | Touches the payment provider | Excluded when the sandbox is down | Anyone |
| `@destructive` | Mutates shared state and cannot run in parallel | Serial project only | QA lead |
| `@manual` | Documented as a manual case, not automated | Never; documentation only | Anyone |

## Rules

- **Every E2E test carries exactly one priority tag** (`@smoke`, `@critical`, or `@regression`). A test with none is invisible to every filter; a test with two is ambiguous.
- **Capability tags stack freely** (`@payments`, `@visual`, `@slow`).
- **`@flaky` requires an issue link and an expiry date** in the test body. A quarantine past its expiry is fixed or deleted, never extended silently.
- **A new tag needs a row here in the same pull request.** A tag introduced without a row is a filter that will surprise someone.
- **Retire tags that stop being used.** A tag matching zero tests is a CI filter waiting to silently select nothing.

## Spelling

```ts
test('rejects an expired card @critical @payments', async ({ page }) => { ... });
```

Or, with Playwright's tag option:

```ts
test('rejects an expired card', { tag: ['@critical', '@payments'] }, async ({ page }) => { ... });
```

Pick one form and use it everywhere. The `--grep` filter matches title text, so mixing the two forms works but makes the tests harder to search.

## CI filter mapping

Keep this table next to the tag table. It is what makes a tag's consequence visible.

| Workflow | Filter | Effect |
| --- | --- | --- |
| `ci.yml` fast job | `--grep @smoke` | About 12 tests, 40 seconds |
| `ci.yml` main job | `--grep-invert "@slow\|@flaky\|@manual"` | Everything except the excluded |
| `nightly.yml` | no filter, `--grep-invert @manual` | Full suite |
| `pre-release.yml` | `--grep "@critical\|@payments"` | The release gate |

The dangerous pattern to check for: a `--grep-invert` chain that has grown until it excludes a third of the suite, with nobody noticing. Count what each filter actually selects and put the number in the table.

## Audit

Quarterly:

- [ ] Count the tests each tag selects. A tag selecting zero is dead; remove it.
- [ ] Check that every `@smoke` test still runs inside the stated budget.
- [ ] Check `@flaky` expiry dates. Past-due entries are fixed or deleted.
- [ ] Confirm each CI filter still selects roughly what the table claims.
- [ ] Look for tests with no priority tag.

```bash
# Tests with no priority tag
npx playwright test --list --grep-invert "@smoke|@critical|@regression"

# Count per tag
for t in smoke critical regression visual slow flaky; do
  printf "%-12s %s\n" "@$t" "$(npx playwright test --list --grep "@$t" | grep -c '^\s')"
done
```
