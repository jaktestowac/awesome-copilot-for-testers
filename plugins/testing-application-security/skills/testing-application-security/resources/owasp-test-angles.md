# OWASP Test Angles for Testers

Each category mapped to checks a tester can run, with the point at which to hand off. The boundary is deliberate: confirm the class, do not develop the exploit.

Every check below assumes the authorization gate in `scope-and-authorization-gate.md` is complete.

---

## A01 Broken access control

The most common serious defect class, and the most testable by ordinary thoroughness.

**Checks**: the full authorization matrix. See `authz-matrix-template.md`.

**Stop at**: one demonstration per finding. Reading a single record you should not see proves it; enumerating the table does not add evidence and does add harm.

---

## A02 Cryptographic failures

**Checks a tester can run**

- HTTPS enforced; plain HTTP redirects rather than serving
- `Strict-Transport-Security` header present
- personal data absent from URLs and query strings
- cookies carry `Secure`, `HttpOnly`, and an appropriate `SameSite`
- authenticated responses are not cacheable (`Cache-Control: no-store`)
- passwords never appear in a response body, a log, or a trace
- password reset tokens are single use and short lived

**Hand off**: cipher suite analysis, certificate chain validation, key management.

---

## A03 Injection

**Checks a tester can run**

- input containing SQL-ish, template-ish, or shell-ish characters, submitted as ordinary data, with the **response observed**
- error responses examined for stack traces, SQL fragments, or internal paths
- input reflected into the page, observed for whether it is encoded
- search, filter, and sort parameters, which are frequently concatenated into queries
- file upload names used in a path

```
Name: O'Brien
Search: %' OR '1'='1
Comment: <img src=x onerror=1>
Filter: ../../etc/passwd
```

What you are looking for is a **response that indicates the input was interpreted**: a database error, unencoded reflection, an unexpected result set.

**Stop immediately** when a response indicates a real injection path. Report it. Developing it further exceeds the tester scope and can cause damage the authorization does not cover.

---

## A04 Insecure design

**Checks a tester can run**

- business logic bypass: negative quantities, a price sent from the client, a discount applied twice, a coupon replayed
- workflow skipping: deep-link to step three, submit step two twice, complete a flow after cancelling it
- rate limiting on expensive or sensitive operations
- race conditions on limited resources: two concurrent redemptions of a single-use code

```
POST /api/cart/items { "productId": "p-1", "qty": -5 }
POST /api/checkout   { "total": 0.01 }
POST /api/coupons/redeem  x2 concurrently, same single-use code
```

Business logic flaws are among the most valuable findings a tester produces, because they need product understanding that a scanner does not have.

---

## A05 Security misconfiguration

**Checks a tester can run**

- default credentials on any admin interface
- directory listing enabled
- reachable files that should not be: `.git/`, `.env`, `backup.sql`, `*.bak`, source maps
- verbose errors in a non-development environment
- security headers present: `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` or a CSP `frame-ancestors`
- CORS policy: does `Access-Control-Allow-Origin` reflect an arbitrary origin
- HTTP methods enabled that should not be: `TRACE`, `PUT` on static paths

```bash
curl -sI https://app.example.com | grep -iE 'content-security|strict-transport|x-content-type|referrer'
curl -sI -H "Origin: https://evil.example" https://api.example.com/api/orders | grep -i access-control
```

---

## A06 Vulnerable and outdated components

**Checks a tester can run**

- `npm audit` and the equivalent for other ecosystems
- dependency scanning in CI, with someone acting on the output
- version strings disclosed in headers or error pages
- known-vulnerable versions of anything the response advertises

This one belongs in the pipeline rather than in a manual session, run on every build with someone acting on the output.

---

## A07 Identification and authentication failures

**Checks a tester can run**

- session identifier rotates on login (fixation)
- session invalidated server-side on logout, not merely cleared client-side
- session invalidated on password change and on role change
- session timeout enforced by the server, not by a client-side timer
- account lockout or rate limiting on repeated failed logins
- login, registration, and password reset responses do not disclose whether an account exists
- password reset token: single use, short lived, invalidated after use, not reusable after a new one is issued
- multi-factor enforced on API paths, not only in the UI
- remember-me tokens invalidated on logout

```
1. Log in, capture the session cookie.
2. Log out.
3. Replay the captured cookie against an authenticated endpoint.
   Expect 401. A 200 is a finding.
```

That three-step check finds a real defect surprisingly often, because logout is usually tested through the UI where the cookie is gone anyway.

---

## A08 Software and data integrity failures

**Checks a tester can run**

- update or import mechanisms that accept unsigned content
- deserialization endpoints accepting arbitrary structures
- webhook endpoints without signature verification
- CI configuration pulling unpinned dependencies from mutable sources

**Hand off**: supply chain analysis, build system integrity.

---

## A09 Security logging and monitoring failures

**Checks a tester can run**

- do failed logins produce a log entry
- does a permission denial produce a log entry
- does anything alert on a burst of 403s
- do logs contain data they should not: passwords, tokens, personal data
- can log entries be triggered with attacker-controlled newlines (log injection)

The inverse of the usual concern: too little logging leaves attacks invisible, too much puts personal data in a system with weaker controls than the database.

---

## A10 Server-side request forgery

**Checks a tester can run**

- any feature that fetches a URL the user supplies: webhooks, image imports, PDF generation, link previews, avatar-by-URL
- observe whether internal addresses are rejected: `http://localhost`, `http://169.254.169.254/`, `http://10.0.0.1`
- redirect following, when the supplied URL redirects to an internal address

**Stop at** observing that an internal address is accepted. Do not pursue what it returns. Report it.

---

## Not on this list, and out of scope

Deliberately excluded from a tester's scope. Route these to a security professional:

- exploit development of any confirmed finding
- chaining findings into a fuller compromise
- network, host, and infrastructure testing
- denial of service or resource exhaustion, in any environment
- social engineering, phishing, or anything involving a person
- physical security
- cryptographic implementation review

## The tester's contribution

The genuine advantage a tester holds over a scanner and often over an external penetration test is **product knowledge**. A scanner does not know that a refund should not exceed the original payment, that a tenant admin should not see another tenant's report, or that a coupon is meant to be single use.

Broken access control and business logic flaws are where that knowledge pays, and they are what this skill is aimed at. The systematic matrix in `authz-matrix-template.md` is the highest-value thing here; the rest of this file is what to check while you are already in the area.
