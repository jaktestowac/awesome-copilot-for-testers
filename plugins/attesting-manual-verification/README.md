---
description: 'Records human verification - code review, exploratory sessions, UAT, accessibility passes, UX and observability reviews - as dated, attributed attestations in a register, so human-centric practices stay in the quality contract without pretending to be automated checks. Use when a strategy requires verification no tool can prove, when sign-off evidence is scattered across chats and tickets, when a gap matrix needs to distinguish "attested" from "passed", or when an audit asks who verified what and when.'
---

# Attesting Manual Verification Plugin

This plugin gives an AI agent the capability to record human verification - code review, exploratory sessions, UAT, accessibility passes, UX and observability reviews - as dated, attributed attestations, so practices no tool can prove stay in the quality contract without being reported as automated passes.

## What's inside

- `skills/attesting-manual-verification/` - the agent skill with a supporting resource (attestation register format, per-practice guidance, expiry and staleness rules, release-pack output), synced from the repository's `skills/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install attesting-manual-verification
```

## Usage

Once installed, ask the agent for example:

- "Record the exploratory testing we did on this build"
- "Which human verifications are missing for this release?"
- "Is our code-review practice actually attested, or just configured?"

## Note on source of truth

The skill content is a copy of `skills/attesting-manual-verification/` at the repository root. Do not edit the plugin copy directly - update the root skill and run `npm run plugin:materialize`.
