# Hook Example Pack: Block Destructive Shell Commands

This example shows a conservative safety hook that blocks obviously destructive shell commands before they run.
It is meant as a pattern for dangerous-command protection, not as a universal production policy.

## `README.md`

```md
# Block Destructive Shell Commands

This hook denies clearly destructive terminal commands such as `rm -rf`, `git reset --hard`, and drive-wide delete patterns before they are executed.
Use it in shared workspaces where accidental destructive shell usage would be costly.

## Behavior

- Event: `preToolUse`
- Mode: `deny`
- Timeout: `10` seconds
- Default action when uncertain: `allow`

## Installation

- Copy this folder to `.github/hooks/block-destructive-shell/`
- Review the command patterns before enabling it in a repository
- Adjust the allowed and denied commands to fit your team's workflow

## Notes

- This hook intentionally targets only a small set of obvious destructive commands
- If your environment uses custom wrappers, update the pattern matching accordingly
- Always return a human-readable denial reason
```

## `hooks.json`

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "type": "command",
        "command": "bash scripts/block-destructive-shell.sh",
        "windows": "powershell -File scripts\\block-destructive-shell.ps1",
        "cwd": ".github/hooks/block-destructive-shell",
        "timeoutSec": 10,
        "comment": "Block obviously destructive shell commands before execution"
      }
    ]
  }
}
```

## `scripts/block-destructive-shell.ps1`

```powershell
$payload = [Console]::In.ReadToEnd() | ConvertFrom-Json
$toolArgs = $payload.toolArgs
$commandText = ''

if ($null -ne $toolArgs.command) {
  $commandText = [string]$toolArgs.command
} else {
  $commandText = $toolArgs | ConvertTo-Json -Compress
}

$dangerPattern = '(?i)rm\s+-rf|git\s+reset\s+--hard|del\s+/s|format\s+[a-z]:'

if ($commandText -match $dangerPattern) {
  @{
    permissionDecision = 'deny'
    permissionDecisionReason = 'Blocked a clearly destructive shell command. Use a safer scoped command or ask for an explicit exception.'
  } | ConvertTo-Json -Compress
}
```

## `scripts/block-destructive-shell.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

payload="$(cat)"
command_text="$(printf '%s' "$payload" | jq -cr '.toolArgs.command // .toolArgs')"

if printf '%s' "$command_text" | grep -Eiq 'rm[[:space:]]+-rf|git[[:space:]]+reset[[:space:]]+--hard|del[[:space:]]+/s|format[[:space:]][A-Za-z]:'; then
  printf '%s\n' '{"permissionDecision":"deny","permissionDecisionReason":"Blocked a clearly destructive shell command. Use a safer scoped command or ask for an explicit exception."}'
fi
```

## Why this example is useful

- it targets a narrow, high-confidence policy
- it returns a clear denial reason
- it shows how `README.md`, `hooks.json`, and scripts stay aligned
