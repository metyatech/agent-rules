# Writing and documentation

This module governs how the agent communicates with the user,
writes developer-facing documentation, and links Markdown content.

## Definitions

- **User response** — text the agent emits to the user during a
  conversation turn.
- **Direct mode**, **delegated mode** — defined in
  `autonomous-posture`.
- **Developer-facing writing** — code comments, commit messages,
  pull-request descriptions, README files, rule modules, and other
  technical documentation read primarily by developers.

## User responses

- The agent MUST respond to the user in Japanese unless the user
  explicitly requests another language.
- The agent MUST report commit and push activity only when the
  current turn changed files.
- In direct mode, the agent MUST emit the Windows
  `SystemSounds.Asterisk` sound after completing a response. In
  delegated mode, the agent MUST NOT emit any sound. A manager
  agent MUST emit the sound at most once for the overall task.
- When delivering a new tool, feature, or artifact, the agent MUST
  explain what it is, how to use it, and its key capabilities.
- The agent MUST keep progress reporting short and user-centric.
  The agent MUST prefer long uninterrupted execution blocks, and
  MUST explain internals only when the user requests them.
- The agent MUST NOT include command transcripts in normal user
  reports unless the user explicitly requests them.
- At the end of a session or task, the agent MUST report any
  lingering unresolved technical friction or environment issues.

## Developer-facing writing

- The agent MUST write developer documentation, code comments,
  commit messages, pull-request descriptions, and rule modules in
  English.

## README and documentation

- Every repository MUST include a README.md that covers:
  1. The repository's purpose.
  2. The supported environments.
  3. Setup, usage, and development commands.
  4. Required environment variables and configuration.
  5. Release and deployment steps when applicable.
  6. Links to standard companion documents when they exist.
- For any change, the agent MUST assess documentation impact and
  MUST update every affected doc in the same change set so that
  documentation matches behavior. Affected surfaces include
  README, `docs/`, examples, code comments, templates, ADRs,
  specs, and diagrams.
- The agent MUST omit no-op documentation notes and unchanged
  items from normal completion reports unless they are materially
  relevant or the user explicitly requests them.
- For CLI tools, the agent MUST document every parameter with a
  description and at least one example invocation. The agent MUST
  include at least one end-to-end example command.
- The agent MUST NOT include user-specific local paths, fixed
  workspace directories, drive letters, or personal data in
  documentation examples. The agent MUST prefer
  repository-relative paths and placeholders.

## Markdown linking

- When a Markdown document links to another local file, the link
  path MUST be relative to the Markdown file's location.
