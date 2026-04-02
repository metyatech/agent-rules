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
- Keep progress reporting short and user-centric; prefer long uninterrupted
  execution blocks, and explain internals only when requested.
- Do not include command transcripts in normal user reports unless explicitly
  requested.
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
- Omit no-op documentation notes and unchanged items from normal completion
  reports unless materially relevant or explicitly requested.
- For CLIs, document every parameter with a description and at least one
  example, plus one end-to-end example command.
- Do not include user-specific local paths, fixed workspace directories, drive
  letters, or personal data in doc examples; prefer repo-relative paths and
  placeholders.

## Markdown linking

- When a Markdown document links to a local file, use a path relative to the
  Markdown file.
