---
name: creating-prompts
description: "Creates GitHub Copilot prompt files (`.prompt.md`) for VS Code. Use when the user asks to create, improve, or templatize a `.prompt.md` file — e.g. building a reusable slash-command, routing a task to a specific agent, standardizing repeated workflows, or fixing a vague prompt. Ships install-ready templates, examples, and validation guidance."
argument-hint: "Prompt goal, target agent, required inputs, and desired output"
user-invocable: true
---

# Creating Copilot Prompt Files

Use this skill when a task deserves a reusable entrypoint instead of the user re-explaining the same workflow every time.
It helps create prompt files that are specific, easy to invoke, and well-matched to the agent or workflow behind them.

## When to Use

Use this skill when the user asks for things like:

- "create a prompt file for this workflow"
- "turn this repeated request into a `.prompt.md`"
- "make a slash-command that runs this analysis"
- "route this task to the right agent with guided input"
- "fix a prompt that is too vague or too generic"
- "templatize this workflow so the team can reuse it"
- "add a reusable prompt example for the team"

Typical scenarios: creating a slash-command entrypoint, standardizing a frequent workflow, capturing required inputs/outputs for a specialized task, or improving prompt discoverability for a repo or public collection.

## Outcome Standard

A strong prompt contribution usually includes:

- a single clear job
- the right target agent and model when appropriate
- explicit inputs, workflow steps, and output expectations
- minimal overlap with agent identity or repository instructions
- one install-ready prompt file plus reference material

## Prompt Design Rules

- **Workflow starter, not persona** - let the agent define behavior; let the prompt define the task.
- **One job per prompt** - split prompts that try to launch multiple unrelated workflows.
- **Be explicit about inputs** - state what the user or workspace must provide.
- **Define the finish line** - describe the expected deliverable or completion state.
- **Stay reusable** - avoid baking in one-off context that belongs in the user's actual message.

## Workflow

### Phase 0: Decide whether a prompt is the right primitive

Use a prompt when users need a reusable task starter.
If the real need is a standing expert role, create an agent. If the real need is reusable procedural knowledge, create a skill. If the real need is always-on repository rules, create instructions.

### Phase 1: Frame the prompt contract

Clarify or infer:

- what task the prompt should trigger
- which agent should receive the work
- what input the user must provide
- what output or artifact the prompt should produce

### Phase 2: Draft the frontmatter

Choose the smallest useful set of fields: `name` (menu label), `agent` (routing), `description` (discoverability), `model` (only when it materially matters), `argument-hint` (guides user input), and `tools` (only when overriding defaults is required).

### Phase 3: Write the prompt body

Use the supporting resources below while drafting:

- `./resources/prompt.template.prompt.md`
- `./resources/prompt.example.prompt.md`

A good prompt body should usually include:

- a short goal statement
- required or optional inputs
- a numbered workflow
- output expectations or completion criteria
- constraints when the workflow should stay within tight bounds

**Minimal example** of a complete `.prompt.md` file:

```markdown
---
name: Summarize PR
agent: code-review
description: "Summarize a pull request's changes and flag risks"
argument-hint: "PR number or URL"
---

Summarize the pull request provided by the user.

1. List changed files grouped by area (API, UI, tests, config).
2. Highlight breaking changes or risk areas.
3. Output a short summary (under 200 words) plus a risk rating (low / medium / high).
```

See `./resources/prompt.example.prompt.md` for a fuller worked example.

### Phase 4: Package the reference bundle

At minimum, provide:

- the main `.prompt.md` file
- one template or example for reuse
- a short explanation of why the agent, model, and inputs were chosen

### Phase 5: Validate before handoff

Check the result against `./resources/prompt-quality-checklist.md`.

Pay special attention to:

- whether the prompt tells the agent what to do without redefining who the agent is
- whether the inputs are explicit enough to prevent weak output
- whether the workflow is focused on one coherent outcome
- whether the file is discoverable from the `description` and `name`

## Common Failure Modes

- writing a prompt that sounds like an agent manifesto
- omitting the key inputs the workflow depends on
- stacking multiple unrelated jobs into one prompt
- overriding tools without a concrete need
- producing a prompt that still requires the user to re-explain everything every time

## Resource Map

- `./resources/prompt.template.prompt.md` - scaffold for a focused prompt file
- `./resources/prompt.example.prompt.md` - worked example of a reusable prompt
- `./resources/prompt-quality-checklist.md` - final review checklist before shipping

## Definition of Done

A task using this skill is complete when:

- the prompt starts one clear workflow
- the chosen agent and inputs make sense for the outcome
- the file is install-ready and internally consistent
- supporting template or example material exists for reuse
- the final prompt passes the quality checklist without obvious ambiguity
