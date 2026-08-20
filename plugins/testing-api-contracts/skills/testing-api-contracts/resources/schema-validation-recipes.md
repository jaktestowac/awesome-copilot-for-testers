# Schema Validation Recipes

Attach a validator to requests the suite already makes. The goal is that no response leaves a test unvalidated.

## Playwright matcher over an OpenAPI document

One matcher, used by every API test.

```ts
// test/fixtures/schema-matcher.ts
import { expect as baseExpect } from '@playwright/test';
import Ajv, { type ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import type { APIResponse } from '@playwright/test';
import spec from '../../openapi.json';

const ajv = new Ajv({ strict: false, allErrors: true, allowUnionTypes: true });
addFormats(ajv);
ajv.addSchema(spec, 'openapi');

const cache = new Map<string, ValidateFunction>();

function validatorFor(path: string, method: string, status: number): ValidateFunction {
  const key = `${method} ${path} ${status}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const ref = `openapi#/paths/${path.replace(/\//g, '~1')}/${method.toLowerCase()}/responses/${status}/content/application~1json/schema`;
  const validate = ajv.getSchema(ref);
  if (!validate) throw new Error(`No schema in the spec for ${key}. Either the spec is incomplete or the path template is wrong.`);

  cache.set(key, validate);
  return validate;
}

export const expect = baseExpect.extend({
  async toMatchContract(response: APIResponse, pathTemplate: string, method: string) {
    const body = await response.json();
    const validate = validatorFor(pathTemplate, method, response.status());
    const valid = validate(body);

    return {
      pass: valid,
      message: () =>
        valid
          ? `Expected ${method} ${pathTemplate} not to match its ${response.status()} schema`
          : `Contract mismatch for ${method} ${pathTemplate} -> ${response.status()}\n` +
            (validate.errors ?? [])
              .map((e) => `  ${e.instancePath || '/'}: ${e.message} (got ${JSON.stringify(e.data)})`)
              .join('\n'),
    };
  },
});
```

Usage:

```ts
import { expect } from '../fixtures/schema-matcher';

test('product list matches its contract', async ({ request }) => {
  const response = await request.get('/api/products?page=1');
  await expect(response).toMatchContract('/api/products', 'GET');
});
```

The error message carries the JSON path, the reason, and the offending value. Anything less makes the failure a scavenger hunt.

## Validate error responses too

```ts
test('404 body matches its contract', async ({ request }) => {
  const response = await request.get('/api/products/does-not-exist');
  expect(response.status()).toBe(404);
  await expect(response).toMatchContract('/api/products/{id}', 'GET');
});
```

Error shapes drift more than success shapes because fewer people look at them.

## Strictness

By default, JSON Schema ignores properties it does not know about. That makes an undocumented field invisible.

```ts
const ajv = new Ajv({ strict: false, allErrors: true, removeAdditional: false });
```

To surface undocumented fields without failing on every one, compare key sets explicitly:

```ts
function undocumentedFields(body: Record<string, unknown>, schema: { properties?: object }): string[] {
  const documented = new Set(Object.keys(schema.properties ?? {}));
  return Object.keys(body).filter((k) => !documented.has(k));
}
```

Report the result. An undocumented field is either a spec gap or an accidental data leak, and the second one matters.

## zod, when the client already has types

If the consumer validates with zod at runtime, reuse the same schemas in tests. One definition, two uses.

```ts
// src/api/schemas.ts
import { z } from 'zod';

export const Product = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  price: z.number().int().nonnegative(),
  category: z.enum(['books', 'electronics', 'other']),
  discontinuedAt: z.string().datetime().nullable(),
});

export const ProductList = z.object({
  items: z.array(Product),
  total: z.number().int().nonnegative(),
  nextCursor: z.string().nullable(),
});
```

```ts
test('product list parses', async ({ request }) => {
  const response = await request.get('/api/products');
  const parsed = ProductList.safeParse(await response.json());

  expect(parsed.success, parsed.success ? '' : JSON.stringify(parsed.error.issues, null, 2)).toBe(true);
});
```

Use `.strict()` on the object when undocumented fields should fail:

```ts
export const Product = z.object({ /* ... */ }).strict();
```

Caveat: zod schemas hand-written by the consumer are the consumer's belief about the contract, not the contract. They catch consumer-side drift, not provider-side spec violations. For provider testing, validate against the published spec.

## openapi-response-validator, for a quick provider check

```ts
import OpenAPIResponseValidator from 'openapi-response-validator';
import spec from '../openapi.json';

const validator = new OpenAPIResponseValidator({
  responses: spec.paths['/api/products'].get.responses,
  components: spec.components,
});

const error = validator.validateResponse(200, await response.json());
expect(error, JSON.stringify(error, null, 2)).toBeUndefined();
```

Less flexible than the ajv matcher, quicker to stand up.

## Validating fixtures against the same schema

The drift guard for mocks. Run it separately from the API suite so a stale fixture is reported as a test-suite defect, not an API defect.

```ts
import { readdirSync, readFileSync } from 'node:fs';

describe('mock fixtures still match the published contract', () => {
  const files = readdirSync('test/mocks/fixtures').filter((f) => f.endsWith('.json'));

  test.each(files)('%s', (file) => {
    const { endpoint, method, status, body } = JSON.parse(readFileSync(`test/mocks/fixtures/${file}`, 'utf8'));
    const validate = validatorFor(endpoint, method, status);

    expect(validate(body), JSON.stringify(validate.errors, null, 2)).toBe(true);
  });
});
```

Name each fixture file with its endpoint so a failure points at the file to refresh.

## Diffing two spec versions

```bash
# Classify changes between the deployed spec and the branch spec
npx oasdiff breaking https://api.example.com/openapi.json ./openapi.json

# Full changelog, not just breaking items
npx oasdiff changelog https://api.example.com/openapi.json ./openapi.json
```

Run it in CI on any pull request that touches the spec, and treat a non-empty breaking list as a required review rather than a hard failure. The classification still needs a human to confirm which consumers are affected.

## GraphQL

```bash
npx graphql-inspector diff schema.prev.graphql schema.graphql
```

Same rule: `BREAKING`, `DANGEROUS`, and `NON_BREAKING` map onto the breaking, risky, and safe classes in `breaking-change-checklist.md`.
