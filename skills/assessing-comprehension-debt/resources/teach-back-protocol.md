# Teach-Back Protocol

Ten minutes, four questions, one person explaining a change to another. The record is a by-product; the conversation is the point.

## When to run one

- a change on high-risk surface with a **high** band and no explanation
- a module with one author and no substantive reviewer
- before a primary author goes on leave or leaves the team
- when a reviewer notices they approved something they could not now describe
- on any change an agent wrote end to end, where nobody has yet formed a mental model

Not on every change. A teach-back on a two-line fix teaches nothing and turns the practice into a ritual.

## The four questions

Ask them in order. Each one probes a different kind of understanding, and the second is where most sessions actually land.

### 1. What does this change do, in your own words?

Not the commit message. The behaviour, from the outside, as a user or a caller would see it.

**Strong:** "A support agent can now refund part of a settled order. Before, they had to reverse the whole thing, which broke the monthly reconciliation."
**Weak:** "It adds a partial refund endpoint." - restates the diff.

### 2. Why is it shaped this way rather than the obvious way?

The constraint question. This is the one that separates understanding from familiarity, and the one an agent cannot answer for you.

**Strong:** "We key idempotency on the provider's refund id instead of generating our own, because the provider retries webhooks up to five times and a generated id would let a retry double-refund. A queue would also have worked but the reconciliation window is fifteen minutes."
**Weak:** "That's how the existing code does it." - this is the answer that most often reveals real comprehension debt, and it is worth writing down verbatim.

### 3. What breaks if it goes wrong, and how would we find out?

Failure modes and detectability.

**Strong:** "A double refund. We would see it in the reconciliation variance report the next morning, not in an alert - there is no alert on refund totals, and I think there should be."
**Weak:** "The tests would fail." - tests catch what was anticipated, which is the class of failure least likely to be the problem.

### 4. What would you tell someone about to change this?

The maintainer question. It surfaces the tacit knowledge that never reaches a comment.

**Strong:** "Don't touch the id derivation without checking the provider's retry semantics, and don't assume the amount is the full order total - settled orders can already be partially refunded."
**Weak:** "Read the code." - no transferable model exists yet.

## Running the session

- **Two people, ten minutes, no slides.** Author explains, second person asks. Voice or in person; asynchronous text loses the follow-up question, which is where the value is.
- **The listener's job is to ask "why" once more than is comfortable.** Not to check answers against a key.
- **A gap found is a success, not a failure.** The session worked. Half the value is the author discovering mid-sentence that they do not know why something is the way it is.
- **The reviewer can be the attester.** Reviewer-side attestation ("I can explain this change") is often more valuable than author-side, because it proves the knowledge moved.

## Recording the outcome

The record is short and honest:

```
Comprehension-Attested-by: @tomek
```

Or in the attestation register (`attesting-manual-verification`):

```yaml
- practice: comprehension-attestation
  scope: 'a3f91c2..HEAD (src/billing/refunds/**)'
  attested_by: '@tomek'
  date: 2026-08-21
  outcome: >-
    Can explain behaviour, the idempotency constraint and the failure mode.
    Gap found: no alert on refund totals - raised as OPS-77. Second gap: nobody
    knew settled orders can already be partially refunded; added to the module
    intent register.
  limitations: 'Covers the refund path only, not the reconciliation job it feeds.'
  expires: scope-change
```

Rules:

- **Record the gaps found.** A session that found two gaps is more valuable than one that found none, and the record should show it.
- **Never record a session that did not happen.** A fabricated attestation is worse than an unattested change, because it removes the signal _and_ adds a false one.
- **The attester is a person who can be asked questions later.** That is the entire mechanism.
- **`expires: scope-change`** is usually right - understanding of a module does not survive the module being rewritten.

## What follows a weak session

Not a red build. One of these, chosen deliberately:

| Finding                                        | Follow-up                                                                 |
| ---------------------------------------------- | ------------------------------------------------------------------------- |
| Nobody can explain why the shape is what it is | write it into the module intent register (`recording-change-intent`)      |
| Failure modes are undetectable                 | an observability item - probably the highest-value output of a teach-back |
| Only one person holds the model                | schedule a second pair of eyes on the next change to that module          |
| The code is genuinely hard to follow           | a refactor candidate, sized and prioritised like any other                |
| The test suite is unusable by anyone else      | `documenting-test-suites`                                                 |

The pattern worth noticing: teach-back sessions most often produce **observability** and **documentation** work, not test work. That is a legitimate result, and it is one no test-focused metric would ever have surfaced.

## Anti-patterns

- **Making it an exam.** The listener is not grading. The moment it feels like assessment, answers become defensive and the signal is gone.
- **Running it after release.** Comprehension debt is cheapest to pay before merge, while the author still has the context.
- **Attesting your own work by default.** Author-side attestation is fine as a record of intent; reviewer-side is what proves the knowledge transferred.
- **Recording an attestation without the session.** The one failure that makes the whole practice worthless.
- **Skipping the record.** Then the next assessment cannot tell a well-understood module from an unexamined one.
