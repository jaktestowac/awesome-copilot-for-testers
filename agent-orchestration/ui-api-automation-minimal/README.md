# UI + API Test Automation Orchestration Pack (Minimal)

A minimal orchestration pack that coordinates a small set of subagents to explore an application (OpenAPI and/or Playwright MCP), plan test coverage, set up a test framework if needed, and implement UI and API tests.

This is the lighter sibling of [`../ui-api-automation/`](../ui-api-automation/) — fewer agents, no dedicated reviewer or runner stage.

## Agents and flow

| Agent | Role |
| ----- | ---- |
| `QA Orchestrator (Minimal)` | Coordinates the flow; delegates, never implements |
| `Explorer Agent (Minimal)` | Explores the OpenAPI spec and/or the UI via Playwright MCP |
| `Test Planner (Minimal)` | Combines exploration results into a prioritized plan |
| `Test Framework Starter Agent (Minimal)` | Sets up a test framework when none exists |
| `Test Coder Agent (Minimal)` | Implements API or UI tests from the plan |

Typical flow: explore → plan → (optional) framework setup → implement. The orchestrator writes a timestamped `AUTOMATION_SUMMARY.md` to `.ai-outputs/`.

## Installation

Copy the `*.agent.md` files from this folder into either:

- your VS Code user prompts directory (per machine), or
- the repository's `.github/agents/` folder (shared with the team).

Reload VS Code, then start with `@QA Orchestrator (Minimal)`.

## Prerequisites

- For UI exploration, the **Playwright MCP server** must be configured in VS Code — see [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp).
- For API exploration, an OpenAPI spec (file or URL).

## Output contract

Every subagent returns a **Handoff Packet** (objective, inputs, findings, decisions, artifacts, gaps, risks, next action) that the orchestrator synthesizes into a final summary.
