# Command execution

## General execution rules

- Prefer repo-standard scripts (`package.json`, `Makefile`, README).
  The agent MUST NOT add wrappers, redirections, or pipes unless the user asks.
- Reproduce a reported command failure (or closest equivalent) before fixing it.
- Nonzero exit codes are failures unless documented and
  explicitly checked in code;
  never reclassify unknown codes.
- Assume only available agent capabilities. On missing tools or changed config,
  verify MCP access or report the blocker; stop dependent work.
- For third-party failures, check the latest stable release; if it still fails,
  document the limitation and use a deterministic workaround.
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

- New Git worktrees MUST be created outside every existing Git
  working-tree root.
  Verify the resolved canonical destination before `git worktree add`
  or `git worktree move`.
  MUST NOT create or move a worktree into a repository's own directory,
  including `.worktrees/` or another nested location. Use a sibling directory
  outside the repository; if no safe external destination exists, stop.

- When directly running a repository-scoped Git command, the agent MUST explicitly
  select its target repository independently of the shell working directory or
  preceding directory changes.
- Avoid interactive git prompts (pass `--no-edit` or set
  `GIT_EDITOR=true`).
- When no branch is specified, work on the current branch.
  Direct commits to `main`/`master` are permitted in
  user-controlled repositories.
- If Git or `gh` fails authentication, token, or credential-helper checks
  in a Codex sandbox, verify host authentication read-only; sandbox failure
  alone does not prove invalid credentials. If host access succeeds, retry
  the same scoped operation once through the approved host route, keeping
  repository and safety checks. Never print, copy, export, or inject
  credentials; never bypass approval,
  or retry indefinitely; if host access fails, stop and report.
- For blocked Google, Apple, Microsoft, or GitHub login in an automated
  browser, hand off only the IdP step to a real browser and resume after
  redirect. NEVER bypass anti-automation or embedded-browser restrictions.
- On CGCL `lock_active` from another worker in the task directory, stop:
  no lock wait, worker termination, or same-directory retry. If still needed,
  use a task-specific worktree at a distinct canonical path from a verified
  base. Preserve the original checkout, other worktrees, workers,
  and pending changes; integrate without
  force-push. Auto-retry only if work definitely never began; never duplicate
  ambiguous work. If isolation is unavailable, report the blocker.
- At task end, remove only verified unused, authorized resources.
  Preserve pending work and others' resources; report leftovers.
- When removing a task-owned worktree, verify its directory and Git registration
  are gone; unlink only verified leftover `node_modules` junctions/symlinks (not
  their targets), remove empty remnants, and preserve/report unexpected content.

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

- Use Windows/PowerShell commands, not Unix-only commands; execute PowerShell
  scripts with `pwsh` or `powershell -File`.
- Backslash is literal in PowerShell. Prefer single quotes;
  do not shadow automatic variables;
  chain with `;`, not `&&` or `||`.
- Headless Windows console children MUST launch headlessly; do not use the
  PowerShell `&` call operator from a windowless parent to start them.
- Before destructive file operations, verify the absolute target, normalize
  attributes when needed, and prefer explicit PowerShell/.NET APIs over `rm`.
- Name browser automation sessions when supported; on default bind failure,
  retry with a different task-scoped name. Close task-owned sessions at end.
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
