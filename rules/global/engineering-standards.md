# Engineering and design standards

GUI-specific design and verification rules live in `gui-standards`.
Quality gates live in `quality-and-verification`.

## Tooling and dependencies

- Prefer official, well-maintained, latest-stable tools and
  dependencies by default.
- Prefer OSS or free-tier services. When using a paid or
  proprietary service, call out the tradeoff in the change set's
  documentation or commit message.

## Reuse before build

- Before designing or building a system, verify whether the whole
  system or any decomposed subsystem can be satisfied by an
  existing official or well-maintained system, service, or tool.
- Use the existing system by default; build custom logic only for
  verified gaps.

## System design

- Designs MUST be compositional; dependency direction MUST be clean
  (high-level depends on low-level abstractions, not the reverse).
- Control flow MUST be shallow. Naming MUST be intention-revealing.
- Change points MUST be centralized in configuration or constants.
- Keep code, docs, tests, and configuration DRY; refactor repeated
  procedures rather than copy them.
- Fix root causes; remove obsolete code in the same change set;
  repair broken tools at the source rather than work around them.
- Failure paths MUST tear down resources and MUST NOT leave partial
  state. Verify cleanup runs on every error branch.

## Runtime and async behavior

- The agent MUST NOT block async APIs or use synchronous I/O where
  responsiveness is expected.
- Prefer push-, event-, or signal-driven synchronization over
  periodic polling. Polling MAY be used only when no reliable
  authoritative event path exists OR the user explicitly requests
  it; when unavoidable, document why and bound cadence and retry
  behavior in code.

## API surfaces

- Avoid external command execution; prefer native SDKs.
- Prefer stable public APIs; isolate and document any unavoidable
  use of internal or unstable APIs.
- Externalize large embedded strings, templates, and rule data
  into resource files instead of inlining them in code.
- The agent MUST NOT commit build artifacts. Keep artifact
  directory names and `.gitignore` entries aligned.

## Environment portability

- The agent MUST NOT introduce machine-specific environments. Paths
  MUST be relative; configuration MUST be explicit.
- Lifecycle hooks (install, build, test) MUST succeed on a clean
  machine. Invoke developer tools via `npm exec` or the equivalent
  project-managed runner.
- Regenerate and commit lock files in the same change set whenever
  the manifest changes.
- Agent-owned temporary files MUST live under the OS temporary
  directory unless the user explicitly approves another location.

## Tool integration

- Design tools and services for agent-compatibility via standard
  interfaces. CLI conventions live in the `cli-design` skill.
- When editing a file managed by a formatter, run the formatter
  immediately before performing replace operations to normalize
  the on-disk state. Do not re-read the file unless it has been
  changed externally.
