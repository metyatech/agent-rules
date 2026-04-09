# Command execution

Post-change deployment verification lives in
`post-change-deployment`. CLI conventions live in the `cli-design`
skill.

## Definitions

- **External command** — any executable invoked through a shell or
  process API that the agent does not own.
- **Repository-standard command** — the command published by the
  repository's `package.json` scripts, `Makefile`, README, or
  other authoritative documentation.

## General execution rules

- Prefer repository-standard scripts and commands over ad hoc
  invocations. The agent MUST NOT add wrappers, redirections, or
  pipes unless the user explicitly asks for them.
- Before proposing a fix for a reported command failure, reproduce
  the same command (or the closest equivalent) and observe the
  same failure.
- Treat any nonzero exit code as a failure unless the specific
  exit code is explicitly documented AND the agent's code
  explicitly checks for that documented value. The agent MUST NOT
  map unknown nonzero exits to benign states.
- The agent MUST NOT assume agent platform capabilities beyond
  what is available; fail explicitly when a required capability is
  unavailable.
- When expected tools are missing or configuration has changed,
  verify MCP connectivity, fix or report connection failures, and
  do not proceed with work that depends on the missing tool.
- When diagnosing a third-party tool failure, first check the
  latest stable release. If the latest still reproduces the
  failure, record the verified limitation and use a deterministic
  workaround when one exists.

## Git and identity flows

- Avoid interactive git prompts by passing `--no-edit` or setting
  `GIT_EDITOR=true`.
- When no branch is specified, work on the current branch. Direct
  commits to `main` or `master` are permitted in user-controlled
  repositories.
- For federated identity flows (Google, Apple, Microsoft, GitHub),
  when an automation-launched browser context is blocked or
  degraded, hand off only the IdP step to a real browser session
  via CDP or explicit user interaction, then resume automation
  after the redirect. The agent MUST NOT attempt to bypass
  provider anti-automation or embedded-browser restrictions.

## Privilege elevation

- When elevated privileges are required, use `sudo` directly. The
  agent MUST NOT launch a separate elevated shell such as
  `Start-Process -Verb RunAs`. Fall back to "Run as Administrator"
  only when `sudo` is unavailable.

## Windows and PowerShell environment

- This is a Windows/PowerShell environment. The agent MUST NOT
  invoke Unix-only commands directly; run PowerShell scripts via
  `pwsh` or `powershell -File`.
- In PowerShell, the backslash `\` is a literal character. Avoid
  shadowing PowerShell automatic variables; prefer single-quoted
  strings.
- In PowerShell, use `;` for sequential command chaining. The
  agent MUST NOT use `&&` or `||` as control-flow operators.
- In headless Windows/PowerShell flows, launch every
  non-interactive console child process headlessly. The agent
  MUST NOT use the `&` call operator from a windowless parent to
  spawn such children.
- For destructive PowerShell file operations, verify the final
  absolute target path first, normalize file attributes when
  needed, and prefer explicit PowerShell or .NET deletion APIs
  over alias-driven shell deletion.
- Use explicit `agent-browser` session names on Windows. If the
  default session bind fails, retry with a different session
  name. Close all task-owned agent-browser sessions before
  concluding.
