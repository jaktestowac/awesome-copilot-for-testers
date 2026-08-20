# Traceability Automation

A matrix maintained by hand is true once. Generate it from the annotations, check it in CI, and it stays true.

## Generator

Parses the runner's own test list, so it sees skip status and cannot drift from what actually runs.

```js
// scripts/traceability.mjs
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const REQ_PATTERN = /@req:([A-Z]+-\d+)/g;

// The register is the authority on which IDs exist and which are retired.
function loadRegister(path = 'docs/requirements.md') {
  const rows = new Map();
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\|\s*(REQ-\d+)\s*\|\s*([^|]+?)\s*\|[^|]*\|\s*(High|Medium|Low)\s*\|\s*(\w+)/);
    if (m) rows.set(m[1], { statement: m[2], risk: m[3], status: m[4] });
  }
  return rows;
}

function loadTests() {
  const raw = execSync('npx playwright test --list --reporter=json', { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const report = JSON.parse(raw);
  const out = [];

  const walk = (suite, file) => {
    for (const spec of suite.specs ?? []) {
      const skipped = spec.tests.every((t) => t.annotations?.some((a) => a.type === 'skip' || a.type === 'fixme'));
      const text = spec.title + ' ' + JSON.stringify(spec.tests.flatMap((t) => t.tags ?? []));
      out.push({
        title: spec.title,
        file: file ?? suite.file,
        line: spec.line,
        skipped,
        reqs: [...text.matchAll(REQ_PATTERN)].map((m) => m[1]),
      });
    }
    for (const child of suite.suites ?? []) walk(child, file ?? suite.file);
  };

  for (const suite of report.suites ?? []) walk(suite);
  return out;
}

const register = loadRegister();
const tests = loadTests();

// Forward: requirement -> tests
const forward = new Map([...register.keys()].map((id) => [id, []]));
// Backward: tests with no requirement
const orphans = [];
// Annotations pointing at an ID the register does not know
const dangling = [];

for (const t of tests) {
  if (t.reqs.length === 0) {
    orphans.push(t);
    continue;
  }
  for (const id of t.reqs) {
    if (!register.has(id)) dangling.push({ ...t, id });
    else forward.get(id).push(t);
  }
}

const uncovered = [...forward.entries()]
  .filter(([id, ts]) => register.get(id).status === 'Active' && ts.filter((t) => !t.skipped).length === 0)
  .map(([id, ts]) => ({ id, ...register.get(id), skippedOnly: ts.length > 0 }));

writeFileSync(
  '.ai-outputs/traceability.json',
  JSON.stringify({ generatedFrom: tests.length, forward: [...forward], orphans, dangling, uncovered }, null, 2),
);

console.log(`tests: ${tests.length}  requirements: ${register.size}`);
console.log(`uncovered: ${uncovered.length}  orphan tests: ${orphans.length}  dangling links: ${dangling.length}`);

if (process.env.CI && dangling.length) {
  console.error('\nAnnotations referencing unknown requirements:');
  for (const d of dangling) console.error(`  ${d.file}:${d.line} -> ${d.id}`);
  process.exit(1);
}
```

Two details that matter:

- **`skipped` is computed and used.** A skipped test keeps its annotation. Counting it as coverage is the most common way a generated matrix lies.
- **`uncovered` distinguishes `skippedOnly`.** A requirement whose only link is skipped is a gap that looks like coverage, and it deserves its own line in the report.

## The staged CI gate

Adopt in this order. A gate switched on against the whole backlog gets disabled within a week, and then nothing is enforced.

### Stage 1: dangling links (adopt immediately)

Cheap, unambiguous, and no backlog. An annotation pointing at a nonexistent or retired requirement is always a defect.

```yaml
      - name: Traceability - link integrity
        run: node scripts/traceability.mjs
```

### Stage 2: critical requirements are covered

Scope to a declared set, not everything.

```js
const CRITICAL = [...register.entries()]
  .filter(([, r]) => r.risk === 'High' && r.status === 'Active')
  .map(([id]) => id);

const uncoveredCritical = uncovered.filter((u) => CRITICAL.includes(u.id));

if (uncoveredCritical.length) {
  console.error('High-risk requirements with no running test:');
  for (const u of uncoveredCritical) {
    console.error(`  ${u.id}: ${u.statement}${u.skippedOnly ? '  (linked test is SKIPPED)' : ''}`);
  }
  process.exit(1);
}
```

### Stage 3: new tests carry an annotation

Changed files only. This is what keeps the backlog from blocking every pull request while stopping it from growing.

