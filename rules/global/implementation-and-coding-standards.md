# Engineering and implementation standards

- Prefer official, well-maintained, latest-stable tools and dependencies by
  default; prefer OSS/free-tier services and call out tradeoffs when not.
- PowerShell: \ is literal; avoid shadowing auto-vars; prefer single quotes.
- Assess reuse first: before designing or building a system, verify whether the
  whole system or any decomposed subsystem can be satisfied by an existing
  official or well-maintained system, service, or tool; use existing systems by
  default and build custom logic only for verified gaps.
- Keep designs compositional, dependency direction clean, control flow shallow,
  naming intention-revealing, and change points centralized in config/constants.
- Design GUIs around the user's real workflow moment, next action, and result;
  use persistent explanatory prose only when the action cannot be inferred from
  the UI itself. Detailed flow design guidance belongs in `guided-gui-design`.
- For Web GUIs with user-entered state that would be costly to recreate,
  preserve draft state across reloads, accidental tab/browser closes, and
  browser restarts by default; if persistence would be unsafe, provide an
  explicit equally-safe recovery path instead of silent data loss.
- Optimize GUIs for first-use clarity and real-workflow task success: use
  ordinary task language, avoid internal jargon, make current
  selection/source/result obvious, and prefer user comprehension over stylistic
  flourish or machine-verifiable convenience.
- For human/AI systems, keep operator conventions, backend capabilities, and
  user-facing product features distinct; do not expose operator-only or
  backend-only paths as GUI controls unless the requester explicitly asks for
  that surface.
- In GUI interactions, follow established expectations for common controls (for
  example info icons, disclosure toggles, close buttons, tabs, row selection);
  only deviate when the UX gain clearly outweighs the surprise cost.
- Prefer modern visuals and purposeful motion only when they improve
  comprehension; avoid horizontal scrolling in primary UI unless explicitly
  justified.
- In interactive selection flows, make the current item, choice set, and
  destination explicit at a glance; comprehension wins over style.
- Keep DRY across code/docs/tests/config; refactor repeated procedures.
- Fix root causes; remove obsolete code; repair tools at source.
- Ensure failure paths tear down resources; no partial state.
- Do not block async APIs, avoid sync I/O where responsiveness is expected, and
  prefer push-, event-, or signal-driven synchronization over periodic polling;
  use polling only when no reliable authoritative event path exists or the user
  explicitly requests it, and when unavoidable document why it is necessary and
  bound its cadence and retry behavior.
- Avoid external command execution; prefer native SDKs.
- Prefer stable public APIs; isolate/document unavoidable internal API usage.
- Externalize large embedded strings/templates/rules; do not commit build
  artifacts and keep naming aligned.
- No machine-specific environments; use relative paths and explicit config.
- Agent temp files MUST stay under OS temp unless approved.
- Design tools/services for agent-compatibility via standard interfaces (CLI).
- Lifecycle hooks must succeed on clean machines; use npm exec.
- Regenerate and commit lock files after manifest changes.
- **Robust editing**: Run formatter (e.g. clang-format) IMMEDIATELY BEFORE
  replace to normalize disk state; do not re-read file unless changed
  externally.
