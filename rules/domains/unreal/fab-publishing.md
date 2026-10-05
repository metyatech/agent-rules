# Fab Publishing

## Sales optimization

- When the user's goal includes sales, revenue, conversion, discovery, or
  competitive optimization for a Fab Unreal product, the agent MUST consult the
  current `fab-unreal-publishing` sales-optimization guidance and inspect
  current relevant Fab alternatives before finalizing listing or media.
- Technical validation or media-design PASS MUST NOT be represented as evidence
  that a listing is sales-optimal.
- A sales-optimization PASS represents the best-supported current pre-launch
  treatment, not proven sales lift or guaranteed optimality.
- Sales optimization review and Human Approval MUST remain separate states.

## Human Approval

- An agent MUST NOT infer or create Human Approval from AI review, automated
  validation, design review, or ambiguous/general user agreement.
- Human Approval MUST require explicit user approval of the identified artifacts
  or media set.
- If approval-bound artifact bytes, hash, path, or order changes, prior Human
  Approval MUST NOT be treated as valid.
- An agent MUST use confirmation flags such as
  `Approve-FabMedia.ps1 -ConfirmHumanApproval` only after the explicit human
  approval precondition has actually been satisfied.
