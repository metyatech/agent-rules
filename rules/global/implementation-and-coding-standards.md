# Engineering and implementation standards

- Prefer official frameworks and well-maintained dependencies.
- Use latest stable versions of packages/tools; document blockers if not.
- Prefer OSS/free-tier services; call out tradeoffs.
- PowerShell: \ is literal; avoid shadowing auto-vars; prefer single quotes.
- Assess reuse first: before designing or building a system, verify whether the
  whole system or any decomposed subsystem can be satisfied by an existing
  official or well-maintained system, service, or tool; use existing systems by
  default and build custom logic only for verified gaps.
- Single responsibility; composition over inheritance; clean dependency
  direction.
- Avoid deep nesting; guard clauses; small functions; intention-revealing names.
- Prefer config/constants over hardcoding; consolidate change points.
- GUI: start by identifying when in the user's real workflow they will open the
  screen, what they are trying to accomplish at that moment, what context they
  already have, and what decision or action must become easier right then;
  design the interface around that moment, with ergonomics, in-app guidance, and
  a deliberate user journey from current context to next action to result to
  optional detail, and use persistent explanatory prose only when the user
  cannot reasonably infer the action from the UI itself.
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
- Prefer modern, visually rich UI and purposeful motion when they improve
  comprehension; avoid horizontal scrolling in primary application UI unless
  explicitly justified by the task.
- In interactive selection flows, make the current item, the choice list, and
  the destination of the chosen result visually and spatially explicit. Prefer
  anchored drawers, callouts, overlays, or similar patterns over detached panels
  when they improve comprehension.
- Do not treat stylistic richness or "game-like" presentation as success if
  users cannot immediately tell what is selected now, what they are choosing
  from, and where the change will apply. Comprehension wins over style.
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
