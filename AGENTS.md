# AGENTS.md — Shared AI Agent Instructions

> This file provides universal instructions for all AI coding agents (Claude Code, Codex, Cursor, etc.) working on this React / Vite frontend repository.

## 1. Context Loading Workflow

### At the start of a task

1. Read this file (`AGENTS.md`).
2. Read `SESSION_LOG.md` for the latest working state.
3. Read `docs/ai/PROJECT_CONTEXT.md` for project overview.
4. Locate the relevant module via `docs/ai/modules/INDEX.md`.
5. Read the module documentation and `docs/ai/core/CORE_OVERVIEW.md` when relevant.
6. Inspect referenced source files and their imports.
7. **Search the codebase before creating new abstractions.** The project has established shared components, hooks, stores, and API clients — use them.
8. Expand investigation only when the task requires it or when docs conflict with source.

### During implementation

1. Follow existing conventions and module boundaries (see Section 3).
2. Protect unrelated work — avoid unnecessary changes to files outside your scope.
3. Verify assumptions against actual source code.
4. Run `npm run build` to check your changes and verify route tree generation.
5. Record important discoveries and decisions.

### At the end of a task

1. Review the source changes (`git diff`).
2. Run verification: `npm run build`, `npm run lint`.
3. Update documentation affected by meaningful changes.
4. Update `SESSION_LOG.md` with the current state and next steps.
5. Append a concise entry to `SESSION_HISTORY.md` for completed work.
6. Report changed files, verification results, and unresolved issues.

## 2. Source of Truth

- **Source code is the source of truth.** Documentation is a derived representation.
- If documentation conflicts with code, verify the implementation and update the docs.
- Do not claim tests/builds passed unless they were actually executed.
- Do not invent architectural patterns, UI standards, or module relationships.

## 3. Coding Conventions

### Technology Stack
- React 19 + TypeScript (ES2022 / ESNext bundler mode)
- Vite 7 + `@vitejs/plugin-react`
- `@tanstack/react-router` for file-based routing and auto-code-splitting
- `@tanstack/react-query` for server state management and caching
- Zustand for lightweight client state (`useAuthStore`, `useSettingStore`, `usePaginateStore`)
- Ant Design (`antd` v6) + Custom Theme & Token System (`src/shared/common/design-token.ts`)
- Lucide React & `@ant-design/icons` for iconography
- Axios singleton with automatic JWT refresh queue (`src/shared/lib/api/axios.ts`)
- `i18next` + `react-i18next` for multilingual support (English & Vietnamese)
- Motion (`motion/react`) for fluid transitions and micro-animations

### Directory Structure & File Naming
- Route definitions: `src/routes/` with TanStack Router conventions:
  - Route groups: `(public)`, `(protected)`, `(empty-layout)`
  - Index routes: `index.tsx`
  - Subroutes: `<name>.tsx` or `<name>/route.tsx`
  - Generated tree: `src/shared/router/routeTree.gen.ts` (run `npm run generate-routes`)
- Shared feature pages: `src/shared/pages/<domain>/`
- Shared UI components: `src/shared/components/<component-name>/`
- Shared API hooks: `src/shared/api/<domain>/`
- Path alias: `@/` maps to `src/` and `@shared/` maps to `src/shared/`

### Routing & Data Fetching Patterns
- Protected routes live under `src/routes/(protected)/route.tsx` which validates authentication via `AuthTokenService.loadTokens()` in `beforeLoad` and synchronizes user preferences.
- Queries and mutations use TanStack Query hooks.
- Mutation endpoints that impact financial records (e.g. transactions) must attach a UUID v4 generated via `generateIdempotencyKey()` (`src/shared/lib/idempotency/idempotencyKey.ts`) as the `Idempotency-Key` header.

## 4. Core Source Protection Policy

1. **Reuse existing abstractions** — `customAxios`, `queryClient`, `generateIdempotencyKey`, `AuthTokenService`, `useAuthStore`, `AppThemeProvider`, `getTokens`.
2. **Search before creating** — look for existing shared components in `src/shared/components/` (modal, form, select, table, etc.).
3. **Preserve existing contracts** — avoid modifying API clients without verifying against backend endpoints or Orval configurations.
4. **Do not modify core infrastructure** merely for isolated feature convenience.

### Core files requiring extra caution:
- `src/shared/lib/api/axios.ts` (Axios singleton, request/response interceptors, token refresh queue)
- `src/shared/auth/` (Token persistence, auth store, logout triggers)
- `src/shared/lib/idempotency/idempotencyKey.ts` (UUID generation and idempotency headers)
- `src/shared/provider/antd-theme.provider.tsx` & `src/shared/common/design-token.ts` (Theming engine)
- `src/routes/__root.tsx` & `src/routes/(protected)/route.tsx` (Root router context & auth guards)
- `src/main.tsx` & `src/root-provider.tsx` (Application bootstrapping and top-level providers)

## 5. Module Documentation

- Module docs are in `docs/ai/modules/`.
- Use `docs/ai/modules/INDEX.md` to find the relevant doc.
- Read only the modules relevant to your task — avoid loading unnecessary context.
- When you modify a module's behavior or add features, update its documentation.

## 6. Session Logging

- `SESSION_LOG.md` — current session state, work in progress, immediate next steps.
- `SESSION_HISTORY.md` — chronological log of completed tasks.
- Keep entries concise. Don't copy entire conversations.
- Don't mark work as completed unless it was verified.

## 7. Git Safety & Secrets

- Check `git status` before making changes.
- Do not overwrite or revert pre-existing uncommitted work.
- **Never** include credentials, API keys, or private tokens in documentation or commits.
- Environment variables belong in `.env` / `.env.local` (prefixed with `VITE_`).

## 8. Documentation References

| Document | Path | Purpose |
|---|---|---|
| Project Context | `docs/ai/PROJECT_CONTEXT.md` | Tech stack, entry points, commands |
| Architecture | `docs/ai/ARCHITECTURE.md` | System design, routing, data flow |
| Core Overview | `docs/ai/core/CORE_OVERVIEW.md` | Shared infrastructure reference |
| Module Index | `docs/ai/modules/INDEX.md` | Find module documentation |
| Decisions | `docs/ai/DECISIONS.md` | Architectural decisions log |
| Session Log | `SESSION_LOG.md` | Current working state |
| Session History | `SESSION_HISTORY.md` | Completed work log |
