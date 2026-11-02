# Commands

- Prefer repo-standard scripts; add no wrappers, redirects, or pipes unless
  asked. Reproduce reported failures (or closest equivalent) before fixing.
  Nonzero exits fail unless documented and explicitly checked in code; unknown
  codes fail.
- Use available capabilities only. For missing/changed tools/config, verify
  MCP access or report a blocker and stop dependent work. For third-party
  failures, check latest stable release; if persistent, document limits and use
  deterministic workarounds.
- For `EPERM`, `EACCES`, access denied, or denied file/Git operations
  (read/write, create, rename, install), verify target, ownership, conflicts,
  side effects. If ambiguous, retry same operation once via approved
  sandbox/host; for clearly OS-admin-only failures, use scoped admin. Known MXC
  signatures require native approval first. HTTP 401/403, auth, timeouts, locks,
  and config errors aren't OS permission failures. Preserve approval gates;
  report failed/refused/unavailable retries. Claim full verification only after
  all required checks pass.

## Processes

- System diagnostics MUST be read-only by default. The agent MUST NOT
  terminate, force-kill, restart, or otherwise disrupt pre-existing processes,
  shared daemons, or services without explicit action-specific user
  authorization.
- Agent-started isolated temporary test fixtures MAY be cleaned without
  approval only with verified ownership/identity. A PID alone is
  insufficient; retain a process handle or verify executable identity and
  creation time before termination.
- Starting/discovering managed/shared daemons during diagnostics doesn't make
  them agent-owned disposable test processes. Managed services MUST use
  official lifecycle for authorized stops/restarts; force termination requires
  separate explicit authorization after managed shutdown fails.
- The agent MUST NOT use broad process-name matches, unverified PIDs, or
  process-tree kills for diagnostics. If ownership/identity is uncertain, the
  agent MUST leave it running and report why.

## Git

- New Git worktrees MUST be outside every existing Git
  working-tree root.
  Verify resolved canonical destination before `git worktree add`
  or `git worktree move`.
  MUST NOT create or move a worktree into a repository's own directory,
  including `.worktrees/` or another nested location. Use a sibling directory
  outside the repository; if none is safe, stop.

- Repository-scoped Git commands MUST select their repo explicitly, independent
  of shell directory. Avoid prompts (`--no-edit` or `GIT_EDITOR=true`).
- Omitted branch defaults to current branch.
  Direct commits to `main`/`master` are permitted in
  user-controlled repositories.
- On sandbox Git/`gh` auth/token/credential-helper failure, check host auth
  read-only; sandbox failure alone doesn't prove credentials invalid. If host
  auth works,
  retry the same scoped operation once via the approved host route with repo/
  safety checks. Never expose credentials, bypass approval, or retry again; if
  host auth fails, stop/report.
- If Google/Apple/Microsoft/GitHub login is blocked, hand off only the IdP step
  to a real browser and resume after redirect. NEVER bypass anti-automation or
  embedded-browser restrictions.
- On CGCL `lock_active` from another task-directory worker, stop: no wait,
  worker termination, or same-dir retry. If needed, use a task-specific
  worktree at a distinct canonical path from a verified
  base. Preserve the original checkout, other worktrees/workers, and pending
  changes; integrate without force-push. Retry only if work definitely never
  began; never duplicate ambiguous work. If isolation is unavailable, report it.
- Task completion MUST remove task-owned temp worktrees, local/remote task
  branches, and temp/prompt files after verifying ownership, unused and clean
  (no uncommitted/unmerged work), integration/commit/push where relevant, and
  no active worker/PR/process references. Preserve dirty/unmerged, shared,
  unowned, or active resources; report each unsafe leftover and why. Unsafe
  leftovers prevent completion.
- After worktree removal, verify directory and Git registration are gone.
  Unlink only verified task-owned `node_modules` junctions/symlinks, never
  targets; remove empty remnants; preserve/report unexpected content.

## Privilege

- For clearly in-scope operations requiring OS-admin rights, MAY run `sudo`
  directly without separate per-command authorization or confirmation; on
  Windows use the narrowest available admin execution per operation. This doesn't
  expand scope, authorize destructive or hard-to-reverse work, override
  explicit prohibitions, or allow broad security changes.
  Keep command/target narrow. Retry ambiguous denials via approved sandbox/host;
  for MXC use native Codex approval, not `sudo`. Never disable sandbox
  protections as a shortcut.

## Windows

- Use Windows PowerShell, not Unix; run scripts with `pwsh` or
  `powershell -File`.
  Backslashes are literal: use single quotes, don't shadow automatic variables,
  and chain with `;` (not `&&`/`||`).
- Console children MUST launch headlessly; don't start them with PowerShell `&`
  from a windowless parent. Before destructive file operations, verify the
  absolute target, normalize attributes if needed, and prefer PowerShell/.NET
  APIs to `rm`.
- Name browser sessions when supported; on bind failure retry with a task name
  and close owned sessions. `.cmd`/`.bat` require BOM-free CRLF/matching code
  page; Japanese PowerShell 5.1 requires UTF-8 BOM.

## Sandbox

- On Windows, `EPERM`, `EACCES`, or WinError 5 creating Junctions/hard links or
  atomically replacing a file under MXC or sandboxed/redirected `%TEMP%` /
  `%LOCALAPPDATA%` is a sandbox signature, not proof of an app defect. Node
  `fs.symlinkSync(target, link, 'junction')` creates a directory junction, not
  a symlink privilege probe; MXC `EPERM` is a known capability signature. Do
  not attribute it to Developer Mode/OS denial before native approval.
- For this MXC-specific signature, make one Codex native sandbox escalation
  (`require_escalated` or equivalent) for the same in-scope command/directory,
  with a brief reason. For test failures, escalate the original full test
  command, never a link-only probe. Use the configured reviewer (`auto_review`
  when available); never bypass it.
- If approved, rerun the same full command once; verify its exit code and all
  suite assertions. If refused, unavailable, or failing,
  don't repeat escalation/unchanged diagnosis; report uncovered verification
  and continue independent safe work. Preserve all tests/assertions; never
  weaken/disable them. Skips aren't passes.
- Classify genuine OS symlink failures as Windows capability/privilege issues
  (e.g. Developer Mode), distinct from MXC; scope admin actions. Never use the
  legacy `elevated` Windows sandbox,
  `danger-full-access`, global
  sandbox disablement, or broad security/config changes. Report unverified
  required assertions.
