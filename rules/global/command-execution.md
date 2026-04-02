# Workflow and command execution

## MCP server setup verification

- Verify MCP connectivity whenever expected tools are missing or configuration
  changes; fix/report connection failures before proceeding.
- Do not add wrappers or pipes to commands unless the user explicitly asks.
- Prefer repository-standard scripts/commands (package.json scripts, README
  instructions).
- Reproduce reported command issues by running the same command (or closest
  equivalent) before proposing fixes.
- Treat nonzero exits from external commands as failures unless a specific exit
  code is explicitly documented and checked as an expected condition; never map
  unknown nonzero exits to benign states.
- In headless Windows/PowerShell flows, launch every non-interactive console
  child headlessly and do not use the `&` call operator from a windowless
  parent to spawn such children.
- When diagnosing third-party tool failures, check the latest stable release
  first; if the latest still reproduces the failure, treat upgrade as
  insufficient, record the verified limitation, and use a deterministic
  workaround when available.
- Avoid interactive git prompts by using --no-edit or setting GIT_EDITOR=true.
- If elevated privileges are required, use sudo directly; do not launch a
  separate elevated shell (e.g., Start-Process -Verb RunAs). Fall back to run as
  Administrator only when sudo is unavailable.
- Keep changes scoped to the affected canonical repository; when destination
  ownership is inferred, verify from repo purpose and user intent before
  landing changes, and keep uncertain work isolated until confirmed.
- If no branch is specified, work on the current branch; direct commits to
  main/master are allowed.
- Do not assume agent platform capabilities beyond what is available; fail
  explicitly when unavailable.
- CLIs must follow standard conventions: help/version flags, piping, machine-
  readable output, dry-run for mutations, deterministic exit codes, and config
  validation.
- Use explicit `agent-browser` session names on Windows, retry with a different
  session if the default bind fails, and close all task-owned sessions before
  concluding.
- For federated identity flows (Google, Apple, Microsoft, GitHub, etc.), when
  automation-launched browser contexts are blocked, degraded, or risky, hand off
  only the IdP step to a real browser/session via CDP or explicit user
  interaction, then resume automation after the redirect; do not try to bypass
  provider anti-automation or embedded-browser restrictions.

## Codex-only PowerShell safety

- For destructive PowerShell file operations, verify the final absolute target
  path first, normalize attributes when needed, and prefer explicit
  PowerShell/.NET deletion APIs over alias-driven shell deletion.
- In PowerShell, use `;` for sequential command chaining; never use `&&` or `||`
  as control-flow operators.

## Post-change deployment

- After modifying code, check whether deployment steps beyond commit/push are
  needed before concluding; if the repo is globally linked (`npm ls -g` shows
  `->` to local path), rebuild and verify the global binary is functional.
- If the repo powers a running service, daemon, or scheduled task, rebuild,
  restart, and verify with deterministic evidence; do not claim completion until
  the running instance reflects the changes. Detection and verification
  procedures are in the `post-deploy` skill.
- For tests, helper flows, or ad hoc verification setups that spawn background
  services, daemons, browsers, temporary clones, patch files, or other
  agent-owned temporary resources, verify teardown and remove them before
  concluding; if cleanup fails, fix the harness or cleanup path instead of
  leaving residue.
- This is a Windows/PowerShell environment: do not use Unix commands directly,
  and run PowerShell scripts via `pwsh`/`powershell -File` only.
