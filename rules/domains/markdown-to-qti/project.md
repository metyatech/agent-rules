# Markdown-to-QTI Project Rules

## Scope

- This repository MUST implement an npm-installable TypeScript CLI that converts Markdown content into IMS QTI 3.0.
- Prioritize correctness of QTI 3.0 output and a clean internal data model.

## TypeScript / npm conventions

- Use TypeScript with a Node.js ESM npm package and expose the `markdown-to-qti` bin through `package.json`.
- Do not require Java, Gradle, a JDK, or JVM launchers for normal install or runtime use.
- Keep the CLI entrypoint small; put conversion logic into testable modules.
- Favor immutable data, explicit types at boundaries, and clear error types.

## QTI 3.0 output rules

- Output must be valid QTI 3.0 XML: well-formed and schema-aligned.
- Keep identifiers stable and deterministic.
- Avoid random IDs unless explicitly required.
- When behavior is ambiguous, prefer standards-compliant conservative output and document the decision.

## Markdown conversion behavior

- Define supported Markdown features explicitly, including headings, lists, code blocks, and inline formatting.
- If a requested Markdown construct cannot be represented in QTI, do not implement it and explicitly state this in the response.
- Unsupported constructs should fail fast with actionable messages or be safely downgraded with clear warnings.
- Preserve exact formatting as much as possible when mapping Markdown to QTI.

## Testing expectations

- Add unit tests for parsing and mapping rules.
- Add golden tests for QTI XML output using normalized XML comparison.
- Include end-to-end fixtures for Markdown input to QTI output under a dedicated test folder.
- Golden tests MUST preserve parity with historical Kotlin fixture outputs unless an intentional format change is documented.

## CLI / UX

- Provide a simple CLI with input path support, output directory support, validation mode, and verbose logging.
- Provide `--help` / `-h`, `--version` / `-V`, and `--json` for first-run discoverability and machine-readable use.
- Error messages MUST include source location when possible: file, line, and column.