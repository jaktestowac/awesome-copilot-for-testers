# Functional Test Plan — [Feature / Flow Name]

## 1. Goal

State the user or business outcome this plan is validating.

## 2. Test basis

- Source: [story / AC / URL / exploratory notes]
- Environment: [dev / stage / prod-like]
- Roles covered: [guest / user / admin / other]

## 3. Scope

### In scope

- [flow or capability]
- [flow or capability]

### Out of scope

- [explicitly excluded area]
- [explicitly excluded area]

## 4. Risk and priority map

| Area              | Priority | Why it matters   | Coverage notes                |
| ----------------- | -------- | ---------------- | ----------------------------- |
| [Checkout]        | High     | [Money movement] | [Happy + negative + recovery] |
| [Profile editing] | Medium   | [High usage]     | [Happy + boundary]            |

## 5. Scenario catalog

### SCN-001 — [Short scenario title]

- **Type:** happy / negative / boundary / permission / recovery / a11y-smoke
- **Priority:** High / Medium / Low
- **Preconditions:** [required starting state]
- **Steps:**
  1. [action]
  2. [action]
- **Expected result:** [observable outcome]
- **Notes:** [data, assumptions, open questions]

### SCN-002 — [Short scenario title]

- **Type:** happy / negative / boundary / permission / recovery / a11y-smoke
- **Priority:** High / Medium / Low
- **Preconditions:** [required starting state]
- **Steps:**
  1. [action]
  2. [action]
- **Expected result:** [observable outcome]
- **Notes:** [data, assumptions, open questions]

## 6. Assumptions and open questions

- [ASSUMPTION] [missing rule or expected behavior]
- [OPEN QUESTION] [what still needs clarification]

## 7. Automation handoff

| Scenario ID | Automation candidate | Why                     | Suggested next step         |
| ----------- | -------------------- | ----------------------- | --------------------------- |
| SCN-001     | high                 | [stable and repeatable] | [send to Playwright prompt] |
| SCN-002     | medium               | [needs data setup]      | [add fixtures first]        |

## 8. Exit signal

This plan is ready when:

- scope is explicit
- risky flows have deeper coverage
- assumptions are visible
- scenarios are identifiable and reusable
