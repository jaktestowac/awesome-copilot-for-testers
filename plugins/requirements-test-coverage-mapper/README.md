---
description: 'Plugin that maps requirements (PRD, user stories, acceptance criteria) to test coverage via a Requirements Traceability Matrix, exposing gaps, risks, and automation candidates.'
---

# Requirements Test Coverage Mapper Plugin

This plugin gives an AI agent the capability to map requirements (PRD, user stories, acceptance criteria) to comprehensive test coverage. It produces a Requirements Traceability Matrix (RTM), a gap and ambiguity report, risk-based test prioritization, and automation/CI recommendations.

## What's inside

- `skills/requirements-test-coverage-mapper/` — the agent skill (synced from the repository's `skills/` directory, which is the source of truth)

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install requirements-test-coverage-mapper
```

## Usage

Once installed, ask the agent to map requirements to test coverage, for example:

- "Map this PRD to test coverage and show me the gaps"
- "Build an RTM for these user stories"
- "Which requirements are missing acceptance criteria or tests?"

## Note on source of truth

The skill content is a copy of `skills/requirements-test-coverage-mapper/` at the repository root. Do not edit the plugin copy directly — update the root skill and re-sync.
