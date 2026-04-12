# Regression Scope Report

## 1. Change summary

- Source of change: [PR / diff / release notes / hotfix]
- Target environment: [dev / stage / prod-like]
- Critical flows in play: [auth / checkout / notifications / admin / etc.]

## 2. Regression risk table

| Area               | Risk   | Why it is affected                 | Must retest                                | Can sample         | Setup / notes            |
| ------------------ | ------ | ---------------------------------- | ------------------------------------------ | ------------------ | ------------------------ |
| [Checkout summary] | High   | [shared price logic changed]       | [recalculate totals, coupon, tax]          | [visual polish]    | [seed cart and discount] |
| [Profile update]   | Medium | [shared validation helper changed] | [save valid profile, reject invalid email] | [avatar crop flow] | [standard user role]     |

## 3. Minimal confidence suite

- `RS-001` [critical scenario]
- `RS-002` [critical scenario]
- `RS-003` [critical scenario]

## 4. Deferred or watch-list items

- [lower priority area worth tracking]
- [lower priority area worth tracking]

## 5. Open questions

- [unknown dependency or risk propagation]
- [missing environment or data assumption]
