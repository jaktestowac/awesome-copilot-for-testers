# Pre-tool use hook that prints tool information to console and chat

# Read JSON input from stdin
$input = [Console]::In.ReadToEnd() | ConvertFrom-Json

# Extract fields from the JSON input
$timestamp = $input.timestamp
$cwd = $input.cwd
$toolName = $input.toolName
$toolArgs = $input.toolArgs

# Convert Unix timestamp (milliseconds) to readable format
$readableTime = [System.DateTimeOffset]::FromUnixTimeMilliseconds($timestamp).DateTime.ToString("yyyy-MM-dd HH:mm:ss")

# Create formatted output for console and chat
Write-Host "==============================================="
Write-Host "TOOL EXECUTION INFO"
Write-Host "==============================================="
Write-Host "Time: $readableTime"
Write-Host "Tool: $toolName"
Write-Host "Working Directory: $cwd"
Write-Host "Arguments: $toolArgs"
Write-Host "==============================================="

# Allow the tool to execute (output is optional, but we can be explicit)
# Uncomment the next lines if you want to show the decision in chat:
# $output = @{
#     permissionDecision = 'allow'
# }
# $output | ConvertTo-Json -Compress
