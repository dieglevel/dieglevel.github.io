# CLAUDE.md — Claude Code-Specific Instructions

> This file extends `AGENTS.md` with Claude Code-specific setup. All shared rules, workflows, and conventions are defined in `AGENTS.md` — do not duplicate them here.

## Setup

1. Read `AGENTS.md` before taking action.
2. Read `SESSION_LOG.md` for current state and next steps.
3. Read `docs/ai/PROJECT_CONTEXT.md` for project overview.
4. Locate relevant modules via `docs/ai/modules/INDEX.md`.

## Key Commands

```bash
# Development
npm run dev              # Start Vite dev server on port 5173
npm run watch            # Run concurrently: tsr watch + vite + tsc

# Routing
npm run generate-routes  # Generate TanStack route tree (routeTree.gen.ts)
npm run watch-routes     # Watch and generate routes on file changes

# Quality & Verification
npm run build            # Run generate-routes && vite build && tsc
npm run lint             # Run ESLint check
npm run check            # Prettier write + ESLint fix
npm run test             # Run Vitest suite

# Code Generation
npm run orval            # Generate TypeScript API clients from OpenAPI specs
```

## Critical Rules

- Do NOT invent abstractions when shared components exist in `src/shared/components/`.
- All mutation requests touching financial transactions must send an `Idempotency-Key` header via `generateIdempotencyKey()`.
- Do NOT modify application source code during documentation tasks.
- Respect the **Core Source Protection Policy** in `AGENTS.md`.
