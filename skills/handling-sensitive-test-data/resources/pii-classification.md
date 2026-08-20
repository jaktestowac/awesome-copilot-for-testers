# Classifying Test Data

Classify per field, then reassess in combination. Most re-identification failures come from fields that look harmless individually.

## Classes

### Direct identifiers

Identify a person on their own.

Name, email, phone, postal address, national identification number, passport number, driving licence, account number, customer id where it is externally meaningful, IP address in most jurisdictions, device identifiers, photographs, biometric templates, signatures.

**Handling**: never in test data. Replace with generated values.

### Quasi-identifiers

Harmless alone, identifying in combination.

Date of birth, postcode, gender, job title, employer, exact timestamps, purchase history, geolocation, browser fingerprint attributes, first three digits of a phone number, rare medical conditions, unusual account attributes.

**Handling**: generalize, do not just replace. Date of birth becomes a year, postcode becomes an area, exact timestamps become dates.

**Why this matters**: the combination of birth date, postcode, and gender is enough to uniquely identify the large majority of a population. This is the finding that broke several published "anonymized" datasets, and it is the reason a name-replacement pipeline is not anonymization.

Assess **k-anonymity** in a released dataset: for every combination of quasi-identifiers present, at least k records share it. A combination matching a single record is a re-identification.

### Special category data

Under GDPR Article 9 and equivalents elsewhere: racial or ethnic origin, political opinions, religious or philosophical beliefs, trade union membership, genetic data, biometric data used for identification, health data, sex life or sexual orientation.

**Handling**: strictest. Generally must not leave production. If a test needs the shape, generate it; do not transform real records.

Note that some fields carry it implicitly: a pharmacy order line, a clinic name in an address field, a support ticket subject.

### Financial data

Card numbers, CVV, IBAN, sort codes, transaction records, credit scores, salary.

**Handling**: PCI DSS scope. Use the payment provider's published test values only, never a real card number even one that belongs to you. A card number in a test environment brings that environment into PCI scope, which is an expensive accident.

Standard provider test values are designed to be safe and to trigger specific responses:

| Number | Provider convention | Behaviour |
| --- | --- | --- |
| `4242 4242 4242 4242` | Visa test | Succeeds |
| `4000 0000 0000 0002` | Visa test | Declined |
| `4000 0000 0000 9995` | Visa test | Insufficient funds |

Check the current list in your provider's documentation rather than copying from memory.

### Credentials

Passwords, API keys, tokens, session cookies, private keys, connection strings, webhook signing secrets.

**Handling**: never committed, never in artifacts, never in logs. See `secrets-in-ci.md`.

A credential in git history is compromised even after the file is deleted. Rotate it; do not just remove it.

### Business confidential

Pricing rules, contract terms, internal metrics, unreleased features, customer lists.

**Handling**: per company policy, but the practical rule is the same: do not put it in a fixture that ships in a repository more people can read than should.

---

## Regime notes

Not legal advice. These are the practical implications for a test suite; the data protection owner decides the obligations.

### GDPR and equivalents

- Test data derived from production is still processing, and needs a lawful basis. "We are only testing" is not one.
- **Purpose limitation**: data collected to provide a service is not automatically usable for testing.
- **Storage limitation**: a test copy needs a deletion date at creation.
- **Data minimization**: take the smallest slice that works, not the whole table because it was easier.
- Anonymized data falls outside the regulation. Pseudonymized data does not, because the mapping makes it reversible. This distinction decides whether your pipeline solved the problem or moved it.
- A data subject's deletion request extends to test environments holding their data, which is a strong practical argument for never putting it there.

### HIPAA

- The Safe Harbor method lists 18 identifiers to remove, including all dates more precise than a year, all ages over 89, and geographic subdivisions smaller than a state.
- The alternative is expert determination, which is a formal process, not a judgement call by the test team.
- Test environments holding protected health information are in scope for the same controls as production.

### PCI DSS

- Real card data must not be used for testing, at all.
- A system storing card data is in scope, and scope is expensive.
- Use provider test values, and confirm the environment never receives a real number, including through a form a tester might fill in by habit.

---

## Classification worksheet

Per data source in the suite.

| Field | Class | In test data? | Strategy | Note |
| --- | --- | --- | --- | --- |
| `customer.name` | Direct | Generated | Faker with a fixed seed | |
| `customer.email` | Direct | Generated | `user-{n}@example.com` | Reserved domain, cannot reach a real inbox |
| `customer.dob` | Quasi | Generalized | Year only, or a fixed date per age band | |
| `customer.postcode` | Quasi | Generalized | Area only (`SW1`), or fixed test values | |
| `order.total` | Business | Generated | Distribution matched to production | |
| `order.card_last4` | Financial | Generated | Provider test values | |
| `ticket.body` | **Unknown** | **Dropped** | Free text can contain anything | Never pattern-scrub |
| `session.token` | Credential | Never | Generated per run | Stripped from HAR fixtures |

The free-text row deserves the attention. A support ticket body, a note field, or a description can contain a national id, a phone number, a health condition, or all three. Pattern-based scrubbing finds the formats you thought of. Drop the field or replace it wholesale with generated text.

## The quick test

Before committing a fixture or seeding an environment, ask:

1. If this file were published, would anyone be harmed?
2. Could I identify a real person from it, using anything else I might plausibly have?
3. Does any value here also work against production?
4. Would I be comfortable showing this in a conference talk?

A "no" to question 3 and a "yes" to question 4 is the target state.
