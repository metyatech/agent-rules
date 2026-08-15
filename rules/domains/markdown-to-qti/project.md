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

## Markdown and HTML presentation conversion

- CommonMark/GFM and normal raw HTML MUST share one structured conversion pipeline: MDAST to HAST, parsed raw HTML merged into that HAST, then XML-safe QTI serialization.
- Raw HTML is first-class authored input, not opaque text. Do not introduce a parallel string-replacement presentation pipeline.
- Ordinary presentation MUST use standard HTML element names where representable by the QTI 3 content model. Reserve `qti-*` names for actual QTI-specific structures and interactions.
- Retired qti-prefixed presentation aliases are FORBIDDEN: `qti-p`, `qti-h1`–`qti-h6`, `qti-div`, `qti-em`, `qti-strong`, `qti-del`, `qti-a`, `qti-blockquote`, `qti-ul`, `qti-ol`, `qti-li`, `qti-pre`, `qti-code`, `qti-table`, `qti-thead`, `qti-tbody`, `qti-tfoot`, `qti-tr`, `qti-th`, `qti-td`, `qti-img`, `qti-br`, and `qti-hr`. Do not restore or support compatibility shims for these retired aliases; `qti-*` remains reserved for actual QTI-specific elements and interactions.
- Preserve representable authored hierarchy, nesting, whitespace, and attributes, including `style`, `class`, `id`, `title`, `aria-*`, and `data-*`, subject to QTI/XML/content-model constraints.
- HTML comments are source-only authoring notes and MUST be omitted from QTI output.
- Markdown fenced code MUST retain literal Markdown-code semantics: HTML-looking source is escaped, not interpreted as raw HTML.
- Authored raw `<pre><code>` MAY contain intentional nested rich HTML. Preserve that structure and preformatted whitespace through QTI conversion.
- Choice `## Options` MUST be a flat Markdown task list. Checked state determines correctness, task-list checkbox syntax is structural metadata and MUST NOT render inside `qti-simple-choice`, rich option content MUST remain structured HTML, and list order determines choice order.
- Cloze processing MUST preserve the surrounding rich presentation tree and MUST NOT flatten rich HTML to Markdown or plain text to locate blanks.
- A scoring rubric MUST serialize as `qti-rubric-block view="scorer"` containing ordinary standard HTML `p` criteria; `qti-p` is FORBIDDEN.
- This trusted internal authoring pipeline MUST NOT sanitize away authored presentation HTML. Reject only content that cannot be represented as valid QTI/XML/content-model output; QTI validity remains authoritative.

## Testing expectations

- Add unit tests for parsing and mapping rules.
- Add golden tests for QTI XML output using normalized XML comparison.
- Include end-to-end fixtures for Markdown input to QTI output under a dedicated test folder.
- Golden tests MUST protect the current canonical presentation contract.

## CLI / UX

- Provide a simple CLI with input path support, output directory support, validation mode, and verbose logging.
- Provide `--help` / `-h`, `--version` / `-V`, and `--json` for first-run discoverability and machine-readable use.
- Error messages MUST include source location when possible: file, line, and column.
