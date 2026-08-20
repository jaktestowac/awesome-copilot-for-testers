# Data Handling Checklist

## Per artifact type

| Artifact | What it can contain | Default control | Retention |
| --- | --- | --- | --- |
| Fixture files | Whatever was put there | Synthetic only; reviewed at pull request | Lives with the repository |
| Seeded database | Whatever the seed script inserts | Generated; wiped on a schedule | Refresh cadence, documented |
| HAR files | Full request and response bodies, headers, cookies | Auth headers stripped; recorded against synthetic data | Refresh date recorded |
| Playwright trace | Every request, response, and a screenshot per step | On failure only; treated as sensitive | 7 to 14 days |
| Video | Everything shown on screen | On failure only | 7 to 14 days |
| Screenshot | Whatever is on the page | Synthetic data, or masked regions | 7 to 14 days |
| CI logs | Anything printed, including config dumps | No body logging at debug level; masking verified | Platform default, checked |
| Test report HTML | All of the above, bundled | Hosting access reviewed | Set explicitly |
| Coverage report | Source paths only | No control needed | Any |
| Bug report attachments | Whatever the reporter attached | Reviewed before filing | Lives with the ticket |

The last row is worth a habit: a screenshot pasted into a bug report is the most common way real customer data leaves a controlled environment, because it feels like communication rather than data handling.

## Before merging a change that touches test data

- [ ] No real names, emails, phone numbers, or addresses in any new fixture
- [ ] No credentials, tokens, or keys, including in comments and example code
- [ ] Any new HAR file has been stripped of auth headers and cookies
- [ ] Any new free-text fixture content is generated, not copied from a real record
- [ ] New generated data uses reserved domains and reserved phone ranges
- [ ] Any new data field is classified, and quasi-identifiers assessed in combination
- [ ] `.env` was not staged (check `git status` before committing, not after)

## Before seeding an environment from production

- [ ] The specific constraint that generated data cannot satisfy is named
- [ ] Transformation runs inside the production boundary
- [ ] The transformation is irreversible, with no retained mapping
- [ ] Quasi-identifiers are generalized, not just direct identifiers replaced
- [ ] Free-text fields are dropped or replaced wholesale
- [ ] Outlier records are suppressed
- [ ] Referential integrity verified after transformation
- [ ] Re-identification check run, with the result recorded
- [ ] Approval recorded: who authorized it
- [ ] Deletion date set and owned

## Before enabling artifact upload in CI

- [ ] Retention period set explicitly, not left at the default
- [ ] Access to the artifact store reviewed: who can download
- [ ] Capture is on failure only, not on every run
- [ ] Test data in the artifacts is synthetic
- [ ] Log masking verified on a real run

## Quarterly review

- [ ] Every environment listed, with the date its data was last refreshed
- [ ] Any production-derived dataset past its deletion date is deleted
- [ ] Fixture files scanned for anything that looks real
- [ ] Secret rotation schedule checked against the last-rotated dates
- [ ] Artifact retention periods still match policy
- [ ] New data fields since the last review have been classified

## Incident: personal data found where it should not be

1. **Contain**: restrict access to the artifact, environment, or repository location.
2. **Assess**: what data, how many records, how long it has been there, who could have accessed it.
3. **Notify**: the data protection owner, immediately. Notification obligations have short clocks and are not the test team's to judge.
4. **Remove**: delete the data, and rotate any exposed credential.
5. **Trace**: how did it get there. Almost always a missing control rather than an individual mistake.
6. **Fix the path**: the control that would have prevented it, not a reminder to be careful.

Step 3 is not optional and not a judgement call for the tester. Report it and let the owner decide.

## The one-line policy

If it is worth writing a single line into the test suite README, this is it:

> Test data is generated, never copied from production. Secrets come from the vault, never from a file in this repository. Artifacts are captured on failure, expire in 14 days, and contain only synthetic data.

Three sentences a contributor can hold in their head. Everything else in this skill exists to make those three true.
