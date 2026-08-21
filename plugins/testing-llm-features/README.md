---
description: 'Builds an offline eval suite for LLM-powered features: golden reference cases per prompt template, deterministic scoring where possible, a regression gate on prompt, model and retrieval changes, and CI wiring with promptfoo, Vitest or deepeval. Use when a product ships prompts, agents or RAG, when a model or prompt upgrade needs a regression check, when LLM output is currently verified by someone eyeballing it, or when asked how to test a feature whose output is non-deterministic.'
---

# Testing LLM Features Plugin

This plugin gives an AI agent the capability to build an offline eval suite for LLM-powered features: golden reference cases per prompt template, the cheapest scoring strategy that can actually fail, pinned determinism, and a regression gate that fires when a prompt, model or retrieval change degrades quality.

## What's inside

- `skills/testing-llm-features/` — the agent skill with supporting resources (eval case taxonomy, scoring strategies and judge rubrics, promptfoo and Vitest implementations with CI wiring), synced from the repository's `skills/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install testing-llm-features
```

## Usage

Once installed, ask the agent for example:

- "Design an eval suite for our ticket summarisation feature"
- "We are upgrading the model — what would regress?"
- "Wire an eval regression gate into CI"

## Note on source of truth

The skill content is a copy of `skills/testing-llm-features/` at the repository root. Do not edit the plugin copy directly — update the root skill and run `npm run plugin:materialize`.
