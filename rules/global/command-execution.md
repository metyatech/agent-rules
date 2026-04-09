# Command execution

This module governs how the agent runs shell commands, handles
external tool failures, and operates in this Windows/PowerShell
environment. Post-change deployment verification lives in
`post-change-deployment`.

## Definitions

- **External command** — any executable invoked through a shell or
  process API that the agent does not own.
- **Repository-standard command** — the command published by the
  repository's `package.json` scripts, `Makefile`, README, or other
  authoritative documentation.

## General execution rules

- The agent MUST prefer repository-standard scripts and commands
  over ad hoc invocations.
- The agent MUST NOT add wrappers, redirections, or pipes to
  commands unless the user explicitly asks for them.
- Before proposing a fix for a reported command failure, the agent
  MUST reproduce the same command (or the closest equivalent) and
  MUST observe the same failure.
- The agent MUST treat any nonzero exit code from an external
  command as a failure unless the specific exit code is explicitly
  documented AND the agent's code explicitly checks for that
  documented value. The agent MUST NOT map unknown nonzero exits to
  benign states.
- The agent MUST NOT assume agent platform capabilities beyond what
  is available. The agent MUST fail explicitly when a required
  capability is unavailable.
- When expected tools are missing or configuration has changed, the
  agent MUST verify MCP connectivity, MUST fix or report connection
  failures, and MUST NOT proceed with work that depends on the
  missing tool.
- When diagnosing a third-party tool failure, the agent MUST first
  check the latest stable release. If the latest stable release
  still reproduces the failure, the agent MUST record the verified
  limitation and MUST use a deterministic workaround when one
  exists.

## Git and identity flows

- The agent MUST avoid interactive git prompts by passing
  `--no-edit` or setting `GIT_EDITOR=true`.
- When no branch is specified, the agent MUST work on the current
  branch. Direct commits to `main` or `master` are permitted in
  user-controlled repositories.
- For federated identity flows (Google, Apple, Microsoft, GitHub),
  when an automation-launched browser context is blocked or
  degraded, the agent MUST hand off only the IdP step to a real
  browser session via CDP or explicit user interaction, then
  resume automation after the redirect. The agent MUST NOT attempt
  to bypass provider anti-automation or embedded-browser
  restrictions.

## Privilege elevation

- When elevated privileges are required, the agent MUST use `sudo`
  directly. The agent MUST NOT launch a separate elevated shell
  such as `Start-Process -Verb RunAs`. The agent MAY fall back to
  "Run as Administrator" only when `sudo` is unavailable.

## CLI conventions

- A CLI built or modified by the agent MUST follow standard
  conventions: `--help` and `--version` flags, pipeable I/O,
  machine-readable output, dry-run for mutations, deterministic
  exit codes, and configuration validation. Detailed CLI
  conventions are defined in the `cli-design` skill.

## Windows and PowerShell environment

- This is a Windows/PowerShell environment. The agent MUST NOT
  invoke Unix-only commands directly. The agent MUST run PowerShell
  scripts via `pwsh` or `powershell -File`.
- In PowerShell, the backslash `\` is a literal character. The
  agent MUST avoid shadowing PowerShell automatic variables. The
  agent SHOULD prefer single-quoted strings.
- In PowerShell, the agent MUST use `;` for sequential command
  chaining. The agent MUST NOT use `&&` or `||` as control-flow
  operators.
- In headless Windows/PowerShell flows, the agent MUST launch every
  non-interactive console child process headlessly. The agent MUST
  NOT use the `&` call operator from a windowless parent to spawn
  such children.
- For destructive PowerShell file operations, the agent MUST verify
  the final absolute target path first, MUST normalize file
  attributes when needed, and MUST prefer explicit PowerShell or
  .NET deletion APIs over alias-driven shell deletion.
- The agent MUST use explicit `agent-browser` session names on
  Windows. If the default session bind fails, the agent MUST retry
  with a different session name. The agent MUST close all
  task-owned agent-browser sessions before concluding.
