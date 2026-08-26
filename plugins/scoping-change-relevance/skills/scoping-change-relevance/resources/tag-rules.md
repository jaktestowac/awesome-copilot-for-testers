# Tag Rules

Two layers. **File tags** come from the path and say where the change landed. **Hunk tags** come from the added and removed lines and say what changed. Patterns are a floor, not a definition - the intent column is what you are actually matching against.

## File tags

| Tag              | Path patterns                                                                                          | Intent                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `test`           | `**/*.{test,spec}.{ts,tsx,js,jsx}`, `**/{test,tests,__tests__,spec,e2e}/**`                            | test code; never also `source`                                |
| `source`         | `**/*.{ts,tsx,js,jsx,mts,cts}` not matching `test` or `generated`                                      | production code                                               |
| `config`         | `**/*.{json,yaml,yml,toml,ini}`, `*.config.*`, `.env*`, dotfiles                                       | behaviour that changes without code changing                  |
| `secret-suspect` | `.env*`, `**/*.pem`, `**/*.key`, `**/secrets/**`, `**/credentials*`                                    | credential-shaped file                                        |
| `infra`          | `Dockerfile*`, `docker-compose*`, `**/{k8s,helm,terraform,infra,deploy}/**`, `.github/workflows/**`    | runtime or pipeline definition                                |
| `public-api`     | `**/{api,routes,controllers,handlers,endpoints,pages/api,app/api}/**`, `**/trpc/**`                    | externally reachable surface                                  |
| `schema`         | `openapi*.{yaml,yml,json}`, `swagger*`, `**/*.proto`, `**/*.graphql`, `**/schema.prisma`, `**/*.sql`   | a published contract others depend on                         |
| `auth`           | `**/{auth,authn,authz,security,permissions,acl,iam,session,rbac}/**`, `**/middleware/auth*`            | who can do what                                               |
| `critical-path`  | `**/{payment,payments,billing,checkout,order,orders,invoice,pricing,subscription}/**`                  | money, or the flow that earns it - tune this list per project |
| `db-migration`   | `**/{migrations,migrate}/**`, `**/*.migration.*`, Prisma/Drizzle/Knex migration dirs                   | irreversible data change                                      |
| `ai`             | `**/prompts/**`, `**/*.prompt.*`, `**/evals/**`, `**/*.eval.*`, `**/{agents,chains}/**`                | LLM behaviour                                                 |
| `generated`      | `**/dist/**`, `**/build/**`, `**/*.generated.*`, `**/__snapshots__/**`, `*.lock`, `**/node_modules/**` | not hand-written; excluded from hunk tagging                  |
| `docs`           | `**/*.md`, `docs/**`                                                                                   | prose, unless prose is the deliverable                        |

Rules:

- A path may carry several tags. `src/api/payments/refund.ts` is `source` + `public-api` + `critical-path`.
- `test` beats `source`: a path that matches both is a test.
- `generated` suppresses hunk tagging but not file tagging - a lockfile change is still `added-dependency`.
- **Tune `critical-path` per project.** The default list is e-commerce-shaped. In a healthcare product the critical path is patient records; in a logistics product it is dispatch. Set it in the contract, not in the reviewer's head.
- **Monorepos:** a change to `packages/shared/**` carries the tags of its consumers too. Resolve importers before tagging.

## Hunk tags - additions

Read the `+` lines. Patterns are illustrative; the intent is what matters.