```yaml
      - name: Traceability - new tests are annotated
        run: |
          CHANGED=$(git diff --name-only origin/${{ github.base_ref }}...HEAD -- '*.spec.ts' '*.test.ts')
          [ -z "$CHANGED" ] && exit 0

          FAIL=0
          for f in $CHANGED; do
            [ -f "$f" ] || continue
            # Every added test line should carry an annotation
            while IFS= read -r line; do
              case "$line" in
                *"@req:"*) ;;
                *) echo "::warning file=$f::added test without a @req annotation: ${line#+}"; FAIL=1 ;;
              esac
            done < <(git diff origin/${{ github.base_ref }}...HEAD -- "$f" | grep -E '^\+\s*(test|it)\(')
          done
          exit $FAIL
```

Start it as a warning. Promote to a failure once the team has been living with it for a sprint.

### Stage 4: last-link removal is acknowledged

```js
const previous = JSON.parse(readFileSync('.ai-outputs/traceability.baseline.json', 'utf8'));
const lost = previous.uncovered ? [] : [];  // compare forward maps between runs

for (const [id, ts] of previous.forward) {
  const now = forward.get(id) ?? [];
  if (ts.length > 0 && now.length === 0) {
    console.error(`${id} lost its last linked test in this change.`);
    process.exit(1);
  }
}
```

Override with a commit trailer (`Traceability-drop: REQ-014, feature removed`) so a legitimate removal is possible and recorded.

## Re-verification trigger

The highest-value automation in this file, and the cheapest. A pull request touching a test that carries an annotation prompts a re-verification of that link, at the moment the author still knows what they changed.

```yaml
      - name: Traceability - re-verify touched links
        run: |
          TOUCHED=$(git diff origin/${{ github.base_ref }}...HEAD -- '*.spec.ts' '*.test.ts' \
                    | grep -oP '@req:\K[A-Z]+-\d+' | sort -u)
          if [ -n "$TOUCHED" ]; then
            echo "::notice::This change touches tests linked to: $(echo $TOUCHED | tr '\n' ' ')"
            echo "Confirm each linked test still fails when its requirement's behaviour is broken."
          fi
```

It catches the semantic drift no static check can find: a test refactored to verify something else while keeping its annotation.

---

## Change-impact procedure

When a requirement changes, the matrix is what tells you where to look.

1. **Find the linked tests.**
   ```bash
   npx playwright test --list --grep "@req:REQ-014"
   grep -rn "@req:REQ-014" tests/
   ```
2. **Classify each** against the new wording:
   | Verdict | Action |
   | --- | --- |
   | Still valid | Nothing |
   | Needs updating | Update the test in the same change as the requirement |
   | Now wrong | Rewrite or delete; do not leave it passing against the old behaviour |
   | Newly needed | Design it; route to `designing-functional-tests` |
3. **Update tests and links together.** A requirement edited in one pull request and its tests in another leaves a window where the matrix is confidently wrong.
4. **When a requirement is retired**: mark it retired in the register, then delete or re-link every annotation. Never leave an annotation pointing at a retired ID.
5. **Re-verify** the links on the changed requirement.
6. **For the wider retest scope** beyond the linked tests, hand to `analyzing-regression-scope`. The matrix finds the direct links; it does not find the shared component three layers down.

---

## Report template

```markdown
# Traceability report

- **Generated**: [YYYY-MM-DD] from [n] tests and [n] active requirements
- **Scope**: [full suite / named areas]
- **Extraction coverage**: [n] of [n] tests read by a human; the rest by annotation only

## Summary

| | Count |
| --- | --- |
| Requirements with a verified link | |
| Requirements with an unverified link | |
| Requirements covered only by a skipped test | |
| Requirements with no link | |
| Orphan tests | |
| Dangling annotations | |

## Uncovered requirements, by risk

| Req ID | Statement | Risk | Note |
| --- | --- | --- | --- |

## Links that failed verification

| Req ID | Test | What was broken | Test result | Action |
| --- | --- | --- | --- | --- |

Highest severity in the report. A link that survives a broken behaviour is documented
coverage of something that is not covered.

## Orphan tests, classified

| Test | Classification | Evidence | Action |
| --- | --- | --- | --- |

## Drift since the last run

| Change | Effect |
| --- | --- |

## Verification coverage

[n] of [n] links verified, selected by [criterion]. The remainder are recorded as
unverified and are not evidence of coverage.

## What this matrix does not cover

- [areas outside the extraction scope]
- [test levels not included]
- [requirements with no authoritative source, derived and unconfirmed]
```

The last two sections are what stop the matrix being over-quoted. A traceability report without them gets read as complete, and it is the artifact people use to decide what not to test.
