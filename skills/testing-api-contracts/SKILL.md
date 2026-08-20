---
name: testing-api-contracts
description: 'Validates API responses against OpenAPI or JSON Schema, detects breaking changes between spec versions, and builds consumer-driven contract checks. Use when an API has a published spec, when a backend change might break a client, when API tests assert only status codes, or when mocked fixtures need a guard against drifting from the real service.'
argument-hint: 'OpenAPI or JSON Schema path or URL, the endpoints in scope, consumer or provider side, and the previous spec version if a diff is wanted'
user-invocable: true
---

# Testing API Contracts

Use this skill when the question is not "does the endpoint work" but "does the endpoint still promise what its consumers were built against".

A contract test checks **shape and compatibility**, not business behaviour. It answers: did a field disappear, did a type change, did an enum gain a value the client cannot handle, did a required field become optional. Functional API tests answer whether the value is correct. Both are needed and they fail for different reasons, which is the point of keeping them separate.

## When to Use

- an API publishes an OpenAPI or JSON Schema document and nothing verifies the implementation matches it
- API tests assert `status === 200` and nothing about the body
- a backend change is about to ship and no one can say which clients it breaks
- mocked fixtures need a drift guard against the real service
- two teams are arguing about whether a change is breaking
- a spec exists but has visibly diverged from what the service returns

## Operating Principles

- **The spec is the contract, the implementation is the claim.** Test the claim against the contract, in both directions.
- **Shape checks and value checks stay separate.** Mixing them produces a test that fails for two unrelated reasons and reports one message.
- **Additive is safe, subtractive is not.** Adding an optional response field breaks nobody. Removing one, or tightening a type, breaks everybody who read it.
- **Validate every response, not a sampled one.** Schema validation is cheap enough to run on every API call the suite already makes.
- **A breaking change is defined by consumers, not by the provider.** A field no client reads can be removed freely; the argument is about evidence, not opinion.
- **Undocumented behaviour is a finding.** A response field absent from the spec is either a spec gap or an accidental leak. Both get reported.

## Workflow

### Phase 0: Locate the contract

Find the authoritative artifact and record which it is:

- an OpenAPI document in the repository, generated from code or hand-written
- an OpenAPI document served at runtime (`/openapi.json`, `/swagger.json`, `/v3/api-docs`)
- standalone JSON Schema files
- a GraphQL SDL
- **none of the above**, in which case the first deliverable is a spec derived from observed traffic, marked as derived rather than authoritative

If the spec is hand-written and the implementation is not generated from it, say so. Hand-written specs drift, and the drift is exactly what this skill exists to surface.

### Phase 1: Decide which side you are testing

| Side | Question | Typical artifact |
| --- | --- | --- |
| **Provider** | Does our service return what our spec promises? | Schema validation over live responses |
| **Consumer** | Do we still work against what the provider promises? | Fixture validation plus a live sample check |
| **Both** | Are these two versions of the spec compatible? | Spec diff and breaking-change report |

Choose one per run. A single output that mixes provider defects with consumer risks is unreadable to either team.

### Phase 2: Wire validation into requests already being made

The cheapest contract coverage is a validator attached to the existing API test suite. Every request the suite already sends gets its response validated for free.

Recipes for `ajv`, `zod`, `openapi-response-validator`, and a Playwright `expect` extension are in `./resources/schema-validation-recipes.md`.

Rules for the validator:

- **Strict by default.** `additionalProperties: false` when the spec allows it, so undocumented fields surface instead of passing silently.
- **Validate the error responses too.** The 4xx body shape is part of the contract and is where drift is most common.
- **Report the path, not just "invalid".** `/items/0/price: expected number, got string` is actionable; `schema validation failed` is not.
- **Fail the test.** A validator that logs a warning gets ignored within a week.

### Phase 3: Cover the shape, not the sample

For each endpoint in scope, check the cases in `./resources/contract-coverage-checklist.md`. The ones that catch real defects:

- **empty collection** - `items: []` with the pagination envelope intact
- **nullable fields actually null** - the spec says nullable, so make one null
- **optional fields absent** - not present rather than present-and-null; these are different contracts
- **maximum-length and boundary values** - the field the spec caps at 255 characters
- **every enum member** - a client switch statement that has no default breaks on the value you never sent
- **error responses** - one per documented status code
- **pagination edges** - first page, last page, past the end

### Phase 4: Diff the versions

When a spec has changed, produce a compatibility verdict rather than a list of edits. Classify every change using `./resources/breaking-change-checklist.md`:

| Class | Examples | Verdict |
| --- | --- | --- |
| **Safe** | New optional response field, new endpoint, new optional request parameter, widened response enum a client treats as opaque | Ship |
| **Risky** | New enum value in a field clients branch on, tightened validation, changed default, changed ordering, changed pagination size | Ship with a consumer check |
| **Breaking** | Removed or renamed field, narrowed type, required field added to a request, optional response field made absent, status code change, auth requirement change | Version it or coordinate |

For every Risky and Breaking item, name the affected consumers if they are knowable, and say what evidence supports the claim. "Unknown consumers" is a valid finding and raises the severity.

### Phase 5: Guard the mocks

If the codebase mocks this API anywhere, the spec is also the guard for those fixtures. Validate the fixtures against the same schema:

- fixtures that fail validation are stale and are reported as defects in the test suite, not in the API
- run this check on the same cadence as the spec changes, not on every commit

This is the handoff point with `mocking-network-and-time`.

### Phase 6: Report

Use `./resources/contract-report-template.md`. A useful report contains:

- which spec, which version, which side was tested
- endpoints covered and endpoints skipped, with the reason for skipping
- validation failures grouped by endpoint, with the JSON path and both values
- the compatibility verdict per change, with severity
- undocumented fields found in responses
- what remains unverified

## Common Failure Modes

- asserting only the status code and calling it an API test
- validating the happy path and never the documented error bodies
- `additionalProperties` left permissive, so a leaked internal field passes forever
- diffing two specs and reporting every line changed rather than classifying compatibility
- calling a change non-breaking because no test failed, when no test covered it
- treating a generated spec as proof of correctness; a spec generated from the code agrees with the code by construction
- one report that mixes provider bugs, consumer risks, and spec gaps

## Resource Map

- `./resources/schema-validation-recipes.md` - `ajv`, `zod`, `openapi-response-validator`, and a reusable Playwright matcher
- `./resources/breaking-change-checklist.md` - full classification of spec changes into safe, risky, and breaking, for requests and responses
- `./resources/contract-coverage-checklist.md` - the response shapes to force per endpoint
- `./resources/contract-report-template.md` - report structure with a worked example

## Related Skills

- `api-playwright-test-developer` - when the functional API tests these validators attach to are being written
- `mocking-network-and-time` - when the spec is being used to guard mocked fixtures against drift
- `analyzing-regression-scope` - when a breaking change needs its retest blast radius mapped
- `verifying-acceptance-criteria` - when the question is whether behaviour meets its stated contract rather than its shape
- `assessing-release-readiness` - when a breaking change feeds a go/no-go decision
- `documenting-test-suites` - when the spec gaps found here need writing up

## Definition of Done

This skill is complete when:

- the authoritative spec is identified and its trustworthiness stated
- the side under test (provider, consumer, or version diff) is declared
- validation runs on every response the suite produces, including error responses, and fails the test on mismatch
- the shape cases from the coverage checklist are forced rather than hoped for
- every spec change carries a safe, risky, or breaking classification with its rationale
- undocumented response fields are reported
- mocked fixtures for this API are validated against the same schema, or their absence is noted
- the report says what was not covered
