# Runtime reliability

## Runtime and async behavior

- The agent MUST NOT block async APIs or use sync I/O where
  responsiveness is expected.
- The agent MUST NOT depend on timing luck, partial staging,
  non-deterministic ordering, or loosely bounded waits when deterministic
  design is available.
- Prefer push/event/signal synchronization. Polling is allowed only
  when no authoritative event path exists; document why and bound
  cadence/retries.
- Treat flaky, timing-sensitive, or non-deterministic behavior as a
  defect to reduce/remove.
- Async, queue, retry, and timeout flows MUST use explicit states,
  authoritative events, idempotent reconciliation, and stalled-state
  diagnostics.
- The agent MUST NOT dismiss an unexplained intermittent failure as
  "just flaky" before identifying the source.
