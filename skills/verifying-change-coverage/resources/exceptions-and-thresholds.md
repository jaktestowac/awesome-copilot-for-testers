# Thresholds and Exceptions

## Thresholds

Set them in the quality contract, per profile, and gate on **changed lines only**.

| Profile              | Diff line coverage | Diff branch coverage | Repo coverage     |
| -------------------- | ------------------ | -------------------- | ----------------- |
| `prototype-internal` | none (report only) | none                 | none              |
| `standard`           | ≥ 75%              | ≥ 60%                | must not decrease |
| `critical-regulated` | ≥ 80%              | ≥ 75%                | must not decrease |

Escalation overrides the threshold: on files tagged `auth`, `critical-path`, `db-migration`, or containing a `new-endpoint`, **uncovered new branches are a finding regardless of the percentage**. A file can hit 90% and still have the one branch that matters untested.

### Why not a repo-wide floor

A repo-wide floor on a legacy codebase is unreachable, so it gets set below the current value - where it can only ever detect catastrophe - or it blocks everything and gets deleted. Either way it stops being a gate. "Changed lines must be covered; repo coverage must not decrease" is enforceable from day one at any starting point.

### Rolling out without a revolt

1. **Measure and report only**, one or two iterations. Post the number on PRs; change nothing.
2. **Warn** on below-threshold, still non-blocking. Fix the loud false positives - usually merge and path problems.
3. **Block** on escalated files first: auth, critical path, migrations, new endpoints.
4. **Block** everywhere.

Skipping to step 4 is how coverage gates get reverted. The intermediate steps also buy you the credibility to keep it.

## Legitimate exception classes

Uncovered is not automatically a defect. These are acceptable, and each needs the reason recorded:

| Class                          | Example                                                     | Why acceptable                                 |
| ------------------------------ | ----------------------------------------------------------- | ---------------------------------------------- |
| Instrumentation                | `logger.debug(...)`, metric increments, span attributes     | no behaviour to assert                         |
| Exhaustiveness guards          | `default: assertNever(x)`, `throw new Error('unreachable')` | the type system already proves it              |
| Environment shims              | `process.env.NODE_ENV === 'production'` branches            | the other branch is the tested one             |
| Third-party glue with no logic | a one-line SDK pass-through                                 | asserting it tests the SDK, not your code      |
| Catastrophic-failure paths     | out-of-memory handlers, `process.on('uncaughtException')`   | cannot be simulated meaningfully in unit scope |

Not acceptable, however it is framed:

- validation and error paths ("it's just the error case" - that is the case users hit)
- new conditionals on money, permissions, or data mutation
- anything on a file tagged `auth`, `critical-path`, or `db-migration`
- code that is hard to test because of its design - that is a design finding, not an exception

## Recording an exclusion

An exclusion is a waiver. Give it the same discipline (`governing-quality-waivers`): reason, owner, expiry.

Where the runner supports inline markers, always pair the marker with a reason on the same line:

```ts
/* v8 ignore next 3 -- unreachable: exhaustiveness guard, @maria, review 2026-12-01 */
default:
  assertNever(kind);
```

```ts
/* istanbul ignore else -- production-only branch, covered by the smoke suite, @tomek */
if (process.env.NODE_ENV !== 'production') {
```

Config-level exclusions belong in the contract, not scattered in the runner config:

```ts
// vitest.config.ts
coverage: {
  exclude: [
    'src/generated/**',        // codegen output - regenerate, do not test
    'src/**/*.stories.tsx',    // Storybook fixtures
    '**/*.d.ts',
  ],
}
```

Rules:

- **A bare `ignore` with no reason is a defect in the review, not a coverage exception.** Reject it the way you would reject a bare `@ts-expect-error`.
- **Never exclude a directory to move a number.** Excluding `src/services/**` because it is untested converts a visible gap into an invisible one.
- **Audit exclusions on every contract re-derivation.** They accumulate silently and each one shrinks what the gate can see.
- **Count them.** Report "diff coverage 82%, 3 exclusions in scope" - the exclusion count is part of the result.

## Reporting an exception in the verdict

```
src/payments/refund.ts   changed 41  covered 34  (83%)  branches 5/8
  UNCOVERED 88-91   untested logic - partial-refund rounding path. FINDING: needs a test.
  UNCOVERED 104     instrumentation - audit log call. Accepted.
  PARTIAL   77      branch: `if (order.currency !== 'PLN')` false path never taken.
                    FINDING: escalated (critical-path).
```

Three groups, three different judgements, one file. That is the level of detail a coverage report needs to be actionable. A single "83%" would have hidden the branch finding entirely - which is the whole argument for doing this per group rather than per file.
