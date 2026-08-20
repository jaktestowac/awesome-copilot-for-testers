# Heuristics Cheatsheet

Lenses for generating test ideas during a session. Name the ones a charter will use before the session starts, so the coverage is reviewable afterwards.

## SFDIPOT: what to cover

James Bach's Heuristic Test Strategy Model, product elements. Walk the seven and ask what could go wrong in each.

| Element | Ask |
| --- | --- |
| **Structure** | What is it made of? Files, modules, services, third-party components. What breaks if one is missing? |
| **Function** | What does it do? Calculations, transformations, navigation, error handling, start-up and shutdown |
| **Data** | What does it process? Input, output, stored, temporary, big, small, empty, invalid, boundary, historical, shared between users |
| **Interfaces** | How is it reached? UI, API, CLI, file import and export, other systems, message queues |
| **Platform** | What does it depend on? OS, browser, device, network, screen size, locale, timezone, permissions, external services |
| **Operations** | How is it really used? Common paths, extreme paths, disfavoured users, misuse, sequences nobody designed for |
| **Time** | What changes over time? Concurrency, ordering, timeouts, expiry, scheduling, daylight saving, race conditions, session lifetime |

Time and Operations are the two most often skipped and the two that produce the most surprising findings.

## CRUSSPIC STMPL: what "good" means

Quality criteria, for charters that go beyond "does it work".

**Operational**

- **C**apability - does it do what it claims
- **R**eliability - does it keep doing it under stress, over time, after errors
- **U**sability - can a real user accomplish the goal
- **S**calability - does it hold up as data and load grow
- **S**ecurity - does it protect what it should
- **P**erformance - is it fast enough where it matters
- **I**nstallability - can it be deployed, upgraded, and rolled back
- **C**ompatibility - does it work with the platforms and systems it claims

**Development**

- **S**upportability - can problems be diagnosed in production
- **T**estability - can it be observed and controlled
- **M**aintainability - can it be changed safely
- **P**ortability - can it move
- **L**ocalizability - does it work in other languages, currencies, and regions

Pick one or two per charter. A charter that says "explore for usability and supportability" produces different notes than "explore for capability".

## Tours

A tour is a repeatable angle of attack. Useful when a charter needs structure without becoming a script.

| Tour | What you do | Finds |
| --- | --- | --- |
| **Money** | Follow the features that make the money | Business-critical breakage |
| **Landmark** | Visit the well-known features, in an order nobody designed | Integration gaps between features |
| **Back alley** | Use the least-used features | Neglected code, stale assumptions |
| **Saboteur** | Actively try to break it: kill the network, revoke the token, fill the disk | Error handling, recovery |
| **Obsessive-compulsive** | Repeat the same action many times, submit twice, refresh mid-flow | Idempotency, double-submit, race conditions |
| **Supermodel** | Look only at the surface: layout, spacing, transitions, text | Visual and content defects |
| **Rained-out** | Start something and cancel it, everywhere | Cleanup, partial state, orphaned records |
| **Couch potato** | Accept every default, click through with minimum input | Default values, empty states |
| **Antisocial** | Enter the least likely input at every step | Validation gaps |
| **Collector's** | Try to trigger every message and error the system can produce | Unreachable and wrong error states |
| **Intellectual** | Ask the hardest question the feature can answer | Boundary of the design |
| **Garbage collector's** | Go screen by screen, exhaustively, shallowly | Coverage map of an unfamiliar area |

The back alley and rained-out tours are consistently productive and consistently skipped.

## Input heuristics

For any field or parameter:

- empty, whitespace only, single character, maximum length, maximum length plus one
- zero, negative, the smallest and largest allowed values, one beyond each
- leading and trailing whitespace, internal double spaces
- non-Latin scripts, right-to-left text, combining characters, emoji including multi-codepoint ones
- apostrophes and quotes (`O'Brien`), angle brackets, ampersands, backslashes
- strings that look like other types: `007`, `1e10`, `true`, `null`, `NaN`, `-0`, `Infinity`
- SQL-ish and template-ish strings, entered as ordinary data and observed for reflection
- very long single-word input with no spaces (layout breakage)
- pasted content carrying formatting, and content pasted from a PDF

## State and flow heuristics

- back button in the middle of a multi-step flow
- browser refresh mid-flow, and refresh after submit
- two tabs, same account, conflicting actions
- open a flow, leave it until the session expires, then continue
- start a flow, change the underlying data elsewhere, return and submit
- cancel at every step and check what was left behind
- double-click every submit button
- deep-link straight into step three without doing steps one and two
- complete a flow, then use the browser back button and submit again
- permission revoked between page load and action

## Data heuristics

- zero rows, one row, exactly the page size, page size plus one, very many
- records that sort identically, so ordering is unstable
- records with identical display names but different ids
- soft-deleted, archived, and suspended records where they appear
- a record referenced by another record, then deleted
- data created before the current schema existed
- values crossing the boundary between the free tier and the paid tier, or any other business threshold

## Oracles: how you know it is wrong

Without an oracle, exploring produces observations rather than findings. The usual sources:

| Oracle | Example |
| --- | --- |
| Specification | The acceptance criterion says the discount applies to the pre-tax total |
| Consistency within the product | The same date renders differently on two screens |
| Consistency with history | This worked in the previous release |
| Consistency with comparable products | Every other checkout lets you edit the quantity in the cart |
| Claims | Marketing, help text, tooltips, error messages |
| User expectation | A reasonable person would be surprised |
| Standards | WCAG, HTTP semantics, the platform's own guidelines |
| Purpose | It works, and it does not accomplish what the feature exists for |

When a finding has no oracle, record it as a question rather than a bug. "Is this intended?" is a legitimate session output and often the most valuable one.
