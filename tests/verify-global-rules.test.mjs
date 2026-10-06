import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const globalRulesPath = path.join(repoRoot, 'rules', 'global');

test('retired tracking tools are absent from active global rules', async () => {
  await assert.rejects(stat(path.join(globalRulesPath, 'persistent-tracking.md')), {
    code: 'ENOENT',
  });

  const ruleFiles = (await readdir(globalRulesPath))
    .filter((file) => file.endsWith('.md'));
  for (const file of ruleFiles) {
    const content = await readFile(path.join(globalRulesPath, file), 'utf8');
    assert.equal(content.includes('task-tracker'), false, `${file} references task-tracker`);
    assert.equal(content.includes('thread-inbox'), false, `${file} references thread-inbox`);
  }
});

test('large multi-file completion uses the selected primary Jev tool files mode', async () => {
  const content = await readFile(path.join(globalRulesPath, 'engineering-standards.md'), 'utf8');
  const normalized = content.replace(/\s+/g, ' ');

  assert.match(normalized, /exactly one primary completion review: `jev_gate` when concrete completion claims and supporting evidence exist; otherwise `jev_review`/);
  assert.match(normalized, /use the selected primary completion tool's supported `files` per-file mode, following the live schema limits; do not intentionally send a known-over-limit whole `diff`/);
  assert.doesNotMatch(normalized, /use `jev_gate`'s `files` per-file mode/);
});
