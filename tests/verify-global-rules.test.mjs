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

test('delegation rules do not depend on undefined tier labels', async () => {
  const content = await readFile(path.join(globalRulesPath, 'sub-agent-delegation.md'), 'utf8');

  assert.doesNotMatch(content, /\bLight work\b/u);
  assert.doesNotMatch(content, /\bStandard(?: work| implementation| review)\b/u);
  assert.doesNotMatch(content, /\bHeavy(?: work| implementation| review)\b/u);
  assert.doesNotMatch(content, /\btask is Heavy\b/u);

  assert.match(content, /Non-trivial implementation or review/);
  assert.match(content, /cross-system, high-blast-radius/);
  assert.match(content, /require an independent review with `PASS`/);
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

test('canonical verification uses the shared PowerShell verifier', async () => {
  const config = await readFile(path.join(repoRoot, '.mwt', 'config.toml'), 'utf8');
  assert.match(config, /command\s*=\s*"pwsh -NoProfile -File tools\/verify\.ps1"/);
});

test('canonical verifier checks tests, pinned Markdown lint, then non-mutating composition', async () => {
  const verifierPath = path.join(repoRoot, 'tools', 'verify.ps1');
  const verifier = await readFile(verifierPath, 'utf8');
  const normalized = verifier.replace(/\s+/g, ' ');

  assert.match(verifier, /^\$ErrorActionPreference = 'Stop'$/mu);
  assert.match(normalized, /node --test .*verify-course-authoring\.test\.mjs .*verify-global-rules\.test\.mjs/);
  assert.match(normalized, /npx --yes markdownlint-cli@0\.49\.1/);
  for (const markdownPath of [
    "'rules/**/*.md'",
    'README.md',
    'CHANGELOG.md',
    'CONTRIBUTING.md',
    'SECURITY.md',
    '--ignore node_modules',
  ]) assert.ok(verifier.includes(markdownPath), `missing markdownlint input: ${markdownPath}`);
  assert.match(normalized, /compose-agentsmd check --refresh --quiet/);
  assert.doesNotMatch(normalized, /npx --yes markdownlint-cli(?:\s|$)/);
  assert.doesNotMatch(verifier, /^\s*compose-agentsmd\s*$/mu);
  assert.equal((verifier.match(/\$LASTEXITCODE -ne 0/gu) ?? []).length, 3);
  assert.ok(normalized.indexOf('node --test') < normalized.indexOf('npx --yes markdownlint-cli@0.49.1'));
  assert.ok(normalized.indexOf('npx --yes markdownlint-cli@0.49.1') < normalized.indexOf('compose-agentsmd check'));
});

test('README documents the canonical verifier and its checks', async () => {
  const readme = await readFile(path.join(repoRoot, 'README.md'), 'utf8');
  assert.match(readme, /pwsh -NoProfile -File tools\/verify\.ps1/);
  assert.match(readme, /markdownlint-cli@0\.49\.1/);
  assert.match(readme, /non-mutating compose-agentsmd check/);
  assert.ok(readme.includes('command in [.mwt/config.toml]'));
  assert.match(readme, /and CI both use the same\s+canonical verifier/);
});

test('CI verifies with current compose-agentsmd main on Windows', async () => {
  const workflowPath = path.join(repoRoot, '.github', 'workflows', 'ci.yml');
  const workflow = await readFile(workflowPath, 'utf8');
  const normalized = workflow.replace(/\s+/g, ' ');

  assert.match(normalized, /push:[\s\S]*?branches:[\s\S]*?- main/);
  assert.match(normalized, /pull_request:/);
  assert.match(normalized, /permissions:[\s\S]*?contents: read/);
  assert.match(normalized, /runs-on: windows-latest/);
  assert.match(normalized, /timeout-minutes: 10/);
  assert.match(normalized, /actions\/checkout@v7/);
  assert.match(normalized, /actions\/setup-node@v7/);
  assert.match(normalized, /node-version: "24"/);
  assert.match(normalized, /repository: metyatech\/compose-agentsmd/);
  assert.match(normalized, /ref: main/);
  assert.match(normalized, /path: \.ci\/compose-agentsmd/);
  assert.match(normalized, /working-directory: \.ci\/compose-agentsmd/);
  assert.match(normalized, /run: npm ci/);
  assert.match(normalized, /run: npm run build/);
  assert.match(normalized, /run: npm link/);
  assert.match(normalized, /pwsh -NoProfile -File tools\/verify\.ps1/);
});
