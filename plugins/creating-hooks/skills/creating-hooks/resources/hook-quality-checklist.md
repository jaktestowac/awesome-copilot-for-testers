# Hook Quality Checklist

Use this checklist before finalizing a GitHub Copilot hook pack.

## Fit and scope

- [ ] A hook is the right primitive for this need.
- [ ] The chosen lifecycle event matches the behavior.
- [ ] The policy is narrow enough to avoid surprising users.

## Operational quality

- [ ] The hook is fast enough for the event it runs on.
- [ ] The scripts fail safely when input is missing or malformed.
- [ ] Denial or warning messages tell the user what happened and what to do next.
- [ ] Cross-platform support is documented or intentionally out of scope.

## Pack completeness

- [ ] `hooks.json` is present and matches the documented behavior.
- [ ] Supporting scripts are named consistently with the configuration.
- [ ] A README or equivalent documentation explains installation, purpose, and limitations.

## Safety review

- [ ] The hook defaults are conservative.
- [ ] Blocking behavior is justified by stable policy, not preference alone.
- [ ] The hook does not silently mutate behavior without documentation.

## Smells that should trigger a rewrite

- broad deny logic with vague error messages
- long-running scripts on frequently triggered lifecycle events
- platform-specific commands with no adaptation guidance
- undocumented prerequisites or side effects
