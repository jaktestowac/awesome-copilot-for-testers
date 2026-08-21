#!/usr/bin/env node

// Verifies that `npm run plugin:materialize` has been run - i.e. that the generated
// plugin skill copies are byte-identical to their source of truth in skills/.
//
// Two checks:
//   1. Every skill declared in plugins/<plugin>/.github/plugin/plugin.json has a copy.
//   2. For each plugins/<plugin>/skills/<skill>/, if skills/<skill>/ exists at the repo
//      root, the file lists and file contents match exactly.

const fs = require('fs');
const path = require('path');
const { createLogger } = require('./lib/log');

const repoRoot = path.join(__dirname, '..');
const pluginsDir = path.join(repoRoot, 'plugins');
const log = createLogger('check-plugin-sync');
const errors = [];
const warnings = [];

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
  log.finish({ ok: '(no plugins directory, nothing to check)' });
}

// One line per drifted skill, listing the files, beats one line per file: the fix is
// the same command either way, and the file list is the evidence for it.
function reportDrift(skillName, kind, files) {
  const shown = files.slice(0, 5).join(', ');
  const more = files.length > 5 ? `, … +${files.length - 5} more` : '';
  errors.push(
    `plugin copy of skill '${skillName}' ${kind}: ${files.length} file(s) - ${shown}${more} - ` +
      "run 'npm run plugin:materialize'",
  );
}

let checked = 0;
const drifted = new Set();

for (const pluginName of fs.readdirSync(pluginsDir)) {
  // Check 1: every skill the manifest declares must have been materialized.
  const manifestPath = path.join(pluginsDir, pluginName, '.github/plugin/plugin.json');
  if (fs.existsSync(manifestPath)) {
    let manifest = null;
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (err) {
      errors.push(`${rel(manifestPath)}: invalid JSON - ${err.message}`);
    }
    for (const relPath of manifest && Array.isArray(manifest.skills) ? manifest.skills : []) {
      if (typeof relPath !== 'string') continue;
      const skillName = relPath.replace(/^\.\/skills\//, '').replace(/\/$/, '');
      const copyPath = path.join(pluginsDir, pluginName, 'skills', skillName);
      if (!fs.existsSync(path.join(copyPath, 'SKILL.md'))) {
        errors.push(
          `${rel(manifestPath)}: declares '${relPath}' but ${rel(copyPath)}/SKILL.md is missing - run 'npm run plugin:materialize'`,
        );
      }
    }
  }

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
    const differing = rootFiles
      .filter((f) => pluginFiles.includes(f))
      .filter(
        (f) =>
          !fs
            .readFileSync(path.join(rootSkill, f))
            .equals(fs.readFileSync(path.join(pluginSkill, f))),
      );

    if (missing.length) reportDrift(skillName, 'is missing files its source has', missing);
    if (extra.length) reportDrift(skillName, 'has files its source does not', extra);
    if (differing.length) reportDrift(skillName, 'differs from its source', differing);
    if (missing.length || extra.length || differing.length) drifted.add(skillName);
  }
}

log.finish({
  errors,
  warnings,
  ok: `(${checked - drifted.size} plugin skill copy/copies match skills/)`,
});
