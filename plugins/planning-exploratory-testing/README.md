---
description: 'Runs session-based exploratory testing: writes charters, timeboxes sessions, applies coverage heuristics and tours, captures notes as evidence, debriefs, and converts findings into bug reports and automation candidates. Use when a feature needs testing before requirements settle, when scripted cases keep passing while users hit problems, when a release needs a risk sweep with limited time, or when the request mentions charters or exploratory sessions.'
---

# Planning Exploratory Testing Plugin

Runs session-based exploratory testing: writes charters, timeboxes sessions, applies coverage heuristics and tours, captures notes as evidence, debriefs, and converts findings into bug reports and automation candidates. Use when a feature needs testing before requirements settle, when scripted cases keep passing while users hit problems, when a release needs a risk sweep with limited time, or when the request mentions charters or exploratory sessions.

## What's inside

- `skills/planning-exploratory-testing/` — the agent skill, generated from the repository's `skills/planning-exploratory-testing/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install planning-exploratory-testing
```

## Note on source of truth

The skill content is a copy of `skills/planning-exploratory-testing/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
