# GUI design and verification

Theory, lenses, and workflow: `guided-gui-design`. Non-negotiable
obligations follow.

## Task and structure

- Design GUIs around the user's real workflow, not the internal
  data model. Organize controls by task sequence; keep secondary
  detail behind the primary flow.
- For human/AI systems, the agent MUST NOT expose operator-only
  or backend-only paths as product GUI controls unless the
  requester explicitly asks.

## State and feedback

- At every stage the user MUST be able to identify: where they
  are, what they are acting on, what the next action is, what
  will happen, and what changed after acting.
- In interactive selection flows, the agent MUST make the current
  selection, source, target, and result visually distinct without
  requiring the user to read a tooltip or status bar.
- The agent MUST give immediate, localized feedback after every
  state-changing action. Transient messages alone MUST NOT be the
  only indication of state change.

## Cognitive load

- GUIs MUST be designed for first-use clarity using ordinary task
  language. The agent MUST NOT use persistent explanatory prose to
  compensate for an unclear UI.
- The agent MUST replace implementation jargon with task language;
  keep domain terms only when they are part of the user's real work.
- The agent MUST NOT require users to remember hidden state from
  previous screens (recognition over recall).
- The agent MUST NOT split a flow into beginner/expert modes
  unless the user explicitly asks.

## Conventions

- Follow established conventions for common controls. Deviate only
  when the UX gain clearly outweighs the surprise cost.
- The agent MUST NOT introduce horizontal scrolling in primary UI
  without explicit justification.
- The agent MUST place the primary confirmation action near the
  artifact it commits.

## Error prevention and recovery

- The agent MUST make destructive or irreversible actions explicit,
  distinguishable from routine actions, and confirmable or undoable.
- The agent MUST prevent invalid states at the input boundary when
  possible, and show validation next to the offending control.
- The agent MUST provide visible recovery paths (undo, retry,
  reset, cancel) where mistakes are plausible. The agent MUST NOT
  hide recovery only in documentation.

## Draft state

- For Web GUIs with user-entered state costly to recreate, the
  agent MUST preserve draft state across reloads and accidental
  closes. When unsafe, provide an equally-safe recovery path; the
  agent MUST NOT silently discard the draft.

## Accessibility minimum

- Every interactive control MUST have an accessible name and a
  visible focus indicator.
- The primary flow MUST be completable by keyboard alone in a
  logical focus and reading order.
- The agent MUST NOT convey state, selection, or validity through
  color alone; pair color with shape, weight, icon, or text.
- Text and UI components MUST meet WCAG 2.1 AA contrast (4.5:1
  normal text, 3:1 large text and UI components).
- The agent MUST NOT remove the default focus ring without
  providing an equally visible replacement.

## Verification gates

Before reporting completion on any GUI change, the agent MUST:

1. Complete a first-use walkthrough following only the visible UI.
2. Take screenshots at normal and reduced width; review for
   overflow, clipping, wrapping, and missing controls.
3. Verify keyboard reachability and visible focus for the primary
   flow.
4. Run a whole-screen plausibility pass.

If the primary flow is not immediately understandable, iterate
until first-use clarity is achieved.
