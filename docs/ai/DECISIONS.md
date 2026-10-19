# Architectural Decisions Log

This document records verified architectural and design decisions for the frontend application.

---

## ADR-001: React 19 Single Page Application with Vite 7

- **Status**: Accepted
- **Context**: The frontend requires rapid local development, fast Hot Module Replacement (HMR), optimized production bundle splitting, and modern React 19 capabilities.
- **Decision**: Use Vite 7 with `@vitejs/plugin-react` and TypeScript in ES2022 / ESNext bundler mode.
- **Rationale**: Vite provides instant server start, native ESM dev serving, and efficient Rollup-based production chunking compared to legacy bundlers.
- **Consequences**: Node 18+ is required. Any non-standard browser APIs must be checked before usage.
- **Evidence / Source Paths**:
  - `package.json`
  - `vite.config.ts`
  - `tsconfig.json`

---

## ADR-002: Type-Safe File-Based Routing with TanStack Router

- **Status**: Accepted
- **Context**: Large SPAs with nested layout requirements (protected vs. public shells) often suffer from routing drift and lack of compile-time URL parameter safety.
- **Decision**: Adopt `@tanstack/react-router` with `@tanstack/router-plugin/vite`. Routes are defined in `src/routes/` and compiled into `src/shared/router/routeTree.gen.ts`.
- **Rationale**: Eliminates runtime 404s due to route typos; provides built-in `beforeLoad` route guards, search param validation, and automatic component code-splitting.
- **Consequences**: Developers must run `npm run generate-routes` (or keep `npm run watch-routes` running) whenever route files are created or renamed.
- **Evidence / Source Paths**:
  - `src/routes/__root.tsx`
  - `src/routes/(protected)/route.tsx`
  - `vite.config.ts`

---

## ADR-003: Server State Management via TanStack Query

- **Status**: Accepted
- **Context**: API requests need aggressive caching, background refetching, pagination management, and mutation lifecycle handlers without polluting global UI state.
- **Decision**: Use `@tanstack/react-query` v5 for all server-side data fetching and mutations.
- **Rationale**: Separates server cache from client state, reduces network traffic via query deduplication, and standardizes loading/error states.
- **Consequences**: Components should not duplicate server data into local `useState` unless editing copies in forms.
- **Evidence / Source Paths**:
  - `src/shared/lib/api/query-client.ts`
  - `src/root-provider.tsx`
  - `src/shared/api/financial/`

---

## ADR-004: Dual-Storage Authentication with Resilient 401 Refresh Queue

- **Status**: Accepted
- **Context**: The backend uses short-lived access tokens and longer-lived refresh tokens. The frontend must rotate tokens silently without interrupting user tasks or causing parallel race conditions.
- **Decision**: Implement an Axios response interceptor that catches 401s, locks a singleton refresh promise (`refreshPromise`), refreshes tokens via `AuthTokenService`, updates both `localStorage` and Zustand `useAuthStore`, and replays original requests with the new access token.
- **Rationale**: Guarantees zero session interruption on access token expiry and prevents multiple simultaneous 401 requests from triggering redundant refresh calls.
- **Consequences**: If the refresh token itself expires or is revoked, the interceptor clears all tokens and routes the user to the login screen.
- **Evidence / Source Paths**:
  - `src/shared/lib/api/axios.ts`
  - `src/shared/auth/authToken.service.ts`
  - `src/shared/auth/auth.store.ts`

---

## ADR-005: Client-Driven UUID v4 Idempotency Key Generation

- **Status**: Accepted
- **Context**: Financial operations (transactions, payments, transfers) risk duplicate ledger records if users submit forms multiple times or experience network hiccups.
- **Decision**: Provide a utility function `generateIdempotencyKey()` (`src/shared/lib/idempotency/idempotencyKey.ts`) producing RFC 4122 UUID v4 strings. Forms generate this key once when opened and attach it as the `Idempotency-Key` header on mutation calls.
- **Rationale**: Matches the backend `IdempotencyInterceptor` contract, ensuring retried requests return cached responses rather than creating duplicate charges.
- **Consequences**: Mutation hooks for transactions must accept and pass through `idempotencyKey`.
- **Evidence / Source Paths**:
  - `src/shared/lib/idempotency/idempotencyKey.ts`
  - `src/shared/api/financial/transaction/transaction.mutation.ts`

---

## ADR-006: Ant Design 6 UI with Custom Design Token Engine

- **Status**: Accepted
- **Context**: Complex financial tables, forms, modals, and date pickers require a mature component library, but brand identity requires a distinctive aesthetic (Hu Tao color palette with dark/light mode toggle).
- **Decision**: Use Ant Design 6 wrapped with a custom token provider `AppThemeProvider` (`src/shared/provider/antd-theme.provider.tsx`) and single-source-of-truth palette definitions in `src/shared/common/design-token.ts`.
- **Rationale**: Leverages Ant Design's accessible, tested components while applying custom brand scales, border radii, and background treatments.
- **Consequences**: UI code should use `theme.useToken()` or `getTokens(mode)` rather than arbitrary CSS color constants.
- **Evidence / Source Paths**:
  - `src/shared/common/design-token.ts`
  - `src/shared/provider/antd-theme.provider.tsx`
  - `src/shared/common/antd-config-provider.constant.tsx`

---

## ADR-007: Zustand for Lightweight Client State

- **Status**: Accepted
- **Context**: Global client state (auth tokens, pagination parameters, user appearance preferences) needs to be accessible outside of React component trees (e.g., inside Axios interceptors or router `beforeLoad` hooks).
- **Decision**: Use Zustand (`useAuthStore`, `useSettingStore`, `usePaginateStore`).
- **Rationale**: Minimal boilerplate, no context wrapper required, and allows synchronous reading/writing via `.getState()` and `.setState()` anywhere in vanilla TypeScript code.
- **Consequences**: Do not store transient component state or server query caches in Zustand.
- **Evidence / Source Paths**:
  - `src/shared/auth/auth.store.ts`
  - `src/shared/pages/financial/_store/setting.store.ts`
  - `src/shared/store/paginate.store.ts`

---

## ADR-008: Automatic User Preference Synchronization on Protected Route Mount

- **Status**: Accepted
- **Context**: User financial settings (cycle start date, preferred theme, language) are stored on the backend and must configure the client environment seamlessly upon login.
- **Decision**: In `src/routes/(protected)/route.tsx`, call `useGetFinance_Setting_Get()`. In an effect, update `useSettingStore`, set `AppThemeProvider` mode (`data.data.themeMode`), and change locale (`i18nChangeLanguage(data.data.language)`).
- **Rationale**: Guarantees that personal settings are applied immediately without requiring manual toggling on each device.
- **Consequences**: A brief visual loader (`SakuraBranch`) is shown while user settings are initially retrieved.
- **Evidence / Source Paths**:
  - `src/routes/(protected)/route.tsx`
  - `src/shared/pages/financial/_store/setting.store.ts`
