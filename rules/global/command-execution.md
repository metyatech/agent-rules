# Commands

- Prefer repo-standard scripts; no wrappers, redirects, or pipes unless asked.
  Reproduce reported failures (or closest equivalent) before fixes.
  Nonzero exits fail unless documented and checked explicitly in code; unknown
  codes fail.
- Use available capabilities only. For missing/changed tools/config, verify MCP
  access or report blocker and stop dependent work. For third-party failures,
  check latest stable; if persistent, document limits and use deterministic
  workarounds.

- Before dependency-requiring commands, check installed dependencies/caches
  against manifest/lockfile; prepare missing dependencies in this task, preferring
  the repo-standard installer.
- If preparation fails, identify why and try permitted alternatives in the same
  execution (compatible dependencies/cache or approved host retry for sandbox
  restrictions). Stop only if none works or explicitly forbidden to continue.
  Never modify shared dependencies unsafely, bypass approval, or weaken
  verification.
- For `EPERM`, `EACCES`, access denied, or denied file/Git operations
  (read/write, create, rename, install), verify target, ownership, conflicts,
  side effects. If ambiguous, retry same operation once via approved
  sandbox/host; for clearly OS-admin-only failures, use scoped admin. Known MXC
  signatures require native approval first. HTTP 401/403, auth, timeouts, locks,
  and config errors aren't OS permission failures. Preserve approval gates;
  report failed/refused/unavailable retries. Claim full verification only after
  all required checks pass.

## Processes

- Diagnostics MUST be read-only by default. Never disrupt pre-existing
  processes, shared daemons, or services without explicit action-specific user
  authorization. Discovery/start does not make managed/shared daemons disposable.
  Use official lifecycle for authorized stops/restarts; force termination
  requires separate explicit authorization after managed shutdown fails.
- Clean agent-started isolated temporary test fixtures without approval only
  with verified ownership: retain a handle or verify executable identity and
  creation time before termination. A PID alone is insufficient. Never use broad
  process-name matches, unverified PIDs, or process-tree kills for diagnostics.
  If ownership/identity is uncertain, leave it running and report why.
- Autostart, scheduled, and background processes MUST show no console/GUI unless
  user interaction is required. Verify actual launch, not just task visibility
  settings; preserve startup, stop, monitoring, recovery, and updates.

## Git

- New Git worktrees MUST be outside every existing Git
  working-tree root.
  Verify resolved canonical destination before `git worktree add`
  or `git worktree move`.
  MUST NOT create or move a worktree into a repository's own directory,
  including `.worktrees/` or nested paths. Use an external sibling; otherwise
  stop.

- Repository-scoped Git commands MUST select their repo explicitly, independent
  of shell directory. Avoid prompts (`--no-edit` or `GIT_EDITOR=true`).
- Omitted branch defaults to current branch.
  Direct commits to `main`/`master` are permitted in
  user-controlled repositories.
- Sandbox Git/`gh` auth failures don't prove invalid credentials. Check host
  auth read-only; only then retry the same scoped operation once via approved
  host route with repo/safety checks. Otherwise stop/report. Never expose
  credentials or bypass approval.
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
  branches, and temp/prompt files only after verifying ownership, unused and clean
  (no uncommitted/unmerged work), integration/commit/push where relevant, and no
  active worker/PR/process references. Preserve dirty/unmerged, shared, unowned,
  or active resources; report each unsafe leftover and why. Unsafe leftovers
  prevent completion.
- CGCL clean/integrated worktrees/branches: GC-owned, not unfinished; no
  manual Git deletion. For GC failures, use CGCL.
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
- If approved, rerun the same full command once; verify its exit code and every
  assertion, including the whole suite for test commands. Do not infer success
  from partial results. If refused, unavailable, or failing, don't repeat
  escalation/unchanged diagnosis; report uncovered verification and continue
  independent safe work. Preserve all tests/assertions; never weaken/disable
  them. Skips aren't passes.
- Classify genuine OS symlink failures as Windows capability/privilege issues
  (e.g. Developer Mode), distinct from MXC; scope admin actions. Never use the
  legacy `elevated` Windows sandbox,
  `danger-full-access`, global
  sandbox disablement, or broad security/config changes. Report unverified
  required assertions.
