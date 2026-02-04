# Observability and diagnostics

## General policy

- Design for debuggability: make failures diagnosable from logs/metrics/traces without reproducing locally.
- Add observability in the same change set as behavior changes that affect runtime behavior, performance, or reliability.

## Logging

- Prefer structured logs for services; keep field names stable (e.g., level, message, component, request_id/trace_id, version).
- Include actionable context in errors (what failed, which input/state, what to do next) without logging secrets/PII.
- Log at the right level; avoid noisy logs in hot paths.

## Metrics

- Instrument the golden signals (latency, traffic, errors, saturation) for each service and critical dependency; define concrete SLIs/SLOs for user-facing flows.
- Use OpenTelemetry Metrics for instrumentation and OTLP for export; using vendor-specific metrics SDKs directly is an exception and requires explicit user approval.
- Use the right metric types (counters for monotonic totals, histograms for latencies/sizes, gauges for current values) and include explicit units in names.
- Keep metric names and label keys stable; use a consistent namespace and Prometheus-style `snake_case` naming with base-unit suffixes (e.g., `http_server_request_duration_seconds`).
- Constrain label cardinality: labels must come from small bounded sets; never use user identifiers, raw URLs, request bodies, or other unbounded values as labels.
- Ensure correlation: when supported, record exemplars or identifiers that let you jump from a metric spike to representative traces/logs.
- Treat missing/incorrect metrics as a defect when they block verification, incident response, or SLO evaluation; add/adjust dashboards and alerts with behavior changes that impact reliability/performance.

## Tracing

- For multi-service or async flows, use OpenTelemetry and propagate context across boundaries (HTTP/gRPC/queues).
- Correlate logs and traces via trace_id/request_id.

## Health and self-checks

- Services must have readiness and liveness checks; fail fast when dependencies are unavailable.
- CLIs should provide a verbose mode and clear error output; add a self-check command when it reduces support burden.
