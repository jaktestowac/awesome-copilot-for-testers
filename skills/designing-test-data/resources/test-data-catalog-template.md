# Test Data Catalog

## 1. Scope

- Feature / flow: [what this data supports]
- Intended use: manual / automation / both
- Environment notes: [dev / stage / seeded sandbox]

## 2. Data sets

| Data Set ID | Entity / field set | Category | Example values                          | Purpose             | Setup / dependencies             |
| ----------- | ------------------ | -------- | --------------------------------------- | ------------------- | -------------------------------- |
| TD-001      | [User profile]     | valid    | [standard active user]                  | baseline happy path | [seed account]                   |
| TD-002      | [User profile]     | boundary | [max length name, empty optional field] | validation edges    | [same role as TD-001]            |
| TD-003      | [Promo code]       | invalid  | [expired, malformed, duplicate]         | negative validation | [cart and pricing rules enabled] |

## 3. Role and state combinations

| Combination ID | Role  | State                | Why it matters                   |
| -------------- | ----- | -------------------- | -------------------------------- |
| RSC-001        | guest | new session          | [public path coverage]           |
| RSC-002        | user  | expired subscription | [authorization / downgrade edge] |
| RSC-003        | admin | locked item          | [privileged recovery path]       |

## 4. Notes

- Cleanup: [what to remove or reset after use]
- Masking / privacy: [safe-data reminder]
- Open questions: [unknown constraints or assumptions]
