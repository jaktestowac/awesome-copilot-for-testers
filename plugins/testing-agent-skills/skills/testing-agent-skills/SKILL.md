---
name: testing-agent-skills
description: 'Tests the customization assets themselves - skills, prompts, custom agents, instructions - the way a product is tested: activation cases that check an asset fires when it should and stays quiet when it should not, output-contract cases, safety cases, collision cases between assets competing for the same trigger, a weighted rubric scored blind, and a baseline-versus-candidate gate before an edit ships. Use when a skill is edited and nobody knows whether behaviour changed, when two skills fight over the same request, when a description is being tuned for discoverability, when a collection has grown past manual spot-checking, or when the request mentions skill evals, prompt regression, or "does this skill actually work".'
argument-hint: 'The skill, prompt, agent, or instruction file under test, the behaviour it claims, and the harness it runs in'
user-invocable: true
---

# Testing Agent Skills

Use this skill when a customization asset is treated as done because it reads well.

A `SKILL.md` is a behavioural contract executed by a model. Nothing about it is verified by frontmatter linting, a markdown check, or a careful read. Every claim in a skill description - "use when X", "always applies", "never invents a root cause" - is a testable assertion, and until someone tests it the asset is untested code shipped to every user of the collection.

This skill treats the collection as the system under test. `testing-llm-features` covers the same discipline pointed at a product feature; the difference is what fails. A product eval failure ships a wrong answer to a customer. A skill eval failure ships a wrong *process* to every future task.

## When to Use

- a skill, prompt, agent, or instruction file was edited and the behavioural effect is unknown
- a new asset is being added to a collection that already has near neighbours
- two assets compete for the same request and the wrong one keeps winning
- a description is being rewritten for discoverability and nobody can tell whether it got better
- an asset claims "always applies" and the claim has never been checked past turn three
- a collection has grown past the point where a human can spot-check it before release
- before publishing a collection, as a release gate
- the request mentions skill evals, prompt regression, activation testing, A/B on a prompt, or "does this actually change anything"

## Smallest Useful Suite

A full suite is 10 to 20 cases with baselines and blind scoring. Nobody starts there. Six cases in an afternoon catch most of what is actually broken, and they establish whether the criteria are scorable at all - which is the thing you cannot learn by planning.

Start with exactly these six, in this order:

1. **One activation-positive**, phrased the way a user would ask, with the asset never named.
2. **One activation-negative**, on the nearest adjacent request the asset should leave alone.
3. **One collision**, against the nearest neighbour, with the intended winner stated up front.
4. **One contract**, on whatever the asset promises to produce.
5. **One safety**, if the asset touches brevity, speed, or autonomy - this is where confirmation steps quietly disappear.
6. **One persistence**, if the asset claims to always apply.

Run each three times, with the asset and without it, and score the twelve responses in one sitting. Two hours, and the result is usually one of three things: the asset works, the asset changes nothing the model was not already doing, or a criterion turned out to be unscorable. All three are worth the afternoon.

Grow the suite from failures after that, not from a plan. Every real defect found in use becomes a case, and the suite ends up shaped like the asset's actual weaknesses.

## What an Eval Can and Cannot Prove

Say this out loud before writing cases, because the most common failure here is a suite that proves the wrong thing.

**An eval can prove:**

- the asset activates on the requests it claims, and stays quiet on adjacent requests it does not claim
- the output satisfies a stated contract - required sections, a severity ranking, a file written to the right path
- a specific bad behaviour that used to happen no longer happens
- the candidate version scores higher than the baseline on the same cases, with the same model, at the same settings

**An eval cannot prove:**

- that the asset is better in general. It is better on these cases, at this model version
- that the asset is correct when the case criteria only check shape. A response that has all five required headings and wrong content passes a shape-only case
- anything at all from a single trial. Model output varies between runs; one pass is one observation
- that the asset caused the change, unless the baseline ran on the same cases in the same conditions

Write the limits into the report. A skill eval that claims general improvement from six cases and one trial is the same failure as a test suite claiming coverage from a green run.

## Case Taxonomy

A usable suite covers seven categories. Most suites only write the first, which is why most suites pass.

| Category | The question | Fails when |
| --- | --- | --- |
| **Activation-positive** | Does it fire on a request it claims? | The description reads well but shares no vocabulary with real requests |
| **Activation-negative** | Does it stay quiet on adjacent requests it does not claim? | The description is so broad the asset fires on everything |
| **Collision** | Between two competing assets, does the right one win? | Two skills claim the same trigger and selection is effectively random |
| **Contract** | Does the output have the parts the asset promises? | The workflow is followed loosely and required sections go missing |
| **Behavioural** | Does it change what the model *does*, not just what it says? | The asset is quoted back as a summary and then ignored |
| **Safety** | Are confirmations, authorization gates, and refusals preserved? | A brevity or speed rule quietly deletes a confirmation step |
| **Persistence** | Does an always-apply asset still apply at turn ten? | The rules survive two turns and lapse when the topic changes |

