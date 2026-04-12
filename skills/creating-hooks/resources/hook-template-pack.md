# Hook Template Pack

Use this pack as a starting point for a documented GitHub Copilot hook.
Replace placeholders, remove sections that do not apply, and keep the policy as small as possible.

## `README.md`

```md
# <Hook Title>

This hook <what it does> and is designed for <when or why it should run>.

## Behavior

- Event: `<preToolUse | postToolUse | ...>`
- Mode: `<observe | warn | deny | mutate>`
- Timeout: `<seconds>`
- Default action when uncertain: `<allow | deny>`

## Installation

- Copy this folder to `.github/hooks/<hook-name>/`
- Update the script names if you are only supporting one platform
- Review the patterns and messages before enabling blocking behavior

## Notes

- Explain what users should do if the hook denies an action
- Document any prerequisites such as `jq`, Node.js, or Python
- Mention limitations or known false positives
```

## `hooks.json`

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "type": "command",
        "command": "bash scripts/<hook-script>.sh",
        "windows": "powershell -File scripts\\<hook-script>.ps1",
        "cwd": ".github/hooks/<hook-name>",
        "timeoutSec": 10,
        "comment": "<Short explanation of the hook>"
      }
    ]
  }
}
```

## `scripts/<hook-script>.ps1`

```powershell
$inputObject = [Console]::In.ReadToEnd() | ConvertFrom-Json

# Extract the fields you care about from the hook payload.
$toolName = $inputObject.toolName
$toolArgs = $inputObject.toolArgs

# Evaluate your policy here.
$shouldDeny = $false
$reason = 'Replace with a user-friendly reason.'

if ($shouldDeny) {
  @{ permissionDecision = 'deny'; permissionDecisionReason = $reason } |
    ConvertTo-Json -Compress
}
```

## `scripts/<hook-script>.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

payload="$(cat)"

# Parse the fields you need. Adjust for your environment and dependencies.
tool_name="$(printf '%s' "$payload" | jq -r '.toolName')"

should_deny="false"
reason="Replace with a user-friendly reason."

if [ "$should_deny" = "true" ]; then
  printf '{"permissionDecision":"deny","permissionDecisionReason":"%s"}\n' "$reason"
fi
```

## Usage Notes

- Start with logging-only or warning behavior before introducing hard blocks.
- Keep scripts short and deterministic.
- Make denial reasons specific enough that users know what to change.
