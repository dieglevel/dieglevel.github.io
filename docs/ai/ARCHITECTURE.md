# Architecture

## System Overview

The frontend is a single-page React 19 application built using Vite and TypeScript. It follows a modular component-driven architecture with clear separation between routing, state management, shared design tokens, and API communication.

```
┌─────────────────────────────────────────────────────────────┐
│                       Browser View                          │
│   (index.html → src/main.tsx → src/root-provider.tsx)      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                ┌──────────────▼─────────────┐
                │   TanStack Router Context  │
                │     (src/routes/__root)    │
                └──────────────┬─────────────┘
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
┌───────────────────────────────┐     ┌───────────────────────────────┐
│     (public) Route Tree       │     │    (protected) Route Tree     │
│  - /login, /sign-up           │     │  - beforeLoad Auth Guard      │
│  - /upload, demo components   │     │  - Fetches Financial Setting  │
│  - Three.js / Canvas demos    │     │  - MainLayout + Navigation    │
└───────────────────────────────┘     └───────────────┬───────────────┘
                                                      │
                                                      ▼
                                       ┌───────────────────────────────┐
                                       │    Domain Feature Pages       │
                                       │  - Financial (Wallets, Debts, │
                                       │    Categories, Transactions,  │
                                       │    Dashboard, Goals, etc.)    │
                                       │  - User Profile               │
                                       │  - System Information         │
                                       └──────────────┬────────────────┘
                                                      │
         ┌────────────────────────────────────────────┼────────────────────────────────────────────┐
         ▼                                            ▼                                            ▼
┌─────────────────────────────┐             ┌─────────────────────────────┐             ┌─────────────────────────────┐
│      TanStack Query         │             │      Zustand Store          │             │     Theme & UI Engine       │
│  - Server Cache & Revalidate│             │  - useAuthStore             │             │  - AppThemeProvider         │
│  - Domain Query/Mutation    │             │  - useSettingStore          │             │  - Design Tokens (Hu Tao)   │
│  - Idempotency injection    │             │  - usePaginateStore         │             │  - Ant Design 6 Components  │
└──────────────┬──────────────┘             └─────────────────────────────┘             └─────────────────────────────┘
               │
               ▼
┌─────────────────────────────┐
│   Axios HTTP Singleton      │
│  - Bearer Token Interceptor │
│  - 401 Silent Refresh Queue │
│  - Auto-logout on expiry    │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│   NestJS Backend REST API   │
│   (http://localhost:3000)   │
└─────────────────────────────┘
```

---

## 1. File-Based Routing System (TanStack Router)

Routing is declarative and fully type-safe, managed by `@tanstack/react-router` and compiled via `@tanstack/router-plugin/vite`.

- **Root Route** (`src/routes/__root.tsx`):
  Injects query client context, sets default Ant Design spin indicators (`SpinGlobal`), mounts `AppThemeProvider`, provides `GlobalLoading`, and attaches TanStack Devtools.
- **Route Groups**:
  - `(public)`: Public routes including login, sign-up, and standalone visual demos. Uses `(empty-layout)` where no shell navigation is needed.
  - `(protected)`: Wraps all secure application pages.
    - `beforeLoad`: Executes synchronous token inspection via `AuthTokenService.loadTokens()` and initializes `useAuthStore`.
    - `RouteComponent`: Loads user configuration (`useGetFinance_Setting_Get`), synchronizes theme mode and language, and renders `MainLayout` with `<Outlet />`.
- **Code Splitting**: The router plugin automatically splits page components into distinct bundles for lazy loading.

---

## 2. API Communication & Resilient Auth Refresh Pipeline

Network requests are channeled through an Axios singleton (`src/shared/lib/api/axios.ts`) configured with two primary interceptors:

### Request Interceptor
- Inspects `AuthTokenService.getAccessToken()`.
- Automatically injects `Authorization: Bearer <token>` into request headers.

### Response Interceptor (Silent Token Refresh)
When an HTTP 401 Unauthorized status is returned:
1. Ignores 401s from `auth/sign-in` or `auth/refresh-token` to avoid infinite loops.
2. If `x-refresh-retry` header is absent, extracts the persistent refresh token.
3. If no refresh token exists, immediately clears user state via `handleLogout()` and redirects to `/`.
4. If a refresh request is already in-flight, subsequent requests hook into the same singleton promise (`refreshPromise`) to prevent race conditions.
5. Upon successful token exchange, updates `localStorage` and `useAuthStore`, assigns the new access token to `originalRequest.headers.Authorization`, and replays the original request.

---

## 3. Client-Side Idempotency Protocol

Financial transactions require strict idempotency to protect against accidental double-clicks or unstable mobile connections.

- **Mechanism**: `src/shared/lib/idempotency/idempotencyKey.ts` provides `generateIdempotencyKey()`.
- **Format**: Generates a standard RFC 4122 UUID v4 using `crypto.randomUUID()` with fallback.
- **Header**: Attached as `Idempotency-Key: <uuid>` on create, update, and delete mutations.
- **Lifecycle**: Generated once per user interaction (e.g. modal open) and kept stable across network retries.

---

## 4. State Management Architecture

The application adopts a strict distinction between server cache and client state:

- **Server Cache (`@tanstack/react-query`)**:
  - Manages API data fetching, caching, deduplication, and optimistic updates.
  - Query keys are scoped by domain (e.g. `transactionKeys`, `walletKeys`).
- **Client State (`zustand`)**:
  - **`useAuthStore`** (`src/shared/auth/auth.store.ts`): User identity, access tokens, refresh tokens, and authentication status.
  - **`useSettingStore`** (`src/shared/pages/financial/_store/setting.store.ts`): User financial preferences (cycle start date, display currency, theme).
  - **`usePaginateStore`** (`src/shared/store/paginate.store.ts`): Standardized page size, page index, and total record counts.

---

## 5. Theming & Design Token Engine

The UI follows a design token architecture based on the "Hu Tao" aesthetic:

- **Tokens Source of Truth** (`src/shared/common/design-token.ts`):
  - Defines color scales from step 50 through 900 for primary, secondary, neutral, success, error, and warning.
  - `getTokens(mode)` maps steps to semantic roles (`base`, `hover`, `active`, `soft`, `text`).
- **`AppThemeProvider`** (`src/shared/provider/antd-theme.provider.tsx`):
  - Context provider managing `'light' | 'dark'` modes.
  - Persists preference in `localStorage` under `LOCAL_STORAGE_KEY.THEME`.
  - Reflects mode onto `<html data-theme="...">` and `style.colorScheme` for CSS/SVG synchronization.
  - Computes `ConfigProviderProps` for Ant Design dynamically.

---

## 6. Internationalization (i18n)

Multilingual support is built into the application layout:
- Configured via `i18next` and `react-i18next` (`src/i18n/`).
- Translates UI labels into Vietnamese (`vi`) and English (`en`).
- Automatically synced on login with `FinancialSettingEntity.language` fetched from the backend.
