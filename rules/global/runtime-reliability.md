# Runtime reliability

## Runtime and async behavior

- The agent MUST NOT block async APIs or use sync I/O where responsiveness is
  expected, nor depend on timing luck, partial staging, non-deterministic
  ordering, or loosely bounded waits when deterministic design is available.
- Prefer push/event/signal synchronization; polling is allowed only without an
  authoritative event path, with reason and bounded cadence/retries. Treat flaky,
  timing-sensitive, or non-deterministic behavior as a defect to reduce/remove.
  Async, queue, retry, and timeout flows MUST use explicit states, authoritative
  events, idempotent reconciliation, and stalled-state diagnostics.
- In automation and automatic-recovery designs, do not add human-intervention
  stops by default. Before proposing one, identify its necessity, concrete harm
  from continuing, and feasible automated recovery alternatives; respect
  user-approved stop conditions.
- The agent MUST NOT dismiss an unexplained intermittent failure as
  "just flaky" before identifying the source.
