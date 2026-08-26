# Running Evals

How to actually get numbers out of a case file. Start with the manual protocol - it works in every host and it is how you find out whether your criteria are scorable. Automate second.

## Isolating the asset

Every result depends on the baseline condition being genuinely without the asset. Pick the mechanism your host makes reliable, and write down which one you used.

| Mechanism | How | Watch out for |
| --- | --- | --- |
| **Branch** | Baseline runs on a branch where the asset file does not exist | The most trustworthy option, and the only one that also removes README and plugin copies |
| **Move the folder** | Rename `skills/<name>` to `skills/.<name>.off` for the baseline run | Vendored plugin copies of the same skill may still be installed - check |
| **Fresh session** | New session per case, no carried context | Required for activation and persistence cases regardless of the other mechanisms |
| **Explicit invocation** | Candidate run invokes the asset by name | Only valid for contract and behavioural cases. It cannot test activation, which is usually the point |

Two conditions must otherwise be identical: same model and version, same tool availability, same repo state, same fixture files.

## The manual blind protocol

Workable for a 14-case suite in under an hour, and it produces better criteria than any automated first pass.

1. **Prepare a response sheet** with one row per case per trial per condition, columns for the six rubric dimensions and a blocker flag. Leave the condition column blank.
2. **Run the baseline.** New session per case. Paste the prompt exactly as written, add the follow-up turns for multi-turn cases, and save the full response to `evals/runs/<date>/baseline/<case-id>-<trial>.md`.
3. **Run the candidate** the same way, into `.../candidate/`.
4. **Shuffle and relabel.** Copy every response into a flat folder with opaque names (`r001.md`, `r002.md`), keeping the mapping in a file you do not open while scoring.
5. **Score against the criteria**, not against your memory of the asset. Mark blockers as you go.
6. **Unblind and compute** using the rubric in `./rubric-and-gate.md`.

Step 4 is the one people skip. Skipping it means step 5 measures your expectations.

## Scripted runs

Once the criteria are stable, drive the prompts through a non-interactive CLI and keep the scoring manual or judge-assisted.

The shape, host-independent:

```bash
#!/usr/bin/env bash
# Reads cases.jsonl, runs each prompt N times, saves responses per condition.
set -euo pipefail

CASES=${1:-evals/cases.jsonl}
CONDITION=${2:?baseline or candidate}
TRIALS=${3:-3}
OUT="evals/runs/$(date +%Y-%m-%d)/$CONDITION"
mkdir -p "$OUT"

while IFS= read -r line; do
  id=$(printf '%s' "$line" | jq -r '.id')
  prompt=$(printf '%s' "$line" | jq -r '.prompt')
  for t in $(seq 1 "$TRIALS"); do
    # Replace with your host's non-interactive invocation.
    # Claude Code:  claude -p "$prompt"
    # Copilot CLI:  see its own docs for the non-interactive flag
    your-agent-cli --print "$prompt" > "$OUT/$id-$t.md"
  done
done < "$CASES"
```

Three things this script deliberately does not do:

- **It does not score.** Automated scoring against string matching produces a suite that measures phrasing. Score with the rubric, by hand or by judge.
- **It does not handle multi-turn cases.** Persistence and behavioural cases need the follow-up turns fed into the same session; extend the script per host or run those cases by hand.
- **It does not switch conditions.** Do that with the branch or folder mechanism above, so the isolation is visible in git rather than hidden in a flag.

Verify your CLI's non-interactive flag against its own documentation before wiring anything to CI. Flags differ between hosts and change between versions, and a suite that silently ran zero prompts reports as a clean pass.

## Existing runners

Reach for these before writing your own harness. Check each tool's current documentation for its case format and flags rather than copying an example from here.

| Tool | Fits | Does not fit |
| --- | --- | --- |
| **promptfoo** | Prompt-level assets, matrix runs across models, assertion-based criteria, side-by-side output views | Multi-turn agent sessions and tool use; activation testing, which needs a real host |
| **`claude plugin eval`** | Skills packaged as Claude Code plugins, run in a sandbox with a report | Copilot-specific activation behaviour |
| **Vitest or Jest** | Deterministic parts only - frontmatter shape, required sections, path conventions, plugin-copy parity | Anything about model behaviour |
| **Your own script** | Full control over sessions and turns | Everything you now maintain yourself |

The deterministic checks belong in the ordinary lint job and should gate hard. Behavioural cases belong in a separate, non-blocking job until the suite has enough history to trust.

## Judge prompt

If a model scores the responses, keep it blind and keep the asset out of its context.

```text
You are scoring two responses to the same request. You do not know how either
was produced and you must not speculate.

Request given to both:
<prompt>

Pass criteria for this case:
<criteria, verbatim from the case file>

Response A:
<response>

Response B:
<response>

For each response, score 1-5 on: correctness, contract adherence, actionability,
safety, activation fit, concision. Then list any blocking finding: a dangerous
instruction, a material factual error, a claim of verification with nothing run
behind it, a stated contract violation, or work handed back to the user that the
responder should have done.

Output JSON only:
{"A":{"correctness":n,...,"blockers":[]},"B":{...},"notes":"one line each"}
```

Do not paste the skill, its rules, or its name into this prompt. A judge that knows what the asset rewards will find it.

## CI wiring

Stage it. A behavioural suite promoted straight to a required check will be disabled within a month.

**Stage 1 - deterministic, blocking.** On every PR touching an asset: frontmatter lint, required sections, description contains a "use when" clause, plugin copies byte-identical, README in sync. These are the checks this repository already runs, and they should keep failing the build.

**Stage 2 - behavioural, advisory.** On PRs that change an asset's `SKILL.md`, `description`, or scope boundary: run that asset's cases plus the collision cases of its near neighbours. Post the scores as a PR comment. Do not fail the build yet.

**Stage 3 - behavioural, blocking on regression only.** Once a suite has run on ten or more PRs and the trial disagreement rate is known, fail the build on a safety or correctness regression against the stored baseline. Never fail on the concision dimension.

**Nightly or pre-release - full sweep.** Every asset's suite, more trials, against the current default model. This is where a model upgrade shows up as a collection-wide regression, which is the failure no per-PR run can see.

Cost control that does not compromise the result:

- per PR, run only the changed asset and its collision neighbours
- keep `high` risk cases in every run; sample `low` risk cases in the nightly only
- store baseline responses so the baseline condition is not re-run on every PR
- re-record the baseline whenever the model changes, and say so in the run record

## What to do with a failing case

In order of preference:

1. **Fix the asset.** The usual right answer, and the reason the suite exists.
2. **Fix the criterion**, if two people scoring it disagree. Vague criteria produce noise, not findings.
3. **Record the failure and ship anyway**, with the reason stated in the run record and the case left failing. Legitimate when the failure is a known trade-off, and honest because the next run still shows it.
4. **Delete the case.** Only when the behaviour it tested is no longer claimed by the asset - and then the description should have changed in the same commit.

Editing a case until the candidate passes is the eval-suite version of editing a test until it goes green. It is the one move that makes the suite worse than having none.
