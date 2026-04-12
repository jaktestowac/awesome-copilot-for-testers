---
name: creating-custom-agents
description: "Creates GitHub Copilot custom agents (`.agent.md`) for VS Code. Use when defining a specialized agent role, selecting a minimal toolset, referencing supporting skills, or shipping install-ready agent examples with clear boundaries and collaboration rules."
argument-hint: "Agent purpose, target users, tool needs, and nearby skills or prompts"
user-invocable: true
---

# Creating Custom Agents

Use this skill when a reusable role needs its own identity instead of hiding inside a prompt or a skill.
It helps create custom agents that are focused, tool-aware, and easy to extend without turning into tiny chaotic governments.

## When to Use

Use this skill when the user asks for things like:

- "create a custom agent for this workflow"
- "design an agent with limited tools"
- "turn this expert role into a `.agent.md` file"
- "define how an orchestrator should delegate to specialists"
- "fix an agent that is too broad or too verbose"

Typical scenarios:

- creating a new single-purpose agent
- building a specialist for a multi-agent workflow
- tightening an existing agent's scope and tool access
- preparing a reusable example agent for a shared repository

## Outcome Standard

A strong custom agent contribution usually includes:

- a crisp role and mission
- a deliberate toolset rather than blanket access
- clear guidance on when the agent should be used
- boundaries that stop the agent from absorbing work better handled by prompts, skills, or instructions
- an install-ready `.agent.md` file plus reference material

## Agent Design Rules

- **Role first** - define who the agent is and what it owns before writing any workflow guidance.
- **Minimal tools** - only grant the tools the role genuinely needs.
- **Skills for procedure** - reference skills for reusable workflows instead of stuffing the entire playbook into the agent.
- **Prompts for entrypoints** - if users need a guided starting command, create a prompt file in addition to the agent.
- **Boundaries matter** - explain what the agent should not do, especially when nearby agents overlap.

## Workflow

### Phase 0: Decide whether an agent is the right primitive

Choose an agent only when the work needs a persistent role, a specific tool profile, or a distinct collaboration pattern.
If the need is only a reusable task starter, prefer a prompt. If the need is procedural knowledge, prefer a skill.

### Phase 1: Study adjacent artifacts

Before drafting:

- inspect similar agents, prompts, and skills already in the repository
- identify the smallest role boundary that still feels useful
- note what the agent should own directly versus delegate or reference

### Phase 2: Define the agent contract

Clarify or infer:

- the agent's mission
- the main user requests it should handle
- the tools it must have and the ones it should avoid
- the output style or deliverables it should consistently produce
- any collaboration or orchestration behavior

### Phase 3: Draft the `.agent.md` file

Use the supporting files below while drafting:

- `./resources/custom-agent.template.agent.md`
- `./resources/custom-agent.example.agent.md`

A good first draft should cover:

- frontmatter for name, description, model, and tools
- a role section describing what the agent is responsible for
- a short workflow or operating rhythm
- constraints or anti-patterns
- output expectations

### Phase 4: Add the reference bundle

At minimum, provide:

- the main `.agent.md` file
- one example or template for reuse
- a summary of why the chosen toolset and boundaries make sense

If the agent is part of a larger workflow, mention the prompts or skills it should work with.

### Phase 5: Validate before handoff

Check the result against `./resources/custom-agent-quality-checklist.md`.

Pay special attention to:

- whether the description clearly signals when the agent should be used
- whether the tools are minimal and intentional
- whether the agent body defines identity and behavior instead of duplicating a skill
- whether the output style is specific enough to be useful

## Common Failure Modes

- giving the agent a vague job like "help with everything"
- granting too many tools out of convenience
- embedding detailed workflow instructions that belong in a skill
- copying repository instructions into the agent file
- creating a new agent when a prompt or skill would have been enough

## Resource Map

- `./resources/custom-agent.template.agent.md` - scaffold for a focused custom agent
- `./resources/custom-agent.example.agent.md` - worked example of a bounded specialist agent
- `./resources/custom-agent-quality-checklist.md` - final review checklist before shipping

## Definition of Done

A task using this skill is complete when:

- the role and scope are easy to explain in one short paragraph
- the toolset matches the actual responsibilities
- the file is install-ready and internally consistent
- supporting template or example material exists for reuse
- the agent passes the quality checklist without obvious overlap or confusion
