# Runtime reliability

## Runtime and async behavior

- Never block async APIs or use sync I/O where responsiveness is expected,
  nor rely on timing luck, partial staging, nondeterministic ordering or
  loosely bounded waits when deterministic design is available.
- Prefer push/event/signal synchronization; poll only without authoritative
  events, with justification, bounded cadence/retries. For temporary external
  usage limits with safe resumption, wait/recheck indefinitely with backoff;
  resume only on confirmed availability; never blindly replay uncertain outcomes.
- Async/queue/retry/timeout flows require explicit states, authoritative
  events, idempotent reconciliation and stalled-state diagnostics. Treat flaky,
  timing-sensitive or nondeterministic behavior as defects to reduce; identify
  intermittent failure sources before dismissal as flaky.
- Implement and verify automatic recovery: detect, preserve state, wait,
  confirm recovery, safely resume and complete normally. Default to no
  human-intervention stops; before proposing one, identify necessity, concrete
  harm from continuing and feasible automated alternatives; respect
  user-approved stops.
