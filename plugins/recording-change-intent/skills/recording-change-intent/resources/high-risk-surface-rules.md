# High-Risk Surface Rules

What makes a change require a recorded rationale. Keep this list short and defensible - the credibility of an intent gate rests on being visibly proportionate.

## The rules

| Rule                                | Trigger                                                                                   | Why a rationale matters here                                                                                  |
| ----------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **New public export**               | a new exported function, class, const, type, or a new barrel entry                        | a new capability others will build on; the reason it exists shapes how it should be used                      |
| **New endpoint**                    | a new route, handler, tRPC procedure, or queue consumer                                   | a new externally reachable operation, and a new attack surface                                                |
| **Modified auth**                   | changes to tokens, sessions, roles, permissions, scopes, password handling, CORS, cookies | the highest-consequence class of change, and the one where the _why_ is least recoverable from the code       |
| **Schema or migration**             | DDL, ORM model changes, new migration files                                               | often irreversible; readers need to know whether the shape was chosen or inherited                            |
| **Removed guard**                   | deleted auth check, validation, rate limit, feature-flag gate, or test                    | removal is the change type least explained by the diff - the code no longer contains the thing you would read |
| **New external dependency or call** | a new package, SDK client, webhook target, or `fetch` to a new host                       | new failure modes and new supply-chain surface                                                                |
| **Contract change**                 | changed public request/response shape, published schema, or event payload                 | consumers break on this; the alternatives considered matter                                                   |
| **Critical-path module**            | any change under paths the contract marks `critical-path`                                 | blast radius is defined by the project, not by the diff                                                       |

Everything else needs nothing. Say so in the report - "12 files changed, none on high-risk surface, no rationale required" is what stops the gate from being read as a tax.

## Not high-risk

Explicitly out of scope, so the boundary is not re-litigated per PR:

- formatting, import ordering, lint fixes
- dependency patch bumps with no API change (the lockfile-only case)
- test additions that touch no production code
- docs, comments, and type-only refactors that change no runtime behaviour
- pure renames with no signature change - though a rename _plus_ a signature change is a contract change
- generated-code regeneration, when the generator input is unchanged

## Severity by profile

| Profile              | Undeclared high-risk surface | Malformed record                        |
| -------------------- | ---------------------------- | --------------------------------------- |
| `critical-regulated` | **BLOCK** on MUST surface    | BLOCK - a broken record is not a record |
| `standard`           | **WARN**                     | WARN                                    |
| `prototype-internal` | **INFO**                     | INFO                                    |

Never let an intent finding block on `prototype-internal`. The profile exists to buy iteration speed, and a governance gate on a spike is the fastest way to get the whole practice dismissed as bureaucracy.

## Module intent register

Some rationale is module-level and stable - it does not belong on every commit that touches the module. Record it once:

`.qa/intent.md`

```yaml
modules:
  - paths: ['src/billing/reconciliation/**']
    intent: >-
      Reconciliation runs against the provider's settlement file, not our own
      ledger, because the provider's fees are only known post-settlement. This
      is why totals here can disagree with the orders table by design; the
      variance report is the reconciliation output, not a bug.
    owner: '@maria'
    ref: ADR-0031
    reviewed: 2026-07-02

  - paths: ['src/auth/session.ts']
    intent: >-
      Sliding-window refresh with a hard absolute cap. The window exists so
      checkout is not interrupted; the cap exists for SOC2. Changing either
      without changing the other reintroduces the finding in SEC-88.
    owner: '@tomek'
    ref: SEC-88
    reviewed: 2026-08-01
```

A change to paths covered by a register entry is **covered** - unless the change contradicts the recorded intent, in which case the register entry is what needs updating, and that update is the rationale.

Review the register when the contract is re-derived. A `reviewed` date more than a year old on a module that has changed since is a stale record, and stale records are worse than absent ones: they mislead confidently.

## Intent waivers

Some high-risk changes genuinely have no interesting rationale. Bulk mechanical work is the honest case:

```yaml
intent_waivers:
  - paths: ['src/generated/**']
    reason: 'Codegen output. The rationale lives with the schema change that produced it.'
    owner: '@maria'
    expiry: 2026-12-01
  - paths: ['**/*.test.ts']
    reason: 'Test-only changes. Intent belongs on the production change they cover.'
    owner: '@lead'
    expiry: 2027-01-01
```

Same discipline as any waiver - reason, owner, expiry - and the same register review (`governing-quality-waivers`). An intent waiver on `src/**` is not a waiver; it is switching the practice off, and that belongs in the contract.

## ADRs versus trailers

Both are valid records. Choose by the shape of the decision:

| Use                 | When                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `Intent:` trailer   | the reason fits in a few lines and belongs to this change                                     |
| ADR + `Intent-Ref:` | alternatives were weighed, consequences outlive the change, several changes will implement it |
| Module register     | the reason is about the module's existence, not any single change                             |

The failure to avoid: an ADR directory that nothing links to. An ADR nobody can reach from the code is documentation, not a record of intent. `Intent-Ref: ADR-0042` in the commit that implements it is the link that makes the ADR findable from `git log` and `git blame` - which is where a future reader actually starts.
