# Workflow and command execution

## MCP server setup verification

- After adding or modifying an MCP server configuration, immediately verify connectivity using the platform's MCP health check and confirm the server is connected.
- If a configured MCP server fails to connect, diagnose and fix before proceeding. Do not silently fall back to alternative tools without reporting the degradation.
- At session start, if expected MCP tools are absent from the available tool set, verify MCP server health and report/fix connection failures before continuing.

- Do not add wrappers or pipes to commands unless the user explicitly asks.
- Prefer repository-standard scripts/commands (package.json scripts, README instructions).
- Reproduce reported command issues by running the same command (or closest equivalent) before proposing fixes.
- Avoid interactive git prompts by using --no-edit or setting GIT_EDITOR=true.
- If elevated privileges are required, use sudo directly; do not launch a separate elevated shell (e.g., Start-Process -Verb RunAs). Fall back to run as Administrator only when sudo is unavailable.
- Keep changes scoped to affected repositories; when shared modules change, update consumers and verify at least one.
- If no branch is specified, work on the current branch; direct commits to main/master are allowed.
- Do not assume agent platform capabilities beyond what is available; fail explicitly when unavailable.

## Codex-only: Commands blocked by policy (PowerShell)

- Blocked by policy under Codex: `Remove-Item` (aliases: `rm`, `ri`, `del`, `erase`) -> Use: `if ([IO.File]::Exists($p)) { [IO.File]::SetAttributes($p,[IO.FileAttributes]::Normal); [IO.File]::Delete($p) }`
- Blocked by policy under Codex: `Remove-Item -Recurse` (aliases: `rmdir`, `rd`) -> Use: `if ([IO.Directory]::Exists($d)) { [IO.File]::SetAttributes($d,[IO.FileAttributes]::Normal); foreach ($e in [IO.Directory]::EnumerateFileSystemEntries($d,'*',[IO.SearchOption]::AllDirectories)) { [IO.File]::SetAttributes($e,[IO.FileAttributes]::Normal) }; [IO.Directory]::Delete($d,$true) }`
