# Course Exams Repository Structure

- Course data MUST live under `courses/<slug>/`.
- Course directories under `courses/<slug>/` MUST contain source data and
  course-specific assessment content only.
- New course-local scripts, `package.json` files, lockfiles, verification
  wrappers, or workflow implementations MUST NOT be added under
  `courses/<slug>/`.
- Assessment workflow logic MUST live in root `scripts/`, root `docs/`, or `packages/assessment-tools/`.
- Course assessment source files MUST use the common migrated Markdown/QTI
  assessment format.
- An assessment directory MUST contain only `assessment.yaml`, `result/`, and
  optionally `track-map.yaml` when Track-published. It MUST NOT keep question
  Markdown locally.
- Assessment-local runtime configuration files such as `assessment-run.json` are
  not supported.
- The question-bank `ref` referenced by each manifest item is the only source of
  truth for question content.
- Weekly quiz, exam, and preparation-set behavior MUST be distinguished by
  workflow context, not by adding legacy manifest `type` fields.
- Operational exceptions for a single course MUST be documented in the course
  content itself or the task prompt, not by creating repo-local agent rule
  files.
- For future AI grading comparisons or benchmarks in this repository, follow
  `docs/research/README.md`: write a dated, anonymized aggregate report in
  `docs/research/` and link it from that index. Include the objective and
  selection method, exclusions and denominators; methods and input
  specifications, relevant endpoint and fixed model version; every baseline and
  variant, failures and unfavorable results; evaluation criteria, aggregate
  metrics, sample counts, coverage, unknowns and missing data; measured usage
  and estimated costs with their basis when available; limitations, adoption
  status, and the local-only evidence path and audit inventory.
- Keep Git research reports limited to anonymized aggregate methods and
  findings, and keep raw evidence local-only on the PC. Do not commit names,
  student IDs, email addresses, student responses, anonymous case keys,
  request/response payloads, or credentials; do not create a separate recording
  system.
