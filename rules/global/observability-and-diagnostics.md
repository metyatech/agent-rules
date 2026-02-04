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

## Alerting

- Alerting is part of the definition of done for reliability/performance changes: update dashboards, alerts, and runbooks in the same change set.
- Define alert severity and routing explicitly; paging alerts must correspond to user-impacting SLO/error-budget burn, not “interesting” internal signals.
- Use multi-window burn-rate alerting to reduce flapping; page only on sustained burn and use ticket-level alerts for slower burn or early-warning signals.
- Every alert must be actionable and owned: include service/team ownership labels and a runbook link that lists diagnosis steps, mitigation steps, and rollback/feature-flag options.
- Every alert must include a dashboard link and relevant identifiers (service, environment, region/cluster) so responders can triage quickly.
- Reduce noise aggressively: delete or downgrade alerts that page without clear user impact; treat alert fatigue and stale/non-actionable alerts as defects.
- Alert rules must be managed as code and reviewed with code changes; manual, ad-hoc changes in vendor UIs are prohibited.
- Alert rules must be automatically validated and tested in CI; for Prometheus-compatible rules this means `promtool check rules` and `promtool test rules`.
- If constraints make “alerts as code” or CI validation impractical, treat it as an exception and require explicit user approval with documented rationale.

## Tracing

- For multi-service or async flows, use OpenTelemetry and propagate context across boundaries (HTTP/gRPC/queues).
- Correlate logs and traces via trace_id/request_id.

## Health and self-checks

- Services must have readiness and liveness checks; fail fast when dependencies are unavailable.
- CLIs should provide a verbose mode and clear error output; add a self-check command when it reduces support burden.
