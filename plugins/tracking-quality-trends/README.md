---
description: 'Turns point-in-time quality readings into a trend: archives each run, diffs against the previous one, and reports direction per metric - practices newly present or regressed, coverage movement, flake rate, waivers expiring, eval scores - using limit/current/goal framing. Use when quality reporting is a series of disconnected snapshots, when a team needs to show improvement over a quarter, when a number is quoted with no baseline, or when a regression in the quality system itself should be visible.'
---

# Tracking Quality Trends Plugin

This plugin gives an AI agent the capability to turn point-in-time quality readings into a trend: archived runs, direction per metric in limit/current/goal framing, and the structural changes a snapshot never shows — thresholds lowered, gates made non-blocking, waivers renewed.

## What's inside

- `skills/tracking-quality-trends/` — the agent skill with supporting resources (metric set with limits, caveats and gaming risks; trend report template with history layout), synced from the repository's `skills/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install tracking-quality-trends
```

## Usage

Once installed, ask the agent for example:

- "Is our quality improving or just being reported differently?"
- "Build a trend report for this quarter"
- "Did any of our gates quietly stop blocking?"

## Note on source of truth

The skill content is a copy of `skills/tracking-quality-trends/` at the repository root. Do not edit the plugin copy directly — update the root skill and run `npm run plugin:materialize`.
