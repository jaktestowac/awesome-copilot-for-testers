# Secrets in Local Runs and CI

## Local

### The env file pattern

```
.env             # real values, gitignored, never committed
.env.example     # keys only, committed, no values
```

```bash
# .env.example
BASE_URL=http://localhost:3000
API_TOKEN=            # vault entry: "qa-api-token"
TEST_USER_PASSWORD=   # vault entry: "qa-test-user"
```

The comment naming the vault entry is what makes this usable. A key with a blank value and no pointer means a new joiner has to ask, which is a documentation defect that repeats forever.

Verify the gitignore actually covers it, including variants:

```
.env
.env.*
!.env.example
```

`.env.local` and `.env.staging` are how the pattern usually fails.

### If a secret was committed

Removing the file in a later commit does not remove it. It is in history, on every clone, and in every fork.

1. **Rotate the secret immediately.** This is the only step that actually fixes it.
2. Then optionally purge history (`git filter-repo`, BFG), coordinating with everyone who has a clone.
3. Check whether the repository is public, has forks, or is mirrored anywhere.

Rotation first. History rewriting is cleanup; rotation is the remedy.

## CI

### Secrets come from the store

```yaml
      - name: Run tests
        run: npx playwright test
        env:
          API_TOKEN: ${{ secrets.QA_API_TOKEN }}
          TEST_USER_PASSWORD: ${{ secrets.QA_TEST_USER_PASSWORD }}
```

Never a literal in the workflow file, never a committed encrypted file with the key alongside it, never fetched from a URL that itself needs no auth.

### Verify masking rather than assuming it

CI platforms mask values registered as secrets in log output. The masking fails in ways worth knowing about:

- a secret that appears **base64-encoded** or URL-encoded is not the registered string, so it prints in full
- a secret **split across lines** may not match
- a secret **embedded in JSON** that gets pretty-printed can break the match
- a secret **derived** from another value is not itself registered

Verify on a real run:

```yaml
      - name: Confirm masking
        run: |
          echo "direct: ${{ secrets.QA_API_TOKEN }}"
          echo "encoded: $(echo -n '${{ secrets.QA_API_TOKEN }}' | base64)"
```

Both lines should show `***`. The second frequently does not, which is the finding.

### Never in a URL

```ts
// Wrong: lands in access logs, referrer headers, browser history, and the Playwright trace
await page.goto(`https://app.example.com/login?token=${process.env.API_TOKEN}`);

// Right
await request.get('https://api.example.com/orders', {
  headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
});
```

A token in a query string is logged by every intermediary between the client and the server, and none of them mask it.

### Fork pull requests

The default on most platforms is that secrets are not available to workflows triggered by a fork's pull request. Keep it. A fork can propose a workflow change that prints every secret it can reach.

If forked contributions need to run tests, use a separate workflow with no secrets, or a manual approval gate before the secret-bearing job.

### Test account privileges

- least privilege the test actually needs
- separate credentials per environment, never shared with production
- one account per suite or per CI job where isolation matters, rather than one shared account that makes parallel runs conflict
- expiry where the platform supports it, so an abandoned account does not live forever

A test account with admin rights on a shared environment is a production incident waiting for a bad `beforeEach`.

### Rotation

| Secret | Owner | Rotation | Last rotated |
| --- | --- | --- | --- |
| `QA_API_TOKEN` | QA team | Quarterly | 2026-06-01 |
| `QA_TEST_USER_PASSWORD` | QA team | Quarterly | 2026-06-01 |
| `VISUAL_BASELINE_BUCKET_KEY` | Platform | Yearly | 2026-01-15 |

An unowned secret is never rotated. Naming the owner is most of the control.

## Scanning

A backstop, not the control.

```yaml
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Locally, as a pre-commit hook:

```bash
npx gitleaks protect --staged --redact
```

Scanners find known formats. A custom internal token with no recognizable shape passes straight through. Treat a clean scan as the absence of the obvious mistakes, not as proof.

## Secrets in test artifacts

The path teams miss.

| Artifact | Risk | Control |
| --- | --- | --- |
| Playwright trace | Full request and response bodies, including `Authorization` headers | Capture on failure only; short retention; treat as sensitive |
| HAR fixture | Live session tokens, if recorded from a real session | Strip auth headers and cookies before committing |
| Video | Anything visible on screen, including a token pasted into a field | Retention limit; avoid credentials in visible UI |
| CI log | `console.log` of a config object; a failed assertion printing a header | No body logging at debug level; verify masking |
| Test report HTML | Everything above, hosted somewhere | Check who can read the hosting location |
| Coverage report | Usually safe | Low risk |

### Stripping a HAR before committing

```js
// scripts/sanitize-har.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const SENSITIVE = new Set(['authorization', 'cookie', 'set-cookie', 'x-api-key']);
const har = JSON.parse(readFileSync(process.argv[2], 'utf8'));

for (const entry of har.log.entries) {
  for (const list of [entry.request.headers, entry.response.headers]) {
    for (const header of list) {
      if (SENSITIVE.has(header.name.toLowerCase())) header.value = '[REDACTED]';
    }
  }
  entry.request.cookies = [];
  entry.response.cookies = [];
}

writeFileSync(process.argv[2], JSON.stringify(har, null, 2));
```

Run it as part of the recording workflow rather than as a step someone remembers. A manual sanitization step is a sanitization step that gets skipped.

Header stripping does not cover personal data in response **bodies**. Record against synthetic data so there is nothing in the body to strip.

## Checklist

- [ ] `.env` and its variants gitignored; `.env.example` committed with vault pointers
- [ ] No secret in the repository or its history; anything ever committed has been rotated
- [ ] CI secrets come from the platform store, never from workflow literals
- [ ] Masking verified on a real run, including an encoded form
- [ ] No secret in a URL, anywhere
- [ ] Fork pull requests do not receive secrets
- [ ] Test accounts hold least privilege and are separate from production
- [ ] Every secret has an owner and a rotation schedule
- [ ] Artifacts sanitized, with retention set
- [ ] A secret scanner runs in CI as a backstop
