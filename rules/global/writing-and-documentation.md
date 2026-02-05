# Writing and documentation

## User responses

- Respond in Japanese unless the user requests otherwise.
- Always report whether you committed and whether you pushed; include repo(s), branch(es), and commit hash(es) when applicable.
- After completing a response, emit the Windows SystemSounds.Asterisk sound via PowerShell when possible.

## Developer-facing writing

- Write developer documentation, code comments, and commit messages in English.
- Rule modules are written in English.

## README and docs

- Every repository must include README.md covering overview/purpose, supported environments/compatibility, install/setup, usage examples, dev commands (build/test/lint/format), required env/config, release/deploy steps if applicable, and links to SECURITY.md / CONTRIBUTING.md / LICENSE / CHANGELOG.md when they exist.
- For any change, assess documentation impact and update all affected docs in the same change set so docs match behavior (README, docs/, examples, comments, templates, ADRs/specs, diagrams).
- If no documentation updates are needed, explain why in the final response.
- For CLIs, document every parameter (required and optional) with a description and at least one example; also include at least one end-to-end example command.
- Do not include user-specific local paths, fixed workspace directories, drive letters, or personal data in doc examples. Prefer repo-relative paths and placeholders so instructions work in arbitrary environments.

## Markdown linking

- When a Markdown document links to a local file, use a path relative to the Markdown file.
