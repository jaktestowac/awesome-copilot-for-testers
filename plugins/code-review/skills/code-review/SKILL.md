---
name: code-review
description: 'Performs a quick, lightweight review of a small diff or single file, giving concise feedback on correctness, readability, tests, and obvious risks. Use when the user asks for a fast sanity-check review of a small change. For test-automation suites, architectural refactors, security-sensitive paths, or multi-file reviews, use the code-review-advanced skill instead.'
argument-hint: 'The diff, file, or snippet to review, plus the goal of the change'
user-invocable: true
---

# Quick Code Review

This skill applies a consistent, lightweight assessment to a small code change. It focuses on key principles of code quality:

- Safety (avoid incorrect assumptions; call out uncertain areas)
- Clarity (structuring comments in positive and actionable form)
- Coverage (address correctness, tests, security, performance, readability)

## When to Use

1. The user asks for a quick review of a small diff, single file, or snippet.
2. A change needs a fast sanity check before a fuller review.
3. You need a compact checklist for a routine, low-risk change.

For large or multi-file pull requests, legacy audits, test-automation suites, or high-risk paths (auth, payments, data flows), use `code-review-advanced` instead.

## Skill Behavior

- Start with a summary: what is changing, why, and whether the implementation is aligned with goals.
- Categorize findings:
  - ✅ Strengths / wins
  - ⚠️ Concerns / risks
  - 🛠️ Suggestions / improvements
- Provide `short-term` fix guidance plus `long-term` design thoughts.
- Flag any missing tests, docs, or standards violations.
- Respect context: mention the module/file/function names (not generic: "the code").

## Quick Review Checklist

1. **Correctness**
   - Does the code do what the ticket/PR describes?
   - Are edge cases handled (null, errors, concurrency, format)?
   - Any regression risk from changed behavior?

2. **Maintainability**
   - Is the implementation easy to read and reason about?
   - Are abstractions and naming appropriate?
   - Any repeated logic that should be refactored?

3. **Testing**
   - Are unit and integration tests present and relevant?
   - Do tests cover both normal and boundary cases?
   - Are tests deterministic and fast?

4. **Security & Privacy**
   - Are user inputs validated/escaped and untrusted data treated carefully?
   - Any secrets in code, logs, or config?
   - Does the change introduce new permissions, cross-origin, or auth gaps?

5. **Performance**
   - Any obvious O(N^2) loops or hot-path allocations?
   - Are caching and batching used when appropriate?
   - For network I/O, is retry/backoff and timeout handling present?

6. **Style/Convention**
   - Follow team linting rules and style guide (naming, indent, line length).
   - Approve clean diff with minimal noise in formatting.

7. **Documentation**
   - Public APIs should be documented.
   - Migration notes, config docs, and README changes included if needed.

## Output Style

- Keep each comment concise (1-2 sentences plus the issue).
- Use bullet points for multiple issues.
- Use neutral, teammate-first language (`Consider`, `Could`, `Would` instead of `You`).
- Include a final recommendation state: `approve`, `request changes`, or `comment`.

## Related Skills

- `code-review-advanced` - evidence-driven, severity-ranked review for complex, risky, or multi-file changes
- `tech-debt-analysis` - when recurring review findings suggest a broader debt assessment

## Definition of Done

This skill is complete when:

- the change is summarized with intent and alignment stated
- findings are categorized (strengths, concerns, suggestions) with concrete file/function references
- missing tests or docs are flagged
- a final recommendation (`approve`, `request changes`, or `comment`) is given
