#!/bin/bash
# Pre-tool use hook that prints tool information to console and chat

# Read JSON input from stdin
INPUT=$(cat)

# Extract fields from the JSON input
TIMESTAMP=$(echo "$INPUT" | jq -r '.timestamp')
CWD=$(echo "$INPUT" | jq -r '.cwd')
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName')
TOOL_ARGS=$(echo "$INPUT" | jq -r '.toolArgs')

# Convert Unix timestamp (milliseconds) to readable format
READABLE_TIME=$(date -d @$((TIMESTAMP/1000)) '+%Y-%m-%d %H:%M:%S')

# Create formatted output for console and chat
echo "==============================================="
echo "🔧 TOOL EXECUTION INFO"
echo "==============================================="
echo "Time: $READABLE_TIME"
echo "Tool: $TOOL_NAME"
echo "Working Directory: $CWD"
echo "Arguments: $TOOL_ARGS"
echo "==============================================="

# Allow the tool to execute (output is optional, but we can be explicit)
# Uncomment the next line if you want to show the decision in chat:
# echo '{"permissionDecision":"allow"}'
