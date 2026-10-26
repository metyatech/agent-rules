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

## Windows sandbox capability failures

- On Windows, treat `EPERM`, `EACCES`, or WinError 5 while creating a Junction
  or hard link, or atomically replacing a file under the MXC sandbox or another
  sandboxed or redirected `%TEMP%` or `%LOCALAPPDATA%`, as a known sandbox
  signature, not immediate proof of an application defect.
- Classify the operation, route, and path once. Run at most one minimal
  comparison of the same operation for that path class and, when an
  already-authorized execution route is available, at most one comparison
  through the legacy `elevated` sandbox or the host. Do not repeat broad
  diagnosis or an unchanged probe when operation, route, and evidence are
  unchanged.
- Preserve all tests and assertions. If the alternate route passes, classify
  the failure as sandbox-specific and use that route or Windows CI running the
  same assertion. A skipped test is not a pass; never weaken tests to hide the
  error.
- If symbolic-link creation also fails on the host or through the legacy
  `elevated` sandbox, classify it separately as a Windows capability or
  privilege issue, such as Developer Mode. Do not keep retrying or change
  system security settings without approval. Use verified Windows CI or
  another authorized environment, or report the exact unverified coverage.
- Continue independent work when safe. Stop only when required verification
  has no authorized route, and report that exact gap. Never disable sandboxing
  globally or use `danger-full-access` as a generic workaround.
