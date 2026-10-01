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

test('orientation and guided observation are reviewed without banning useful guidance', async () => {
  const authoring = await readRule('course-docs/authoring');
  assert.match(authoring, /concrete value to the current activity, structure, or decision/);
  assert.match(authoring, /guaranteed course sequence/);
  assert.match(authoring, /canonical Unit objective/);
  assert.match(authoring, /name-only list is not pre-training/);
  assert.match(authoring, /term may appear in orientation or a heading before it is explained/);
  assert.match(authoring, /fully guided action\/code → observable result → explanation/);
  assert.match(authoring, /bounded quality heuristic, not a retrieval-rule extension or a universal sequencing law/);
  assert.match(authoring, /does not require discovery/);
  assert.match(authoring, /does not.*weaken worked examples or explicit guidance/);
  assert.match(authoring, /no actionable preparation, re-entry, or recovery value/);
  assert.match(authoring, /This review does not reject objectives or advance organizers/);
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

test('course cold-read checks learner-action consistency without exact-word matching', async () => {
  const authoring = await readRule('course-docs/authoring');
  assert.match(authoring, /heading, its immediate explanation, the task statement, and relevant UI cues/);
  assert.match(authoring, /Treat a mismatch as a learner-facing defect/);
  assert.match(authoring, /Natural paraphrases are fine/);
  assert.match(authoring, /Multiple actions are fine when their order is explicit/);
  assert.match(authoring, /この見出しを読んで learner が予想する次の行動と、実際に次に要求される行動は一致しているか/);
  assert.match(authoring, /not a directly tested rule about particular verb pairs/);
  assert.doesNotMatch(authoring, /MUST use the same (word|verb)/i);
});

test('course cold-read reviews local continuity with bounded sequencing heuristics', async () => {
  const authoring = await readRule('course-docs/authoring');
  assert.match(authoring, /sequence \/ discourse continuity as a broader cold-read question than learner-action consistency/);
  assert.match(authoring, /novice-oriented initial instruction/);
  for (const question of [
    /なぜ今この話/,
    /新しい概念・道具・操作は、その必要性が生じてから導入されているか/,
    /見出しだけ先に読んだとき、learner state より先の結論へ飛んでいないか/,
    /前の結果 → 次の説明・操作の因果や目的が自然につながっているか/
  ]) assert.match(authoring, question);
  assert.match(authoring, /not a fixed template or universal order/);
  assert.match(authoring, /Preserve intentional inference in retrieval and problem-solving activities/);
  assert.match(authoring, /do not impose this as a universal high-coherence rule for learners with substantial prior knowledge/);
  assert.match(authoring, /needed for a later QuickCheck or operation on the main instructional path/);
  assert.match(authoring, /operation → result check → generalization/);
});