Activation-negative and collision cases are where a mature collection earns its keep. In a collection with fifty skills, a new asset's real risk is not that it fails to fire - it is that it fires instead of something better.

Category definitions, worked cases, and the case file schema are in `./resources/case-file-schema.md`.

## Asset Types Other Than Skills

The seven categories apply to every asset type, but what they mean changes. Test what the asset type can actually get wrong.

**Custom agents.** The tool grant is the contract, and exceeding it is the failure class no skill has. A read-only reviewer that edits a file has failed regardless of how good its findings were. Write one negative case per boundary the agent declares - one for each "does NOT do" in its own prose, and one attempting an action outside its granted tools. Also test the handoff: when the agent hits work it declares out of scope, does it hand off to the named target or do it anyway?

**Prompt files.** Activation is not the question - a prompt is invoked deliberately. What breaks instead is routing and inputs: does it reach the agent it declares, does it collect the inputs it needs before starting, and does it degrade sensibly when an optional input is missing? Six to ten cases, weighted toward missing and malformed inputs.

**Instruction files.** The risk is scope. An `applyTo` glob wider than the rules it carries applies domain-specific advice to unrelated files, and nothing about that looks wrong in review. Weight the suite toward activation-negative: files just outside the glob, and files inside it where the rules do not fit. One case per rule, checking the rule is actually followed rather than merely present.

**Hooks.** Mostly deterministic, so most of the suite is not a model eval at all: feed it real payload shapes and assert on exit codes and output. What still needs a behavioural case is the response to a hook that fires - does the agent act on a denial reason or route around it? A hook that denies and gets circumvented is worse than no hook.

**Orchestration packs.** Test the seams, not the agents. Does each handoff carry the packet the next role needs, and does a role stop at its boundary instead of finishing the next one's work? One case per handoff.

## Workflow

### Phase 0: State the behavioural claim

Write one sentence: what does this asset make the model do that it would not do otherwise?

If that sentence is hard to write, the asset has no testable claim yet, and that is the finding. Stop and fix the asset first.

Then list the claims already written into its frontmatter. Every "use when" clause is an activation-positive case. Every scope boundary ("this skill does not…") is an activation-negative case. Every "always" is a persistence case.

### Phase 1: Write the cases

Aim for 10 to 20 cases for a single asset. Coverage across the seven categories beats volume in one.

Per case, write:

- the prompt, in the words a real user would use - not the words from the description
- the category and a risk level
- pass criteria that are observable in the response, and that a second person would score the same way
- for activation cases, which asset should fire, and which assets must not

Use the schema in `./resources/case-file-schema.md`. Keep the file next to the asset or under `evals/` in the collection.

Bad prompt: "Use the communicating-quality-findings skill to summarize these findings." - names the asset and reuses its vocabulary, so it tests nothing but obedience.

Good prompt: "I've got 22 review comments and my lead just says 'so what do I actually do'. Turn this into something he'll read." - the words a user types, sharing no vocabulary with the description.

Bad criterion: "Response includes a severity ranking." - passes on a ranking that is wrong.

Good criterion: "Ranks the swallowed 402 above the fixture duplication." - a substantive judgement a second scorer would agree on.

### Phase 2: Record the baseline

Run every case with the asset **disabled** or absent. Save the responses verbatim.

This is the step that gets skipped and it invalidates everything downstream. Without a baseline you cannot tell an asset that improves behaviour from an asset that describes behaviour the model already had. Plenty of skills are the latter.

For an edit to an existing asset, the baseline is the current published version, not the absence of it.

### Phase 3: Run the candidate

Same cases, same model, same settings, asset enabled. Multiple trials per case - three is a workable floor, and one trial is not a result. Record every trial, including the ones that disagree with each other.

Note the model and version in the run record. A suite scored against one model says nothing about another.

### Phase 4: Score blind

Label the responses `A` and `B` without exposing which is baseline and which is candidate, then score each against the rubric in `./resources/rubric-and-gate.md`.

Scoring your own change while knowing which is yours produces the result you expected. If a second person is available, have them score. If a model is the judge, keep the labels blind for it too, and spot-check its scores by hand.

### Phase 5: Apply the gate

