---
name: handling-sensitive-test-data
description: 'Keeps test data legally and operationally safe: classifies personal data, replaces production copies with synthetic or anonymized fixtures, manages secrets in local runs and CI, strips personal data from traces and HAR files, and sets retention rules. Use when tests run against a production data copy, when fixtures contain real names or emails, when a data protection review is coming, or when test artifacts might carry personal data into CI logs.'
argument-hint: 'Test suite and its data sources, whether production data is involved, applicable regime (GDPR, HIPAA, PCI), and where artifacts are stored'
user-invocable: true
---

# Handling Sensitive Test Data

Use this skill when the data a test suite touches would matter if it leaked.

Test environments are where personal data goes to be forgotten about. A production dump copied to staging "just for this migration" outlives the migration by years; a HAR fixture recorded from a real session carries a real session token into the repository; a failing test uploads a screenshot of a customer's address to a CI artifact store with public read access. None of these are exotic. All of them are the ordinary result of nobody having decided anything.

This skill is about doing testing work safely. It is not legal advice, and where a regime's specific obligations are in play, the data protection owner decides, not the tester.

## When to Use

- a test environment is seeded from a production dump
- fixtures contain real names, emails, phone numbers, or addresses
- HAR files, traces, videos, or screenshots are committed or uploaded to CI
- secrets are needed for local runs and nobody knows where they should live
- a data protection review, audit, or certification is coming
- a test suite is being set up for a product handling health, financial, or identity data

## Operating Principles

- **Synthetic first.** Generated data that satisfies the same constraints is safer than any transformation of real data, and usually easier to reason about.
- **Anonymization is a claim that must survive re-identification.** Replacing a name while keeping a date of birth, postcode, and purchase history re-identifies most people. Assess the combination, not the field.
- **Minimize before you protect.** The safest record is the one you did not copy. Take the smallest slice that makes the test work.
- **Artifacts leak.** Traces, HARs, videos, screenshots, and logs all capture whatever was on screen or on the wire. They need the same treatment as fixtures.
- **Secrets never enter the repository, the trace, or the log.** Not in a fixture, not in a URL, not in a committed `.env`.
- **Retention is a decision, not a default.** Data with no deletion date accumulates until an incident finds it.

## Workflow

### Phase 0: Inventory what the suite touches

List every place data lives, including the ones that are not obviously data:

- fixture files and factories
- seeded databases and their source
- recorded HAR files and network fixtures
- CI artifacts: traces, videos, screenshots, logs, coverage
- test reports and their hosting
- local `.env` files and developer machines
- third-party services the tests send data to

The artifacts are where teams are surprised. A Playwright trace holds every request body, every response, and a screenshot of every step.

### Phase 1: Classify

Use `./resources/pii-classification.md` to sort what you found:

| Class | Examples | Handling |
| --- | --- | --- |
| **Direct identifiers** | Name, email, phone, national id, account number | Never in test data |
| **Quasi-identifiers** | Date of birth, postcode, gender, job title, timestamps | Dangerous in combination; three are usually enough to re-identify |
| **Special category** | Health, biometrics, ethnicity, religion, sexual orientation, trade union membership | Strictest handling; usually forbidden outside production |
| **Financial** | Card numbers, IBANs, transaction records | PCI scope; use provider test values only |
| **Credentials** | Passwords, tokens, keys, session cookies | Never committed, never in artifacts |
| **Business confidential** | Pricing, contracts, internal metrics | Handled per company policy |

The quasi-identifier row is the one that gets missed. Anonymizing names while keeping birth date and postcode is not anonymization.

### Phase 2: Choose the data strategy

Ranked by safety. Take the highest one that works.

| Strategy | Safety | Cost | Use when |
| --- | --- | --- | --- |
| **Synthetic, generated** | Highest | Building factories | Default for everything |
| **Synthetic, shaped by production statistics** | High | Analysis of distributions | Load tests, realistic volume |
| **Anonymized production copy** | Medium | Pipeline plus verification | Migration and reporting tests that need real shape |
| **Pseudonymized production copy** | Low | Key management | Almost never; the mapping is itself personal data |
| **Raw production copy** | None | None | Never |

If the answer lands below synthetic, write down the specific test that cannot be satisfied by generated data. Usually there is one real constraint, such as a data distribution or a legacy record shape, and it can be met by generating data with that property rather than by copying.

### Phase 3: Build the synthetic path

`./resources/anonymization-recipes.md` covers both generation and transformation.

For generated data:

- **seeded and deterministic**, so a failure reproduces
- **satisfying the real constraints**: valid checksums where the system validates them, plausible lengths, correct formats
- **including the awkward cases**: apostrophes in names, non-Latin scripts, right-to-left text, very long values, plausible-but-invalid inputs
- **obviously fake on inspection**: use reserved domains (`@example.com`), reserved phone ranges, and provider test card numbers, so nobody mistakes a fixture for a real customer
- **built through factories**, not copied literals, so a change to the shape is a one-place edit

