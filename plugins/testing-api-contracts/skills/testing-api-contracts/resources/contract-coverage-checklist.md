# Contract Coverage Checklist

Work through this per endpoint. A contract covered only by its happy path is covered by roughly a third.

## Per endpoint

### Success responses

- [ ] Documented 2xx status with a fully populated body
- [ ] Every documented 2xx status, not only the first one (201 and 204 exist too)
- [ ] `204 No Content` returns no body, and the test asserts the body is empty rather than ignoring it

### Collection shapes

- [ ] Non-empty collection
- [ ] **Empty collection**, with the envelope intact (`items: []`, `total: 0`, cursor present or null per spec)
- [ ] Single-item collection, when the client renders it differently
- [ ] Collection at the documented maximum page size

### Field-level cases

- [ ] Every **nullable** field observed actually null at least once
- [ ] Every **optional** field observed absent at least once, distinct from null
- [ ] Every **enum** member observed at least once across the suite
- [ ] Fields at their documented **maximum length**
- [ ] Numeric fields at their documented minimum, maximum, and zero
- [ ] Fields with a documented **format** (`uuid`, `date-time`, `email`, `uri`) validated by format, not by regex you invented
- [ ] Unicode content in free-text fields, including a right-to-left string and an emoji

### Error responses

- [ ] One test per documented 4xx status
- [ ] The documented 5xx shape, provoked or stubbed
- [ ] Validation error body carries the documented field-level detail structure
- [ ] Unauthenticated request returns the documented status and body
- [ ] Authenticated-but-unauthorized request returns the documented status, and it differs from unauthenticated where the spec says it does

### Pagination

- [ ] First page
- [ ] Middle page
- [ ] Last page, with the terminal cursor or `hasMore: false`
- [ ] Page beyond the end
- [ ] Invalid page parameter

### Undocumented behaviour

- [ ] Response keys compared against the schema's declared properties, extras reported
- [ ] Response headers that clients depend on are documented (`ETag`, `Location`, `Retry-After`, rate-limit headers)

## Per spec

- [ ] Every path in the spec has at least one validated response
- [ ] Every path the service actually serves appears in the spec (compare against a route dump or access logs)
- [ ] Shared components (`$ref` targets) are validated everywhere they are used, not once
- [ ] Auth schemes described in the spec match what the service enforces

## Reporting the gaps

For each unchecked box, record one of:

- **Covered elsewhere** - name the test
- **Not applicable** - say why (no nullable fields on this endpoint)
- **Gap** - carry into the report's "not covered" section

An unchecked box with no note is the same as an untested endpoint that looks tested.

## Automation candidates

These are worth generating rather than hand-writing:

| Case | How |
| --- | --- |
| Every enum member | Generate one request per member from the spec |
| Boundary values | Derive from `minLength`, `maxLength`, `minimum`, `maximum` |
| Required-field-missing requests | Omit each required field in turn, expect the documented 4xx |
| Type-confusion requests | Send a string where a number is required, expect the documented 4xx |
| Full-surface smoke | Property-based fuzzing against the spec (Schemathesis, `fast-check` plus a generator) |

Property-based fuzzing finds spec violations faster than hand-written cases, and produces failures that need triage. Budget for the triage before turning it on.
