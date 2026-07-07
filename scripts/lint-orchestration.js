#!/usr/bin/env node

// Validates agent orchestration packs:
// - every handoffs[].agent and agents[] entry must match a `name:` defined in the same pack (hard error)
// - heuristic tool checks (warnings): agents told to run tests/commands should have an
//   'execute' tool; agents told to write files/documents should have an 'edit' tool

const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const errors = [];
const warnings = [];

function rel(p) {
  return path.relative(repoRoot, p).split(path.sep).join('/');
}

function listAgentFiles(dir) {
  const out = [];
  function walk(d) {
    for (const it of fs.readdirSync(d)) {
      const full = path.join(d, it);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (it.endsWith('.agent.md')) out.push(full);
    }
  }
  if (fs.existsSync(dir)) walk(dir);
  return out;
}

function stripQuotes(v) {
  v = v.trim();
  if (
    (v.startsWith("'") && v.endsWith("'") && v.length > 1) ||
    (v.startsWith('"') && v.endsWith('"') && v.length > 1)
  ) {
    return v.slice(1, -1);
  }
  return v;
}

function parseAgent(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const content = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
  const m = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  const fm = m ? m[1] : '';
  const body = m ? content.slice(m[0].length) : content;

  const nameMatch = fm.match(/^name\s*:\s*(.+)$/m);
  const name = nameMatch ? stripQuotes(nameMatch[1]) : null;

  // handoff targets: lines like `agent: X` nested under handoffs
  const handoffTargets = [];
  const handoffsBlock = fm.match(/^handoffs\s*:\s*\r?\n([\s\S]*?)(?=^\S|\s*$(?![\s\S]))/m);
  if (handoffsBlock) {
    for (const lm of handoffsBlock[1].matchAll(/^\s+agent\s*:\s*(.+)$/gm)) {
      handoffTargets.push(stripQuotes(lm[1]));
    }
  }

  // agents: list entries
  const agentRefs = [];
  const agentsBlock = fm.match(/^agents\s*:\s*\r?\n((?:\s+-\s*.+\r?\n?)*)/m);
  if (agentsBlock) {
    for (const lm of agentsBlock[1].matchAll(/^\s+-\s*(.+)$/gm)) {
      agentRefs.push(stripQuotes(lm[1]));
    }
  }

  const toolsMatch = fm.match(/^tools\s*:\s*(\[[\s\S]*?\])/m) || fm.match(/^tools\s*:\s*\r?\n([\s\S]*?\])/m);
  const tools = toolsMatch ? toolsMatch[1] : '';

  return { name, handoffTargets, agentRefs, tools, body };
}

// Packs: each direct subdirectory of agent-orchestration, plus sets/*/custom-agents
const packDirs = [];
const orchRoot = path.join(repoRoot, 'agent-orchestration');
if (fs.existsSync(orchRoot)) {
  for (const name of fs.readdirSync(orchRoot)) {
    const full = path.join(orchRoot, name);
    if (fs.statSync(full).isDirectory()) packDirs.push(full);
  }
}
const setsRoot = path.join(repoRoot, 'sets');
if (fs.existsSync(setsRoot)) {
  for (const name of fs.readdirSync(setsRoot)) {
    const full = path.join(setsRoot, name);
    if (fs.statSync(full).isDirectory()) packDirs.push(full);
  }
}

let checkedAgents = 0;

for (const packDir of packDirs) {
  const files = listAgentFiles(packDir);
  if (files.length === 0) continue;

  const parsed = files.map((f) => ({ file: f, ...parseAgent(f) }));
  const names = new Set(parsed.map((p) => p.name).filter(Boolean));
  checkedAgents += parsed.length;

  for (const p of parsed) {
    if (!p.name) {
      errors.push(`${rel(p.file)}: missing frontmatter 'name'`);
      continue;
    }

    for (const target of p.handoffTargets) {
      if (!names.has(target)) {
        errors.push(
          `${rel(p.file)}: handoff target '${target}' does not match any agent name in this pack (${[...names].join(', ')})`,
        );
      }
    }
    for (const ref of p.agentRefs) {
      if (!names.has(ref)) {
        errors.push(
          `${rel(p.file)}: agents[] entry '${ref}' does not match any agent name in this pack`,
        );
      }
    }

    // Heuristic tool checks (warnings only)
    const bodyLower = p.body.toLowerCase();
    const hasExecute = /execute/.test(p.tools);
    const hasEdit = /'edit|"edit|\bedit\b/.test(p.tools);

    if (/\brun (the )?(relevant )?(tests?|test suites?|test commands?|commands?)\b/.test(bodyLower) && !hasExecute) {
      warnings.push(`${rel(p.file)}: body says to run tests/commands but tools lack 'execute'`);
    }
    if (/\b(write|create|save)\b[^.\n]{0,60}\b(file|document|report|plan|summary|\.md)\b/.test(bodyLower) && !hasEdit) {
      warnings.push(`${rel(p.file)}: body says to write/create files but tools lack 'edit'`);
    }
  }
}

for (const w of warnings) console.warn(`⚠️  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`❌ ${e}`);
  console.error(`\nlint-orchestration: ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(1);
}
console.log(`lint-orchestration: OK (${checkedAgents} agents checked, ${warnings.length} warning(s))`);
