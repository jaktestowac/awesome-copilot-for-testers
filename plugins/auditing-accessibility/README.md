---
description: 'Performs webpage and user-flow accessibility audits with WCAG 2.2 guidance, manual verification checklists, prioritized remediation output, and stakeholder-ready summaries. Use when auditing accessibility on a URL, triaging suspected a11y issues, or producing technical findings with practical next steps.'
---

# Auditing Accessibility Plugin

Performs webpage and user-flow accessibility audits with WCAG 2.2 guidance, manual verification checklists, prioritized remediation output, and stakeholder-ready summaries. Use when auditing accessibility on a URL, triaging suspected a11y issues, or producing technical findings with practical next steps.

## What's inside

- `skills/auditing-accessibility/` — the agent skill, generated from the repository's `skills/auditing-accessibility/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install auditing-accessibility
```

## Note on source of truth

The skill content is a copy of `skills/auditing-accessibility/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
