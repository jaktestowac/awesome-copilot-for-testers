# Authorization Matrix

The highest-value artifact in this skill. Broken access control is the most common serious defect class in web applications, and a complete matrix finds it by being thorough rather than clever.

## Format

Rows are protected resources, columns are actors. Every cell is an expected outcome, verified.

| Endpoint | Method | Anonymous | User A | User B (other user) | Tenant-2 user | Admin |
| --- | --- | --- | --- | --- | --- | --- |
| `/api/orders` | GET | 401 | **200** (own only) | **200** (own only) | **200** (own only) | **200** (all) |
| `/api/orders/{A}` | GET | 401 | **200** | 403 | 403 | **200** |
| `/api/orders/{A}` | PATCH | 401 | **200** | 403 | 403 | **200** |
| `/api/orders/{A}` | DELETE | 401 | 403 | 403 | 403 | **200** |
| `/api/admin/users` | GET | 401 | 403 | 403 | 403 | **200** |
| `/api/admin/users/{id}` | PATCH | 401 | 403 | 403 | 403 | **200** |
| `/api/reports/export` | POST | 401 | **200** (own scope) | **200** (own scope) | **200** (own scope) | **200** (all) |

Bold marks an expected allow. Every other cell is a deny that must be **verified**, not assumed.

Add an observed column when running it:

| Endpoint | Method | Actor | Expected | Observed | Verdict |
| --- | --- | --- | --- | --- | --- |
| `/api/orders/{A}` | GET | User B | 403 | **200** | **Finding: horizontal IDOR** |
| `/api/orders/{A}` | PATCH | User B | 403 | 403 | Pass |
| `/api/admin/users` | GET | User A | 403 | 403 | Pass |
| `/api/admin/users` | POST | User A | 403 | **201** | **Finding: method not checked** |

The second finding is the pattern to look for: `GET` is protected, `POST` on the same path is not. Access control is frequently applied per handler rather than per route.

## Coverage rules

- **Every method on every protected path**, not just the one the UI uses. `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, and `OPTIONS`.
- **Both collection and item endpoints.** A `GET /api/orders` that filters correctly says nothing about `GET /api/orders/{id}`.
- **Every role, including anonymous.** Anonymous is a column, not an assumption.
- **Cross-tenant, when the system is multi-tenant.** This is the highest-impact cell in most SaaS products.
- **Endpoints with no UI.** Take the list from the OpenAPI spec or a route dump, not from clicking around.

## Verify at the API

A UI check proves the UI hides something. Access control lives on the server.

```ts
import { test, expect, request } from '@playwright/test';

const CASES = [
  { path: '/api/orders/ORDER_A', method: 'get',   actor: 'userB',  expected: 403 },
  { path: '/api/orders/ORDER_A', method: 'patch', actor: 'userB',  expected: 403 },
  { path: '/api/admin/users',    method: 'get',   actor: 'userA',  expected: 403 },
  { path: '/api/admin/users',    method: 'post',  actor: 'userA',  expected: 403 },
  { path: '/api/orders/ORDER_A', method: 'get',   actor: 'anon',   expected: 401 },
];

for (const c of CASES) {
  test(`${c.method.toUpperCase()} ${c.path} as ${c.actor} returns ${c.expected}`, async () => {
    const ctx = await request.newContext({
      baseURL: process.env.BASE_URL,
      extraHTTPHeaders: c.actor === 'anon' ? {} : { Authorization: `Bearer ${tokens[c.actor]}` },
    });

    const res = await ctx[c.method](c.path, { data: {}, failOnStatusCode: false });
    expect(res.status(), `${c.actor} on ${c.method} ${c.path}`).toBe(c.expected);
  });
}
```

Keeping the matrix as executable tests is what makes it a regression guard rather than a one-off audit. A new endpoint added without a matrix row is then visible as a gap.

Note `failOnStatusCode: false`. Without it the request helper throws on 4xx and the test fails for the wrong reason.

## The cases that find defects

### Horizontal escalation (IDOR)

Swap an identifier for one belonging to another user.

```
GET /api/orders/8a1f...   with user B's token, where the order belongs to user A
```

Also try: sequential ids, ids from another tenant, ids from a deleted record, and an id belonging to an admin.

### Vertical escalation

A standard user calling an admin path. Cover every admin endpoint, including the ones the admin UI reaches indirectly.

### Method confusion

```
GET    /api/admin/settings   -> 403   (checked)
POST   /api/admin/settings   -> 200   (not checked)
```

### Mass assignment

Send fields the client never sends, and see whether they stick.

```json
PATCH /api/profile
{ "displayName": "test", "role": "admin", "tenantId": "other-tenant", "emailVerified": true }
```

Then re-read the record. The absence of an error does not mean the field was ignored.

### Token behaviour after a permission change

1. Issue a token for a user with role X.
2. Remove role X from the user.
3. Reuse the original token.

A stateless token that carries stale claims until expiry is a design decision, not automatically a defect, but it must be a **known** one with a stated expiry window.

### Filter parameter injection

```
GET /api/orders?userId=OTHER_USER
GET /api/orders?tenantId=OTHER_TENANT
GET /api/orders?includeDeleted=true
```

An endpoint that scopes by the session but also honours a query parameter is a common way scoping gets bypassed.

### Indirect access

Resources reached through another resource frequently miss the check the direct path has.

```
GET /api/orders/{A}/attachments/{id}     as user B
GET /api/exports/{id}                    where the export was generated for user A
GET /api/notifications/{id}              belonging to another user
```

## Test accounts

Set up before starting, per `handling-sensitive-test-data`:

| Account | Role | Tenant | Purpose |
| --- | --- | --- | --- |
| `sec-user-a@example.com` | user | tenant-1 | Owner of the resources under test |
| `sec-user-b@example.com` | user | tenant-1 | Same-tenant other user, for horizontal checks |
| `sec-user-c@example.com` | user | tenant-2 | Cross-tenant checks |
| `sec-admin@example.com` | admin | tenant-1 | Expected-allow baseline |
| (none) | anonymous | - | Unauthenticated baseline |

All synthetic. Never a real user's account, including your own production account.

## Recording the result

| Total cells | Verified | Passed | Findings | Not tested |
| --- | --- | --- | --- | --- |
| 168 | 151 | 149 | 2 | 17 |

Not-tested cells are listed with a reason. A matrix presented as complete when 17 cells were skipped is worse than one that says so, because the reader draws a conclusion the evidence does not support.
