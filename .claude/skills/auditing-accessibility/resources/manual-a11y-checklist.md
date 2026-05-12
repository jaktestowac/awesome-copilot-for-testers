# Manual Accessibility Checklist

Use this checklist for triage, retest, or when automated tools cannot confirm a finding.

## Structure and semantics

- [ ] Page has a meaningful title
- [ ] One clear main heading exists
- [ ] Landmarks such as header, nav, main, and footer are present where appropriate
- [ ] Interactive elements have accessible names
- [ ] Form inputs have labels or equivalent accessible names

## Keyboard and focus

- [ ] Every interactive element is reachable by keyboard
- [ ] Focus order follows the visual and logical flow
- [ ] Focus is clearly visible
- [ ] No keyboard trap appears in dialogs, menus, or widgets
- [ ] Escape or equivalent closes dismissible overlays when expected

## Forms and feedback

- [ ] Required fields are identified clearly
- [ ] Error messages are visible and understandable
- [ ] Error state is announced or associated programmatically
- [ ] Success and status messages are discoverable

## Visual accessibility

- [ ] Text remains usable at zoom
- [ ] No critical content disappears at 200% to 400% zoom
- [ ] Contrast looks sufficient for text, icons, and focus rings
- [ ] Meaning is not conveyed by color alone
- [ ] Motion does not block use or overwhelm the interface

## WCAG 2.2 spot checks

- [ ] Focus is not hidden behind sticky UI
- [ ] Touch targets look large enough to use comfortably
- [ ] Dragging interactions have an easier alternative when needed
- [ ] Authentication does not rely on memory puzzles or complex cognitive steps

## Retest notes

- [ ] Findings verified after the fix
- [ ] Residual risk documented
- [ ] Anything still requiring assistive-technology testing is listed explicitly
