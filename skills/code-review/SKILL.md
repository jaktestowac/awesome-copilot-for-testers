---
name: code-review
description: "Reviews code changes and pull requests for correctness, security, performance, and maintainability. Use when a PR diff is ready, a user asks for feedback on code quality, or a change needs sign-off before merge."
argument-hint: "File paths, PR URL, or diff context to review"
user-invocable: true
---

# Code Review

Use this skill when code changes need a structured, consistent review before they land.
It produces categorized findings with actionable suggestions so the author can iterate quickly.

## When to Use

Use this skill when the user asks for things like:

- "review this pull request"
- "check these changes before I merge"
- "audit this diff for security and performance"
- "give me feedback on code quality"
- "what could go wrong with this change?"

Typical scenarios:

- reviewing a PR diff before approval
- auditing a feature branch for release readiness
- checking a refactor for regressions or missed edge cases
- validating that tests, docs, and standards are covered

## Review Principles

- **Specific over generic** — reference exact file, function, and line; never say "the code."
- **Actionable over critical** — every concern includes a concrete fix or next step.
- **Teammate tone** — use "Consider", "Could", "Worth checking" instead of directives.
- **Context-aware** — weigh findings against the goal of the change (bug fix vs. feature vs. refactor).

## Workflow

### Phase 0: Scope the review

Before reading code, establish:

- what the change is meant to accomplish (ticket, PR description, commit messages)
- which files and modules are affected
- the project's language, framework, and relevant style conventions
- any areas the author flagged for extra attention

### Phase 1: Systematic review pass

Walk through the diff against this checklist, noting findings as you go:

- **Correctness** — does the code match the stated intent? Are edge cases (null, empty, concurrent, malformed input) handled?
- **Security** — are inputs validated and escaped? Any secrets, new permissions, or auth gaps?
- **Performance** — obvious quadratic loops, hot-path allocations, missing timeouts or retry/backoff?
- **Testing** — are unit and integration tests present, deterministic, and covering boundary cases?
- **Maintainability** — is naming clear, abstraction appropriate, duplication minimal?
- **Style and docs** — does the diff follow project linting rules? Are public APIs documented and migration notes included?

### Phase 2: Categorize and present findings

Organize findings into three groups:

- **Strengths** — what works well and should be preserved
- **Concerns** — issues that should be addressed before merge, with suggested fixes
- **Suggestions** — optional improvements for readability, performance, or long-term design

For each concern or suggestion, include the file path, a brief explanation, and a concrete fix.

#### Example finding

> **Concern — missing null check in `src/api/users.ts:42`**
>
> `getUser` can return `null` when the ID is not found, but the caller dereferences immediately.
>
> ```ts
> // before
> const user = await getUser(id);
> return user.email; // throws if user is null
>
> // after
> const user = await getUser(id);
> if (!user) {
>   throw new NotFoundError(`User ${id} not found`);
> }
> return user.email;
> ```

### Phase 3: Verdict

Close the review with one of:

- **Approve** — no blocking issues; optional suggestions only
- **Request changes** — one or more concerns must be resolved before merge
- **Comment** — informational feedback; no approval or block implied

Include a one-sentence summary of the overall assessment and any short-term vs. long-term recommendations.

## Definition of Done

A review using this skill is complete when:

- every changed file has been examined against the checklist
- findings are categorized, specific, and actionable
- at least one strength is called out alongside any concerns
- a clear verdict is stated with rationale
- the tone is constructive and teammate-first throughout