The candidate ships only when it clears the release gate in `./resources/rubric-and-gate.md`: no blocking findings, safety and correctness not regressed, weighted score above baseline.

A candidate that wins on concision and loses on correctness does not ship. That trade is the most common regression in style and brevity assets, and it is exactly what the weighting exists to catch.

### Phase 6: Store the suite and re-run it

Commit the case file, the rubric, the baseline responses, and the run record. Re-run before the next edit to the asset, and when the default model changes.

An eval suite that ran once is a screenshot. The value is in the second run.

## Trigger Collisions in a Collection

Specific to collections large enough for assets to overlap. Run this whenever an asset is added or a description is rewritten.

1. **Find the near neighbours.** Which existing assets share vocabulary, scope, or likely trigger phrases with the new one?
2. **Write one collision case per neighbour pair**, phrased the way a user would ask - not phrased to favour either asset.
3. **State the intended winner** for each case, and why. If you cannot say why, the two assets need merging or their scopes need rewriting.
4. **Check the descriptions carry the disambiguation.** Where two assets are deliberately near neighbours, each description should name the other and say when to prefer it. That sentence is what makes the selection reliable; test that it works.
5. **Re-run collision cases when either side changes.** A description edit on one asset is a behavioural change to its neighbours.

## Common Failure Modes

Ordered by cost. The first four produce a suite that reports success while proving nothing, which is worse than having no suite at all - a green eval is quoted in a release decision.

1. **Suite grows to fit the asset.** Cases quietly rewritten until the candidate passes. This is the eval-suite version of editing a test until it goes green, and it is the only failure here that makes the collection worse than untested. Change the asset, or record the failure and ship anyway with the reason.
2. **No baseline.** The most common failure. Without it every result is unattributable, and an asset that merely describes behaviour the model already had scores as effective.
3. **Shape-only criteria.** "Response includes a severity ranking" passes on a ranking that is wrong. At least one criterion per case must check substance.
4. **Judge sees the labels.** Non-blind scoring reproduces the author's expectation and calls it a measurement.
5. **One trial.** Model output varies. A single pass is one observation and cannot be a gate.
6. **Cases written from the description.** Copying trigger phrases out of the frontmatter into the prompts tests a tautology. Write the prompts a user would type.
7. **Safety cases missing.** Style, brevity, and speed assets delete confirmation steps as a side effect. If nothing tests for that, nothing catches it.
8. **No activation-negative cases.** A suite of positives cannot detect an asset that fires on everything, which is the most common real defect in a broad description.
9. **Green suite, unpublished asset.** The plugin copy, the README entry, or the frontmatter never got updated, so the tested asset is not the shipped one.

## Resource Map

- `./resources/case-file-schema.md` - the case file format, field by field, with worked cases for each of the seven categories
- `./resources/rubric-and-gate.md` - the weighted scoring rubric, blocking-finding definitions, and the release gate
- `./resources/running-evals.md` - how to actually run a suite: the manual blind protocol, scripted runs, judge prompts, and CI wiring

## Related Skills

- `testing-llm-features` - the same discipline aimed at a product feature's prompts and RAG, where the eval gates a release rather than a collection
- `creating-skills` - authors the asset this skill then tests; its quality checklist is a static check, not a behavioural one
- `creating-prompts`, `creating-custom-agents`, `creating-instructions` - the other asset types in scope here
- `creating-plugins` - packaging, where an untested asset becomes an installed one
- `unslop-answers` - applies to the eval report itself; a skill eval is exactly the kind of result that gets reported as verified without a run
- `analyzing-quality-metrics` - denominators and windows for the numbers an eval report quotes
- `tracking-quality-trends` - turning repeated eval runs into a direction rather than a series of snapshots
- `creating-orchestration-packs` and `creating-hooks` - the two asset types whose failures live in the seams rather than in the prose
- `communicating-quality-findings` - for the eval report itself, where the decision is ship or do not ship this candidate

## Definition of Done

An asset is tested when:

- its behavioural claim is written in one sentence, and every frontmatter claim maps to at least one case
- the suite covers every category that applies to the asset's type, and always includes one activation-negative and one collision case
- for an agent, one negative case exists per declared boundary and per tool the agent is not granted
- pass criteria are observable, and at least one criterion per case checks substance rather than shape
- a baseline was recorded on the same cases, with the same model and settings
- every case ran more than once, and disagreeing trials are recorded rather than discarded
- scoring was blind, and the rubric weights are stated in the report
- the gate decision is explicit: shipped, or not shipped with the reason
- the case file, rubric, baseline responses, and run record are committed next to the asset
- the report states what the suite does not prove: how many cases, which model, how many trials
