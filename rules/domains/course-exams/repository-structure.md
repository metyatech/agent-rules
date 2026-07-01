# Course Exams Repository Structure

- Course data MUST live under `courses/<slug>/`.
- Course directories under `courses/<slug>/` MUST contain source data and course-specific assessment content only.
- New course-local scripts, `package.json` files, lockfiles, verification wrappers, or workflow implementations MUST NOT be added under `courses/<slug>/`.
- Assessment workflow logic MUST live in root `scripts/`, root `docs/`, or `packages/assessment-tools/`.
- Course assessment source files MUST use the common migrated Markdown/QTI assessment format.
- An assessment directory MUST contain only `assessment.yaml`, an optional `assessment-run.json`, and `result/` (plus `track-map.yaml` when Track-published). It MUST NOT keep question Markdown locally.
- The question-bank `ref` referenced by each manifest item is the only source of truth for question content.
- Weekly quiz, exam, and preparation-set behavior MUST be distinguished by workflow context, not by adding legacy manifest `type` fields.
- Operational exceptions for a single course MUST be documented in the course content itself or the task prompt, not by creating repo-local agent rule files.