| Tag                       | Looks like                                                                                                                                                                  | Intent                                           |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `new-public-export`       | `+ export function\|class\|const\|interface\|type\|default`, a new entry in an `index.ts` barrel, a new field on an exported type                                           | new capability others can now call               |
| `new-endpoint`            | `+ app.get/post/put/patch/delete(`, `+ router.*(`, `+ export async function GET/POST` (Next route handlers), `+ .procedure.mutation(` (tRPC), `+ @Get()/@Post()` decorators | new externally reachable operation               |
| `modified-auth`           | `+` lines mentioning `token`, `jwt`, `session`, `role`, `permission`, `scope`, `hash`, `password`, `bcrypt`, `cookie`, `sameSite`, `cors`                                   | changed access control                           |
| `secret-like-string`      | `+ apiKey\|secret\|token\|password = "…"` with an 8+ char literal, base64-looking blobs, `sk-`/`ghp_`/`AKIA` prefixes                                                       | possible committed credential - always escalate  |
| `sql-string`              | `+` with `SELECT/INSERT/UPDATE/DELETE … FROM`, template literals interpolating into SQL, `db.$queryRaw`                                                                     | query surface, injection risk                    |
| `exec-call`               | `+ eval(`, `new Function(`, `child_process.exec`, `execSync`, `spawn`, dynamic `import(` of a variable                                                                      | code execution surface                           |
| `db-migration`            | `+ CREATE/ALTER/DROP TABLE\|INDEX\|COLUMN`, a new migration file, a changed Prisma/Drizzle model                                                                            | schema and data change, usually irreversible     |
| `modified-error-handling` | `+ try`, `catch`, `throw`, `.catch(`, `Result`/`Either` handling, changed error codes                                                                                       | changed failure behaviour                        |
| `modified-request-schema` | `+ z.object`, `valibot`, `yup`, `joi`, `class-validator` decorators, changed DTO or type used at a boundary                                                                 | changed input or output contract                 |
| `added-dependency`        | `+` inside `dependencies`/`devDependencies`, new entries in the lockfile, a new `import` from a package not previously used                                                 | new third-party code in the build                |
| `modified-prompt`         | `+` in a prompt file or template literal, changed model id, changed temperature or tool list, changed retrieval config                                                      | changed LLM behaviour                            |
| `new-external-call`       | `+ fetch(`, `axios.`, a new SDK client construction, a new webhook target                                                                                                   | new network dependency and failure mode          |
| `new-feature-flag`        | `+ flags.`, `isEnabled(`, a new toggle key                                                                                                                                  | behaviour that differs per environment or cohort |

## Hunk tags - removals

The tags most reviews miss. Read the `-` lines.

| Tag                  | Looks like                                                                                                   | Why it is risk                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| `removed-test`       | a deleted `*.test.ts`, deleted `it(`/`test(` blocks, a test converted to `.skip`                             | coverage removed; require the replacement or a reason |
| `removed-validation` | deleted schema fields, deleted `if (!x) throw`, a relaxed regex, a removed `required`                        | inputs previously rejected are now accepted           |
| `loosened-type`      | `any`, `unknown` cast onward, a new `@ts-expect-error`, a non-null `!`, `strict` turned off, a widened union | the compiler stopped checking something               |
| `removed-guard`      | a deleted auth check, a deleted rate limit, a deleted feature flag gate, a removed `CSRF`/`CORS` restriction | a control disappeared                                 |
| `disabled-check`     | `eslint-disable`, `continue-on-error: true` added, a threshold lowered, `retries` raised                     | a gate stopped gating                                 |

`disabled-check` deserves special handling: it is a change to the _quality system itself_, so it belongs in the waiver conversation (`governing-quality-waivers`), not just the test scope.

## Precision notes

- **Match added lines only** for addition tags. A pattern in an unchanged context line is noise.
- **Skip non-source content** for hunk tagging: markdown, patches, fixtures, snapshots and generated clients regularly contain code-shaped text. Prompt files are the exception - they are content _and_ behaviour, so they get `modified-prompt`.
- **Comments count for nothing.** A `// TODO: add auth` line is not `modified-auth`.
- **Test files still get hunk tags.** `removed-test` and `disabled-check` are found there, and a test that starts calling a real network is `new-external-call`.
- **Prefer over-tagging.** A false positive costs one check run; a false negative ships the defect.

## Escalation set

Any of these makes the change high-risk regardless of diff size. A two-line diff with `modified-auth` outranks a 900-line rename:

`modified-auth` · `secret-like-string` · `sql-string` · `exec-call` · `db-migration` · `removed-guard` · `removed-validation` · `disabled-check` · `new-endpoint` on `critical-path`
