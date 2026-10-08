# Command execution

## General execution rules

- Prefer repository-standard scripts and commands (from
  `package.json`, `Makefile`, README) over ad hoc invocations.
  The agent MUST NOT add wrappers, redirections, or pipes
  unless the user explicitly asks.
- Before proposing a fix for a reported command failure,
  reproduce the same command (or the closest equivalent) and
  observe the same failure.
- Treat any nonzero exit code as a failure unless the specific
  exit code is explicitly documented AND the agent's code
  explicitly checks for that documented value. The agent MUST
  NOT map unknown nonzero exits to benign states.
- The agent MUST NOT assume agent platform capabilities beyond
  what is available; fail explicitly when a required capability
  is unavailable.
- When expected tools are missing or configuration has changed,
  verify MCP connectivity, fix or report connection failures,
  and do not proceed with work that depends on the missing tool.
- When diagnosing a third-party tool failure, first check the
  latest stable release; if it still reproduces, record the
  verified limitation and use a deterministic workaround.

## Process lifecycle safety

- System diagnostics MUST be read-only by default.
- The agent MUST NOT terminate, force-kill, restart, or otherwise disrupt
  pre-existing processes, shared daemons, or services without explicit user
  authorization for that specific action.
- A process started by the agent solely as an isolated, temporary test fixture
  MAY be cleaned up without additional approval only when its ownership and
  identity are verified. A PID alone is insufficient; use a retained process
  handle or verify executable identity and creation time before termination.
- Starting or discovering a managed/shared daemon during diagnostics does not
  make it an agent-owned disposable test process.
- Managed services MUST use their official lifecycle interface when an
  authorized stop or restart is necessary. Force termination requires separate
  explicit authorization after the managed shutdown path has failed.
- The agent MUST NOT use broad process-name matching, unverified PID lists, or
  process-tree termination for diagnostic cleanup.
- When process ownership or identity is uncertain, the agent MUST leave the
  process running and report the uncertainty.

## Git and identity flows

- When directly running a repository-scoped Git command, the agent MUST explicitly
  select its target repository independently of the shell working directory or
  preceding directory changes.
- Avoid interactive git prompts (pass `--no-edit` or set
  `GIT_EDITOR=true`).
- When no branch is specified, work on the current branch.
  Direct commits to `main`/`master` are permitted in
  user-controlled repositories.
- For federated identity flows (Google, Apple, Microsoft,
  GitHub) where an automation-launched browser is blocked or
  degraded, hand off only the IdP step to a real browser
  session and resume automation after the redirect. The agent
  MUST NOT attempt to bypass provider anti-automation or
  embedded-browser restrictions.

## Privilege elevation

- When elevated privileges are required, use `sudo` directly.
  The agent MUST NOT launch a separate elevated shell such as
  `Start-Process -Verb RunAs`. Fall back to "Run as
  Administrator" only when `sudo` is unavailable.

## Windows and PowerShell environment

- This is a Windows/PowerShell environment. The agent MUST NOT
  invoke Unix-only commands directly; run PowerShell scripts
  via `pwsh` or `powershell -File`.
- In PowerShell, the backslash `\` is a literal character.
  Avoid shadowing PowerShell automatic variables; prefer
  single-quoted strings. Use `;` for sequential command
  chaining; the agent MUST NOT use `&&` or `||` as control-flow
  operators.
- In headless Windows/PowerShell flows, launch every
  non-interactive console child process headlessly. The agent
  MUST NOT use the `&` call operator from a windowless parent
  to spawn such children.
- For destructive PowerShell file operations, verify the final
  absolute target path first, normalize file attributes when
  needed, and prefer explicit PowerShell or .NET deletion APIs
  over alias-driven shell deletion.
- Use explicit browser automation session names on Windows when the environment
  supports named sessions.
- If the default browser automation session bind fails, retry with a different
  task-specific session name.
- Close all task-owned browser automation sessions before concluding.
