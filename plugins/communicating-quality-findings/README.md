---
description: 'Shapes QA output for the person who has to act on it: result and blocker in the first two lines, one decision per report, findings ordered by what they cost, the long artifact in a file and the decisions in the message, and magnitude stated in units the reader can count. Use when a report is accurate but nobody acts on it, when a finding set is too long to read under time pressure, when the same findings must be retold for a developer, a release manager, and an on-call engineer, or when the request mentions "too long", "make this readable", "just tell me what to do", "so what", or "summarize this for stakeholders". Pairs with unslop-answers, which makes the same report honest.'
---

# Communicating Quality Findings Plugin

Shapes QA output for the person who has to act on it: result and blocker in the first two lines, one decision per report, findings ordered by what they cost, the long artifact in a file and the decisions in the message, and magnitude stated in units the reader can count. Use when a report is accurate but nobody acts on it, when a finding set is too long to read under time pressure, when the same findings must be retold for a developer, a release manager, and an on-call engineer, or when the request mentions "too long", "make this readable", "just tell me what to do", "so what", or "summarize this for stakeholders". Pairs with unslop-answers, which makes the same report honest.

## What's inside

- `skills/communicating-quality-findings/` - the agent skill, generated from the repository's `skills/communicating-quality-findings/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install communicating-quality-findings
```

## Note on source of truth

The skill content is a copy of `skills/communicating-quality-findings/` at the repository root. Do not edit the plugin copy
directly - update the root skill and run `npm run plugin:materialize`.
