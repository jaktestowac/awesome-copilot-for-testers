---
name: creating-orchestration-packs
description: 'Creates agent orchestration packs: cooperating `.agent.md` files with an orchestrator, subagents, matched handoffs, minimal tool grants, and a shared handoff packet contract. Use when one agent role is too broad for a job, when a workflow needs explore, plan, implement, review, and verify as separate roles, or when a pack fails the orchestration lint because a handoff target does not resolve.'
argument-hint: 'The workflow to orchestrate, the roles it needs, which steps run in parallel, and where artifacts should be written'
user-invocable: true
---

# Creating Orchestration Packs

Use this skill when a job is too big for one custom agent and splitting it into cooperating roles would produce better work rather than just more files.

A pack is a folder of `.agent.md` files plus a README, living under `agent-orchestration/`. One agent orchestrates and delegates; the rest do the work and return a structured **handoff packet**. The orchestrator synthesizes.

The value comes from the same place it comes from in human teams: **an agent with a narrow scope and a clear output contract does better work than one asked to do everything.** The cost is coordination, and a pack that costs more coordination than it saves is worse than a single good agent.

## When to Use

- a workflow has genuinely distinct phases with different tool needs
- one agent's instruction file has grown into several unrelated roles
- explore, plan, implement, review, and verify would each benefit from a fresh, narrow context
- two branches of work could run in parallel and be merged
- an existing pack fails `npm run lint` because a handoff target does not resolve

## Operating Principles

- **A role earns its file.** Each agent has a scope another agent does not, or it should be merged.
- **The orchestrator delegates and never implements.** The moment it writes code, its context fills and the pack collapses into one agent with extra steps.
- **Every handoff target resolves.** `handoffs[].agent` and `agents[]` entries must exactly match a `name:` in the same pack. CI enforces this.
- **Tools are granted per role, minimally.** An explorer that cannot write files cannot accidentally write files.
- **One output contract, shared by every agent.** Mixed return shapes make the orchestrator's synthesis unreliable.
- **Names are unique across packs**, because users install more than one.

## Workflow

### Phase 0: Check that a pack is the right shape

A pack is justified when at least two of these hold:

- the phases need different tools, and granting the union to one agent would be over-privileged
- a phase benefits from a fresh context rather than one carrying everything before it
- two phases could genuinely run in parallel
- a review step is more useful when it did not write the thing it reviews
- the workflow is long enough that one agent would lose the early instructions by the end

When only one holds, write a single custom agent instead and hand off to `creating-custom-agents`. A three-agent pack for a two-step job is coordination overhead with no return.

### Phase 1: Cut the roles

Split by **what the role needs and what it produces**, not by topic.

The pattern that works, from the packs already in this repository:

| Role | Scope | Tools |
| --- | --- | --- |
| Orchestrator | Delegates, synthesizes, never implements | `read`, `agent`, `search`, `edit` |
| Explorer | Gathers facts, returns findings, writes no product code | `read`, `search`, `web`, `edit` |
| Planner | Turns findings into a prioritized plan | `read`, `search`, `edit` |
| Implementer | Writes and runs code within the plan | `vscode`, `execute`, `read`, `edit`, `search` |
| Reviewer | Judges the output, did not write it | `read`, `search`, `edit` |
| Runner and verifier | Executes, diagnoses, reports status | `vscode`, `execute`, `read`, `edit`, `search` |

Two rules that decide the cut:

- **the reviewer must not be the implementer**, or the review is a self-assessment
- **explorers write findings, never product code**, which is why their grant excludes `execute`

### Phase 2: Grant tools per role

Use the canonical grouped vocabulary: `'vscode'`, `'execute'`, `'read'`, `'edit'`, `'search'`, `'web'`, `'agent'`, `'todo'`, plus `'playwright/*'` for Playwright MCP.

The lint applies heuristic checks and warns when:

- an agent told to run tests or commands has no `'execute'`
- an agent told to write files or documents has no `'edit'`

Note that `'edit'` is needed by nearly every agent in practice, because agents write their handoff artifacts to disk. An explorer that returns a summary file needs `'edit'` even though it writes no product code.

Only the orchestrator gets `'agent'`. A subagent that can spawn subagents produces a tree nobody can follow.

Declare a Playwright MCP dependency in the README. An agent with `'playwright/*'` and no configured MCP server fails in a way that looks like a pack defect.

### Phase 3: Wire the handoffs

The orchestrator declares both lists:

