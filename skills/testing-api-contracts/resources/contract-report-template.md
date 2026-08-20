# Contract Test Report

## 1. Scope

- **Spec**: [path or URL] version [x.y.z]
- **Spec authority**: [generated from code / hand-written / derived from traffic]
- **Side tested**: [provider / consumer / version diff]
- **Environment**: [stage / preprod / recorded fixtures]
- **Endpoints in scope**: [count] of [total in spec]
- **Run date**: [YYYY-MM-DD]

## 2. Validation failures

| Endpoint | Method | Status | JSON path | Expected | Actual | Severity |
| --- | --- | --- | --- | --- | --- | --- |
| `/api/products` | GET | 200 | `/items/0/price` | `integer` | `"1299.00"` (string) | High |
| `/api/orders/{id}` | GET | 404 | `/` | `{ error, code }` | `{ message }` | Medium |

Severity here means impact on consumers, not on the test suite.

## 3. Undocumented response fields

| Endpoint | Field | Looks like | Action |
| --- | --- | --- | --- |
| `/api/user` | `internalRiskScore` | Internal scoring value | **Investigate as a data leak** |
| `/api/products` | `warehouseCode` | Legitimate but unspecified | Add to spec |

Fields that look internal go to the security path, not the documentation backlog. See `testing-application-security`.

## 4. Compatibility verdict

Only when a version diff was requested.

| Change | Class | Affected consumers | Evidence | Recommendation |
| --- | --- | --- | --- | --- |
| `Product.price` number to string | **Breaking** | web-checkout, mobile-ios | Client code search | Add `priceMinor`, deprecate `price` with a removal date |
| `OrderStatus` gains `on_hold` | Risky | web-admin switches exhaustively | Client code search | Add a default branch in web-admin before release |
| New optional `Product.thumbnailUrl` | Safe | none | Additive | Ship |

**Overall**: [safe to ship / ship with coordination / do not ship without versioning]

## 5. Coverage

| Endpoint | Happy | Empty | Null fields | All enums | Errors | Pagination |
| --- | --- | --- | --- | --- | --- | --- |
| `/api/products` | yes | yes | yes | 2 of 3 | 400, 500 | yes |
| `/api/orders` | yes | no | no | no | 401 only | no |

## 6. Fixture drift

| Fixture | Endpoint | Valid | Last refreshed |
| --- | --- | --- | --- |
| `products-list.json` | `GET /api/products` | **no** | 2025-11-02 |
| `order-created.json` | `POST /api/orders` | yes | 2026-07-30 |

Invalid fixtures are defects in the test suite. File them there.

## 7. Not covered

- [endpoint or case, and why]
- [e.g. `/api/reports/export` returns a binary stream; no schema applies, needs a different check]

## 8. Recommended actions

1. [action, owner, whether it blocks the release]
2. [action, owner, whether it blocks the release]

---

## Worked example

## 1. Scope

- **Spec**: `https://api.shop.example/openapi.json` version `3.4.0`
- **Spec authority**: hand-written, implementation not generated from it
- **Side tested**: provider
- **Environment**: stage
- **Endpoints in scope**: 12 of 31
- **Run date**: 2026-08-20

## 2. Validation failures

| Endpoint | Method | Status | JSON path | Expected | Actual | Severity |
| --- | --- | --- | --- | --- | --- | --- |
| `/api/products` | GET | 200 | `/items/*/discontinuedAt` | `string \| null` | field absent | High |
| `/api/cart` | POST | 422 | `/errors` | array of `{field, code}` | `{ "postcode": "invalid" }` | High |

The second one means every client's error rendering is written against a shape the service does not return, or the spec was never right. Either way it blocks.

## 4. Compatibility verdict

Not requested; no prior version supplied.

## 7. Not covered

- 19 endpoints outside the checkout flow
- `discontinuedAt` non-null case: stage has no discontinued products, needs seed data

## 8. Recommended actions

1. Decide whether `discontinuedAt` is optional or nullable, then fix the spec or the service. Owner: api-platform. **Blocks the release** because clients branch on it.
2. Seed a discontinued product in stage so the null case can be forced. Owner: QA. Does not block.
3. Add contract validation to the existing checkout API suite so this runs on every commit. Owner: QA. Does not block.
