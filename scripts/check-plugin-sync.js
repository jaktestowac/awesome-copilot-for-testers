#!/usr/bin/env node

// Ensures plugin skill copies are byte-identical to their source of truth in skills/.
// For each plugins/<plugin>/skills/<skill>/, if skills/<skill>/ exists at the repo root,
// the file lists and file contents must match exactly.

const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const pluginsDir = path.join(repoRoot, 'plugins');
const errors = [];

function rel(p) {
  return path.relative(repoRoot, p).split(path.sep).join('/');
}

function listFilesRecursively(basePath) {
  const out = [];
  function walk(dir) {
    for (const it of fs.readdirSync(dir)) {
      const full = path.join(dir, it);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else out.push(path.relative(basePath, full).split(path.sep).join('/'));
    }
  }
  if (fs.existsSync(basePath)) walk(basePath);
  return out.sort();
}

if (!fs.existsSync(pluginsDir)) {
  console.log('check-plugin-sync: no plugins directory, nothing to check.');
  process.exit(0);
}

let checked = 0;

for (const pluginName of fs.readdirSync(pluginsDir)) {
  const pluginSkillsDir = path.join(pluginsDir, pluginName, 'skills');
  if (!fs.existsSync(pluginSkillsDir) || !fs.statSync(pluginSkillsDir).isDirectory()) continue;

  for (const skillName of fs.readdirSync(pluginSkillsDir)) {
    const pluginSkill = path.join(pluginSkillsDir, skillName);
    const rootSkill = path.join(repoRoot, 'skills', skillName);
    if (!fs.statSync(pluginSkill).isDirectory()) continue;
    if (!fs.existsSync(rootSkill)) continue; // plugin-only skill, nothing to compare

    checked++;
    const pluginFiles = listFilesRecursively(pluginSkill);
    const rootFiles = listFilesRecursively(rootSkill);

    const missing = rootFiles.filter((f) => !pluginFiles.includes(f));
    const extra = pluginFiles.filter((f) => !rootFiles.includes(f));

    for (const f of missing) {
      errors.push(`${rel(pluginSkill)}: missing file '${f}' present in skills/${skillName}`);
    }
    for (const f of extra) {
      errors.push(`${rel(pluginSkill)}: extra file '${f}' not present in skills/${skillName}`);
    }

    for (const f of rootFiles.filter((f) => pluginFiles.includes(f))) {
      const a = fs.readFileSync(path.join(rootSkill, f));
      const b = fs.readFileSync(path.join(pluginSkill, f));
      if (!a.equals(b)) {
        errors.push(
          `plugin copy of skill '${skillName}' is out of sync at '${f}' — copy skills/${skillName} into plugins/${pluginName}/skills/${skillName}`,
        );
      }
    }
  }
}

if (errors.length) {
  for (const e of errors) console.error(`❌ ${e}`);
  console.error(`\ncheck-plugin-sync: ${errors.length} error(s)`);
  process.exit(1);
}
console.log(`check-plugin-sync: OK (${checked} plugin skill(s) in sync)`);
