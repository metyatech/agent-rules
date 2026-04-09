# GUI design and verification

Detailed flow design guidance lives in the `guided-gui-design` skill.
Detailed GUI verification procedures and checklists live in the
`quality-workflow` skill.

## Definitions

- **GUI** — any user-facing graphical interface (web, desktop,
  mobile).
- **First-use clarity** — the property that a new user can identify
  the primary path and the next action without prior training.
- **Operator surface** — UI elements for backend operators or for
  the agent itself, not for the end user.
- **Product surface** — UI elements for the end user as part of the
  product.

## Design rules

- Design GUIs around the user's real workflow moment, next action,
  and result.
- The agent MUST NOT use persistent explanatory prose to compensate
  for an unclear UI.
- For Web GUIs with user-entered state that would be costly to
  recreate, preserve draft state across reloads, accidental tab or
  browser closes, and browser restarts by default. When draft
  persistence would be unsafe, provide an explicit equally-safe
  recovery path; the agent MUST NOT silently discard the draft.
- Optimize GUIs for first-use clarity: use ordinary task language,
  avoid irrelevant internal jargon, keep precise operator or domain
  terms when they are part of the user's real work, make the
  current selection/source/result obvious at all times, and prefer
  user comprehension over stylistic flourish or
  machine-verifiable convenience.
- For human/AI systems, keep operator surfaces, backend
  capabilities, and product surfaces distinct. The agent MUST NOT
  expose operator-only or backend-only paths as product GUI
  controls unless the requester explicitly asks for that surface.
- Follow established expectations for common controls (info icons,
  disclosure toggles, close buttons, tabs, row selection); deviate
  only when the UX gain clearly outweighs the surprise cost.
- Use modern visuals and purposeful motion only when they improve
  comprehension; the agent MUST NOT introduce horizontal scrolling
  in primary UI without explicit justification.
- In interactive selection flows, make the current item, choice
  set, and destination explicit at a glance.

## Verification rules

- For GUI work, before reporting completion the agent MUST complete
  all of: a first-use walkthrough on the claimed environments,
  screenshot-based review of every changed view, layout and state
  visibility checks for required content and controls, and a
  whole-screen plausibility pass.
- If the primary flow or next action is not immediately
  understandable in the first-use walkthrough, treat the work as
  unfinished and iterate until first-use clarity is achieved.
