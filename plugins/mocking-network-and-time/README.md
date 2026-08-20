---
description: 'Decides what to fake and stubs it correctly: network interception with Playwright route or HAR replay, MSW handlers, fake clocks, and fixed timezones. Use when a test depends on a third party, when a date-sensitive test breaks overnight, when a suite is slow because it calls real services, or when a mocked test stays green while production is broken.'
---

# Mocking Network And Time Plugin

Decides what to fake and stubs it correctly: network interception with Playwright route or HAR replay, MSW handlers, fake clocks, and fixed timezones. Use when a test depends on a third party, when a date-sensitive test breaks overnight, when a suite is slow because it calls real services, or when a mocked test stays green while production is broken.

## What's inside

- `skills/mocking-network-and-time/` — the agent skill, generated from the repository's `skills/mocking-network-and-time/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install mocking-network-and-time
```

## Note on source of truth

The skill content is a copy of `skills/mocking-network-and-time/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
