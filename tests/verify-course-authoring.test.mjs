import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readRule = async (name) =>
  (await readFile(new URL(`../rules/domains/${name}.md`, import.meta.url), 'utf8'))
    .replace(/\s+/g, ' ');

const overclaimedCourseRules = [
  /always use current state.{0,100}(?:need|problem).{0,80}concept.{0,60}use/i,
  /cumulative presentation (?:is|has been proven|is proven to be) optimal/i,
  /all feedback must explain why/i,
  /all reflection must be required/i,
  /animation (?:alone|by itself) is sufficient/i,
  /shorter text is always better/i,
];

const assertNoCourseAuthoringOverclaims = (authoring) => {
  for (const claim of overclaimedCourseRules) assert.doesNotMatch(authoring, claim);
};

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
  assert.match(authoring, /do not impose a fixed local sequence for doing so/);
  assert.match(authoring, /accidental difficulty/);
});

test('orientation is useful and result withholding is limited to intended retrieval or generation', async () => {
  const authoring = await readRule('course-docs/authoring');
  assert.match(authoring, /concrete value to the current activity, structure, or decision/);
  assert.match(authoring, /guaranteed course sequence/);
  assert.match(authoring, /canonical Unit objective/);
  assert.match(authoring, /name-only list is not pre-training/);
  assert.match(authoring, /term may appear in orientation or a heading before it is explained/);
  assert.match(authoring, /task is intended to elicit retrieval or learner generation/);
  assert.match(authoring, /MUST NOT reveal the target response or a decisive cue/);
  assert.match(authoring, /does not prescribe withholding answers in other task types/);
  assert.match(authoring, /no actionable preparation, re-entry, or recovery value/);
  assert.match(authoring, /This review does not reject objectives or advance organizers/);
  assert.doesNotMatch(authoring, /fully guided action\/code → observable result → explanation/);
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

test('course cold-read reviews local continuity without fixed sequence heuristics', async () => {
  const authoring = await readRule('course-docs/authoring');
  assert.match(authoring, /sequence \/ discourse continuity as a broader cold-read question than learner-action consistency/);
  assert.match(authoring, /novice-oriented initial instruction/);
  for (const question of [
    /なぜ今この話/,
    /新しい概念・道具・操作は、その必要性が生じてから導入されているか/,
    /見出しだけ先に読んだとき、learner state より先の結論へ飛んでいないか/,
    /前の結果 → 次の説明・操作の因果や目的が自然につながっているか/
  ]) assert.match(authoring, question);
  assert.match(authoring, /Preserve intentional inference in retrieval and problem-solving activities/);
  assert.match(authoring, /do not impose this as a universal high-coherence rule for learners with substantial prior knowledge/);
  assert.match(authoring, /needed for a later QuickCheck or operation on the main instructional path/);
  assert.match(authoring, /mutually dependent operations, results, and explanations close enough to integrate/);
  assert.doesNotMatch(authoring, /concrete need → example operation → result check/);
  assert.doesNotMatch(authoring, /operation → result check → generalization/);
});


test('course rules separate research provenance from local contracts and unresolved choices', async () => {
  const authoring = await readRule('course-docs/authoring');
  assert.match(authoring, /`R` — supported.*multiple independent studies or research syntheses/);
  assert.match(authoring, /`S` — a multi-study research synthesis/);
  assert.match(authoring, /`L` — a local, normative, product, authoring, or platform decision/);
  assert.match(authoring, /`U` — unresolved by the available research/);
  assert.match(authoring, /Do not promote a claim to `R` or `S` by combining one research result with unaudited design intuition/);
  assert.match(authoring, /For the local Course Docs `phase="transfer"`/);
  assert.match(authoring, /not a universal scientific definition of transfer/);
  assert.match(authoring, /Do not infer an exact colour, border, radius, or size from signaling research/);
});

test('new learner guidance keeps research claims bounded and local choices explicit', async () => {
  const authoring = await readRule('course-docs/authoring');
  assert.match(authoring, /current\/known state → need\/problem → new concept → use/);
  assert.match(authoring, /local sequencing heuristic, not a research-established or universally optimal order/);
  assert.match(authoring, /prompts MUST make clear at the point of asking the object or content, the judgment\/action required, and the expected response form/);
  assert.match(authoring, /prompt, nearby instructions, and control labels MAY establish these together/);
  assert.match(authoring, /options SHOULD complete or answer the stem naturally/);
  assert.match(authoring, /exact Japanese-copy checks and option phrasing as local Course Docs conventions/);
  assert.match(authoring, /complete semantic sentence over only the inserted fragment/);
  assert.match(authoring, /stable names or identifiers to refer to responsive-layout targets/);
  assert.match(authoring, /Prediction\/prequestion activities SHOULD ask about a concrete upcoming relation or outcome/);
  assert.match(authoring, /effects may be tied to prequestioned content and should not be assumed for unrelated material/);
  assert.match(authoring, /supports code-output prediction as an option.*not a mandatory pattern/);
  assert.match(authoring, /When self-explanation is useful, scaffold what relation, error, or concept to explain/);
  assert.match(authoring, /scaffolded prompts.*not universal superiority over generic prompts/);
  assert.match(authoring, /If reflection is not semantically graded, this local assessment convention says not to make it a fake required gate/);
  assert.match(authoring, /connect code, interface, diagram, or rendered output, make their semantic relationship explicit/);
  assert.match(authoring, /applying that evidence to code\/UI\/output mapping is a local Course Docs heuristic/);
  assert.match(authoring, /Segment by meaningful semantic\/causal boundaries, not screen count/);
  assert.match(authoring, /keep covered information available or easy to reopen/);
  assert.match(authoring, /cumulative presentation is a promising candidate, not a proven universal or uniquely optimal UI/i);
  assert.match(authoring, /newly revealed instruction SHOULD normally appear at or after its triggering action/);
  assert.match(authoring, /When the change functions as a status message, make it programmatically determinable/);
  assert.match(authoring, /visible-prose value test/);
  assert.match(authoring, /single-line interactive response with one primary submit\/confirm action/);
  assert.match(authoring, /Do not apply this to multiline inputs/);
  assert.match(authoring, /Enter used to confirm Japanese, Chinese, or Korean IME composition must not prematurely submit/);
});

test('new learner guidance preserves retrieval, prior-knowledge, and accessibility boundaries', async () => {
  const authoring = await readRule('course-docs/authoring');
  assert.match(authoring, /task is intended to elicit retrieval or learner generation/);
  assert.match(authoring, /does not prescribe withholding answers in other task types/);
  assert.match(authoring, /Preserve intentional inference in retrieval and problem-solving activities/);
  assert.match(authoring, /do not impose this as a universal high-coherence rule for learners with substantial prior knowledge/);
  assert.match(authoring, /Applying semantic\/causal boundaries to Course Docs, including whether simultaneous changes should be separated, is a local design heuristic/);
  assert.match(authoring, /exact tabs, accordions, collapsing, and layout remain local or experimental/);
  assert.match(authoring, /do not rely on viewport-dependent locations such as left, right, above, or below as the sole identifier/);
  assert.match(authoring, /This local editorial heuristic does not mean shorter is always better/);
  assert.match(authoring, /accessibility-equivalent content is not gratuitous redundancy/);
  assert.match(authoring, /Do not rely on transient animation alone/);
  assert.match(authoring, /When the change functions as a status message, make it programmatically determinable/);
  assert.match(authoring, /controls with different standard keyboard behavior/);
  assert.match(authoring, /unless composition is handled/);
  assertNoCourseAuthoringOverclaims(authoring);
});

test('overclaim guard rejects unsafe research and interaction generalizations', async () => {
  const authoring = await readRule('course-docs/authoring');
  const invalidClaims = [
    'Always use current state → problem → concept → use.',
    'Cumulative presentation is optimal.',
    'All feedback must explain why.',
    'All reflection must be required.',
    'Animation alone is sufficient.',
    'Shorter text is always better.',
  ];
  for (const claim of invalidClaims) {
    assert.throws(
      () => assertNoCourseAuthoringOverclaims(`${authoring} ${claim}`),
      (error) => error instanceof assert.AssertionError,
    );
  }
});
