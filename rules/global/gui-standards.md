# GUI design and verification

Detailed flow design and verification procedures live in the
`guided-gui-design` and `quality-workflow` skills.

## Design rules

- Design GUIs around the user's real workflow moment, next
  action, and result.
- The agent MUST NOT use persistent explanatory prose to
  compensate for an unclear UI.
- For Web GUIs with user-entered state that would be costly to
  recreate, preserve draft state across reloads, accidental
  tab/browser closes, and restarts by default. When draft
  persistence would be unsafe, provide an explicit equally-safe
  recovery path; the agent MUST NOT silently discard the draft.
- Optimize GUIs for first-use clarity (a new user can identify
  the primary path and the next action without prior training):
  use ordinary task language, avoid irrelevant internal jargon,
  keep precise operator/domain terms when they are part of the
  user's real work, make the current selection/source/result
  obvious at all times.
- For human/AI systems, keep operator surfaces, backend
  capabilities, and product surfaces distinct. The agent MUST
  NOT expose operator-only or backend-only paths as product GUI
  controls unless the requester explicitly asks.
- Follow established expectations for common controls (info
  icons, disclosure toggles, close buttons, tabs, row
  selection); deviate only when the UX gain clearly outweighs
  the surprise cost.
- The agent MUST NOT introduce horizontal scrolling in primary
  UI without explicit justification.
- In interactive selection flows, make the current item, choice
  set, and destination explicit at a glance.

## Verification rules

- For GUI work, before reporting completion the agent MUST
  complete: a first-use walkthrough on the claimed environments,
  screenshot-based review of every changed view, layout and
  state visibility checks for required content and controls,
  and a whole-screen plausibility pass.
- If the primary flow or next action is not immediately
  understandable in the first-use walkthrough, treat the work
  as unfinished and iterate until first-use clarity is achieved.
