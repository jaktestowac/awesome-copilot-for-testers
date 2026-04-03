# Print Tool Info Hook

This hook prints information about each tool execution before it runs. It displays the tool name, arguments, timestamp, and working directory in both the console and chat interface.

## Configuration

The hook is configured in `hooks.json` with:

- **Bash script**: `print-tool-info.sh` (Linux/macOS)
- **PowerShell script**: `print-tool-info.ps1` (Windows)
- **Timeout**: 10 seconds

## Usage

The hook automatically triggers before any tool is used, showing:

- 🔧 Tool name (e.g., `bash`, `edit`, `view`, `create`)
- ⏰ Timestamp in readable format
- 📂 Working directory
- 🔨 Tool arguments as JSON

## Example Output

```
===============================================
🔧 TOOL EXECUTION INFO
===============================================
Time: 2026-03-07 14:30:45
Tool: bash
Working Directory: /path/to/project
Arguments: {"command":"npm test","description":"Run tests"}
===============================================
```

## Behavior

- The hook **allows all tools to execute** (no blocking)
- It purely provides visibility into tool usage
- The output appears in both the console and the chat interface
- No decision response is sent (permissionDecision is optional)

## Customization

To deny specific tools, uncomment the permission decision output and add conditional logic:

```bash
if [ "$TOOL_NAME" = "bash" ]; then
  echo '{"permissionDecision":"deny","permissionDecisionReason":"Bash not allowed"}'
  exit 0
fi
```

## Requirements

- **Bash**: `jq` must be installed (for JSON parsing)
- **PowerShell**: Built-in, no additional requirements
