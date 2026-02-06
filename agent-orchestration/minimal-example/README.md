# Minimal Agent Orchestration Example

A lightweight, production-ready example of multi-agent coordination with 1 orchestrator and 3 specialized subagents:

- **Orchestrator**: Drives workflow, delegates tasks, synthesizes findings with explicit user approval gates
- **Planner**: Breaks goals into phased implementations with test strategies and risk mitigation
- **Explorer**: Maps codebase structure, discovers patterns, finds entry points and dependencies
- **Analyst**: Identifies architectural patterns, assesses technical debt, surfaces opportunities and risks

This pattern is designed for complex analysis, planning, and documentation workflows where you need clear delegation, research, and synthesis across multiple specialized agents.

## When to Use This Pattern

- **Complex analysis**: Understanding large codebases, identifying patterns and risks
- **Planning**: Breaking tasks into phased, incremental delivery
- **Architecture decisions**: Evaluating trade-offs and NFRs (non-functional requirements)
- **Tech debt assessments**: Identifying opportunities and risks
- **Documentation**: Producing clear, actionable analysis and recommendations

## Architecture Overview

```
┌─────────────────────┐
│  ORCHESTRATOR       │  Main conductor: intake → delegate → synthesize → decide
│  (Orchestrates)     │
└──────────┬──────────┘
           │
    ┌──────┴──────┬─────────────┐
    │             │             │
    ▼             ▼             ▼
┌─────────┐ ┌──────────┐ ┌─────────┐
│ PLANNER │ │ EXPLORER │ │ ANALYST │
│  Phase  │ │   Find   │ │ Pattern │
│ Planning│ │   Files  │ │ Analysis│
└─────────┘ └──────────┘ └─────────┘
```

## Agents at a Glance

### 🎯 Orchestrator
**Role**: Main conductor that drives the workflow

**Responsibilities**:
- Clarify objectives and constraints
- Invoke subagents in the right sequence (often in parallel)
- Synthesize findings from multiple subagents
- Maintain explicit stop gates for user approval
- Decide on next steps based on findings

**When to invoke**: Always the entry point
```
@Orchestrator Analyze this codebase for tech debt and modernization opportunities
```

### 📋 Planner
**Role**: Research-driven planning specialist

**Responsibilities**:
- Break tasks into phased, incremental approaches
- Identify dependencies and constraints early
- Research codebase patterns and conventions
- Propose test strategies and success criteria
- Surface risks and unknowns explicitly

**When to invoke**: When you need a structured plan
```
@Planner Plan a phased implementation for: Add caching layer to API responses
```

### 🔍 Explorer
**Role**: Read-only codebase scout (fast pattern discovery)

**Responsibilities**:
- Map file structure and entry points
- Identify architectural patterns and conventions
- Locate component usage and dependencies
- Discover naming conventions and cross-cutting concerns
- Use parallel searches for efficiency

**When to invoke**: When you need to understand codebase structure
```
@Explorer Find all places where user authentication is checked
```

### 🔬 Analyst
**Role**: Pattern analysis and risk assessment specialist

**Responsibilities**:
- Recognize architectural patterns and anti-patterns
- Assess technical debt and scalability concerns
- Identify opportunities for improvement
- Evaluate security patterns
- Produce actionable risk assessments

**When to invoke**: When you need deep analysis of patterns and risks
```
@Analyst Analyze error handling patterns and identify gaps
```

## Typical Workflows

### Workflow 1: Understand & Analyze a Codebase

```
1. @Orchestrator Analyze this codebase for tech debt, security concerns, and modernization opportunities.
   → Orchestrator clarifies scope
   → [STOP GATE] User confirms scope

2. [Orchestrator invokes in parallel]
   ├─ Explorer: Map file structure and entry points
   └─ Analyst: Identify patterns, technical debt, risks

3. [STOP GATE] Review findings with user
   → User reviews key patterns and risks

4. Orchestrator: Synthesize findings and present recommendations
```

### Workflow 2: Plan a Feature or Refactoring

```
1. @Orchestrator Plan implementing: Add real-time notifications to the API.
   Constraints: Backward compatible, no database changes.
   → Orchestrator clarifies scope and constraints

2. @Planner Plan a phased implementation of: Add real-time notifications
   Context: [from Orchestrator]
   → Planner researches codebase
   → Invokes Explorer for file discovery
   → Invokes Analyst for architectural assessment
   → Produces detailed phased plan with test strategy

3. [Plan hand-off to Orchestrator]
   → Orchestrator reviews plan
   → [STOP GATE] Presents to user for approval
```

### Workflow 3: Deep Analysis of Specific Topic

```
1. @Orchestrator Assess the security posture of our authentication system.

2. [Orchestrator]
   → Classifies as "security analysis"
   → Invokes Explorer: "Map all authentication-related files"
   → Invokes Analyst: "Assess security patterns and vulnerabilities"
   → Collects findings

3. [Orchestrator synthesizes]
   → Groups findings: patterns, risks, opportunities
   → Proposes mitigations
   → [STOP GATE] Presents to user
```

## Key Principles

### 1. Delegation is Cheap, Context is Expensive
- Delegate file exploration to **Explorer**
- Delegate deep research to **Analyst** or **Planner**
- Keep your (Orchestrator) context for orchestration and synthesis

