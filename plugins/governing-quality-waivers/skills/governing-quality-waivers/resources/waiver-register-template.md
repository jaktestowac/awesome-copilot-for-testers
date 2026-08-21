# Waiver Register

Keep it next to the quality contract: `.qa/waivers.md`, with the machine-readable copy in `.qa/quality-contract.yaml` under `waivers:` if gate tooling consumes it. One register per repo - a per-package register in a monorepo is fine, a per-developer one is not.

---

# Waiver Register - <project>

**Reviewed:** 2026-08-21 · **Next review:** 2026-09-18 (sprint boundary) · **Reviewer:** @lead

| ID    | Scope                 | Paths                  | Reason                                                                                                     | Owner  | Created    | Expiry     | Status      |
| ----- | --------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------- | ------ | ---------- | ---------- | ----------- |
| W-001 | `duplication`         | `src/generated/**`     | Generated OpenAPI clients share structure by construction; the metric measures the generator, not our code | @maria | 2026-06-01 | 2026-12-01 | active      |
| W-002 | `e2e-testing`         | `apps/admin/**`        | Admin UI has 4 internal users and no automation harness; covered by a scripted manual pass each release    | @tomek | 2026-07-15 | 2026-10-15 | active      |
| W-003 | `integration-testing` | `src/billing/**`       | Needs a sandbox billing account; provisioning blocked on INFRA-412                                         | @maria | 2026-05-02 | 2026-08-01 | **EXPIRED** |
| W-004 | `flake-control`       | `e2e/checkout.spec.ts` | Fails when the runner clock skews past the token TTL; needs a fake clock. QA-431                           | @piotr | 2026-08-10 | 2026-09-10 | active      |

## Findings

- **W-003 expired 20 days ago.** `src/billing/**` has had no integration coverage since. INFRA-412 is still open. Either escalate the blocker or accept the risk explicitly at the contract level.
- **W-002 renewed twice.** The admin UI has been out of automation scope for nine months. That is a contract position now, not a temporary waiver - propose changing the contract row to COULD with the manual pass as its exit criterion.

## Machine-readable form

```yaml
waivers:
  - id: W-004
    scope: flake-control
    paths: ['e2e/checkout.spec.ts']
    reason: >-
      Fails when the CI runner's clock skews past the session token TTL, producing a
      false auth failure. Needs a fake clock in the fixture. Tracked in QA-431.
    owner: '@piotr'
    created: 2026-08-10
    expiry: 2026-09-10
    review_trigger: 'if the auth fixture changes'
    ticket: QA-431
    renewals: 0
```

## Field rules

| Field            | Rule                                                                                                             |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| `id`             | stable, referenced from code comments and CI output so a suppression can be traced back                          |
| `scope`          | the practice name from the contract catalog, not a free-text label                                               |
| `paths`          | as narrow as honest - a waiver on `src/**` is a contract change in disguise                                      |
| `reason`         | names the mechanism and, where relevant, the ticket. A symptom is not a reason.                                  |
| `owner`          | one person, or a named team with a named accountable lead                                                        |
| `created`        | when it was first granted, not when it was last renewed - this is how you spot the three-year "temporary" waiver |
| `expiry`         | a real date. Not "TBD", not "when we have time"                                                                  |
| `review_trigger` | the assumption whose breaking should reopen the waiver early                                                     |
| `ticket`         | required when the reason is blocked work                                                                         |
| `renewals`       | incremented on each renewal; two or more is a signal to change the contract instead                              |

## Referencing a waiver from code

Every in-code suppression points at its register entry, so the two never drift:

```ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- W-006
test.skip('checkout with expired token', ...); // W-004: clock skew, expires 2026-09-10
```

```yaml
# CI
- run: npm audit --audit-level=critical # W-007: transitive advisory, no patch, expires 2026-10-01
```

A suppression with no ID is a silent skip. That rule is what makes the register the single source of truth rather than one of several places skips live.

## Enforcing expiry

A register only works if expiry has teeth. Fail the build on an expired entry:

```js
// scripts/check-waivers.mjs
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

const { waivers = [] } = parse(readFileSync('.qa/quality-contract.yaml', 'utf8'));
const today = new Date().toISOString().slice(0, 10);
const expired = waivers.filter((w) => !w.expiry || w.expiry < today);

for (const w of expired) {
  console.error(`${w.id} (${w.scope}) expired ${w.expiry ?? 'never set'} - owner ${w.owner}`);
}
if (expired.length) process.exit(1);
```

```yaml
- name: Waiver expiry
  run: node scripts/check-waivers.mjs
```

Treat a missing expiry as expired. That single line is what stops "no expiry" from becoming the path of least resistance.

## The second enforcement rule

A diff that adds a suppression must add a register entry in the same change. Enforce it in review, or mechanically:

```yaml
- name: New suppressions must be registered
  run: |
    added=$(git diff origin/${{ github.base_ref }}...HEAD -U0 \
      | grep -E '^\+.*(eslint-disable|@ts-expect-error|\.skip\(|continue-on-error|istanbul ignore|v8 ignore)' \
      | grep -vE 'W-[0-9]+' || true)
    if [ -n "$added" ]; then
      echo "Unregistered suppressions added:"; echo "$added"; exit 1
    fi
```

This is the check that stops accumulation at the source. Everything else in the register is cleanup after the fact.
