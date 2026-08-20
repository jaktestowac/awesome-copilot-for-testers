---
name: testing-application-security
description: 'Applies OWASP-informed security testing within a tester scope: an authorization gate before any probing, authorization matrices, broken access control and IDOR checks, input validation and injection observation, session and auth behaviour, and safe reporting of findings. Use when testing auth-protected features, when a security review needs QA coverage, when an exploratory session surfaced something security-shaped, or when access control needs a systematic check rather than a spot check.'
argument-hint: 'Target system and its URL, written authorization to test it, roles and permissions in scope, and whether the environment is production'
user-invocable: true
---

# Testing Application Security

Use this skill when a feature's protection matters and the functional suite only proves the happy path works for someone who is allowed to use it.

This is security testing at a tester's depth: **systematic verification that the application enforces what it claims**, not penetration testing. The highest-value work here is unglamorous and rarely done: a complete authorization matrix, checked server-side, for every role against every endpoint. Broken access control is consistently the most common serious defect class in web applications, and it is found by being thorough rather than by being clever.

**Everything in this skill runs after the authorization gate in Phase 0.** Testing a system you are not authorized to test is not a testing activity.

## When to Use

- a feature is behind authentication or role-based permissions
- an exploratory session surfaced something security-shaped
- a security review needs QA-level coverage of access control
- API endpoints exist that the UI hides but does not protect
- a new role, permission, or tenant boundary has been added
- personal or financial data is handled and the handling needs checking

## Operating Principles

- **Authorization first, always.** Written permission for this system, this environment, this scope, this window. No exception, including for your employer's own systems.
- **Observe, do not exploit.** Confirm the finding with the minimum action that demonstrates it, then stop. Reading one record you should not see proves the point; enumerating the table does not add to it and does add harm.
- **The server decides.** A UI that hides a button proves nothing. Every check runs against the API.
- **Systematic beats clever.** A complete role-by-endpoint matrix finds more real defects than an inventive payload.
- **Never in production without explicit written approval**, and never with real customer data.
- **Report findings through the security path**, not the public bug tracker.
- **Depth has a limit.** Beyond confirming a class of finding, hand off to a security professional rather than going further.

## Workflow

### Phase 0: The authorization gate

Nothing else in this skill runs until this is complete. Work through `./resources/scope-and-authorization-gate.md` and record:

- **written authorization** from someone with the authority to give it, naming the system
- **environment**: staging by default; production requires separate, explicit approval and a named approver
- **scope**: which hosts, which endpoints, which accounts. Everything not listed is out of scope.
- **prohibited actions**: no denial of service, no load generation, no third-party systems, no real customer accounts, no data exfiltration
- **time window**
- **contact**: who to call the moment something unexpected happens
- **data rule**: synthetic accounts only

If any line is missing, stop and get it. A missing authorization line is a blocking condition, not a formality to catch up on afterwards.

For third-party systems, a bug bounty scope statement counts as authorization for exactly what it lists and nothing else.

### Phase 1: Map the attack surface

- every route the application serves, including ones the UI does not link
- every API endpoint, from the spec, a route dump, or observed traffic
- every role, and every permission each role holds
- every tenant boundary, if the system is multi-tenant
- authentication mechanisms: password, SSO, tokens, API keys, session cookies
- where user input reaches: forms, query parameters, headers, file uploads, webhooks
- where data leaves: exports, reports, emails, third-party integrations

The API endpoints absent from the UI are the productive part. They are frequently protected by nothing except being undocumented.

### Phase 2: Build the authorization matrix

The core deliverable. `./resources/authz-matrix-template.md` has the format.

Every **role** against every **protected resource**, with the expected outcome and the observed one:

| Endpoint | Anonymous | User A | User B (other tenant) | Admin |
| --- | --- | --- | --- | --- |
| `GET /api/orders/{A's id}` | 401 | **200** | 403 | 200 |
| `PATCH /api/orders/{A's id}` | 401 | **200** | 403 | 200 |
| `GET /api/admin/users` | 401 | 403 | 403 | **200** |

Bold marks the expected allow. Every other cell is a deny that must be verified rather than assumed.

Check each cell **at the API**, with the session or token for that role, bypassing the UI entirely. A cell verified by "the button is not visible" is not verified.

The cases that produce findings:

- **IDOR**: swap an identifier for one belonging to another user or tenant
- **Vertical escalation**: a standard user calling an admin endpoint
- **Horizontal escalation**: user A reading or modifying user B's resource
- **Method confusion**: `GET` denied, `POST` or `PATCH` unchecked on the same path
- **Missing object-level checks**: the collection endpoint filters correctly, the item endpoint does not
- **Mass assignment**: sending `role: "admin"` in a profile update and seeing whether it sticks
- **Token replay after permission change**: revoke a role, then reuse the token issued before

