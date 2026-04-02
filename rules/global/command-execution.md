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
- When a Windows process is intended to run headlessly, every non-interactive
  child console process in that spawn chain must also be launched headlessly
  (`windowsHide: true`, `CreateNoWindow`, or `Start-Process -WindowStyle Hidden`
  as appropriate).
- From a windowless PowerShell parent, do not spawn non-interactive console
  children with the `&` call operator; use an explicit hidden process launch
  that preserves output/exit-code handling.
- When diagnosing third-party tool failures, check the latest stable release
  first; if the latest still reproduces the failure, treat upgrade as
  insufficient, record the verified limitation, and use a deterministic
  workaround when available.
- Avoid interactive git prompts by using --no-edit or setting GIT_EDITOR=true.
- If elevated privileges are required, use sudo directly; do not launch a
  separate elevated shell (e.g., Start-Process -Verb RunAs). Fall back to run as
  Administrator only when sudo is unavailable.
- Keep changes scoped to affected repositories; when shared modules change,
  update consumers and verify at least one.
- When the destination repo/path is inferred rather than explicitly requested,
  verify from the repo's stated purpose and the user's intent that it is the
  canonical home for the work; structural or tooling fit alone is insufficient,
  and if ownership is unclear, keep the work isolated until the destination is
  confirmed.
- If no branch is specified, work on the current branch; direct commits to
  main/master are allowed.
- Do not assume agent platform capabilities beyond what is available; fail
  explicitly when unavailable.
- When building a CLI, follow standard conventions: --help/-h, --version/-V,
  stdin/stdout piping, --json output, --dry-run for mutations, deterministic
  exit codes, and JSON Schema config validation.
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
