---
description: 'Applies OWASP-informed security testing within a tester scope: an authorization gate before any probing, authorization matrices, broken access control and IDOR checks, input validation and injection observation, session and auth behaviour, and safe reporting of findings. Use when testing auth-protected features, when a security review needs QA coverage, when an exploratory session surfaced something security-shaped, or when access control needs a systematic check rather than a spot check.'
---

# Testing Application Security Plugin

Applies OWASP-informed security testing within a tester scope: an authorization gate before any probing, authorization matrices, broken access control and IDOR checks, input validation and injection observation, session and auth behaviour, and safe reporting of findings. Use when testing auth-protected features, when a security review needs QA coverage, when an exploratory session surfaced something security-shaped, or when access control needs a systematic check rather than a spot check.

## What's inside

- `skills/testing-application-security/` — the agent skill, generated from the repository's `skills/testing-application-security/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install testing-application-security
```

## Note on source of truth

The skill content is a copy of `skills/testing-application-security/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