```yaml
agents:
  - OpenAPI Explorer
  - Test Planner
handoffs:
  - label: Explore OpenAPI
    agent: OpenAPI Explorer
    prompt: Analyze the OpenAPI spec and return a Handoff Packet.
    send: false
```

The rule CI enforces, in `scripts/lint-orchestration.js`: **every `handoffs[].agent` and every `agents[]` entry must exactly match a `name:` declared by an agent in the same pack.** Exact match, including spaces, capitalization, and punctuation. `FE Explorer (Playwright MCP)` and `FE Explorer` are different agents, and the second one does not exist.

Subagents declare `agents: []` and `user-invocable: false`. Only the orchestrator is entered directly.

### Phase 4: Fix the output contract

Every subagent returns the same shape. Without this, the orchestrator is synthesizing across incompatible outputs and its summary becomes guesswork.

The house contract is the **Handoff Packet**:

- **Objective** - what this agent was asked to do
- **Inputs** - what it received and what it went and found
- **Findings** - what it learned
- **Decisions** - what it chose, and why
- **Artifacts** - files written, with paths
- **Gaps** - what it could not determine
- **Risks** - what the next agent should watch for
- **Next action** - what it recommends happens next

`Gaps` is the one that carries weight. Without it, a subagent that could not determine something produces a confident summary and the orchestrator propagates the confidence.

Artifacts go to `.ai-outputs/`, per the repository convention.

### Phase 5: Write the README

Every pack needs one, with frontmatter carrying a `description` for the README generator. It contains:

- what the pack does, in one paragraph
- an agent-and-role table
- the typical flow, including which steps run in parallel
- installation: copy the `*.agent.md` files into the user prompts directory or `.github/agents/`
- prerequisites: MCP servers, specs, environments
- the output contract
- a pointer to a lighter variant if one exists

### Phase 6: Validate

```bash
npm run lint       # frontmatter, orchestration, plugin sync
npm run generate   # regenerate the README tables
npm run check      # verify the README is in sync
```

Then run the pack against a real task. The failures that only appear in a live run:

- an orchestrator that starts implementing when a subagent returns something incomplete
- a subagent that lacks a tool it needs and reports success anyway
- a handoff prompt too vague for the subagent to act on
- two agents doing the same work because their scopes overlap
- a packet whose `Gaps` section is always empty, which means the agents are not using it

Use `./resources/orchestration-quality-checklist.md` before shipping.

## Common Failure Modes

- an orchestrator that implements, filling its context and defeating the split
- a handoff naming an agent that does not exist in the pack, which is the lint's hard error
- agent names duplicated across packs, so installing two packs breaks both
- every agent granted every tool, removing the safety the split provides
- subagents returning free-form prose in different shapes
- a reviewer that also implements, so the review approves its own work
- five agents where two would do
- no README, so nobody can install it or knows the Playwright MCP prerequisite
- artifacts written to the repository root instead of `.ai-outputs/`

## Resource Map

- `./resources/orchestration-pack.template.md` - a complete minimal pack: orchestrator plus two subagents plus README, ready to copy
- `./resources/handoff-packet.md` - the output contract, section by section, with a worked example and the common ways it degrades
- `./resources/orchestration-quality-checklist.md` - pre-ship checks covering naming, tools, handoffs, contract, and the live-run failures

## Related Skills

- `creating-custom-agents` - when one agent is the right answer, or for writing each agent file in the pack
- `creating-skills` - when the expertise belongs in a skill the agents reference rather than in an agent body
- `creating-prompts` - when the entry point should be a prompt that routes to the orchestrator
- `creating-plugins` - when the pack should ship as an installable plugin
- `creating-instructions` - for conventions that should apply to every agent rather than one

## Definition of Done

This skill is complete when:

- a pack is justified: at least two of the Phase 0 conditions hold, and a single agent was genuinely considered
- every role has a scope no other role has
- the orchestrator delegates only, and is the only agent with `'agent'`
- every `handoffs[].agent` and `agents[]` entry exactly matches a `name:` in the same pack
- agent names are unique across every pack in the repository
- tool grants are minimal per role, and agents that run commands have `'execute'`
- every subagent returns the same handoff packet shape, including a `Gaps` section
- artifacts are written to `.ai-outputs/`
- the README covers agents, flow, installation, prerequisites, and the output contract
- `npm run lint`, `npm run generate`, and `npm run check` pass
- the pack has been run against a real task, not only linted
