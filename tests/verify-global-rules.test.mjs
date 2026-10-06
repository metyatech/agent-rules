import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
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
  assert.match(normalized, /For an over-limit multi-file patch, use that tool's supported per-file mode/);
  assert.match(normalized, /Follow the live schema, including path and context limits/);
  assert.match(normalized, /Do not repeat the primary review on unchanged evidence/);
});

test('global rules stay within the hard 8000-token budget', async () => {
  const projectRoot = await mkdtemp(path.join(os.tmpdir(), 'agent-rules-budget-'));
  try {
    await writeFile(path.join(projectRoot, 'agent-ruleset.json'), JSON.stringify({
      sources: [repoRoot],
      profile: 'agent-rules',
      global: true,
    }));

    const result = spawnSync('compose-agentsmd', [
      '--root', projectRoot,
      '--dry-run',
      '--json',
    ], {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
      shell: process.platform === 'win32',
    });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    const report = JSON.parse(result.stdout);
    assert.equal(report.budget.totalExceeded, false);
    assert.ok(
      report.budget.totalTokens <= 8000,
      `global rules exceed hard budget: ${report.budget.totalTokens}/8000`,
    );
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});
