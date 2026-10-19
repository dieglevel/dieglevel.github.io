# Project Context

## Project Purpose

The frontend is a modern, responsive Single Page Application (SPA) designed for personal finance management. It connects to the NestJS backend API, providing users with real-time financial tracking, multi-wallet balance ledgers, transaction management with client-driven idempotency protection, debt and repayment workflows, goal tracking, recurring expense schedules, customizable dashboard analytics, and theme personalization.

## Technology Stack

| Category | Technology | Version / Details |
|---|---|---|
| **Framework & Core** | React | 19.2.0 |
| **Language** | TypeScript | 5.7.2 (ES2022 / ESNext bundler mode) |
| **Bundler & Build** | Vite | 7.1.7 (`@vitejs/plugin-react`) |
| **Routing** | `@tanstack/react-router` | 1.132.0 (file-based routing, auto-code-splitting) |
| **Server State** | `@tanstack/react-query` | 5.66.5 (caching, background revalidation) |
| **Client State** | Zustand | 5.0.9 (`useAuthStore`, `useSettingStore`, `usePaginateStore`) |
| **UI Library** | Ant Design (`antd`) | 6.1.4 |
| **Animations & 3D** | Motion (`motion/react`), Three.js | Motion 12.42.2, Three.js 0.186.0 (`@react-three/fiber`) |
| **API Client** | Axios | 1.13.2 (singleton with refresh queue) |
| **Code Generation** | Orval | 7.17.2 (OpenAPI client generator) |
| **Icons** | Lucide React & `@ant-design/icons` | Lucide 0.545.0 |
| **Internationalization** | `i18next` & `react-i18next` | English (`en`) & Vietnamese (`vi`) |
| **Testing** | Vitest | 3.0.5 |
| **Linting & Formatting** | ESLint & Prettier | Flat config `eslint.config.js` |

## Entry Points

- **`index.html`**: Host HTML template mounting into `#app`.
- **`src/main.tsx`**: Bootstraps React root, initializes TanStack Router (`createRouter`), and binds global error/performance reporting.
- **`src/root-provider.tsx`**: Top-level provider wrapping `App`, `ConfigProvider` (Ant Design), `QueryClientProvider` (TanStack Query), and `AntdProvider`.
- **`src/routes/__root.tsx`**: Root TanStack Router definition providing theme context (`AppThemeProvider`), global loading overlay (`GlobalLoading`), not-found boundary, and devtools.

## Key NPM Scripts

```bash
# Development
npm run dev              # Starts local dev server at http://localhost:5173
npm run watch            # Concurrently runs route watcher, vite dev server, and tsc watcher

# Routing
npm run generate-routes  # Runs tsr generate to compile src/shared/router/routeTree.gen.ts
npm run watch-routes     # Watches src/routes/ and regenerates routeTree.gen.ts on the fly

# Quality & Verification
npm run build            # Full production build: generate-routes -> vite build -> tsc
npm run lint             # Runs ESLint across codebase
npm run check            # Auto-fixes formatting and linting issues
npm run test             # Executes test suite with Vitest

# Code Generation
npm run orval            # Generates typed queries and mutations from backend OpenAPI specification
```

## Directory Structure

```
FE/
├── src/
│   ├── main.tsx                         # Main client entry point
│   ├── root-provider.tsx                # Composite React provider
│   ├── styles.css                       # Global styles & Tailwind-compatible resets
│   ├── i18n/                            # Multilingual translation dictionaries (en, vi)
│   ├── routes/                          # File-based TanStack routes
│   │   ├── __root.tsx                   # Top-level route context & devtools
│   │   ├── index.tsx                    # Landing / dashboard redirect
│   │   ├── (public)/                    # Unauthenticated routes (login, sign-up, demos)
│   │   └── (protected)/                 # Authenticated route tree with auth guard
│   │       ├── route.tsx                # Protected layout: auth check & theme/locale init
│   │       ├── financial/               # Financial feature routes (dashboard, wallet, etc.)
│   │       └── auth/profile.tsx         # User profile page route
│   └── shared/                          # Reusable modules, libraries, and components
│       ├── api/                         # Domain-specific API hooks and mutations
│       │   ├── auth/                    # Sign-in, sign-up, refresh hooks
│       │   ├── financial/               # Submodule queries (wallet, category, debt, etc.)
│       │   └── profile/                 # Profile management queries
│       ├── auth/                        # Token services, localStorage & auth store
│       ├── common/                      # Design tokens, menus, antd config constants
│       ├── components/                  # Shared UI library (tables, modals, forms, layout)
│       ├── lib/                         # Core infrastructure
│       │   ├── api/                     # Axios instance, interceptors, QueryClient
│       │   ├── idempotency/             # UUID v4 generator for mutation idempotency
│       │   └── service/                 # LocalStorage service
│       ├── pages/                       # Page view implementations
│       │   └── financial/               # Rich domain page implementations
│       ├── provider/                    # Context providers (AntdTheme, etc.)
│       ├── router/                      # Route tree artifacts (routeTree.gen.ts)
│       └── store/                       # Global Zustand stores (loading, pagination)
├── index.html                           # Root HTML
├── vite.config.ts                       # Vite config with TanStack Router plugin & aliases
├── tsconfig.json                        # Path mappings (@/* -> ./src/*, @shared/*)
└── orval.config.ts                      # OpenAPI codegen configuration
```

## Coding & Architectural Conventions

1. **Path Aliases**: Always use `@/` for `src/` and `@shared/` for `src/shared/`.
2. **File-Based Routing**: Any new page must be registered by adding a file inside `src/routes/` and executing `npm run generate-routes`.
3. **Protected Layout Boundary**: All protected routes must be nested inside `src/routes/(protected)/`. Authentication state is checked in `beforeLoad` and redirects unauthenticated users to the login screen.
4. **Idempotency**: All mutation actions modifying financial transaction state must include an `Idempotency-Key` header with a UUID v4 generated via `generateIdempotencyKey()`.
5. **Theme & Tokens**: Use semantic tokens from `src/shared/common/design-token.ts` (`getTokens(mode)`) and Ant Design's `theme.useToken()` rather than hardcoded hex colors.
