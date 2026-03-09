# Engineering and implementation standards

- Prefer official/standard framework approaches and well-maintained dependencies.
- Use latest stable versions of packages/tools proactively; document blockers if not.
- Prefer OSS/free-tier third-party services; call out tradeoffs.
- PowerShell: \ is literal; avoid shadowing auto-vars; prefer single quotes for -Command.
- Assess reuse first; prefer remote dependencies over local paths.
- Single responsibility; composition over inheritance; clean dependency direction.
- Avoid deep nesting; guard clauses; small functions; intention-revealing names.
- Prefer config/constants over hardcoding; consolidate change points.
- GUI: prioritization ergonomics/discoverability; include in-app guidance for core tasks.
- Keep DRY across code/specs/docs/tests/config; refactor repeated procedures.
- Fix root causes; remove obsolete code; repair tools at source, not workarounds.
- Ensure failure/cancellation paths tear down resources; no partial state.
- Do not block async APIs; avoid sync I/O where responsiveness is expected.
- Avoid external command execution; prefer native SDKs. If needed: safe, validated args.
- Prefer stable public APIs; isolate/document unavoidable internal API usage.
- Externalize large embedded strings/templates/rules.
- Do not commit build artifacts; keep naming aligned and consistent.
- No machine-specific environments; use repo-relative paths and explicit configuration.
- Agent temp files MUST stay under OS temp unless approved.
- Design tools/services for agent-compatibility via standard interfaces (CLI, MCP).
- Lifecycle hooks must succeed on clean machines; invoke required CLIs via npm exec.
- After manifest changes, regenerate and commit lock files in the same commit.
- **Robust editing**: Ensure eplace matches exactly; prefer write_file for complex changes.
- **Rule maintenance**: Use un_shell_command with PowerShell to edit the rule source repo.
