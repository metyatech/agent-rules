# GUI design and verification

Design principles, theory, and procedural detail live in the
`guided-gui-design` skill. Test design and runtime verification
procedures live in the `quality-workflow` skill.

This module states the non-negotiable obligations. The judgement
guidance and HCI foundations behind them live in
`guided-gui-design`.

## Task and structure

- Design GUIs around the user's real workflow moment, next
  action, and result, not around the system's internal data
  model or implementation layers.
- The agent MUST organize controls by the user's task sequence.
  Group secondary or administrative detail behind the primary
  flow.
- For human/AI systems, keep operator surfaces, backend
  capabilities, and product surfaces distinct. The agent MUST
  NOT expose operator-only or backend-only paths as product GUI
  controls unless the requester explicitly asks.

## State, selection, and feedback

- At every stage the user MUST be able to identify: where they
  are, what they are acting on, what the next action is, what
  will happen if they take it, and what changed after they took
  it.
- In interactive selection flows (drag-and-drop, item
  selection, move/copy/reorder, compare mode, multi-select),
  the agent MUST make the current selection, source, target,
  and result visually distinct without requiring the user to
  read a tooltip, toast, or status bar.
- The agent MUST give immediate, localized feedback after every
  user action that changes state. Transient messages alone MUST
  NOT be the only indication that state changed.

## Cognitive load

- Optimize GUIs for first-use clarity: a new user MUST be able
  to identify the primary path and the next action without
  prior training, using ordinary task language.
- The agent MUST NOT use persistent explanatory prose to
  compensate for an unclear UI. Use layout, ordering, grouping,
  labels, and feedback to teach the flow first; add prose only
  when the next action cannot be inferred from the UI itself.
- The agent MUST replace implementation jargon and site-only
  internal terms with ordinary task language. Keep precise
  operator or domain terms only when they are part of the
  user's real work.
- The agent MUST NOT require users to remember hidden state
  from previous screens. Externalize required context through
  visible labels, previews, and current-selection indicators
  (recognition over recall).
- The agent MUST NOT split a flow into beginner/expert modes
  unless the user explicitly asks for that boundary.

## Conventions and common controls

- Follow established expectations for common controls (info
  icons, disclosure toggles, close buttons, tabs, row
  selection, primary-button placement, destructive-action
  styling). Deviate only when the UX gain clearly outweighs
  the surprise cost, and document the deviation.
- The agent MUST NOT introduce horizontal scrolling in primary
  UI without explicit justification.
- The agent MUST place the primary confirmation action near the
  artifact it commits, not far from the working area.

## Error prevention and recovery

- The agent MUST make destructive or irreversible actions
  explicit, distinguishable from routine actions, and
  confirmable or undoable.
- The agent MUST prevent invalid states at the input boundary
  when possible, and show validation next to the control that
  caused it rather than only in a summary region.
- The agent MUST provide visible recovery paths (undo, retry,
  reset, cancel) for any flow where mistakes are plausible. The
  agent MUST NOT hide recovery only in documentation.

## Draft state and data safety

- For Web GUIs with user-entered state that would be costly to
  recreate, preserve draft state across reloads, accidental
  tab/browser closes, and restarts by default. When draft
  persistence would be unsafe, provide an explicit equally-safe
  recovery path; the agent MUST NOT silently discard the draft.

## Accessibility minimum

- Every interactive control MUST have an accessible name
  (visible label, `aria-label`, or equivalent platform
  attribute) and a visible focus indicator.
- The primary flow MUST be completable by keyboard alone, with
  a logical focus and reading order.
- The agent MUST NOT convey state, selection, validity, or
  required action through color alone; pair color with shape,
  weight, icon, text, or position.
- Text and meaningful non-text content MUST meet at least WCAG
  2.1 AA contrast (4.5:1 for normal text, 3:1 for large text
  and UI components).
- The agent MUST NOT remove or suppress the default focus ring
  without providing an equally visible replacement.

## Verification gates

For any GUI change, before reporting completion the agent MUST:

1. Complete a first-use walkthrough on each claimed environment
   and viewport, following only the visible UI from the top.
2. Take screenshots of every changed view at normal width and
   at a reduced width (roughly two-thirds), and review for
   overflow, clipping, unexpected wrapping, alignment, and
   missing required content or controls.
3. Verify keyboard reachability and visible focus for the
   primary flow.
4. Run a whole-screen plausibility pass: nothing visibly broken,
   misaligned, or duplicated.

If the primary flow or next action is not immediately
understandable in the first-use walkthrough, treat the work
as unfinished and iterate until first-use clarity is achieved.
