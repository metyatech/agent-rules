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

- At every stage, users MUST identify where they are, what they act on, the next
  action, what will happen, and what changed. Interactive selection flows MUST
  visually distinguish current selection, source, target, and result without
  relying on tooltip or status bar; every state change MUST receive immediate,
  localized feedback, with persistent indication beyond transient messages.

## Cognitive load

- GUIs MUST provide first-use clarity in ordinary task language; MUST NOT use
  persistent explanatory prose to compensate for unclear UI, require recall of
  hidden prior-screen state, or split flows into beginner/expert modes unless
  explicitly asked. The agent MUST replace implementation jargon with task
  language and keep domain terms only when they are part of users' real work.

## Conventions

- Follow established conventions for common controls; deviate only when UX gain
  clearly outweighs surprise cost. The agent MUST NOT introduce horizontal
  scrolling in primary UI without explicit justification and MUST place primary
  confirmation near the artifact it commits.

## Error prevention and recovery

- The agent MUST make destructive/irreversible actions explicit, distinguishable
  from routine actions, and confirmable or undoable; prevent invalid states at
  input boundaries when possible and show validation next to the offending
  control. The agent MUST provide visible recovery (undo, retry, reset, cancel)
  where mistakes are plausible and MUST NOT hide it only in documentation.

## Draft state

- For Web GUIs with user-entered state costly to recreate, the
  agent MUST preserve draft state across reloads and accidental
  closes. When unsafe, provide an equally-safe recovery path; the
  agent MUST NOT silently discard the draft.

## Accessibility minimum

- Every interactive control MUST have an accessible name and visible focus
  indicator; the primary flow MUST be keyboard-completable in logical focus and
  reading order. The agent MUST NOT convey state, selection, or validity through
  color alone; pair it with shape, weight, icon, or text. Text and UI components
  MUST meet WCAG 2.1 AA contrast (4.5:1 normal text, 3:1 large text/UI
  components). The agent MUST NOT remove the default focus ring without an
  equally visible replacement.

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
