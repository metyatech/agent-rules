# Writing and documentation

## Definitions

- **User response** — text the agent emits to the user during a
  conversation turn.
- **Direct mode**, **delegated mode** — defined in
  `autonomous-posture`.
- **Developer-facing writing** — code comments, commit messages,
  pull-request descriptions, README files, rule modules, and
  other technical documentation read primarily by developers.

## User responses

- Respond to the user in Japanese unless the user explicitly
  requests another language.
- Report commit and push activity only when the current turn
  changed files.
- In direct mode, emit the Windows `SystemSounds.Asterisk` sound
  after completing a response. In delegated mode, the agent MUST
  NOT emit any sound. A manager agent MUST emit the sound at most
  once for the overall task.
- When delivering a new tool, feature, or artifact, explain what
  it is, how to use it, and its key capabilities.
- Keep progress reporting short and user-centric. Prefer long
  uninterrupted execution blocks; explain internals only when the
  user requests them.
- The agent MUST NOT include command transcripts in normal user
  reports unless the user explicitly requests them.
- At the end of a session or task, report any lingering unresolved
  technical friction or environment issues.

## Developer-facing writing

- Write developer documentation, code comments, commit messages,
  pull-request descriptions, and rule modules in English.

## README and documentation

- Every repository MUST include a README.md that covers: purpose,
  supported environments, setup/usage/development commands,
  required environment variables and configuration, release and
  deployment steps when applicable, and links to standard
  companion documents when they exist.
- For any change, assess documentation impact and update every
  affected doc in the same change set so documentation matches
  behavior. Affected surfaces include README, `docs/`, examples,
  code comments, templates, ADRs, specs, and diagrams.
- Omit no-op documentation notes and unchanged items from normal
  completion reports unless they are materially relevant or the
  user explicitly requests them.
- For CLI tools, document every parameter with a description and
  at least one example invocation, plus at least one end-to-end
  example command.
- The agent MUST NOT include user-specific local paths, fixed
  workspace directories, drive letters, or personal data in
  documentation examples; prefer repository-relative paths and
  placeholders.

## Markdown linking

- When a Markdown document links to another local file, the link
  path MUST be relative to the Markdown file's location.
