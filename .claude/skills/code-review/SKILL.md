---
name: code-review
description: Assists users with code review, providing feedback on code quality, best practices, and potential improvements. Use always when user asks for code review or when there are code changes to review, providing feedback on code quality, structure, readability, maintainability, and adherence to coding standards. This skill provides information on best practices for code review, including how to identify issues, suggest improvements, and communicate feedback effectively.
---

## Overview

The `code-review` skill helps reviewers apply consistent, high-quality assessments across code changes when reviewing code. It focuses on key principles of code quality:

- Safety (avoid incorrect assumptions; call out uncertain areas)
- Clarity (structuring comments in positive and actionable form)
- Coverage (address correctness, tests, security, performance, readability)

## When to Use

1. User asks for code review.
2. Pull request diff is ready and you must provide code review comments.
3. You are auditing a code change for architecture, compliance, or release readiness.
4. You need a checklist for manual or automated review before approving.

## Skill Behavior

- Start with a summary: what is changing, why, and whether the implementation is aligned with goals.
- Categorize findings:
  - ✅ Strengths / wins
  - ⚠️ Concerns / risks
  - 🛠️ Suggestions / improvements
- Provide `short-term` fix guidance plus `long-term` design thoughts.
- Flag any missing tests, docs, or standards violations.
- Respect context: mention the module/file/function names (not generic: "the code").

## Best-practice Review Checklist

1. **Correctness**
   - Does the code do what the ticket/PR describes?
   - Are edge cases handled (null, errors, concurrency, format) ?
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

## Prompt Pattern

Use this template for your code review request:

```
You are a senior code reviewer.
Project context: <technology stack and repository>
Changed files: <list or path prefix>
Key goals: <bug fix, feature, refactor, perf>
Specific concerns: <optional>
Please provide:
- High-level summary
- Risk assessment
- Specific line comments / suggestions
- Example improvement snippets
```

## Output Style

- Keep each comment concise (1-2 sentences plus the issue).
- Use bullet points for multiple issues.
- Use neutral, teammate-first language (`Consider`, `Could`, `Would` instead of `You`).
- Include a final recommendation state: `approve`, `request changes`, or `comment`.
