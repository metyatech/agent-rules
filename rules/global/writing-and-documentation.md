# Writing

## Responses

- Reply in Japanese unless requested otherwise. Report commits/pushes only if
  this turn changed files. Explain new tools/features/artifacts' purpose, use,
  key capabilities.
- Keep progress reports short/user-focused; prefer long uninterrupted
  execution blocks;
  explain internals on request. Omit command transcripts unless requested.
  Report unresolved technical/environment issues at task end.

## Developer

- Developer docs/comments, commit messages, pull-request descriptions, and
  rule modules MUST be in English.

## Docs

- Every repo MUST have a README: purpose, environments,
  setup/usage/development commands, required variables/config,
  release/deployment steps, companion doc links.
- Assess doc impact; update all affected docs in the same change set to match
  behavior; omit no-op notes. If docs conflict with code, follow code
  conventions and
  report each inconsistency.
- CLI docs MUST describe every parameter and include an example invocation and
  an end-to-end example command. `--help`/`-h` MUST explain first use without
  external docs;
  top-level help MUST show workflows, shared flags, and `<tool> <command> -h`
  syntax. Invalid usage/unknown commands MUST point to authoritative help.
- Documentation examples MUST omit user-specific paths, fixed workspaces, drive
  letters, and personal data; use repo-relative paths/placeholders.

- Reuse findings before investigating. Record conclusions, evidence, failed
  approaches, and unknowns in repo docs; omit secrets/logs.
- Local Markdown links MUST be relative to their document.
