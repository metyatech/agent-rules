import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readRule = async (name) =>
  (await readFile(new URL(`../rules/domains/${name}.md`, import.meta.url), 'utf8'))
    .replace(/\s+/g, ' ');

test('course rules keep optional presentation separate from Unit evidence', async () => {
  const authoring = await readRule('course-docs/authoring');
  assert.match(authoring, /Section `goal` is optional.*at every depth/);
  assert.match(authoring, /zero or more `<Hint>` blocks, then exactly one `<Answer>`/);
  assert.match(authoring, /not require Section-local closure/);
  assert.match(authoring, /Define each Unit exactly once.*learning-units.yaml/);
  for (const obsolete of [
    /top-level.*MUST declare goal/i,
    /one or more `<Hint>`/,
    /MUST.*`### 演習N`/,
    /goal-first ordering/,
  ]) assert.doesNotMatch(authoring, obsolete);
});

test('course purpose is normative and support follows the learner', async () => {
  const purpose = await readRule('education/course-purpose');
  const authoring = await readRule('course-docs/authoring');
  assert.match(purpose, /normative educational purpose/);
  assert.match(purpose, /value judgment/);
  assert.match(purpose, /not.*unique educational purpose established by empirical research/);
  assert.match(purpose, /Do not equate enjoyment with ease/);
  assert.doesNotMatch(purpose, /happiness is the highest-level goal/);
  assert.match(authoring, /guidance minimization is not an objective/);
  assert.match(authoring, /context-dependent heuristic, not a required or default authoring sequence/);
  assert.match(authoring, /accidental difficulty/);
});

test('task assistance permits taught information and concise useful feedback', async () => {
  const authoring = await readRule('course-docs/authoring');
  assert.match(authoring, /first Hint SHOULD avoid unnecessarily revealing the answer immediately/);
  assert.match(authoring, /Multiple Hints MAY become progressively stronger or more explicit/);
  assert.match(authoring, /Hints SHOULD default to material already covered/);
  assert.match(authoring, /Hints MAY explicitly teach new information/);
  assert.match(authoring, /MUST NOT require unfamiliar information as already known without explaining it/);
  assert.match(authoring, /Answers MUST provide feedback that lets learners understand correctness/);
  assert.match(authoring, /Answers MAY be concise for simple, self-explanatory tasks when additional explanation adds no learning value/);
  assert.doesNotMatch(authoring, /MUST use material already covered/);
  assert.doesNotMatch(authoring, /Answers MUST explain why they are correct/);
});
