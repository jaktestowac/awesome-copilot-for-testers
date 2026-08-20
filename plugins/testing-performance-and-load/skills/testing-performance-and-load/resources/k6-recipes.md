# k6 Recipes

Scripts for each test shape. An Artillery equivalent is at the end.

## Load test: steady state at expected peak

```js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate } from 'k6/metrics';
import { randomIntBetween, randomItem } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const checkoutCompleted = new Counter('checkout_completed');
const checkoutSuccess = new Rate('checkout_success_rate');

// Hot set: 5% of products take 60% of traffic. Uniform random ids give a cache
// hit rate nothing like production.
const hotProducts = JSON.parse(open('./data/hot-products.json'));
const coldProducts = JSON.parse(open('./data/cold-products.json'));

export const options = {
  scenarios: {
    browse: { executor: 'ramping-vus', exec: 'browse', startVUs: 0,
      stages: [{ duration: '5m', target: 840 }, { duration: '20m', target: 840 }, { duration: '2m', target: 0 }] },
    shop: { executor: 'ramping-vus', exec: 'shop', startVUs: 0,
      stages: [{ duration: '5m', target: 300 }, { duration: '20m', target: 300 }, { duration: '2m', target: 0 }] },
    buy: { executor: 'ramping-vus', exec: 'buy', startVUs: 0,
      stages: [{ duration: '5m', target: 60 }, { duration: '20m', target: 60 }, { duration: '2m', target: 0 }] },
  },
  thresholds: {
    'http_req_duration{name:products}': ['p(95)<300'],
    'http_req_duration{name:checkout}': ['p(95)<800', 'p(99)<2000'],
    'http_req_failed': ['rate<0.001'],
    'checkout_completed': ['count>100'],
    'checkout_success_rate': ['rate>0.99'],
  },
  // Exclude the ramp from the reported percentiles
  thresholdsAbortOnFail: false,
};

function pickProduct() {
  return Math.random() < 0.6 ? randomItem(hotProducts) : randomItem(coldProducts);
}

export function browse() {
  http.get(`${__ENV.BASE_URL}/api/products`, { tags: { name: 'products' } });
  sleep(randomIntBetween(3, 12));

  http.get(`${__ENV.BASE_URL}/api/products/${pickProduct()}`, { tags: { name: 'product' } });
  sleep(randomIntBetween(3, 12));
}

export function shop() {
  http.get(`${__ENV.BASE_URL}/api/search?q=${randomItem(['laptop', 'desk', 'lamp'])}`, { tags: { name: 'search' } });
  sleep(randomIntBetween(2, 8));

  const id = pickProduct();
  http.get(`${__ENV.BASE_URL}/api/products/${id}`, { tags: { name: 'product' } });
  sleep(randomIntBetween(1, 4));

  http.post(`${__ENV.BASE_URL}/api/cart/items`, JSON.stringify({ productId: id, qty: 1 }),
    { headers: { 'Content-Type': 'application/json' }, tags: { name: 'cart-add' } });
  sleep(randomIntBetween(3, 10));
}

export function buy() {
  shop();

  const res = http.post(`${__ENV.BASE_URL}/api/checkout`, JSON.stringify({ paymentMethod: 'card' }),
    { headers: { 'Content-Type': 'application/json' }, tags: { name: 'checkout' } });

  const ok = check(res, {
    'checkout returns 201': (r) => r.status === 201,
    'checkout returns an order id': (r) => r.json('orderId') !== undefined,
  });

  checkoutCompleted.add(ok ? 1 : 0);
  checkoutSuccess.add(ok);
  sleep(randomIntBetween(20, 90));
}
```

Three things this does that a naive script does not: weighted product selection, distributed think time, and a business-outcome counter that fails the run if no order was ever created.

## Stress test: find the breaking point

```js
export const options = {
  scenarios: {
    ramp: {
      executor: 'ramping-arrival-rate',
      startRate: 20, timeUnit: '1s',
      preAllocatedVUs: 500, maxVUs: 5000,
      stages: [
        { duration: '3m', target: 100 },
        { duration: '3m', target: 200 },
        { duration: '3m', target: 400 },
        { duration: '3m', target: 800 },
        { duration: '3m', target: 1600 },
      ],
    },
  },
  // No thresholds: the point is to observe failure, not to pass
};
```

Use `ramping-arrival-rate`, not `ramping-vus`. Arrival rate keeps pushing requests as the system slows; VUs back off when responses take longer, which hides the knee you are looking for.

