# Security Finding Report

## Where this goes

**Not the public issue tracker.** A security finding filed publicly is a disclosure.

Route, in order of preference:

1. The team's documented security disclosure path, if one exists
2. A private security channel or a restricted-visibility tracker project
3. Directly to the security owner or engineering manager, by a private channel

Ask before filing when unsure. The cost of asking is a message; the cost of guessing wrong is publishing a vulnerability.

---

# [Finding title: what is wrong, in one line]

- **Severity**: [Critical / High / Medium / Low]
- **Category**: [OWASP category]
- **Reported by**: [name], [date]
- **Environment**: [staging / production]
- **Authorization**: [link to the authorization record]
- **Status**: [New / Confirmed / Fixed / Accepted]

## What the application claims

[The stated behaviour: from the specification, the permission model, the UI, or the documentation. Without this, a finding is an observation with no oracle.]

> Orders are visible only to the customer who placed them and to users with the admin role.

## What it does

[The observed behaviour, in one or two sentences.]

> Any authenticated user can read any order by its id, regardless of who placed it. The API applies no ownership check on `GET /api/orders/{id}`.

## Minimum reproduction

The smallest sequence that demonstrates it. Not a full attack chain.

```
1. Sign in as sec-user-a@example.com. Place an order. Note its id: 8a1f3c...
2. Sign in as sec-user-b@example.com, a different customer in the same tenant.
3. Request, with user B's token:

   GET /api/orders/8a1f3c...
   Authorization: Bearer <user B token>

4. Response: 200, with user A's full order including the delivery address.
   Expected: 403.
```

Include the exact request and the status code. "It leaks data" is not reproducible.

## Impact

What an attacker with this could reach. Stated plainly, without embellishment and without minimizing.

> Any authenticated user can read any order in the system given its id, including delivery
> addresses and contact details. Order ids are UUIDs and are not enumerable from the API,
> so this requires an id obtained elsewhere: a shared link, a screenshot, a support thread,
> or a referrer header. It does not permit modification; `PATCH` on the same path is
> correctly restricted.

That last sentence matters. Stating the limits makes the rest credible and helps the reader triage accurately.

## Scope

| Aspect | Detail |
| --- | --- |
| Affected endpoints | `GET /api/orders/{id}`, `GET /api/orders/{id}/attachments/{id}` |
| Affected roles | Any authenticated user |
| Cross-tenant | **Yes**, verified with a tenant-2 account |
| Requires | A valid session and a known order id |
| Present in | Staging, build `[version]`. Production not tested. |

## Evidence

- Request and response with personal data redacted
- Screenshot with identifying fields masked
- The matrix cell, in context

**Redact before attaching.** Evidence for a security finding routinely contains exactly the data the finding is about. See `handling-sensitive-test-data`.

## Where testing stopped

The section that tells the reader what is proven and what is unknown.

> Confirmed the read on two order ids, one same-tenant and one cross-tenant. Did not enumerate
> further, did not test whether ids are predictable, did not test the production environment.
> Whether `attachments` has the same gap on other parent resources is untested.

## Suggested direction

Optional, and offered as a direction rather than a prescription.

> The ownership check appears to be applied in the collection handler but not the item handler.
> Worth reviewing every item-level handler for the same pattern rather than fixing only this one.

## Verification

For when it is fixed:

- [ ] The reproduction above returns 403
- [ ] The matrix cell passes
- [ ] Related endpoints found by the same pattern also pass
- [ ] A regression test exists in the authorization matrix suite

---

## Severity guidance

Rough, and deliberately conservative when uncertain.

| Severity | Shape |
| --- | --- |
| **Critical** | Unauthenticated access to sensitive data or functions; remote code execution; full account takeover; cross-tenant data access at scale |
| **High** | Authenticated access to another user's data or functions; privilege escalation; authentication bypass; injection with confirmed data access |
| **Medium** | Information disclosure with limited impact; missing rate limiting on a sensitive operation; session invalidation failures; business logic bypass with a financial effect |
| **Low** | Missing security headers; verbose errors; version disclosure; issues requiring an improbable precondition |

Adjust for:

- **exposure**: internet-facing raises it, internal-only lowers it
- **data**: special category or financial data raises it
- **preconditions**: needing a valid session lowers it, needing nothing raises it
- **scale**: affecting every record raises it above affecting one

When two severities are arguable, take the higher and say why. A triage that downgrades is cheap; one that misses a serious finding is not.

## Reporting several findings

One report per finding, not one report listing twelve. They get fixed, triaged, and verified separately.

An index is useful when there are many:

| # | Finding | Severity | Endpoint | Status |
| --- | --- | --- | --- | --- |
| 1 | Order read without ownership check | High | `GET /api/orders/{id}` | New |
| 2 | Admin user creation not role-checked | High | `POST /api/admin/users` | New |
| 3 | Session valid after logout | Medium | All | New |
| 4 | No `Content-Security-Policy` header | Low | All | New |

## What not to include

- a working exploit, or anything closer to one than the minimum reproduction
- unredacted personal data
- speculation about impact you did not verify
- raw scanner output presented as findings
- anything obtained outside the authorized scope
- an assessment of whose fault it is
