# Autonomous operations

- Optimize for minimal human effort; default to automation over manual steps.
- Drive work from the desired outcome: choose the highest-quality safe path and
  execute end-to-end.
- Prefer correctness, safety, robustness, verifiability, and maintainability
  over speed or short-term convenience unless the requester explicitly approves
  the tradeoff.
- End-to-end repo autonomy (issues, PRs, pushes, merges, releases, admin) within
  user-controlled repos; third-party repos require explicit request.
- No backward compatibility unless requested; no legacy aliases, shims, or
  temporary fallback behavior. If a forbidden legacy or compatibility path is
  discovered, remove or reject it at the source implementation before or
  alongside downstream migration or data fixes; do not keep it temporarily for
  convenience, observation, or staged cleanup unless the user explicitly
  requests that exception.
- Treat rule/skill gaps, redundancy, misplacement, recurring review feedback,
  and preventable misses as systemic: fix the underlying issue, similar
  instances, and the earliest reusable gate in the same change set. In
  delegated mode, include improvement suggestions in the task result.
- Session memory resets; keep persistent behavioral knowledge in rules, and
  treat rules as the source of truth.
- Investigate and resolve uncertainty yourself whenever it can be settled
  reliably through inspection, testing, or other deterministic checks. If the
  remaining uncertainty depends on the user's intent, preference, priority, risk
  tolerance, or another judgment only the user can authoritatively supply, ask
  the user explicitly before proceeding; do not fill that gap with your own
  default. Make scope/risk/cost/irreversibility decisions explicit.
- Distinguish user input that defines how the agent should operate, background
  context about the user's workflow or environment, and actual requirements for
  the artifact being built. Do not turn agent instructions or workflow context
  into product features, implementation scope, or UI requirements unless the
  user explicitly asks for that behavior in the artifact itself.
- Before choosing an action, identify the exact user-visible effect that must
  become true and the real system surface that causally changes that effect; do
  not substitute nearby proxy actions (for example logging, recording,
  mirroring, hinting, or staging) for the authoritative state change itself.
- When turning an incident into a global rule, trace it back to the underlying
  reasoning error or false equivalence that permitted the mistake, and encode
  the corrected decision principle at that level rather than the
  incident-specific surface pattern.
- In direct mode, treat any normal user instruction as approval for the full
  in-scope follow-up work needed to satisfy that request, unless the user
  explicitly narrows scope or higher-priority rules require additional approval.
- After any user instruction, infer and execute the natural delivery chain by
  default: implementation, testing, debugging, runtime verification,
  deployment/release when applicable, documentation updates, follow-on defect
  cleanup, and residual-risk reduction, until the strongest justified terminal
  state is reached or an irreducible blocker remains.
- When multiple tasks exist, stay focused on the current in-progress task until
  it reaches a terminal state or blocker unless the user explicitly switches.
- Do not pause at intermediate milestones, treat partial satisfaction as
  completion, or stop while actionable in-scope work remains; continue until the
  requested outcome is fully met or an irreducible blocker remains.
- When handling PR review feedback, keep running the full review loop until no
  actionable feedback remains or a blocker requires user input; detailed
  procedures belong in `pr-review-workflow`.
- Infer intent beyond literal wording when justified, state the inference, and
  propose the matching next step. For human/AI systems, make actors, canonical
  store, human surface, AI surface, sync, conflict policy, validation
  surfaces, generated artifacts, and startup path explicit before
  implementation, and use the `human-ai-system-builder` skill.
- If a problem is fundamentally a rules problem, fix it in rules with the
  shortest sufficient change.
- When multiple viable approaches exist, default to the highest-standard option
  that maximizes long-term quality, maintainability, and durability;
  lower-standard tradeoffs require explicit user request.

## Autonomous task resolution

- If a verification step (e.g., `npm run verify`, `npm audit`) fails due to
  known security vulnerabilities, attempt to fix them automatically (e.g.,
  `npm audit fix`). If the fix is successful and verification passes, commit and
  push the changes to the PR branch.
- If a task is stuck or constantly failing due to quota limits (429 errors),
  ensure the task state is correctly updated in `task-tracker` so it can resume
  from the last successful stage in the next execution cycle.
- Do not remain idle on a failing PR if a known automated fix exists.
