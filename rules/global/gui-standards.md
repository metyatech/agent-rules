# GUI design and verification

This module governs the design and verification of user-facing
graphical user interfaces. General engineering rules live in
`engineering-standards`; quality gates apply per
`quality-and-verification`.

## Definitions

- **GUI** — any user-facing graphical interface, including web,
  desktop, and mobile.
- **First-use clarity** — the property that a new user can identify
  the primary path and the next action without prior training or
  documentation.
- **Operator surface** — UI elements that exist for backend
  operators or for the agent itself rather than for the end user.
- **Product surface** — UI elements that exist for the end user as
  part of the product.

## Design rules

- The agent MUST design GUIs around the user's real workflow moment,
  next action, and result.
- The agent MUST NOT use persistent explanatory prose to compensate
  for an unclear UI. Detailed flow design guidance is defined in
  the `guided-gui-design` skill.
- For Web GUIs with user-entered state that would be costly to
  recreate, the agent MUST preserve draft state across reloads,
  accidental tab or browser closes, and browser restarts by default.
- When draft persistence would be unsafe, the agent MUST provide an
  explicit equally-safe recovery path. The agent MUST NOT silently
  discard the draft.
- The agent MUST optimize GUIs for first-use clarity:
  - The agent MUST use ordinary task language.
  - The agent MUST NOT use irrelevant internal jargon.
  - The agent MUST keep precise operator or domain terms when they
    are part of the user's real work.
  - The agent MUST make the current selection, source, and result
    obvious at all times.
  - The agent MUST prefer user comprehension over stylistic flourish
    or machine-verifiable convenience.
- For human/AI systems, the agent MUST keep operator surfaces,
  backend capabilities, and product surfaces distinct. The agent
  MUST NOT expose operator-only or backend-only paths as product
  GUI controls unless the requester explicitly asks for that
  surface.
- In GUI interactions, the agent MUST follow established
  expectations for common controls (info icons, disclosure toggles,
  close buttons, tabs, row selection). The agent MAY deviate only
  when the UX gain clearly outweighs the surprise cost.
- The agent MAY use modern visuals and purposeful motion only when
  they improve comprehension. The agent MUST NOT introduce
  horizontal scrolling in primary UI without explicit justification.
- In interactive selection flows, the agent MUST make the current
  item, choice set, and destination explicit at a glance.

## Verification rules

- For GUI work, the agent MUST complete all of the following before
  reporting completion:
  1. A first-use walkthrough on the claimed environments.
  2. Screenshot-based review of every changed view.
  3. Layout and state visibility checks for required content and
     controls.
  4. A whole-screen plausibility pass.
- If the primary flow or next action is not immediately
  understandable in the first-use walkthrough, the agent MUST treat
  the work as unfinished and MUST iterate until first-use clarity
  is achieved.
- Detailed GUI verification procedures and checklists are defined in
  the `quality-workflow` skill.
