# Generation and Anonymization Recipes

Generation first, because it is safer and usually easier. Transformation second, for the cases where real shape is genuinely required.

## Synthetic generation

### Seeded and deterministic

A failure has to reproduce. Fix the seed.

```ts
import { faker } from '@faker-js/faker';

faker.seed(20260820);

export function makeCustomer(overrides: Partial<Customer> = {}): Customer {
  const first = faker.person.firstName();
  const last = faker.person.lastName();

  return {
    id: faker.string.uuid(),
    firstName: first,
    lastName: last,
    // Reserved domain: cannot reach a real inbox, obviously fake on inspection
    email: `${first}.${last}@example.com`.toLowerCase(),
    // Reserved UK range for fiction; use your locale's equivalent
    phone: `+44 7700 900${faker.string.numeric(3)}`,
    dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
    ...overrides,
  };
}
```

Rules for generated values:

- **reserved ranges**, so nothing can accidentally reach a real person: `@example.com`, `@example.org`, UK `07700 900xxx`, US `555-01xx`
- **obviously fake on inspection**, so nobody mistakes a fixture for a real record during an incident
- **valid where the system validates**: correct checksums, plausible formats, real-looking postcodes for the locale
- **overridable**, so a test can pin the one field it cares about and leave the rest generated

### Covering the awkward cases

Generated data defaults to well-behaved, which is exactly the data that finds no bugs.

```ts
export const nameEdgeCases = [
  "O'Brien",                    // apostrophe
  'van der Berg',               // spaces and lowercase particles
  'Müller-Schmidt',             // diacritics and hyphen
  '李明',                        // CJK
  'محمد',                       // right-to-left
  'Nguyễn',                     // combining diacritics
  'a'.repeat(255),              // maximum length
  'A',                          // minimum length
  'Robert👨‍👩‍👧‍👦',                    // multi-codepoint emoji
];
```

Coverage decisions belong to `designing-test-data`. What this file adds: these values are safe by construction, which real names are not.

### Matching production distributions without production data

For load and reporting tests that need realistic shape.

```ts
// Derived from aggregate statistics, which are not personal data.
// Source: analytics export, 2026-07, no record-level access.
const cartSizeDistribution = [
  { size: 1, weight: 0.38 },
  { size: 2, weight: 0.24 },
  { size: 3, weight: 0.15 },
  { size: 5, weight: 0.13 },
  { size: 12, weight: 0.08 },
  { size: 47, weight: 0.02 },   // the long tail that breaks pagination
];
```

Aggregate statistics let you match the shape without copying anything. This satisfies most of what teams believe requires a production copy.

### Referential integrity in generated data

```ts
export function makeOrderGraph(seed: number) {
  faker.seed(seed);

  const customer = makeCustomer();
  const addresses = [makeAddress({ customerId: customer.id })];
  const orders = Array.from({ length: 3 }, () =>
    makeOrder({ customerId: customer.id, shippingAddressId: addresses[0].id }),
  );

  return { customer, addresses, orders };
}
```

Build the graph in one factory. Tests that assemble a customer here and an order there produce dangling references, and the failure looks like a product bug.

---

## Transforming production data

Only when a specific constraint cannot be met by generation. Name that constraint before starting.

### Non-negotiables

1. **Transform inside the production boundary.** The untransformed copy never lands anywhere less protected.
2. **Irreversible.** No mapping table, no key, no encryption that someone holds a key for. If it can be reversed, it is pseudonymization and the data is still personal data.
3. **Deterministic per source value**, so referential integrity survives: the same input maps to the same output everywhere.
4. **Generalize quasi-identifiers**, not just direct ones.
5. **Verify afterwards** with a re-identification attempt.

### Deterministic replacement

```sql
-- Same input, same output: foreign keys stay consistent across tables.
-- The salt is generated at run time and discarded, so the mapping is unrecoverable.
UPDATE customers SET
  email      = 'user-' || substr(md5(email || :run_salt), 1, 12) || '@example.com',
  first_name = 'First' || substr(md5(id::text || :run_salt), 1, 6),
  last_name  = 'Last'  || substr(md5(id::text || :run_salt), 1, 6),
  phone      = '+44 7700 900' || lpad((abs(hashtext(id::text)) % 1000)::text, 3, '0');
```

Discarding the salt is what makes it irreversible. A salt stored "in case we need to map back" defeats the whole exercise.

### Generalizing quasi-identifiers

```sql
UPDATE customers SET
  -- Date of birth to year, then to a band for the over-89 tail
  date_of_birth = CASE
    WHEN age(date_of_birth) > interval '89 years' THEN date '1930-01-01'
    ELSE date_trunc('year', date_of_birth)
  END,
  -- Postcode to outward code only
  postcode = split_part(postcode, ' ', 1),
  -- Exact timestamps to date
  created_at = date_trunc('day', created_at);
```

Skipping this step is the most common anonymization failure. Names replaced, birth dates and postcodes intact, and the dataset is re-identifiable.

### Free text: drop, do not scrub

```sql
-- Right
UPDATE support_tickets SET body = 'Redacted for test environment.';

-- Wrong: a regex finds the formats you anticipated and nothing else
UPDATE support_tickets SET body = regexp_replace(body, '\d{3}-\d{2}-\d{4}', 'XXX-XX-XXXX', 'g');
```

A ticket body can contain a national id, a phone number written in an unexpected format, a health condition in prose, or a photograph reference. There is no pattern set that covers it.

If tests need realistic text, generate it.

### Suppressing outliers

A record that is unique in the dataset is identifiable even with every direct identifier removed. The customer with 4,000 orders is one person, and everyone in the company knows which.

```sql
-- Remove records unique on the quasi-identifier combination
DELETE FROM customers c
WHERE (
  SELECT count(*) FROM customers c2
  WHERE c2.postcode = c.postcode
    AND c2.date_of_birth = c.date_of_birth
    AND c2.country = c.country
) < 5;
```

That threshold is k-anonymity with k=5. Choose k with the data protection owner, not by preference.

### Referential integrity checklist

After transformation, before release:

- [ ] Foreign keys resolve
- [ ] Emails are unique where the schema requires it
- [ ] Formats still satisfy application validation
- [ ] Aggregates the tests rely on are preserved
- [ ] Ordering and pagination behave as before
- [ ] Search indexes rebuilt

A transformation that breaks integrity produces test failures that look like product defects and cost days.

---

## The re-identification check

Run it before the dataset is used, and record the result.

1. Take a random sample of 20 records.
2. Using only quasi-identifiers, attempt to match them against any other source you plausibly have: a public dataset, an internal directory, a social profile, the company's own CRM.
3. Count the successes.
4. Compute k-anonymity: the smallest group size across quasi-identifier combinations.
5. Look specifically for outliers: extreme values, unusual combinations, records with rare attributes.

**Any successful re-identification means the pipeline is not finished.** Fix and re-run rather than noting it as a limitation.

Record the outcome:

```markdown
## Re-identification check, 2026-08-20

- Sample: 20 of 180,000 records
- Sources attempted: internal employee directory, a public electoral register extract
- Re-identified: 0
- Minimum k across quasi-identifier combinations: 7
- Outliers found and suppressed: 3 records with order counts above 500
- Verified by: [name]
- Dataset deletion date: 2026-11-20
- Owner: [name]
```
