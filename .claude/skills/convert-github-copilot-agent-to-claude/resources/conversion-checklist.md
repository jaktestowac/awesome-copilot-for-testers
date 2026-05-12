# Conversion Checklist: Copilot Agent → Claude Code Agent

Use before handing off the converted `.claude/agents/<name>.md` file.

## Frontmatter

- [ ] `name` matches the source agent's `name` (or was updated intentionally).
- [ ] `description` is rewritten for Claude routing — not copied verbatim from the Copilot file.
- [ ] `description` includes a clear "Use when..." signal.
- [ ] `title` field is removed.
- [ ] `model` is either omitted or uses a clean Claude model ID — no "(copilot)" string remains.
- [ ] `tools` array is removed from frontmatter.
- [ ] `argument-hint` and `agents` fields are removed.

## Body

- [ ] Copilot-specific tool names (`vscode`, `execute`, `read`, `edit`, etc.) are replaced or removed.
- [ ] References to `@workspace`, `@terminal`, Copilot chat commands, or VS Code panels are removed or adapted.
- [ ] `runTests` and `testFailure` references are replaced with `Bash` + test runner commands.
- [ ] The agent's core role, mission, and operating rhythm are preserved.
- [ ] The body reads as a coherent system prompt, not a collection of IDE instructions.
- [ ] If the original body was very long, procedural steps that belong in a skill have been moved out.

## File placement

- [ ] File is written to `.claude/agents/<name>.md`.
- [ ] The file has valid YAML frontmatter (no syntax errors, no unclosed quotes).

## Final check

- [ ] The converted agent is distinct from any existing agents in `.claude/agents/` (no duplication).
- [ ] The agent makes sense to someone who has not seen the original Copilot file.
- [ ] Tool mapping decisions are documented if non-obvious.

## Smells that should trigger a revision

- Description is identical to the Copilot source — routing signal is weak.
- `tools: [...]` still present in the frontmatter.
- Body still references `vscode`, `runTests`, `@workspace`, or other Copilot-specific syntax.
- Model field contains the string "(copilot)".
- File placed anywhere other than `.claude/agents/`.
- Body is a single paragraph that lost the operating rhythm of the original.
