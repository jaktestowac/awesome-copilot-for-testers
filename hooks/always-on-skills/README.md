---
description: 'Keeps always-apply skill invariants in force across a session: materializes them into a workspace instructions file at session start, and restates the relevant one on stderr after each edit to a file in its scope.'
---

# Always-On Skills Hook

Some skills claim to apply to everything. `unslop-tests` says "must always apply to test code". `unslop-answers` says "must always apply to answers about your own work". A description cannot enforce that. Long sessions drift, topics change, and by turn twelve the discipline the skill exists for is gone.

This hook makes the claim structural instead of hopeful.

## Behavior

| | |
| --- | --- |
| Events | `sessionStart`, `postToolUse` |
| Mode | observe and materialize - never denies, never mutates your source |
| Timeout | 10s (`sessionStart`), 5s (`postToolUse`) |
| Default when uncertain | exit 0 and do nothing |

**At session start** it reads `always-on-skills.json` and writes the enabled skills' invariants into `.github/instructions/always-on-skills.instructions.md` with `applyTo: '**'`. Copilot loads instruction files automatically, so the invariants are present in every session including after a reload, a reconnect, or a context compaction. It then prints the armed skill names to stderr, so you can see what is in force.

**After each file edit** it checks the edited path against each enabled skill's `appliesTo` patterns and, on a match, prints that skill's invariant to stderr and appends a line to `.github/logs/always-on-skills.log`. Editing `checkout.spec.ts` restates the test-honesty invariant at the moment it is relevant, which an instructions file cannot do.

Only path-scoped skills produce these reminders. A skill scoped to `*` is already carried by the instructions file on every request, so repeating it after every edit would be noise - the script skips it.

## Why it works this way

Copilot hooks have no context-injection channel: for `sessionStart` and `userPromptSubmitted`, stdout is ignored. A hook cannot put text into the conversation the way it can in some other hosts. So the hook writes to the channel Copilot does read - an instructions file - and uses stderr for what only a hook can give you: a per-action, path-scoped reminder and an audit trail of when the discipline was relevant.

For a host that *does* add hook stdout to the session context, the same script has an `emit` mode that prints the invariant block to stdout. Wire that into the equivalent session-start event instead.

## Installation

Copy this folder into your workspace:

```
.github/hooks/always-on-skills/
├── hooks.json
├── always-on-skills.json
└── scripts/
    ├── always-on-skills.sh
    └── always-on-skills.ps1
```

`hooks.json` sets `"cwd": ".github/hooks/always-on-skills"`, so the scripts must sit at that path.

Then:

1. Edit `always-on-skills.json` - keep the skills your team actually installed, and delete the rest.
2. Start a session and check stderr for the armed list.
3. Commit the generated `.github/instructions/always-on-skills.instructions.md`, or add it to `.gitignore` if each developer runs a different set. Both work; pick one and say which in your repo docs.

## Configuration

```json
{
  "instructionsPath": ".github/instructions/always-on-skills.instructions.md",
  "logPath": ".github/logs/always-on-skills.log",
  "skills": [
    {
      "name": "unslop-tests",
      "enabled": true,
      "invariant": "A test that cannot fail proves nothing. …",
      "appliesTo": ["*.test.*", "*.spec.*", "tests/*"]
    }
  ]
}
```

| Field | Required | What it does |
| --- | --- | --- |
| `instructionsPath` | no | Where the generated instructions file goes. Relative to the repo root |
| `logPath` | no | Where in-scope edits are logged. Relative to the repo root |
| `skills[].name` | yes | The skill name, used as the section heading and in the stderr line |
| `skills[].enabled` | no | Defaults to `true`. Set `false` to keep an entry without arming it |
| `skills[].invariant` | yes | The one paragraph that must survive the whole session. Write the rule, not the skill's summary |
| `skills[].appliesTo` | no | Shell-glob patterns for the `postToolUse` reminder. Defaults to `["*"]`, which produces no reminders |

**Pattern matching:** `appliesTo` patterns are matched against the repo-relative path with shell-style globs, where `*` crosses directory separators. Write `*.spec.*` and `tests/*`, not `**/*.spec.*` - the `**` form matches nothing extra here and requires a directory separator to be present. Absolute paths are made relative first, and both separator forms are accepted.

A skill left at `["*"]` is armed in the instructions file but silent on edits. Give a skill narrow patterns only when a reminder at the moment of the edit is worth the line of stderr.

**Writing a good invariant.** One paragraph, and it must state the rule rather than describe the skill. "Follow unslop-tests" does nothing. "A test that cannot fail proves nothing; no tautological assertions, no hardcoded waits, no retries used as a fix" is a rule the model can apply mid-task. Keep the total across all enabled skills short - this text is in context for every request in the workspace, so three tight invariants beat eight loose ones.

## Limitations

- **It does not verify compliance.** It keeps the rule present and visible. Whether an answer honoured it is a review question - see `unslop-answers` and `testing-agent-skills`.
- **It writes one file in your workspace.** `instructionsPath`, and the log directory on a match. Nothing else is touched, and no source file is ever modified.
- **The generated file is overwritten, not merged.** Edits to it are lost at the next session start. Change `always-on-skills.json` instead; the generated file says so in a comment.
- **The `postToolUse` reminder depends on tool names and argument shapes.** It filters on `edit`, `create`, `write`, `multi_edit`, and `str_replace_editor`, and reads the path from `path`, `filePath`, or `file_path`. A host using different names produces no reminder - and no error. If reminders never appear, dump the payload and add your host's names to the filter.
- **`jq` is required for the Bash path.** Without it the script prints a notice and exits 0. The PowerShell path uses built-in JSON parsing and needs nothing extra.
- **A committed instructions file gets you most of this.** If your armed list never changes and the file is in git, you barely need the `sessionStart` half. The hook earns its place when the list is per-developer, when the file is gitignored, when someone deletes it, or when you want the edit log.

## Verifying it works

```bash
# Session mode: writes the instructions file and lists what is armed
bash .github/hooks/always-on-skills/scripts/always-on-skills.sh session

# Post-tool mode: feed it a payload and check the reminder fires
echo '{"toolName":"edit","toolArgs":"{\"path\":\"tests/checkout.spec.ts\"}"}' \
  | bash .github/hooks/always-on-skills/scripts/always-on-skills.sh post-tool

# Emit mode: the invariant block on stdout
bash .github/hooks/always-on-skills/scripts/always-on-skills.sh emit
```

On Windows, the same three checks against the PowerShell path:

```powershell
$s = '.github\hooks\always-on-skills\scripts\always-on-skills.ps1'
powershell -NoProfile -ExecutionPolicy Bypass -File $s -Mode session
'{"toolName":"edit","toolArgs":"{\"path\":\"tests/checkout.spec.ts\"}"}' |
  powershell -NoProfile -ExecutionPolicy Bypass -File $s -Mode post-tool
powershell -NoProfile -ExecutionPolicy Bypass -File $s -Mode emit
```

Expected: `session` reports the armed list and is idempotent on a second run; `post-tool` prints the test invariant for a spec file and stays silent for a source file; `emit` prints the block. A malformed payload, a missing config, and an unknown tool name all exit 0 silently.

All three print to stderr or stdout and exit 0. A non-zero exit from a hook blocks the triggering action, so every path in this script is deliberately exit 0 - a broken reminder must never stop an edit.

## Related

- `unslop-tests`, `unslop-answers`, `communicating-quality-findings` - the always-apply skills this hook was built for
- `testing-agent-skills` - the persistence case category tests whether an invariant actually survives to turn ten
- `creating-hooks` - the authoring skill for hook packs
