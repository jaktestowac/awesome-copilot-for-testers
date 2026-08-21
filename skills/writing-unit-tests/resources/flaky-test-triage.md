# Flaky and Slow Test Triage

A test that fails sometimes is not a minor annoyance - it is a defect in the feedback system. Once a suite is known to
lie occasionally, every red build becomes a judgement call, and the first response to a real failure becomes "re-run it".

This is the procedure for an existing test that is unreliable or slow. For preventing it in new tests, see the
determinism phase in `SKILL.md`.

## 1. Reproduce the flake before touching anything

Never "fix" a flake you have not seen fail. Each command below isolates a different cause - run the ones that apply
and keep the output.

| Run                                                                                              | Reveals                                                                      |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| The single test, repeated many times (`--repeat`, a loop, or the runner's retry-until-fail flag) | Nondeterminism inside the test itself: time, randomness, unawaited async     |
| The single test alone, isolated from its file and suite                                          | Dependence on state another test creates                                     |
| The suite in random or reversed order                                                            | Order dependence and shared mutable state                                    |
| The suite with parallelism on, and again with workers set to 1                                   | Races over shared resources: files, ports, fixtures, module-level state      |
| The suite on a loaded machine, or with the CPU throttled                                         | Real timing assumptions hiding behind fast local runs                        |
| The suite in CI only                                                                             | Environment coupling: timezone, locale, env vars, missing config, slower I/O |

If it will not reproduce, do not close it. Add the diagnostic that will catch it next time - log the seed, the ordering,
the timestamps, the environment - and say the cause is still unknown.

## 2. Classify the cause

| Symptom                                                   | Usual cause                                                            | Fix                                                                                           |
| --------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Fails only when the whole file runs                       | Shared mutable state or leaked setup                                   | Rebuild state per test; move setup into the test or a fresh factory                           |
| Fails only in random order                                | One test depends on data another created                               | Give each test its own data; no cross-test fixtures                                           |
| Fails only in parallel                                    | Contention over a real resource - file, port, DB row, module singleton | Isolate per worker, or replace the resource with an in-memory fake                            |
| Fails near midnight, month end, or in another timezone    | Real clock, real locale                                                | Inject or freeze the clock; pin the timezone; assert structured values, not formatted strings |
| Fails under load, passes locally                          | A real delay or an implicit wait                                       | Fake timers; wait on a deterministic signal, never on a duration                              |
| Passes but sometimes reports a different error afterwards | Unawaited promise leaking into the next test                           | Await or return every promise; fail the run on unhandled rejections                           |
| Flakes with generated IDs, hashes, or ordering of a set   | Nondeterministic output asserted as if ordered                         | Seed the generator; assert on sets rather than sequences                                      |
| Fails the first time on a clean machine only              | Hidden dependency on cached or seeded data                             | Make the test create everything it needs                                                      |

## 3. Retries and quarantine are containment, not fixes

- **Retries hide the signal.** A globally retried suite reports green while the underlying race stays in the product.
  If retries exist, treat every retried test as an open defect, not a passing test.
- **Quarantine with an expiry.** If a flake must be skipped to unblock delivery, the skip carries an issue link and an
  owner. A `skip` with no link is silent coverage loss that nobody will ever remove.
- **Never delete a flaky test to make the build green.** Deleting it removes the only evidence that the behavior was
  ever verified. Either fix it, or quarantine it visibly.

## 4. Prove the fix

A flake is fixed when the run that used to fail now passes repeatedly, not when it passes once.

- keep the failing output from step 1
- run the previously failing configuration many times consecutively - the same repeat, order, or parallelism that broke it
- quote both: the failure before and the repeated green after
- remove the retry or quarantine that was masking it, in the same change

## Slow tests

Slowness is usually the same problem wearing a different coat: a unit test that touches something real.

| Signal                                               | What it means                                                        |
| ---------------------------------------------------- | -------------------------------------------------------------------- |
| A unit test takes hundreds of milliseconds           | It is doing real I/O, real waiting, or building far too much fixture |
| `beforeAll` seeds a database or builds a large graph | The tests are integration tests filed in the unit folder             |
| The suite got slower steadily over months            | Setup accreted; nobody owns the runtime budget                       |
| One test dominates the runtime                       | It is probably waiting on a duration rather than a signal            |

Fix the cause rather than raising the timeout: replace real waits with fake timers, replace real resources with
in-memory fakes, build fixtures per test with a factory, and move anything that genuinely needs a boundary to
integration coverage where its cost is expected.

State the runtime before and after. "Faster" is not a measurement.
