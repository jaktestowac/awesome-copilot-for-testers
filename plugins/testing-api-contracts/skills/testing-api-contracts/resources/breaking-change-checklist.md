# Breaking Change Checklist

Classify every spec change as **safe**, **risky**, or **breaking**. The classification is from the consumer's point of view, so the provider's intent does not decide it.

## Response changes

| Change | Class | Note |
| --- | --- | --- |
| Add an optional field | Safe | Unless consumers validate strictly, which some do |
| Add a required field | Safe | Required in a response means always present, which only adds information |
| Remove a field | **Breaking** | Even if you believe nobody reads it; prove it before downgrading |
| Rename a field | **Breaking** | A rename is a remove plus an add |
| Change a field's type | **Breaking** | Including `number` to `string` for ids, the classic |
| Widen a type (`string` to `string \| null`) | **Breaking** | Consumers that do not null-check now crash |
| Narrow a type (`string \| null` to `string`) | Safe | Fewer cases to handle |
| Make a required field optional | **Breaking** | Consumers stop receiving something they depend on |
| Make an optional field required | Safe | More guarantees, not fewer |
| Add an enum value | **Risky** | Safe if consumers treat it as opaque, breaking if they exhaustively switch |
| Remove an enum value | **Breaking** | Unless it was never emitted |
| Change a date or number format | **Breaking** | ISO to epoch, cents to decimal, both silently corrupt data |
| Change field ordering in an array | **Risky** | Breaks consumers that index positionally or snapshot |
| Change default page size | **Risky** | Breaks pagination assumptions and snapshot tests |
| Add a new status code | **Risky** | Consumers with an exhaustive status switch break |
| Change a status code for an existing case | **Breaking** | 200-with-error-body to 400 is breaking even though it is more correct |
| Change the error body shape | **Breaking** | The error contract is a contract |
| Tighten a documented maximum (page size 100 to 50) | **Risky** | Requests that used to succeed now fail |

## Request changes

| Change | Class | Note |
| --- | --- | --- |
| Add an optional parameter | Safe | |
| Add a required parameter | **Breaking** | Existing calls stop working |
| Remove a parameter | **Risky** | Safe if ignored, breaking if it causes a 400 |
| Make an optional parameter required | **Breaking** | |
| Make a required parameter optional | Safe | |
| Tighten validation (add a pattern, lower a max length) | **Breaking** | Previously accepted payloads are now rejected |
| Loosen validation | Safe | |
| Change a default value | **Risky** | Silent behaviour change, no error to observe |
| Add a new enum value to a request field | Safe | |
| Remove an enum value from a request field | **Breaking** | |
| Change auth scheme or required scope | **Breaking** | |
| Add rate limiting, or lower an existing limit | **Risky** | Breaks batch consumers and test suites first |

## Structural changes

| Change | Class |
| --- | --- |
| Add an endpoint | Safe |
| Remove an endpoint | **Breaking** |
| Change a path | **Breaking** |
| Change an HTTP method | **Breaking** |
| Change content type | **Breaking** |
| Add a required header | **Breaking** |
| Change from synchronous to asynchronous (200 to 202 plus polling) | **Breaking** |

## Evidence rules

A classification without evidence is an opinion. For every downgrade from breaking to safe, record which of these you have:

- **Consumer inventory**: a list of known clients and the fields each reads
- **Access logs**: which fields or parameters appear in real traffic
- **Client code search**: a grep across consumer repositories for the field name
- **Explicit sign-off**: the consuming team confirmed in writing

"No test failed" is not evidence. It means the change is untested, which raises severity rather than lowering it.

When consumers are unknown, treat every Risky item as Breaking. An unknown consumer inventory is itself a finding worth reporting.

## Migration options for a breaking change

Ranked by cost to consumers, cheapest first.

1. **Additive with deprecation** - add the new field, keep the old one, mark deprecated with a removal date. Remove only after the date and after traffic confirms no reads.
2. **Version negotiation** - a header or media type that lets consumers pin the old shape.
3. **Path or URL version** - `/v2/`. Expensive to maintain, unambiguous to reason about.
4. **Coordinated release** - both sides ship together. Viable only for a known, small consumer set that you control.
5. **Break it** - acceptable for a pre-release API with declared instability, and only then.

## Deprecation notes worth writing

```yaml
ProductLegacy:
  properties:
    price:
      type: number
      deprecated: true
      description: >
        Deprecated 2026-08-20, removal no earlier than 2027-02-20.
        Use `priceMinor` (integer, minor units) instead.
        Contact: #api-platform
```

A deprecation without a date and a replacement is a comment, not a plan.
