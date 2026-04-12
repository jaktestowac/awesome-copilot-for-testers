---
name: designing-test-data
description: 'Designs realistic, boundary-heavy, and role-aware test data packs for manual and automated testing. Use when a feature needs deliberate inputs and fixtures before execution, when edge-case values keep being improvised, or when automation needs stable example data with setup notes.'
argument-hint: 'Entities, fields, constraints, roles, state combinations, and whether data is for manual or automated use'
user-invocable: true
---

# Designing Test Data

Use this skill when the team needs better inputs, not just more tests.
It helps turn vague "use some sample data" habits into deliberate datasets that exercise happy paths, failures, boundaries, and real workflow states.

## When to Use

- prepare test data before manual execution starts
- create stable fixtures for automation work
- design edge-case inputs from field constraints
- generate role-aware or state-aware data combinations
- replace improvised sample values with a reusable data catalog

## Data Design Rules

- **Derive from constraints, not vibes** - lengths, formats, ranges, relationships, and states drive good data.
- **Happy path is not enough** - pair realistic valid data with deliberate invalid and awkward values.
- **Synthetic first** - use safe, non-sensitive values unless the user explicitly provides approved test data.
- **Dependencies must be visible** - if a dataset requires setup, state it clearly.
- **Time and state matter** - dates, expirations, roles, and lifecycle states often create the real edge cases.

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

### Phase 3: Package the dataset

Use `./resources/test-data-catalog-template.md` when possible.

The output should make clear:

- what the record is for
- how to use it
- any setup dependencies
- whether it is better suited for manual or automated use

### Phase 4: Add handling notes

Before finishing, call out:

- seeding requirements
- cleanup expectations
- masking or privacy concerns
- values that should never be used outside safe test environments

## Common Failure Modes

- only generating happy-path data
- ignoring entity relationships or setup dependencies
- using realistic-looking but sensitive data carelessly
- forgetting state or role permutations
- writing data tables with no explanation of why each set exists

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
