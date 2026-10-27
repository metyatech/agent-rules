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
- For OS/sandbox permission failures (`EPERM`, `EACCES`, access denied,
  or denied file read/write, create, rename, install, or Git operations),
  verify target, ownership, conflicts, and side effects. If ambiguous,
  retry the same operation once through the approved sandbox or host
  route. If clearly OS-administrator-only, use scoped administration
  directly without a futile sandbox retry. For known MXC signatures,
  use the native approval route below first. HTTP 401/403, authentication
  errors, timeouts, locks, and configuration errors are not OS permission
  failures. Preserve approval gates. If retry is unavailable, refused,
  or fails, report the gap; never claim full verification unless all
  required checks ran.

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
- If Git or `gh` fails with an authentication, token, or credential-helper
  error inside a Codex sandbox, do not treat that result alone as proof that
  the user's GitHub credentials are invalid. Check the existing host-side
  authentication state through an authorized read-only route. If it works,
  retry the same in-scope Git/GitHub operation once through the approved host
  execution route, preserving the original target repository and safety
  checks. Never print, copy, export, or inject credentials into the sandbox,
  bypass an approval boundary, or retry indefinitely. If a trusted host route
  is unavailable or also fails, stop and report the distinction.
- For federated identity flows (Google, Apple, Microsoft,
  GitHub) where an automation-launched browser is blocked or
  degraded, hand off only the IdP step to a real browser
  session and resume automation after the redirect. The agent
  MUST NOT attempt to bypass provider anti-automation or
  embedded-browser restrictions.
- If CGCL reports `lock_active` because another worker owns the canonical
  task working directory, stop that run immediately; never wait for its lock,
  terminate its owner, or repeat the same run in that directory. When the
  task remains necessary, create a separate task-specific Git worktree from
  a verified repository base and start a new CGCL run using that distinct
  canonical working directory. Preserve the original checkout, other
  worktrees, active workers, and their pending changes; use normal Git
  integration without force-push. Only auto-retry when the original work
  was definitely not started, and avoid duplicate work on an ambiguous run.
  If a safe independent worktree cannot be prepared, report the blocker.

- At task end, remove only verified unused, authorized resources.
  Preserve pending work and others' resources; report leftovers.

## Privilege elevation

- For an operation within the existing task scope that clearly
  requires OS administrator privileges, the agent MAY invoke `sudo`
  directly without separate per-command authorization or confirmation.
  On Windows, use the narrowest available administrator execution for
  the exact operation. This standing permission does not expand the
  task scope, authorize new destructive operations, override explicit
  prohibitions, or permit broad security changes. Keep the command and
  target narrow. For ambiguous permission failures, follow the approved
  sandbox or host diagnostic retry first. For MXC-specific sandbox
  signatures, use the native Codex sandbox approval route first; do not
  substitute `sudo` for sandbox approval. Do not use broad security
  changes or disable sandbox protections as a shortcut.

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
- Windows `.cmd`/`.bat`: BOM-free CRLF and matching code page;
  Japanese PowerShell 5.1 `.ps1`: UTF-8 BOM.

## Windows sandbox and permission failures

- On Windows, treat `EPERM`, `EACCES`, or WinError 5 while creating a Junction
  or hard link, or atomically replacing a file under the MXC sandbox or another
  sandboxed or redirected `%TEMP%` or `%LOCALAPPDATA%`, as a known sandbox
  signature, not immediate proof of an application defect.
- Node `fs.symlinkSync(target, link, 'junction')` creates a directory junction;
  it is not a standard file or directory symbolic-link privilege probe. Under
  MXC, `EPERM` from this call is a known MXC capability signature. Do not
  classify it as host Developer Mode or Windows OS-level symbolic-link denial
  before trying one native approval.
- For this MXC-specific signature, first request Codex native sandbox
  escalation (`require_escalated` or its version-equivalent) for the same
  already-in-scope command, in the same working directory, with a brief
  justification. If the failure comes from a test run (for example, `npm test`
  or `node --test`), the command to escalate is the original full test command
  in that same working directory, preserving the test invocation; do not
  replace it with a manually extracted junction or link-only probe. Make only
  one escalation request, using native `require_escalated`, and use the
  existing configured approval reviewer, including `auto_review` when
  available; never bypass that reviewer.
- If the request is approved, rerun the same full command once and verify its
  actual exit code and all assertions, including the whole test suite when the
  command was a test run. Do not infer success from a partial result.
- If escalation is refused, unsupported, or the command fails again, do not
  request escalation again or repeat diagnosis against unchanged evidence.
  Report the unresolved verification coverage and continue independent safe
  work.
- Preserve every test and assertion; never weaken or disable them. A skipped
  test is not a pass.
- Classify genuine Windows OS-level symbolic-link creation failures separately
  as a Windows capability or privilege issue, such as Developer Mode, after
  distinguishing them from the MXC junction signature. Keep any authorized OS
  administrator execution scoped as described in Privilege elevation. Do not
  use the legacy `elevated` Windows sandbox, `danger-full-access`, global
  sandbox disablement, or broad configuration or system security changes as a
  shortcut. Report unresolved coverage when the required assertion cannot be
  verified.
