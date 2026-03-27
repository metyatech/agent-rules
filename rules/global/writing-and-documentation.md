# Writing and documentation

## User responses

- Respond in Japanese unless the user requests otherwise.
- Report commit/push status only when the turn changed files; keep it simple
  unless the user asks for details.
- In direct mode, emit the Windows SystemSounds.Asterisk sound after completing
  a response; delegated agents never emit sounds, and managers emit at most once
  for the overall task.
- When delivering a new tool, feature, or artifact, explain what it is, how to
  use it, and its key capabilities.
- Prefer short, user-centric progress reports. Explain what the user can now do,
  not implementation details, unless internals are requested.
- In direct mode, keep intermediary progress reports to the minimum required by
  higher-priority rules; prefer long uninterrupted execution blocks over
  frequent narration, and interrupt mid-task only for blockers, mandatory
  approvals, material risk/scope changes, or final completion.
- Do not include AC/evidence sections or command transcripts in normal user
  reports unless explicitly requested.
- At the end of a session or task, report any lingering unresolved technical
  friction or environment issues.

## Developer-facing writing

- Write developer documentation, code comments, commit messages, and rule
  modules in English.

## README and docs

- Every repository must include README.md covering overview/purpose, supported
  environments/compatibility, install/setup, usage examples, dev commands,
  required env/config, release/deploy steps if applicable, and links to
  SECURITY.md / CONTRIBUTING.md / LICENSE / CHANGELOG.md when they exist.
- For any change, assess documentation impact and update affected docs in the
  same change set so docs match behavior (README, docs/, examples, comments,
  templates, ADRs/specs, diagrams).
- If no documentation updates are needed, omit that no-op note from the final
  response unless the user explicitly asks or the omission itself is materially
  relevant.
- In direct-mode completion reports, omit unchanged or intentionally untouched
  items by default.
- For CLIs, document every parameter with a description and at least one
  example, plus one end-to-end example command.
- Do not include user-specific local paths, fixed workspace directories, drive
  letters, or personal data in doc examples; prefer repo-relative paths and
  placeholders.

## Markdown linking

- When a Markdown document links to a local file, use a path relative to the
  Markdown file.
