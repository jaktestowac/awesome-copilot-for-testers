# UI + API Test Automation Orchestration Pack

An orchestration pack that coordinates specialized subagents to explore an application (frontend via Playwright MCP, backend via its OpenAPI spec), plan test coverage, implement UI and API tests, review the solution, and verify it end-to-end.

## Agents and flow

| Agent                          | Role                                                              |
| ------------------------------ | ----------------------------------------------------------------- |
| `QA Orchestrator`              | Coordinates the whole flow; delegates, never implements           |
| `OpenAPI Explorer`             | Analyzes the OpenAPI spec: endpoints, data models, test scenarios |
| `FE Explorer (Playwright MCP)` | Explores the UI live: flows, selectors, risks                     |
| `Test Planner`                 | Combines exploration results into a prioritized test plan         |
| `FE Test Implementer`          | Implements Playwright UI tests from the plan                      |
| `BE Test Implementer`          | Implements API tests from the plan                                |
| `Solution Reviewer`            | Reviews the implemented tests for quality and anti-patterns       |
| `Test Runner & Verifier`       | Runs the suites, diagnoses failures, verifies the solution        |

Typical flow: explore (FE + BE in parallel) → plan → implement (FE + BE in parallel) → review → run & verify. Exploration summaries and reports are written to `.ai-outputs/`.

For a lighter-weight version of this pack, see [`../ui-api-automation-minimal/`](../ui-api-automation-minimal/).

## Installation

Copy the `*.agent.md` files from this folder into either:

- your VS Code user prompts directory (per machine), or
- the repository's `.github/agents/` folder (shared with the team).

Reload VS Code, then start with `@QA Orchestrator`.

## Prerequisites

- The **Playwright MCP server** must be configured in VS Code - agents in this pack declare `playwright/*` tools and cannot explore the UI without it. See [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp).
- An OpenAPI spec (file or URL) for the backend exploration.

## Output contract

Every subagent returns a **Handoff Packet** (objective, inputs, findings, decisions, artifacts, gaps, risks, next action) that the orchestrator synthesizes into a final summary.
