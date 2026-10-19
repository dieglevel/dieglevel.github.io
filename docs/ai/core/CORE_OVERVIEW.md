# Core Infrastructure Overview

This document provides a concise reference for the shared infrastructure components that all frontend routes and modules depend on.

---

## 1. Network Layer: customAxios

**File**: `src/shared/lib/api/axios.ts`

Singleton Axios instance configured with environment-based `baseURL` and interceptors.

### Key Capabilities
- **Bearer Token Injection**: Reads `AuthTokenService.getAccessToken()` and appends `Authorization: Bearer <token>` to all outgoing requests.
- **Concurrent 401 Silent Refresh**: Intercepts 401 Unauthorized responses. If an access token has expired, queues concurrent requests onto a shared `refreshPromise`, calls `refreshTokenRequest()`, commits the new tokens, and replays failed requests transparently.
- **Auto-Logout**: If refresh token exchange fails, invokes `handleLogout()`, clears localStorage and `useAuthStore`, and redirects to `/`.

### Usage
```typescript
import { customAxios } from '@/shared/lib/api/axios'

export const fetchSomething = (params: MyParams) => {
  return customAxios<MyResponse>({
    url: '/my-endpoint',
    method: 'GET',
    params,
  })
}
```

---

## 2. Server Cache: queryClient

**File**: `src/shared/lib/api/query-client.ts`

Global TanStack Query client pre-configured with caching defaults:
- `staleTime`: Prevents redundant immediate refetches.
- `retry`: Controlled retries for idempotent network failures.
- Injected into the top-level React tree via `QueryClientProvider` in `src/root-provider.tsx` and into the router context in `src/main.tsx`.

---

## 3. Idempotency Key Generator

**File**: `src/shared/lib/idempotency/idempotencyKey.ts`

Utility ensuring financial mutation safety against double-clicks or unstable retries.

### Key Functions
- **`generateIdempotencyKey()`**: Generates a cryptographically random RFC 4122 UUID v4 using `crypto.randomUUID()` when available, with a compliant fallback for older environments.
- **`isValidUUID(value)`**: Validates that a key matches the UUID v4 pattern.

### Usage
```typescript
import { generateIdempotencyKey } from '@/shared/lib/idempotency/idempotencyKey'

const handleFormSubmit = async (values: CreateTransactionDto) => {
  const idempotencyKey = generateIdempotencyKey()
  await createTransactionMutation.mutateAsync({
    body: values,
    idempotencyKey,
  })
}
```

---

## 4. Authentication & Token Management

**Files**:
- `src/shared/auth/authToken.service.ts`: Local storage wrapper managing `accessToken`, `refreshToken`, and user payload.
- `src/shared/auth/auth.store.ts`: Zustand store providing reactive access to `isAuthenticated`, `user`, and `accessToken`.
- `src/shared/auth/logout.service.ts`: Helper triggering backend logout and client cleanup.

### Data Flow
```
User Login → AuthTokenService.setTokens() → useAuthStore.setAuth() → Navigates to (protected)
```

---

## 5. Design Token & Theming Engine

**Files**:
- `src/shared/common/design-token.ts`: Palette source of truth. Provides color scales (steps 50-900) and `getTokens(mode)` mapping to semantic roles (`base`, `hover`, `active`, `soft`, `text`).
- `src/shared/provider/antd-theme.provider.tsx`: Context provider (`AppThemeProvider`) managing `'light' | 'dark'` modes, persisting to `localStorage`, and setting `data-theme` attribute on `<html>`.
- `src/shared/common/antd-config-provider.constant.tsx`: Generates Ant Design `theme.token` and `theme.components` options dynamically from the active mode.

### Usage
```typescript
import { useThemeMode } from '@/shared/provider/antd-theme.provider'

const { mode, isDark, toggle, setMode } = useThemeMode()
```

---

## 6. Route Guards & Shell Layout

**Files**:
- `src/routes/__root.tsx`: Mounts `AppThemeProvider`, `GlobalLoading`, Devtools, and `<Outlet />`.
- `src/routes/(protected)/route.tsx`:
  - `beforeLoad`: Validates authentication via `AuthTokenService.loadTokens()`. If unauthenticated, displays `<LoginComponent />`.
  - `RouteComponent`: Loads financial settings via `useGetFinance_Setting_Get()`, synchronizes theme mode and language, and embeds children within `<MainLayout>`.
- `src/shared/components/layout/layout.tsx`: Main application frame embedding the animated header/navigation menu (`Menu`).

---

## 7. Global State Stores

**Files**:
- `src/shared/pages/financial/_store/setting.store.ts`: Stores per-user financial preferences (`themeMode`, `theme`, `cycleStartDate`, `currency`, `language`).
- `src/shared/store/paginate.store.ts`: Standard pagination state (`pageIndex`, `pageSize`, `total`).
- `src/shared/store/loading.store.ts`: Global loading overlay controller.
