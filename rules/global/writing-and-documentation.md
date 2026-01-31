# Writing and documentation

## User responses

- Respond in Japanese unless the user requests otherwise.
- After completing a response, emit the Windows SystemSounds.Asterisk sound via PowerShell when possible.

## Developer-facing writing

- Write developer documentation, code comments, and commit messages in English.
- Rule modules are written in English.

## README and docs

- Every repository must include README.md covering overview/purpose, setup, dev commands (build/test/lint), required env/config, and release/deploy steps if applicable.
- For any code change, assess README impact and update it in the same change set when needed.
- If a README update is not needed, explain why in the final response.
- CLI examples in docs must include required parameters.
- Do not include user-specific local paths or personal data in doc examples.

## Markdown linking

- When a Markdown document links to a local file, use a path relative to the Markdown file.