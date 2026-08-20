# The Handoff Packet

The shared output contract. Every subagent returns this shape, so the orchestrator synthesizes across comparable structures rather than guessing at prose.

## Sections

### Objective

What this agent was asked to do, in its own words. Restating the task surfaces a misread brief immediately, before the work is wasted.

### Inputs

What the agent received, and what it went and found. Files read, specs consulted, endpoints observed, commands run. Makes the finding traceable.

### Findings

What it learned. The substance of the packet.

Structured where structure helps: a table, a list, a matrix. A wall of prose is harder for the orchestrator to synthesize and harder for a human to check.

### Decisions

What it chose, and why. Not what it was told to do; what it decided when the brief did not say.

> Chose `getByRole` over the existing `data-qa` attributes because three of the four target
> elements already have accessible names, and the fourth needed one anyway.

This is where a wrong turn becomes visible while it is still cheap to correct.

### Artifacts

Files created or modified, with paths relative to the repository root. The orchestrator's final summary is assembled from these.

### Gaps

**The section that carries the most weight, and the one most often left empty.**

What the agent could not determine. Missing access, an ambiguous requirement, a file it could not read, a decision it lacked the authority to make.

Without it, an agent that could not determine something produces a confident summary, and the orchestrator propagates confidence that nothing supports.

> - Could not determine whether the `refund_status` enum has a fifth value; the spec lists four,
>   the database check constraint lists five.
> - No staging admin account was available, so the admin paths are unanalyzed.

An always-empty `Gaps` section across a whole run means the agents are not using it. Say so in the orchestrator's instructions: uncertainty goes here, not into a hedge in `Findings`.

### Risks

What the next agent should watch for. Distinct from `Gaps`: a gap is something unknown, a risk is something known and dangerous.

> The existing fixtures share one seeded account. Adding parallel tests without changing that
> will produce failures that look like flakiness.

### Next action

What this agent recommends happens next. The orchestrator decides, and a recommendation from the agent that just did the work is the best available input.

---

## Worked example

```markdown
## Handoff Packet: Coverage Analyst

### Objective
Analyze the checkout suite against the risk areas in the release diff, and return a
prioritized list of coverage gaps.

### Inputs
- Read: `tests/e2e/checkout/*.spec.ts` (6 files), `tests/api/orders.spec.ts`
- Read: `playwright.config.ts`, `tests/fixtures/auth.ts`
- Diff: 14 files changed, from the PR summary provided

### Findings

| Risk area | Current coverage | Verdict | Priority |
| --- | --- | --- | --- |
| Discount calculation | 6 unit tests, no E2E | Thin | P0 |
| Expired card handling | None | Gap | P0 |
| Address validation | 3 E2E | Covered | - |
| Order confirmation email | None | Gap | P2 |

Conventions the implementer must follow:
- Locators: `getByRole` first (see `checkout.spec.ts:12`)
- Auth: `authenticatedPage` fixture (`tests/fixtures/auth.ts:8`), never a UI login
- Data: factories in `tests/support/factories`, teardown in the fixture

### Decisions
Ranked expired-card handling as P0 despite no explicit mention in the diff, because the
payment method change in `src/payments/card.ts` touches the same code path.

### Artifacts
- `.ai-outputs/coverage-gaps-20260820-1412.md`

### Gaps
- Could not determine whether the discount rule applies before or after tax. The unit tests
  assert both in different files (`discount.test.ts:34` expects pre-tax, `total.test.ts:19`
  expects post-tax). One of them is wrong and I cannot tell which.
- No access to the payment sandbox, so I could not confirm which decline codes are reachable.

### Risks
- The `authenticatedPage` fixture seeds one shared account. Tests added in parallel against it
  will collide.

### Next action
Resolve the pre-tax versus post-tax ambiguity with the product owner before implementing,
since it changes what the test asserts. Then implement the two P0 gaps.
```

That packet's `Gaps` section stops the implementer from writing a test that asserts the wrong number. Without it, the pack produces a confidently wrong test and the orchestrator reports success.

---

## How the contract degrades

| Degradation | Effect | Fix |
| --- | --- | --- |
| `Gaps` always empty | Uncertainty gets hedged into `Findings` and the orchestrator misses it | State in the agent body that uncertainty goes in `Gaps` |
| Free-form prose instead of sections | Orchestrator synthesis becomes guesswork | Name the sections in every agent body |
| Different sections per agent | Nothing is comparable | One contract, stated in the README and every agent |
| `Artifacts` omitted | The final summary cannot name what changed | Require paths |
| `Decisions` omitted | Wrong turns invisible until much later | Require it even when the answer is "none" |
| Packet in the summary but not written to disk | Nothing survives the session | Artifacts go to `.ai-outputs/` |

## Orchestrator handling

When a packet is incomplete, **send it back with the specific gap named.** Do not fill it in.

Filling it in is the failure mode the pack exists to prevent: the orchestrator's context fills with detail, and the pack becomes one agent doing everything with extra coordination steps. Naming the gap and re-dispatching costs one more turn and keeps the structure intact.
