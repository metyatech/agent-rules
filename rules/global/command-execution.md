# Workflow and command execution
## MCP server setup verification
- After adding or modifying an MCP server configuration, immediately verify connectivity using the platform's MCP health check and confirm the server is connected.
- If a configured MCP server fails to connect, diagnose and fix before proceeding. Do not silently fall back to alternative tools without reporting the degradation.
- At session start, if expected MCP tools are absent from the available tool set, verify MCP server health and report/fix connection failures before continuing.
- Do not add wrappers or pipes to commands unless the user explicitly asks.
- Prefer repository-standard scripts/commands (package.json scripts, README instructions).
- Reproduce reported command issues by running the same command (or closest equivalent) before proposing fixes.
- When a Windows process is intended to run headlessly, every non-interactive child console process in that spawn chain must also be launched headlessly (`windowsHide: true`, `CreateNoWindow`, or `Start-Process -WindowStyle Hidden` as appropriate).
- From a windowless PowerShell parent, do not spawn non-interactive console children with the `&` call operator; use an explicit hidden process launch that preserves output/exit-code handling.
- When diagnosing third-party tool failures, check the latest stable release first; if the latest still reproduces the failure, treat upgrade as insufficient, record the verified limitation, and use a deterministic workaround when available.
- Avoid interactive git prompts by using --no-edit or setting GIT_EDITOR=true.
- If elevated privileges are required, use sudo directly; do not launch a separate elevated shell (e.g., Start-Process -Verb RunAs). Fall back to run as Administrator only when sudo is unavailable.
- Keep changes scoped to affected repositories; when shared modules change, update consumers and verify at least one.
- If no branch is specified, work on the current branch; direct commits to main/master are allowed.
- Do not assume agent platform capabilities beyond what is available; fail explicitly when unavailable.
- When building a CLI, follow standard conventions: --help/-h, --version/-V, stdin/stdout piping, --json output, --dry-run for mutations, deterministic exit codes, and JSON Schema config validation.
- Treat `agent-browser` sessions as temporary resources: close them immediately when they are no longer needed, and before concluding a task verify that no sessions spawned for that task remain open.
- When launching `agent-browser` on Windows, do not rely on the implicit default session; always provide an explicit `--session <name>` or set `AGENT_BROWSER_SESSION` to a chosen session name before use, and if a localhost bind/access error occurs (for example `os error 10013`), retry with a different explicit session name instead of reusing the blocked default session, then report the working session name or the remaining failure.
- For federated identity flows (Google, Apple, Microsoft, GitHub, etc.), when automation-launched browser contexts are blocked, degraded, or risky, hand off only the IdP step to a real browser/session via CDP or explicit user interaction, then resume automation after the redirect; do not try to bypass provider anti-automation or embedded-browser restrictions.
## Codex-only PowerShell safety
- `Remove-Item` (aliases: `rm`, `ri`, `del`, `erase`) ↁEUse: `if ([IO.File]::Exists($p)) { [IO.File]::SetAttributes($p,[IO.FileAttributes]::Normal); [IO.File]::Delete($p) }`
- `Remove-Item -Recurse` (aliases: `rmdir`, `rd`) ↁEUse: `if ([IO.Directory]::Exists($d)) { [IO.File]::SetAttributes($d,[IO.FileAttributes]::Normal); foreach ($e in [IO.Directory]::EnumerateFileSystemEntries($d,'*',[IO.SearchOption]::AllDirectories)) { [IO.File]::SetAttributes($e,[IO.FileAttributes]::Normal) }; [IO.Directory]::Delete($d,$true) }`
- In PowerShell, use `;` for sequential command chaining; never use `&&` or `||` as control-flow operators.
## Post-change deployment
- After modifying code, check whether deployment steps beyond commit/push are needed before concluding.
- If the repo is globally linked (`npm ls -g` shows `->` to local path), rebuild and verify the global binary is functional.
- If the repo powers a running service, daemon, or scheduled task, rebuild, restart, and verify with deterministic evidence; do not claim completion until the running instance reflects the changes. Detection and verification procedures are in the `post-deploy` skill.
- **PowerShell native environment**: This is a Windows/PowerShell environment. Do not use Unix commands directly. On Windows, any Bash-tool command containing `pwsh` or `powershell` is invalid; rewrite it to `pwsh`/`powershell -File` with a `.ps1` file before execution. Do not use `-Command`, stdin, heredoc, or `-EncodedCommand` for PowerShell scripts.
