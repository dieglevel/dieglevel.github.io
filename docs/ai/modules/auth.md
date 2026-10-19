# Module: Auth

## Purpose
Manages user authentication, session persistence, silent JWT refresh rotation, login, sign-up, and secure logout.

## Responsibilities and Boundaries
- Authenticate users via username/email (`identifier`) and password.
- Store and retrieve `accessToken`, `refreshToken`, and user payload in browser localStorage via `AuthTokenService`.
- Synchronize authentication state reactively across components via Zustand `useAuthStore`.
- Intercept HTTP 401s in `customAxios` to silently exchange expired access tokens using the refresh token.
- Guard protected routes using TanStack Router's `beforeLoad` hook, redirecting unauthenticated users to `/login`.

## Source Map
```
src/
├── routes/(public)/(empty-layout)/
│   ├── login.tsx                         # Login route & form component
│   └── sign-up.tsx                       # User registration route & form
├── shared/auth/
│   ├── authToken.service.ts              # LocalStorage read/write for tokens
│   ├── auth.store.ts                     # Zustand store (user, tokens, isAuthenticated)
│   ├── auth.type.ts                      # User, Role, and Token interfaces
│   ├── logout.service.ts                 # Logout trigger and storage cleanup
│   └── refreshToken.service.ts           # Standalone refresh helper
└── shared/api/auth/
    ├── auth.dto.ts                       # Login, Register, Refresh request/response DTOs
    ├── auth.mutation.ts                  # TanStack Query mutations (mLogin, mRegister, mLogout)
    └── refreshToken.ts                   # Axios call for token refresh
```

## Main Components
- **`LoginComponent`** (`src/routes/(public)/(empty-layout)/login.tsx`): Form handling identifier and password submission with Ant Design, triggering `mLogin` and token persistence.
- **`AuthTokenService`** (`src/shared/auth/authToken.service.ts`): Manages local storage keys `access_token`, `refresh_token`, and `user`.
- **`useAuthStore`** (`src/shared/auth/auth.store.ts`): Zustand store tracking client authentication state.
- **`LogoutService`** (`src/shared/auth/logout.service.ts`): Calls backend logout endpoint and clears client session storage.

## Business and Data Flows
1. User submits identifier and password on `/login`.
2. `mLogin.mutate` posts to `/auth/sign-in`.
3. Backend returns access token, refresh token, and user profile.
4. Client stores tokens via `AuthTokenService.setTokens()`, updates `useAuthStore`, and redirects to the saved previous page (`LOCAL_STORAGE_KEY.CURRENT_PAGE`) or `/`.
5. On subsequent API calls, `customAxios` attaches `Authorization: Bearer <token>`.
6. When access token expires (401), `customAxios` response interceptor calls `refreshTokenRequest()`, rotates tokens, and replays the failed request.

## Dependencies and Integrations
- **Core**: `customAxios`, `LocalStorageService`.
- **Routing**: TanStack Router `(public)/(empty-layout)` and `(protected)/route.tsx`.

## Existing Patterns and Conventions
- Uses `useApp().message` for toasts.
- Uses `useForm<Request_Login>()` from Ant Design with `WriteItem` helper components.

## Extension Guide
- To add OAuth/Social Login: add redirect routes under `src/routes/(public)/auth/callback.tsx` and process tokens returned from provider URLs.

## Constraints and Common Pitfalls
- Do NOT invoke token refresh on `/auth/sign-in` or `/auth/refresh-token` 401s to prevent recursion.
- Always clear both `LocalStorageService` and `useAuthStore` upon logout.

## Tests and Verification
- Run `npm run build` to verify route and type compilation.

## Documentation Status
- Status: Verified
- Last Verified: 2026-10-19
- Source Paths:
  - `src/routes/(public)/(empty-layout)/login.tsx`
  - `src/shared/auth/authToken.service.ts`
  - `src/shared/auth/auth.store.ts`
  - `src/shared/lib/api/axios.ts`
- Known Gaps: None.