Hand the coverage side of this to `designing-test-data`. This skill owns the safety side; that one owns whether the values exercise the right cases.

### Phase 4: If production data is unavoidable

Then it goes through a pipeline with a verification step, never a manual pass. `./resources/anonymization-recipes.md` has the transformations. Non-negotiables:

- **the transformation runs before the data leaves the production boundary**, not after it lands in staging
- **it is irreversible**: no key kept anywhere that could reverse it
- **it preserves referential integrity**, or the tests fail for reasons that have nothing to do with the code
- **quasi-identifiers are generalized**, not just direct ones: date of birth to year, postcode to area, exact timestamps to day
- **free-text fields are dropped or replaced**, never pattern-scrubbed. A support ticket body contains anything, and a regex will not find all of it.
- **a re-identification check runs afterwards**: sample records and attempt to re-identify them using the quasi-identifiers that remain

Record the approval: who authorized the copy, what the retention period is, and who deletes it.

### Phase 5: Secrets

`./resources/secrets-in-ci.md` in full. The rules:

- `.env` is gitignored, and `.env.example` carries the keys with no values
- secrets come from the CI secret store, never from committed files or workflow literals
- a secret in a URL ends up in logs, referrer headers, and traces; put it in a header
- CI logs are masked, and masking is verified on a real run rather than assumed
- test accounts have the least privilege the test needs and are not shared with production
- pull requests from forks do not get secrets, which is a default worth keeping
- rotation has an owner and a schedule

A secret scanner in CI is the backstop, not the control. Assume it will miss the one that matters.

### Phase 6: Sanitize the artifacts

The step most suites skip entirely.

- **Traces and videos**: capture on failure only; treat them as containing whatever the test saw
- **HAR files**: strip `Authorization`, `Cookie`, and `Set-Cookie` headers and any personal data in bodies before committing
- **Screenshots**: mask fields showing personal data, or use synthetic data so there is nothing to mask
- **Logs**: no request or response bodies at debug level in CI, and no tokens in assertion messages
- **Reports**: check where the HTML report is hosted and who can read it
- **Retention**: set an artifact expiry; the default is often longer than anyone assumes

`./resources/data-handling-checklist.md` has a per-artifact-type table.

### Phase 7: Set retention and review

- **artifacts**: days, set in CI configuration
- **seeded environments**: refreshed and wiped on a schedule
- **anonymized copies**: deletion date recorded at creation, with an owner
- **local developer data**: a documented way to wipe it
- **review cadence**: at least when the data model changes, since a new field is a new classification

## Common Failure Modes

- a production dump copied to staging for a one-off task, still there two years later
- anonymizing names while keeping date of birth, postcode, and transaction history
- pattern-scrubbing free-text fields and calling the result anonymized
- HAR files committed with live session tokens
- CI artifacts holding traces of real customer data, with default retention and broad read access
- a `.env` file committed once, then removed in a later commit and still in git history
- secrets passed as URL parameters, so they land in access logs
- shared test accounts with production-level privileges
- a screenshot in a bug report showing a real customer's details
- no retention, so every environment accumulates data indefinitely

## Resource Map

- `./resources/pii-classification.md` - classification table, the quasi-identifier problem, and regime-specific notes for GDPR, HIPAA, and PCI
- `./resources/anonymization-recipes.md` - synthetic generation patterns, transformation techniques, referential integrity, and the re-identification check
- `./resources/secrets-in-ci.md` - env files, CI secret stores, masking verification, fork policy, rotation, and scanning
- `./resources/data-handling-checklist.md` - per-artifact-type handling, retention defaults, and a pre-merge checklist

## Related Skills

- `designing-test-data` - for whether the data covers the right cases; this skill covers whether it is safe
- `mocking-network-and-time` - when recorded HAR fixtures need sanitizing before they are committed
- `running-visual-regression-tests` - when baselines and diff images show personal data
- `testing-application-security` - when the concern moves from data handling to whether the application protects it
- `documenting-test-suites` - to record the data rules where contributors will find them
- `reporting-bugs` - when evidence attached to a report contains personal data

## Definition of Done

This skill is complete when:

- every place the suite touches data is inventoried, including CI artifacts
- each data element is classified, with quasi-identifiers assessed in combination rather than individually
- the data strategy is the highest-safety option that works, and any step below synthetic names the specific constraint that forced it
- generated data is seeded, constraint-satisfying, and obviously fake on inspection
- any production-derived copy went through an irreversible pipeline with a re-identification check, and has a recorded owner and deletion date
- no secret exists in the repository, its history, a URL, a log, or an artifact
- CI log masking has been verified on a real run
- artifacts are sanitized or generated from synthetic data, with retention set explicitly
- the rules are written where a contributor will find them before they break one
