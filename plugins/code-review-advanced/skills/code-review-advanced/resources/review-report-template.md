# Advanced Code Review Report Template

Use this template for high-signal review output.
Replace placeholders and remove sections that are clearly not relevant, but keep the overall structure.

## Review Metadata

- **Scope:** `<PR / files / module / repository>`
- **Review goal:** `<correctness / architecture / readiness / security / test quality / mixed>`
- **Change type:** `<feature / bug fix / refactor / migration / test-only / infra>`
- **Assumptions / missing context:** `<list any gaps explicitly>`

## Executive Summary

`<2-5 sentences explaining what changed, what looks solid, and the overall risk profile.>`

## Recommendation

**Status:** `<approve / comment / request changes>`

**Why:**

- `<main reason 1>`
- `<main reason 2>`
- `<main reason 3>`

## What Looks Strong

- `<strength worth preserving>`
- `<good engineering decision>`
- `<useful test / design / operational choice>`

## Findings Overview

| Severity | Area            | Summary           | Evidence                       | Suggested action         |
| -------- | --------------- | ----------------- | ------------------------------ | ------------------------ |
| High     | Testing         | `<short finding>` | `<file / behavior / omission>` | `<smallest safe action>` |
| Medium   | Maintainability | `<short finding>` | `<file / behavior / omission>` | `<smallest safe action>` |

## Detailed Findings

### 1. `<Finding title>`

- **Severity:** `<Blocker / High / Medium / Low / Note>`
- **Area:** `<correctness / architecture / security / performance / testing / maintainability / operability>`
- **Evidence:** `<what in the code or diff supports this>`
- **Risk:** `<why this matters>`
- **Recommendation:** `<smallest safe improvement>`

### 2. `<Finding title>`

- **Severity:** `<Blocker / High / Medium / Low / Note>`
- **Area:** `<area>`
- **Evidence:** `<evidence>`
- **Risk:** `<risk>`
- **Recommendation:** `<recommendation>`

## Missing or Weak Coverage

- `<missing test scenario>`
- `<missing operational safeguard>`
- `<missing docs, migration notes, or failure diagnostics>`

## Follow-up Suggestions

- `<nice-to-have improvement>`
- `<longer-term design idea>`
- `<risk reduction step that does not block merge>`
