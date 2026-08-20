# Orchestration Pack Quality Checklist

Run before shipping a pack.

## Justification

- [ ] At least two Phase 0 conditions hold: different tool needs, fresh context per phase, genuine parallelism, review independence, or length
- [ ] A single custom agent was considered and rejected for a stated reason
- [ ] Every agent has a scope no other agent in the pack has
- [ ] No role exists only because the workflow diagram had a box for it

The last one catches the three-agent pack for a two-step job.

## Naming

- [ ] Every `name:` is unique across **every** pack in `agent-orchestration/`, not only within this one
- [ ] Names are suffixed or scoped where a collision is plausible
- [ ] The folder name describes the workflow, not the domain
- [ ] Agent names read as roles ("Test Planner"), not as commands ("Plan Tests")

Check for collisions:

```bash
grep -rh '^name:' agent-orchestration/ | sort | uniq -d
```

Any output is a collision that will break for a user who installs both packs.

## Wiring

- [ ] Every `handoffs[].agent` exactly matches a `name:` in this pack
- [ ] Every `agents[]` entry exactly matches a `name:` in this pack
- [ ] Matches are exact: spaces, capitalization, parentheses, ampersands
- [ ] Only the orchestrator declares non-empty `agents:`
- [ ] Subagents declare `agents: []` and `user-invocable: false`
- [ ] The orchestrator declares `user-invocable: true`
- [ ] `npm run lint` passes

`scripts/lint-orchestration.js` hard-fails on an unresolved handoff. It cannot check that the handoff prompt is useful; that is the live-run test below.

## Tools

- [ ] Each grant is the minimum the role needs
- [ ] Only the orchestrator has `'agent'`
- [ ] Every agent that runs commands or tests has `'execute'`
- [ ] Every agent that writes a file, including its own artifact, has `'edit'`
- [ ] No explorer or analyst has `'execute'`
- [ ] Any `'playwright/*'` grant is matched by an MCP prerequisite in the README
- [ ] Uses the grouped vocabulary: `'vscode'`, `'execute'`, `'read'`, `'edit'`, `'search'`, `'web'`, `'agent'`, `'todo'`

The `'edit'` case catches people out: an analyst that writes `.ai-outputs/summary.md` needs it even though it writes no product code.

## Output contract

- [ ] Every subagent's body names the Handoff Packet sections
- [ ] The sections are identical across every subagent
- [ ] `Gaps` is required, and the body says uncertainty goes there rather than into a hedge
- [ ] `Artifacts` requires paths
- [ ] Artifacts are written to `.ai-outputs/`
- [ ] The orchestrator's body says what its final summary contains
- [ ] The orchestrator is instructed to send an incomplete packet back rather than fill it in

## Scope boundaries

- [ ] The orchestrator's body states plainly that it does not implement
- [ ] Any reviewer role is separate from the implementer role
- [ ] Each agent has a "what this does NOT do" statement
- [ ] No agent is instructed to merge, push, or deploy unless that is the pack's declared purpose

## README

- [ ] Frontmatter carries a `description` for the README generator
- [ ] Agent-and-role table
- [ ] Typical flow, naming which steps run in parallel
- [ ] Installation instructions covering both the user prompts directory and `.github/agents/`
- [ ] Prerequisites: MCP servers, specs, environments, accounts
- [ ] The output contract
- [ ] A link to a lighter variant if one exists

## Repository checks

```bash
npm run lint       # frontmatter, orchestration wiring, plugin sync
npm run generate   # regenerate README tables
npm run check      # verify the README is in sync
```

All three pass before the pull request.

## The live run

Lint proves the wiring resolves. Only a run proves the pack works. Run it against a real task and watch for:

- [ ] **The orchestrator stayed out of the work.** If it started implementing, either a subagent returned something too thin or the orchestrator's instruction is too weak.
- [ ] **Every subagent returned a complete packet.** An always-empty `Gaps` section across the run means the contract is decorative.
- [ ] **No two agents did the same work.** Overlapping scopes show up as duplicated findings.
- [ ] **Every handoff prompt was actionable.** A subagent that had to ask what it was for has a prompt problem, not a capability problem.
- [ ] **The parallel steps were genuinely independent.** If one waited on the other's output, they were not parallel.
- [ ] **The final summary is usable.** Someone who did not watch the run can act on it.
- [ ] **Artifacts landed in `.ai-outputs/`**, not in the repository root.

Record what the run exposed. A pack that has never been run is a pack whose roles were cut on a guess.

## Smells that mean a rewrite

- an orchestrator whose body contains implementation instructions
- a subagent granted every tool "to be safe"
- two agents whose descriptions are hard to tell apart
- a handoff prompt that just restates the agent's name
- five agents where the work is genuinely two phases
- a pack with no README, so it cannot be installed
- agent names that duplicate another pack's
