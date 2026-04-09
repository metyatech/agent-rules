# Engineering and design standards

This module governs general engineering practices, system design,
runtime behavior, and tool integration. GUI-specific design and
verification rules live in `gui-standards`. Quality gates live in
`quality-and-verification`.

## Tooling and dependencies

- The agent MUST prefer official, well-maintained, latest-stable
  tools and dependencies by default.
- The agent MUST prefer OSS or free-tier services. When using a paid
  or proprietary service, the agent MUST call out the tradeoff in
  the change set's documentation or commit message.

## Reuse before build

- Before designing or building a system, the agent MUST verify
  whether the whole system or any decomposed subsystem can be
  satisfied by an existing official or well-maintained system,
  service, or tool.
- The agent MUST use the existing system by default and MUST build
  custom logic only for verified gaps.

## System design

- Designs MUST be compositional. Dependency direction MUST be clean
  (high-level depends on low-level abstractions, not the reverse).
- Control flow MUST be shallow. Naming MUST be intention-revealing.
- Change points MUST be centralized in configuration or constants
  rather than scattered across the code.
- The agent MUST keep code, docs, tests, and configuration DRY. The
  agent MUST refactor repeated procedures rather than copy them.
- The agent MUST fix root causes. The agent MUST remove obsolete
  code in the same change set. The agent MUST repair broken tools at
  the source rather than work around them.
- Failure paths MUST tear down resources and MUST NOT leave partial
  state. The agent MUST verify cleanup runs on every error branch.

## Runtime and async behavior

- The agent MUST NOT block async APIs.
- The agent MUST NOT use synchronous I/O where responsiveness is
  expected.
- The agent MUST prefer push-, event-, or signal-driven
  synchronization over periodic polling.
- The agent MAY use polling only when no reliable authoritative
  event path exists OR when the user explicitly requests polling.
  When polling is unavoidable, the agent MUST document why polling
  is necessary and MUST bound its cadence and retry behavior in
  code.

## API surfaces

- The agent MUST avoid external command execution and MUST prefer
  native SDKs.
- The agent MUST prefer stable public APIs. The agent MUST isolate
  and document any unavoidable use of internal or unstable APIs.
- The agent MUST externalize large embedded strings, templates, and
  rule data into resource files instead of inlining them in code.
- The agent MUST NOT commit build artifacts. The agent MUST keep
  artifact directory names and `.gitignore` entries aligned.

## Environment portability

- The agent MUST NOT introduce machine-specific environments. Paths
  MUST be relative and configuration MUST be explicit.
- Lifecycle hooks (install, build, test) MUST succeed on a clean
  machine. The agent MUST invoke developer tools via `npm exec` or
  the equivalent project-managed runner.
- The agent MUST regenerate and commit lock files in the same change
  set whenever the manifest changes.
- Agent-owned temporary files MUST live under the OS temporary
  directory unless the user explicitly approves another location.

## Tool integration

- The agent MUST design tools and services for agent-compatibility
  via standard interfaces. CLI conventions are defined in the
  `cli-design` skill.
- When the agent edits a file managed by a formatter (clang-format,
  prettier, etc.), the agent MUST run the formatter immediately
  before performing replace operations to normalize the on-disk
  state. The agent MUST NOT re-read the file unless it has been
  changed externally.
