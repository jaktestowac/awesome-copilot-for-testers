---
description: 'Human review protocol for whether AI output is grounded in its sources: claim-by-claim attribution, hallucination classes, citation verification, sampling that is defensible, and a recorded attestation because groundedness cannot be fully automated. Also covers the responsible-AI pass - harmful output, bias, disclosure and privacy. Use when reviewing a RAG or summarisation feature, when factuality matters more than fluency, or when an eval suite needs the human check it cannot replace.'
---

# Reviewing AI Output Groundedness Plugin

This plugin gives an AI agent the capability to run a human review protocol on AI output: claim-by-claim source attribution, hallucination classes, citation verification, omission checks, retrieval-versus-generation attribution, and a responsible-AI pass — ending in an attestation with stated limitations rather than a bare score.

## What's inside

- `skills/reviewing-ai-output-groundedness/` — the agent skill with supporting resources (sampling and claim-decomposition protocol with verdict classes, responsible-AI checklist covering harm, bias, privacy, disclosure and calibration), synced from the repository's `skills/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install reviewing-ai-output-groundedness
```

## Usage

Once installed, ask the agent for example:

- "Review whether our RAG answers are actually grounded in the sources"
- "Check these summaries claim by claim against their retrieved documents"
- "Run a responsible-AI pass before we launch this feature"

## Note on source of truth

The skill content is a copy of `skills/reviewing-ai-output-groundedness/` at the repository root. Do not edit the plugin copy directly — update the root skill and run `npm run plugin:materialize`.
