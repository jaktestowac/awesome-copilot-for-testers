---
name: designing-test-data
description: 'Generates boundary values, creates role-based user fixtures, and produces grouped test data catalogs with setup and cleanup scripts. Use when a feature needs deliberate test inputs before execution, when edge-case or mock data is being improvised instead of planned, or when automation requires stable sample data, dummy records, or seed fixtures with environment notes.'
argument-hint: 'Entities, fields, constraints, roles, state combinations, and whether data is for manual or automated use'
user-invocable: true
---

# Designing Test Data

Use this skill when the team needs better inputs, not just more tests.
It helps turn vague "use some sample data" habits into deliberate datasets that exercise happy paths, failures, boundaries, and real workflow states.

## When to Use

- Prepare deliberate test data before manual execution starts
- Build stable fixtures and seed data for automation suites
- Derive edge-case inputs from field constraints and business rules
- Generate role-aware or state-aware data combinations across workflows
- Replace improvised sample values with a reusable, grouped data catalog

## Data Design Rules

- **Derive from constraints, not vibes** - lengths, formats, ranges, relationships, and states drive good data.
- **Happy path is not enough** - pair realistic valid data with deliberate invalid and awkward values.
- **Synthetic first** - use safe, non-sensitive values unless the user explicitly provides approved test data.
- **Dependencies must be visible** - if a dataset requires setup, state it clearly.
- **Time and state matter** - dates, expirations, roles, and lifecycle states often create the real edge cases.
- **Every set needs a reason** - never dump data tables without explaining why each group exists and what it exercises.

## Workflow

### Phase 0: Frame the target

Clarify the data goal:

- manual execution support
- automation fixture design
- boundary testing
- negative validation
- role or state combinations

Identify the core entities involved.

### Phase 1: Map the constraints

For each entity or field, capture what matters:

- required vs optional
- type and format
- minimum, maximum, and off-by-one limits
- allowed values or enums
- uniqueness or relationship rules
- lifecycle state or permission dependencies

If constraints are not fully known, list assumptions instead of fabricating precision.

### Phase 2: Build the data categories

Generate values across these buckets where relevant:

- **Typical valid data** - realistic and reusable
- **Boundary values** - min, max, zero, empty, whitespace, off-by-one
- **Invalid format data** - malformed, wrong type, disallowed characters
- **Role and state combinations** - guest, user, admin, active, suspended, expired, pending
- **Temporal data** - past, future, leap day, expiry edge, timezone-sensitive values
- **Stress or awkward data** - long strings, Unicode, duplicate keys, near-collision values

**Example — User Registration data pack (excerpt):**

| # | Username | Email | Age | Role | Purpose |
|---|----------|-------|-----|------|---------|
| 1 | `jane_doe` | `jane@example.com` | 25 | user | Typical valid record |
| 2 | `ab` | `a@b.co` | 18 | user | Boundary — minimum length and minimum age |
| 3 | `""` | `not-an-email` | -1 | guest | Invalid — empty name, bad format, negative age |
| 4 | `admin_root` | `admin@example.com` | 65 | admin | Role escalation + upper-age boundary |

### Phase 3: Package the dataset

Use `./resources/test-data-catalog-template.md` for full formatting. Minimal catalog structure:

```markdown
## Scope
- Feature / flow: [target]
- Intended use: manual / automation / both

## Data Sets
| ID | Entity | Category | Example values | Purpose | Setup |
|----|--------|----------|---------------|---------|-------|
| TD-001 | User | valid | standard active user | baseline | seed account |
| TD-002 | User | boundary | max-length name, empty optional | validation edges | same role |

## Role and State Combinations
| ID | Role | State | Why it matters |
|----|------|-------|----------------|
| RSC-001 | guest | new session | public path coverage |

## Notes
- Cleanup: [reset steps]
- Masking: [safe-data reminder]
```

Each record must make clear what it is for, how to use it, any setup dependencies, and whether it suits manual or automated use.

### Phase 4: Add handling notes

Before finishing, call out:

- seeding requirements
- cleanup expectations
- masking or privacy concerns
- values that should never be used outside safe test environments

## Resource Map

- `./resources/test-data-catalog-template.md` - structure for grouped test data packs and setup notes

## Related Skills

- `designing-functional-tests` - when the data pack should map directly to scenarios or cases
- `api-playwright-test-developer` - when the dataset needs to become automation fixtures or API payloads
- `reporting-bugs` - when broken data handling should be captured as a defect
- `verifying-acceptance-criteria` - when data assumptions affect readiness verdicts

## Definition of Done

This skill is complete when:

- core entities and constraints are visible
- data is grouped by purpose rather than dumped randomly
- edge cases are included intentionally
- dependencies and cleanup notes are explicit
- the final dataset is ready for real QA use