### 2. Parallel Execution Saves Time
- Invoke multiple subagents simultaneously
- Collect all results before synthesizing
- Example: `Invoke Explorer AND Analyst in parallel for independent research`

### 3. Stop Gates Keep User in Control
- Never make major decisions without explicit approval
- Use `[STOP GATE]` to pause and wait for user input
- Transparent about what was delegated and why

### 4. Ground Everything in Code
- All findings must cite actual file paths
- No speculation – use patterns found in the codebase
- If uncertain, surface unknowns explicitly

### 5. Output Contracts Enable Quality
- Use structured output sections (`<analysis>`, `<results>`, etc.)
- Follow quality bars for each agent type
- Make synthesis easier by enforcing consistent structure

## Subagent Invocation Guide

### When calling Planner
```
@Planner Plan a phased implementation for: <specific task>
Context: <relevant constraints or requirements>

The codebase uses: [tech stack], organized as: [structure]
```

### When calling Explorer
```
@Explorer Find all files related to: <specific topic>
Goal: <what you need to understand>

Focus on: [file naming patterns, entry points, test files]
```

### When calling Analyst
```
@Analyst Analyze: <specific pattern or concern>
Focus areas: [what to prioritize]

Consider: [constraints, trade-offs, quality aspects]
```

## Output Examples

### From Explorer
```
<results>
  <files>
    - /src/auth/AuthService.ts: Core auth logic
    - /src/auth/__tests__/AuthService.test.ts: Test fixtures
  </files>
  <answer>
    - **Architecture:** Service layer with DI
    - **Conventions:** Service.ts, .service.ts suffix
    - **Entry point:** /src/index.ts initializes auth
  </answer>
  <next_steps>
    - Analyst should review test coverage
    - Check for auth bypass vulnerabilities
  </next_steps>
</results>
```

### From Analyst
```
# Analysis: Error Handling Patterns

## Key Findings
- **Pattern**: Custom error classes in /src/errors/
- **Coverage**: 80% of services use custom errors
- **Gap**: Async error handling inconsistent

## Risk Assessment
- **Risk**: Unhandled promise rejections → (Impact: High) (Effort: Medium)
  - Evidence: /src/services/*.ts missing try-catch in async handlers
  - Mitigation: Add error wrapper middleware

## Recommendations
1. Standardize async error handling pattern
2. Add Promise.prototype.catch guard
3. Review all async middleware for error cases
```

### From Planner
```
# Phased Implementation Plan: Add Real-Time Notifications

## Overview
Implement server-sent events (SSE) for real-time updates to clients.

## Constraints & Assumptions
- Backward compatible REST API
- No database schema changes
- Existing auth reused for SSE connections

## Phase 1: Infrastructure Setup
**Objective:** Add SSE endpoint and basic event system
**Scope:** /src/events/EventBus.ts (new), /src/routes/events.ts (new)
**Tests First:** 
  - EventBus emits events to listeners
  - SSE endpoint accepts connections
**Success Criteria:** SSE endpoint responds to clients on `/api/events`

## Phase 2: Integration
**Objective:** Wire events from services to SSE clients
...
```

## Best Practices

### Do's ✅
- Start with Orchestrator for complex tasks
- Invoke subagents in parallel whenever possible
- Use stop gates to keep user in control
- Cite specific file paths in all findings
- Synthesize subagent findings before deciding
- Be explicit about assumptions and unknowns

### Don'ts ❌
- Don't read files yourself if Explorer can find them faster
- Don't skip stop gates to "save time"
- Don't speculate without code evidence
- Don't parallelize tasks that depend on each other sequentially
- Don't mix research and implementation in a single phase
- Don't hand off without clear output contracts

## Context Conservation Tips

| Task | Use This Agent | Why |
|------|---|---|
| Find all route files | Explorer | Read-only, breadth-first search |
| Understand service architecture | Analyst | Deep pattern analysis |
| Plan a feature with testing | Planner | Synthesizes requirements into phases |
| Review findings & decide | Orchestrator | You focus on synthesis, not search |

## Customization Ideas

This is a minimal template. You can extend it by:

1. **Add a Security specialist**: For security-focused analysis
2. **Add a Test strategist**: For complex testing scenarios
3. **Add an Implementer**: For code generation and writing
4. **Add a Reviewer**: For code quality and best practices
5. **Add a Documenter**: For README and API documentation

Just follow the same pattern: clear scope, hand constraints, output contract, workflow phases.

## Troubleshooting

### "Orchestrator seems to be doing all the work"
→ Make sure to invoke Planner, Explorer, and Analyst explicitly for their specialties. Don't ask Orchestrator to explore or research.

### "Getting generic or vague findings"
→ Be specific in your requests. Instead of "analyze the codebase", say "find all async error handling patterns in service layer".

### "Findings aren't grounded in code"
→ Explicitly ask subagents to cite file paths and line numbers. Use output contracts with structured sections.

### "Taking too long to get findings"
→ Invoke subagents in parallel more aggressively. Don't wait for Explorer to finish before invoking Analyst.

## Examples in the Wild

See the [plan-explore-review-commit](../plan-explore-review-commit/) folder for a more comprehensive orchestration pattern with additional specialized agents (Implementer, Code-Review, Security-Auditor, Docs-Writer).
