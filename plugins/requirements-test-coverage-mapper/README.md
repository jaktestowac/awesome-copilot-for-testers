---
description: 'Maps requirements (PRD, user stories, acceptance criteria) to planned test coverage via a Requirements Traceability Matrix, exposing coverage gaps, risks, test levels, prioritization, and automation candidates. Use when designing coverage from a specification, checking coverage completeness for a PRD or user story, finding missing acceptance criteria, or building a risk-based regression strategy. When the tests already exist and the matrix has to be extracted from them, verified, and kept accurate, use the tracing-requirements-to-code skill instead.'
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
