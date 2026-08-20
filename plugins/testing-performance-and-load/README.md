---
description: 'Designs and runs performance and load tests: workload modelling from real traffic, thresholds tied to SLOs, warmup and ramp shapes, percentile-based analysis, and lightweight CI perf checks with k6 or Artillery. Use when a feature has latency or throughput requirements, when "it feels slow" needs to become a number, when a launch needs a capacity check, or when a performance result needs interpreting rather than just collecting.'
---

# Testing Performance And Load Plugin

Designs and runs performance and load tests: workload modelling from real traffic, thresholds tied to SLOs, warmup and ramp shapes, percentile-based analysis, and lightweight CI perf checks with k6 or Artillery. Use when a feature has latency or throughput requirements, when "it feels slow" needs to become a number, when a launch needs a capacity check, or when a performance result needs interpreting rather than just collecting.

## What's inside

- `skills/testing-performance-and-load/` — the agent skill, generated from the repository's `skills/testing-performance-and-load/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install testing-performance-and-load
```

## Note on source of truth

The skill content is a copy of `skills/testing-performance-and-load/` at the repository root. Do not edit the plugin copy
directly — update the root skill and run `npm run plugin:materialize`.