### Phase 3: Session and authentication behaviour

Verifiable at a tester's depth, from `./resources/owasp-test-angles.md`:

- session invalidated on logout, server-side, not only cleared client-side
- session invalidated on password change and on permission change
- session timeout enforced by the server
- session identifier rotated on login (fixation)
- token expiry honoured
- cookie flags: `HttpOnly`, `Secure`, `SameSite`
- account lockout or rate limiting on login, without confirming which accounts exist
- password reset tokens: single use, short lived, invalidated after use
- registration and reset responses that do not disclose whether an account exists
- multi-factor enforced where claimed, including on API paths

### Phase 4: Input handling, observed not exploited

Send inputs a validator should reject and **observe the response**. The goal is evidence of a class of defect, not exploitation.

- input that reaches output unencoded, observed as reflected content rather than executed script
- error responses containing stack traces, SQL fragments, internal paths, or version strings
- unhandled type confusion: an array where a string is expected, a very large number, a deeply nested object
- file upload: type checks, size limits, and whether the stored name is used in a path
- redirect parameters accepting external hosts
- content type confusion, and whether the response's `Content-Type` matches what it returns

When a response indicates a real injection path, **stop and report**. Confirming a vulnerability class is a tester's job; developing it into an exploit is not, and going further can cause damage the authorization did not cover.

### Phase 5: Data exposure

- API responses containing fields the client never displays; check against the spec (`testing-api-contracts` finds these systematically)
- personal data in URLs, and therefore in logs and referrers
- exports and reports that ignore the row-level permissions the UI applies
- error messages that disclose whether a record exists
- security headers present: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`
- caching headers on authenticated responses
- source maps, `.git` directories, and backup files reachable in the deployed environment

### Phase 6: Report

Security findings do not go in the public bug tracker. Use `./resources/finding-report-template.md` and the team's security disclosure path.

Each finding carries:

- what the application claims, and what it does
- the minimum reproduction, with the exact request
- impact in terms of what an attacker could reach, without embellishment
- affected roles, endpoints, and scope
- evidence, with personal data redacted
- what was **not** tested, and where the tester stopped

State the stopping point explicitly. "Confirmed that user A can read user B's order; did not enumerate further" tells the reader both what is proven and what remains unknown.

## Common Failure Modes

- probing without written authorization, on the assumption that internal systems are fair game
- testing against production or with real customer accounts
- verifying access control through the UI, so a hidden button reads as a working control
- checking `GET` and not the other methods on the same path
- checking the collection endpoint and not the item endpoint
- developing a confirmed finding into a full exploit, beyond the authorized scope
- filing a security finding in the public tracker, where it becomes disclosure
- enumerating records to demonstrate impact, when one record already demonstrated it
- reporting a scanner's raw output as findings without verifying any of it
- treating a passing functional suite as evidence that authorization works

## Resource Map

- `./resources/scope-and-authorization-gate.md` - the Phase 0 record, what authorization must state, production rules, and stop conditions
- `./resources/authz-matrix-template.md` - matrix format, the cases that find defects, and API-level verification recipes
- `./resources/owasp-test-angles.md` - OWASP Top 10 mapped to concrete checks a tester can run, with the boundary of each
- `./resources/finding-report-template.md` - severity guidance, reporting path, redaction rules, and a worked example

## Related Skills

- `planning-exploratory-testing` - when a charter targets authorization or input handling
- `testing-api-contracts` - which finds undocumented response fields, one of the commonest data exposure paths
- `handling-sensitive-test-data` - for the accounts and data used during security testing
- `reporting-bugs` - for non-security defects found along the way; security findings use the disclosure path instead
- `analyzing-regression-scope` - when a permission model change needs its blast radius mapped
- `assessing-release-readiness` - when a security finding bears on a go/no-go decision
- `auditing-accessibility` - a different systematic audit over the same surface

## Definition of Done

This skill is complete when:

- written authorization exists, naming system, environment, scope, prohibited actions, window, and contact, and it was obtained before any probing
- the environment is non-production, or production use has a separate named approval
- only synthetic accounts and data were used
- the authorization matrix covers every role against every protected resource, verified at the API rather than through the UI
- both collection and item endpoints, and every method, were checked on each protected path
- session, authentication, and token behaviour were verified against what the application claims
- every confirmed finding stopped at the minimum demonstration, with no enumeration or exploitation
- findings went through the security disclosure path, with personal data redacted
- the report states where testing stopped and what remains unknown
