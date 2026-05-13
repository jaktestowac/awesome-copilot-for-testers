---
name: convert-github-copilot-agent-to-claude
description: 'Converts GitHub Copilot custom agent files (.agent.md) to Claude Code sub-agent format (.claude/agents/). Use when migrating Copilot agents to Claude Code, porting agent definitions between AI platforms, or when a user says "convert", "migrate", or "port" a Copilot agent to Claude.'
argument-hint: 'Path to the .agent.md file(s) to convert, or paste the agent content directly'
user-invocable: true
---

# Converting GitHub Copilot Agents to Claude Code Agents

Use this skill when a GitHub Copilot `.agent.md` file needs to become a Claude Code sub-agent.
It guides a systematic translation from Copilot's VS Code-anchored format to Claude Code's portable sub-agent format.

## When to Use

Use this skill when the user asks for things like:

- "convert this Copilot agent to Claude"
- "migrate my .agent.md to Claude Code"
- "port all agents in the agents/ folder to Claude"
- "I want to use this Copilot agent in Claude Code"
- "turn this .agent.md into a Claude sub-agent"

Typical scenarios:

- migrating a single agent or a batch of `.agent.md` files
- using an existing Copilot agent definition as the source of truth for a Claude Code sub-agent
- aligning toolsets after switching from GitHub Copilot to Claude Code

## Outcome Standard

A successful conversion produces:

- a `.claude/agents/<name>.md` file with valid Claude Code frontmatter
- a `description` rewritten for Claude's agent-selection routing
- a system prompt body that is portable, clear, and free of Copilot-specific references
- documented tool equivalents when Copilot tool names appeared in the source

## Format Differences

See `./resources/field-mapping-guide.md` for the full field-by-field reference.

**Key structural differences at a glance:**

| Aspect | GitHub Copilot `.agent.md` | Claude Code `.claude/agents/*.md` |
|---|---|---|
| `title` | Human-friendly display name | Not used — drop it |
| `name` | Kebab-case identifier | Same — keep as-is |
| `model` | Copilot model ID (e.g. `Claude Sonnet 4.5 (copilot)`) | To be converted according to the rules decribed in Phase 1 |
| `description` | Usage summary | Agent-selection trigger — rewrite for routing clarity |
| `tools` | Copilot tool names array | Apply the rules described in Phase 1|
| `argument-hint` | Optional user-facing hint | Not standard — drop |
| `agents` | Orchestration allowlist | Not applicable — drop |
| Body | Rich role + workflow + constraints | Focused system prompt |

## Workflow

### Phase 0: Read the source agent

- Read the `.agent.md` file(s) the user specified.
- Note the `name`, `description`, `model`, `tools`, and body structure.
- Identify Copilot-specific references in the body (VS Code commands, Copilot tool names, IDE-specific behavior).

### Phase 1: Map frontmatter

Apply the field mappings from `./resources/field-mapping-guide.md`:

- **name** — keep unchanged.
- **description** — rewrite: Claude uses this to decide when to spawn the agent. Lead with what the agent does, follow with "Use when...". The Copilot description is a starting point, not the final value.
- **model** — Use the following table table in to translate Copilot model strings to clean Claude model IDs.
| Copilot Model String | Claude Code Model ID |
|---|---|
| `Claude Sonnet 4.5 (copilot)` | `claude-sonnet-4-5` |
| `Claude Sonnet 4.6 (copilot)` | `claude-sonnet-4-6` |
| `Claude Opus 4 (copilot)` | `claude-opus-4` |
| `Claude Haiku 3.5 (copilot)` | `claude-haiku-3-5` |
| `Claude Haiku 4.5 (copilot)` | `claude-haiku-4-5` |
| `GPT-4o (copilot)` | Not applicable — omit `model` or choose a Claude model |
| `o3 (copilot)` | Not applicable — omit `model` or choose a Claude model |
| `o4-mini (copilot)` | Not applicable — omit `model` or choose a Claude model |

When in doubt, omit `model` and let the agent inherit the caller's model. This is the most portable option.
- **tools** - Copilot tool names do not exist in Claude Code. Map them as follows:

| Copilot Tool | Claude Code Equivalent |
|---|---|
| `read` | `Read`, `Glob`, `Grep` |
| `edit` | `Edit`, `Write` |
| `execute` | `Bash` |
| `search` | `Grep`, `Glob`, `WebSearch` |
| `web` | `WebFetch`, `WebSearch` |
| `vscode` | No equivalent — remove IDE-specific references |
| `agent` | `Agent` (sub-agent spawning via the Agent tool) |
| `todo` | `TodoWrite` |
| `playwright/*` | MCP Playwright tools (require an MCP server configured in settings) |
| `github` | `Bash` with `gh` CLI, or GitHub MCP tools |
| `think` | No tool needed — Claude reasons natively |


- **title**, **argument-hint**, **agents** — drop entirely.

- **memory** — always set to project

- **maxTurns** — always set to 20

### Phase 2: Adapt the body

Transform the body into a Claude Code system prompt:

- Remove or replace Copilot-specific instructions (references to `vscode`, `@workspace`, Copilot chat commands, IDE panels, `runTests`, `testFailure`).
- Translate tool references using the tool-name map in `./resources/field-mapping-guide.md`.
- Preserve the agent's core role, operating rhythm, workflow, and constraints — this is the high-value content worth keeping.
- If the body is very long and procedural, consider whether some steps belong in a Claude Code skill file instead. Keep the agent body focused on identity and consistent behavior, not step-by-step procedures.

### Phase 3: Write the output file

- Target path: `.claude/agents/<name>.md`
- Use `./resources/claude-agent.template.md` as the scaffold.
- Write the converted file and confirm the path with the user.

### Phase 4: Validate

Check the result against `./resources/conversion-checklist.md` before handing off.

## Common Failure Modes

- Copying the body verbatim without removing Copilot-specific references
- Leaving `title`, `tools`, or `agents` in the Claude frontmatter
- Leaving a Copilot model string (containing "(copilot)") in the `model` field
- Writing a description that describes the agent's topic but does not signal when to route to it
- Treating Copilot `tools: [...]` as a frontmatter field in Claude (it is not)
- Over-simplifying a rich Copilot body into a few sentences that lose the operating rhythm

## Resource Map

- `./resources/field-mapping-guide.md` - full field-by-field and tool-name mapping reference
- `./resources/claude-agent.template.md` - scaffold for the converted Claude agent output
- `./resources/conversion-checklist.md` - validation checklist before shipping

## Definition of Done

A task using this skill is complete when:

- `.claude/agents/<name>.md` exists with valid frontmatter
- the `description` is rewritten for Claude routing, not copied verbatim from the Copilot source
- the body is free of Copilot-specific references and preserves the agent's core role and operating rhythm
- tool references are translated or documented
- the file passes the conversion checklist without open items