## Spike test

```js
export const options = {
  scenarios: {
    spike: {
      executor: 'ramping-arrival-rate',
      startRate: 50, timeUnit: '1s',
      preAllocatedVUs: 200, maxVUs: 4000,
      stages: [
        { duration: '3m', target: 50 },    // baseline
        { duration: '30s', target: 800 },  // the campaign email lands
        { duration: '5m', target: 800 },
        { duration: '2m', target: 50 },    // recovery
        { duration: '5m', target: 50 },    // does it actually recover
      ],
    },
  },
};
```

The final baseline stage is the important one. Plenty of systems survive the spike and never return to their previous latency, which only the recovery window shows.

## Soak test

```js
export const options = {
  scenarios: {
    soak: {
      executor: 'constant-vus',
      vus: 300,
      duration: '8h',
    },
  },
  thresholds: {
    'http_req_duration': ['p(95)<500'],
    'http_req_failed': ['rate<0.001'],
  },
};
```

Watch for **drift**: response time or memory climbing steadily over hours. That is a leak or unbounded growth, and it is invisible in a 20-minute run.

Record server-side memory, connection counts, and file descriptors throughout. The client-side numbers show the symptom hours after the cause starts.

## Warmup, excluded from results

```js
export const options = {
  scenarios: {
    warmup: { executor: 'constant-vus', vus: 20, duration: '5m', tags: { phase: 'warmup' } },
    measure: { executor: 'constant-vus', vus: 800, duration: '20m',
      startTime: '5m', tags: { phase: 'measure' } },
  },
  thresholds: {
    // Only the measure phase counts
    'http_req_duration{phase:measure}': ['p(95)<800'],
  },
};
```

Without this, cold-start and JIT latency lands in the percentiles and makes every run look worse than the system is.

## CI regression check

Short, modest load, generous thresholds. Its job is catching a 10x regression, not measuring capacity.

```js
import http from 'k6/http';
import { sleep } from 'k6';

const baseline = JSON.parse(open('./perf-baseline.json'));

export const options = {
  vus: 20,
  duration: '2m',
  thresholds: {
    'http_req_duration{name:checkout}': [`p(95)<${baseline.checkout.p95 * 1.3}`],
    'http_req_duration{name:products}': [`p(95)<${baseline.products.p95 * 1.3}`],
    'http_req_failed': ['rate<0.01'],
  },
};
```

```yaml
      - name: Performance regression check
        run: k6 run --summary-export=summary.json tests/perf/ci-check.js
        env:
          BASE_URL: ${{ env.STAGING_URL }}

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: perf-summary
          path: summary.json
```

Keep `perf-baseline.json` committed and update it deliberately in its own pull request. A rolling baseline absorbs a 5 percent regression every release and shows green the whole way down.

## Reading the output

```
http_req_duration..........: avg=182ms min=41ms med=156ms max=4.2s p(90)=298ms p(95)=412ms
http_req_failed............: 0.04% ✓ 12  ✗ 29988
checkout_completed.........: 1240
iterations.................: 30000  62.4/s
vus........................: 800
```

- **Ignore `avg`.** The 4.2s max next to a 156ms median says the tail is doing something the mean cannot show.
- **`http_req_failed` counts non-2xx**, not slow-but-successful. Both matter.
- **`iterations/s`** is the achieved throughput. If it is well below the target arrival rate, the system is the limit, not the script.
- **Check `dropped_iterations`** in arrival-rate scenarios. A non-zero value means the load generator could not keep up, and the result understates the load applied.

## Artillery equivalent

```yaml
config:
  target: "{{ $processEnvironment.BASE_URL }}"
  phases:
    - duration: 300, arrivalRate: 5, name: warmup
    - duration: 1200, arrivalRate: 60, name: peak
  ensure:
    thresholds:
      - "http.response_time.p95": 800
      - "vusers.failed": 0
scenarios:
  - name: browse
    weight: 70
    flow:
      - get: { url: "/api/products" }
      - think: 8
      - get: { url: "/api/products/{{ productId }}" }
  - name: buy
    weight: 5
    flow:
      - post:
          url: "/api/checkout"
          json: { paymentMethod: "card" }
          capture: { json: "$.orderId", as: "orderId" }
          expect: [{ statusCode: 201 }]
```

Artillery is quicker to stand up for simple HTTP scenarios. k6 gives finer control over arrival rate, custom metrics, and threshold expressions, which matters once the workload model has any shape to it.
