# Field Mapping Guide: Copilot Agent → Claude Code Agent

## Frontmatter Fields

| Copilot Field | Claude Code Field | Action |
|---|---|---|
| `title` | — | Drop. Claude agents use `name` as the identifier; there is no separate display title. |
| `name` | `name` | Keep unchanged. |
| `model` | `model` (optional) | Omit to inherit. If a specific model is needed, map using the model table below. |
| `description` | `description` | **Rewrite.** Claude uses this for agent-selection routing. See guidance below. |
| `tools` | — | Drop from frontmatter. Document equivalents in the body if needed. See tool map below. |
| `argument-hint` | — | Drop. Not a standard Claude Code frontmatter field. |
| `agents` | — | Drop. Sub-agent orchestration in Claude Code is handled through the `Agent` tool in the body. |

## Writing the Claude `description`

Claude Code reads the `description` to decide when to spawn this agent. A weak or copied description causes poor routing.

**Pattern:** `<What the agent does.> Use when <trigger contexts and user intents>.`

**Copilot source example:**
```
'Help engineers craft robust, fast, and maintainable automated tests that deliver actionable feedback and integrate seamlessly into modern SDLC pipelines.'
```

**Claude Code equivalent:**
```
'Designs, reviews, and implements automated test suites across unit, API, UI, and performance layers. Use when creating new test automation, reviewing test quality, diagnosing CI failures, or planning a test strategy.'
```

Key changes:
- Starts with what the agent actively does (verb phrase).
- Adds "Use when" with concrete trigger contexts.
- Removes marketing language that does not help with routing.

## Model Name Mapping

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

## Tool Name Mapping

Copilot tool names do not exist in Claude Code. Map them as follows when they appear in the body:

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

## Body Adaptation Patterns

| Copilot Pattern | Claude Code Adaptation |
|---|---|
| `Use the vscode tool to open...` | Remove — not applicable in Claude Code |
| `@workspace` | Replace with "the current repository" or a file path |
| `runTests` command | `Bash` with the relevant test runner command |
| `testFailure` event | Analyze test output returned from `Bash` |
| Copilot chat slash commands (e.g. `/fix`, `/explain`) | Remove or rewrite as plain instructions |
| `todo` tool references | `TodoWrite` tool |
| `agent` tool references | `Agent` tool with appropriate `subagent_type` |
| Inline `@` mentions (e.g. `@terminal`) | Remove — these are VS Code-specific |
