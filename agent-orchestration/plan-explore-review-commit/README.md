# VS Code Copilot Agents Pack (Architect + Test Architect)

**Created:** 2026-02-06

This pack defines a multi-agent workflow for **VS Code GitHub Copilot Chat custom agents** ("custom agents", previously called *custom chat modes*). It is optimized for an **experienced IT architect + test architect** workflow: discovery → architecture & plan → implementation → review → quality gates → documentation.

> These agents are meant to be **explicitly invoked** (e.g. `@Orchestrator …`, `@Researcher …`) and to **delegate** to each other using VS Code’s agent handoffs and subagent tooling.

## What you get

### Orchestration
- **Orchestrator** - *Orchestrator / Conductor*  
  Runs an iterative lifecycle: **Discover → Plan → Implement → Review → Commit → Verify**, with explicit "STOP" gates so you stay in control.

### Planning & Architecture
- **Planner** - *Autonomous Planner*  
  Produces a **phased plan** (TDD-first, incremental), plus risks, non-functional requirements, and acceptance criteria. Hands off to Orchestrator.
- **Researcher-subagent** - *Context & Research*  
  Reads code/docs, extracts conventions, finds similar examples.
- **Architect-subagent** - *Architecture & NFRs*  
  Produces ADR-ready decisions, trade-offs, and quality attributes checklist.
- **QA-Strategy-subagent** - *Test Strategy Designer*  
  Builds a test plan and test pyramid mapping (unit/integration/e2e/contract/visual/perf), plus coverage goals.

### Execution
- **Implementer-subagent** - *Implementer*  
  Implements **only** the delegated phase (tests-first), runs targeted test commands, keeps changes small.
- **Explorer-subagent** - *Scout / Codebase Cartographer*  
  Fast discovery across repositories: "what files exist, where is X used, what patterns are present".

### Assurance & Delivery
- **Code-Review-subagent** - *Reviewer*  
  Reviews changed files, enforces quality gates, flags risks, suggests improvements.
- **Security-Auditor-subagent** - *Security / Threat Model*  
  Threat-model-light review (auth, secrets, deps, OWASP-ish checks), red-flags only.
- **Docs-Writer-subagent** - *Documentation & CHANGELOG*  
  Produces docs/README sections, usage examples, and release notes from the diff.

## Installation options

### Option A - User-level agents (quickest, per machine)
Copy `agents/*.agent.md` into your VS Code prompts directory:
- **Windows:** `%APPDATA%\Code\User\prompts\` (or `Code - Insiders`)
- **macOS:** `~/Library/Application Support/Code/User/prompts/` (or `Code - Insiders`)
- **Linux:** `~/.config/Code/User/prompts/` (or `Code - Insiders`)

Reload VS Code.

### Option B - Repo-level agents (share with team)
Place files under: `.github/agents/`

## Recommended VS Code settings

```json
{
  "chat.agent.enabled": true,
  "chat.customAgentInSubagent.enabled": true
}
```

## How to use (typical workflow)

1. **Kick off:**  
   `@Orchestrator Build a solution for <problem>. Constraints: <…>.`

2. **Plan-first alternative:**  
   `@Planner Plan implementing <feature> with TDD, include risks and test strategy.`  
   Then click the handoff to Orchestrator.

3. **Docs/release notes:**  
   `@Docs-Writer Draft release notes and README updates for the last change set.`

4. **Analyze tech debt:**  
  `@Code-Review Analyze the last PR for tech debt and maintainability issues.`

5. **Analyze tech debt (full lifecycle):**  
  `@Orchestrator Analyze project for tech debt and maintainability issues.`
---

## Files
- `Orchestrator.agent.md`
- `Planner.agent.md`
- `Researcher-subagent.agent.md`
- `Explorer-subagent.agent.md`
- `Implementer-subagent.agent.md`
- `Code-Review-subagent.agent.md`
- `Architect-subagent.agent.md`
- `QA-Strategy-subagent.agent.md`
- `Security-Auditor-subagent.agent.md`
- `Docs-Writer-subagent.agent.md`

## Best practices
- Use Explorer and Researcher in parallel for large or unfamiliar areas.
- Keep phases small and TDD-first.
- Avoid manual testing unless explicitly requested.
- Stop at commit gates and wait for user approval.

## Design principles (from template-temp)
- Context conservation: delegate heavy reading, summarize findings.
- Parallelism: run independent subagent tasks together.
- Structured outputs: each agent returns consistent, strict formats.
- Tool minimalism: only declare tools actually needed.
