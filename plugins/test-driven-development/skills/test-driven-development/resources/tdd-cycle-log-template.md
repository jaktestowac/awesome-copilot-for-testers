# TDD Session Log

Use this to keep a long TDD session honest: what is queued, what each cycle proved, and what is still open.

## Session frame

- **Behavior or bug:**
- **Public interface under test:**
- **Seam the tests observe:**
- **Seam confirmed with the user:** yes / no
- **Loop shape:** inner only / double loop / interface-discovery
- **Out of scope for this session:**
- **Test runner and conventions detected:**
- **Command to run one test file:**
- **Command to run the full suite:**
- **Last green commit at start:**

## Test list

Smallest and most central behavior first. Add rows as cycles reveal new cases; never write these tests ahead of their cycle.

| #   | Behavior | Status                                | Notes |
| --- | -------- | ------------------------------------- | ----- |
| 1   |          | done / in progress / queued / dropped |       |
| 2   |          |                                       |       |
| 3   |          |                                       |       |

## Fakes outstanding

Every deliberate fake needs a queued test that will remove it. Empty at session close.

| Fake (file:line) | Test list entry that removes it |
| ---------------- | ------------------------------- |
|                  |                                 |

## Cycle record

Copy one block per cycle.

### Cycle N — <behavior>

**Red**

- Test name:
- Actual failure output:
- Failed for the right reason (behavioral, not mechanical): yes / no
- If no, what was fixed first:
- Passed immediately instead of failing: yes / no → if yes, what was decided:

**Green**

- Strategy: obvious implementation / fake it / triangulation
- Minimal change made:
- Deliberately left faked (and which queued test removes it):
- Doubles added, and the boundary each one stands at:
- Full suite result:

**Refactor**

- Cleanup applied (structure only):
- Behavior unchanged: yes / no
- Full suite result after refactor:
- Reverted anything: yes / no

**Outcome**

- Committed at green: yes / no
- Step size felt: too big / right / could be bigger
- Reverts needed this cycle:
- New cases discovered for the test list:
- Design signal noticed (hard setup, awkward seam, "and" in the name):

## Session close

- [ ] Every production change was preceded by a failing test that was actually run
- [ ] Every red step failed for a behavioral reason, with real output quoted
- [ ] Every expected value came from an independent source, not from the implementation
- [ ] No green step contained code the current test did not demand
- [ ] No fake remains without a queued test to remove it
- [ ] Test doubles stand only at boundaries the project does not own
- [ ] No existing assertion was weakened or removed to reach green
- [ ] Every refactor ran under a passing suite and changed no behavior
- [ ] Full suite passes now, and the result was quoted
- [ ] Any bug fixed here has a minimised, permanent regression test
- [ ] The original un-minimised scenario was re-checked after the fix
- [ ] The suite reads as a description of the feature
- [ ] Remaining test list entries are listed below, not silently dropped

**Where the loop was stepped out of** — which entry, why, and the substitute check that was run instead:

**Design findings surfaced by the loop:**

**Still open:**
