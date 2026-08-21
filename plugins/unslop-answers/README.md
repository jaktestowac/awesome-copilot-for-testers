---
description: 'Cuts AI tells from what the agent says about its own work: completion claimed without a run, invented file paths and API names, terminal output that was never produced, findings with no location, percentages with no denominator, absence claimed from one grep, effort narration instead of results, hedge stacking, buried blockers, puffery in a bug title. Use whenever reporting a result, a fix, a review finding, a test outcome, a coverage or flake number, a root cause, or a release recommendation, and when the request mentions "prove it", "did you actually run it", "be specific", "no fluff", "stop hedging", or "is this real". Must always apply to answers about your own work.'
---

# Unslop Answers Plugin

Cuts AI tells from what the agent says about its own work: completion claimed without a run, invented file paths and API names, terminal output that was never produced, findings with no location, percentages with no denominator, absence claimed from one grep, effort narration instead of results, hedge stacking, buried blockers, puffery in a bug title. Use whenever reporting a result, a fix, a review finding, a test outcome, a coverage or flake number, a root cause, or a release recommendation, and when the request mentions "prove it", "did you actually run it", "be specific", "no fluff", "stop hedging", or "is this real". Must always apply to answers about your own work.

## What's inside

- `skills/unslop-answers/` — the agent skill, generated from the repository's `skills/unslop-answers/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install unslop-answers
```

## Note on source of truth

The skill content is a copy of `skills/unslop-answers/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
