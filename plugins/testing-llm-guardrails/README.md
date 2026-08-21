---
description: 'Tests the runtime validation around model output — schema conformance, PII leakage, moderation, refusal behaviour, tool-call safety — and the adversarial suite that tries to defeat it: direct prompt injection, jailbreaks, and indirect injection through retrieved documents, tool results and user content. Use when an LLM feature reaches real users, when a model can call tools or read untrusted content, when an AI feature needs a security-style test suite, or when asked whether a chatbot or agent can be manipulated.'
---

# Testing LLM Guardrails Plugin

This plugin gives an AI agent the capability to test the runtime validation around model output — schema, PII, moderation, rendering, tool authorization, resource caps and fail-closed behaviour — and to run an adversarial corpus through every content channel, including retrieval and tool results rather than just the chat box.

> **Before you run it:** Adversarial testing is security testing. The skill opens with an authorization gate: confirm in writing that the system is yours or that you have the owner's permission, name the target environment, and agree a window before running any case.

## What's inside

- `skills/testing-llm-guardrails/` — the agent skill with supporting resources (deterministic guardrail checks, adversarial corpus by category, indirect injection scenarios), synced from the repository's `skills/` directory, which is the source of truth

## Installation

Install from this repository's plugin marketplace (defined in `.github/plugin/marketplace.json`):

```
copilot plugin marketplace add jaktestowac/awesome-copilot-for-testers
copilot plugin install testing-llm-guardrails
```

## Usage

Once installed, ask the agent for example:

- "Can our support assistant be manipulated into calling the refund tool?"
- "Test the guardrails around this feature's model output"
- "Run an indirect prompt-injection pass on our RAG pipeline"

## Note on source of truth

The skill content is a copy of `skills/testing-llm-guardrails/` at the repository root. Do not edit the plugin copy directly — update the root skill and run `npm run plugin:materialize`.
