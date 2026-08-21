#!/usr/bin/env node

// Validates YAML frontmatter across the collection:
// - prompts/agents/chatmodes/instructions must have a non-empty description
// - instructions must also have applyTo
// - SKILL.md files must have name (matching the folder) and description
// - no duplicate top-level frontmatter keys
// - description values must not start with 'description:' (doubled-key paste bug)
// - warns (does not fail) when a SKILL.md exceeds 500 lines

const fs = require('fs');
const path = require('path');
const { createLogger } = require('./lib/log');

const repoRoot = path.join(__dirname, '..');
const log = createLogger('lint-frontmatter');
const errors = [];
const warnings = [];

function listFilesRecursively(basePath, filterFn) {
  const out = [];
  function walk(dir) {
    for (const it of fs.readdirSync(dir)) {
      if (it === 'node_modules' || it === '.git') continue;
      const full = path.join(dir, it);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (stat.isFile() && filterFn(full)) out.push(full);
    }
  }
  if (fs.existsSync(basePath)) walk(basePath);
  return out;
}

function rel(p) {
  return path.relative(repoRoot, p).split(path.sep).join('/');
}

function parseFrontmatter(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const content = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
  const m = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { fields: null, lineCount: content.split('\n').length };

  const fields = {};
  const seen = new Set();
  const lines = m[1].split(/\r?\n/);
  for (const line of lines) {
    const kv = line.match(/^([A-Za-z][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue; // continuation/indented lines belong to previous key
    const key = kv[1];
    if (seen.has(key)) {
      errors.push(`${rel(filePath)}: duplicate frontmatter key '${key}'`);
    }
    seen.add(key);
    let value = kv[2].trim();
    if (
      (value.startsWith("'") && value.endsWith("'") && value.length > 1) ||
      (value.startsWith('"') && value.endsWith('"') && value.length > 1)
    ) {
      value = value.slice(1, -1);
    }
    fields[key] = value;
  }
  return { fields, lineCount: content.split('\n').length };
}

function requireField(filePath, fields, name) {
  if (!fields) {
    errors.push(`${rel(filePath)}: missing frontmatter block`);
    return null;
  }
  const value = fields[name];
  if (value === undefined || value === '') {
    // Allow block scalars (|, >) - treat presence of the key as non-empty enough
    if (value === '' && (name === 'description' || name === 'name')) {
      errors.push(`${rel(filePath)}: frontmatter '${name}' is empty`);
    } else if (value === undefined) {
      errors.push(`${rel(filePath)}: missing frontmatter '${name}'`);
    }
    return null;
  }
  return value;
}

function checkDescriptionSanity(filePath, fields) {
  if (fields && typeof fields.description === 'string') {
    if (/^description\s*:/i.test(fields.description)) {
      errors.push(`${rel(filePath)}: description value starts with 'description:' (paste bug)`);
    }
  }
}

// prompts, agents, chatmodes (including orchestration packs and sets)
const describedFiles = [
  ...listFilesRecursively(path.join(repoRoot, 'prompts'), (f) => f.endsWith('.prompt.md')),
  ...listFilesRecursively(path.join(repoRoot, 'agents'), (f) => f.endsWith('.agent.md')),
  ...listFilesRecursively(path.join(repoRoot, 'chatmodes'), (f) => f.endsWith('.chatmode.md')),
  ...listFilesRecursively(path.join(repoRoot, 'agent-orchestration'), (f) =>
    f.endsWith('.agent.md'),
  ),
  ...listFilesRecursively(
    path.join(repoRoot, 'sets'),
    (f) => f.endsWith('.agent.md') || f.endsWith('.prompt.md'),
  ),
];

for (const file of describedFiles) {
  const { fields } = parseFrontmatter(file);
  requireField(file, fields, 'description');
  checkDescriptionSanity(file, fields);
}

// instructions
for (const file of listFilesRecursively(path.join(repoRoot, 'instructions'), (f) =>
  f.endsWith('.instructions.md'),
)) {
  const { fields } = parseFrontmatter(file);
  requireField(file, fields, 'description');
  requireField(file, fields, 'applyTo');
  checkDescriptionSanity(file, fields);
}

// skills (root and plugin copies)
const skillFiles = [
  ...listFilesRecursively(path.join(repoRoot, 'skills'), (f) => path.basename(f) === 'SKILL.md'),
  ...listFilesRecursively(path.join(repoRoot, 'plugins'), (f) => path.basename(f) === 'SKILL.md'),
];

for (const file of skillFiles) {
  const { fields, lineCount } = parseFrontmatter(file);
  const name = requireField(file, fields, 'name');
  requireField(file, fields, 'description');
  checkDescriptionSanity(file, fields);
  const folderName = path.basename(path.dirname(file));
  if (name && name !== folderName) {
    errors.push(`${rel(file)}: frontmatter name '${name}' does not match folder '${folderName}'`);
  }
  if (lineCount > 500) {
    warnings.push(
      `${rel(file)}: SKILL.md is ${lineCount} lines (> 500) - consider moving detail to resources/`,
    );
  }
}

log.finish({
  errors,
  warnings,
  ok: `(${describedFiles.length + skillFiles.length} files checked)`,
});
