# Fab Human Approval

- An agent MUST NOT infer or create Human Approval from AI review, automated
  validation, design review, or ambiguous/general user agreement.
- Human Approval MUST require explicit user approval of the identified artifacts
  or media set.
- If approval-bound artifact bytes, hash, path, or order changes, prior Human
  Approval MUST NOT be treated as valid.
- An agent MUST use confirmation flags such as
  `Approve-FabMedia.ps1 -ConfirmHumanApproval` only after the explicit human
  approval precondition has actually been satisfied.
