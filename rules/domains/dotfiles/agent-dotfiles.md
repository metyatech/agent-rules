# Agent Dotfiles Workflow

- Default direct-user reports to short Japanese.
- Lead with the conclusion.
- Keep routine reports limited to conclusion, issue/no issue, and next step.
- Omit implementation details, file lists, and English jargon unless requested.
- If details are needed, give the short answer first and the details second.
- When editing managed dotfile templates, preserve machine-local settings and local marker blocks unless the user explicitly requests a reset.
- Prefer `pwsh -File .\verify.ps1` for repository verification.
- Prefer `pwsh -File .\apply.ps1` for real chezmoi deployment checks.
- Never commit secrets, auth/session artifacts, or machine-local trust/state values.
- Keep repo-managed versus locally preserved boundaries aligned with `README.md`.