# Module: Profile

## Purpose
Manages user personal information, avatar uploads with in-browser cropping, and profile updates.

## Responsibilities and Boundaries
- Fetch and display the authenticated user's profile details (`firstName`, `lastName`, `dateOfBirth`, `email`, `username`, `avatar`).
- In-browser image cropping via `antd-img-crop` before uploading to the backend static file service.
- Profile editing and synchronization with global `useAuthStore`.

## Source Map
```
src/
├── routes/(protected)/auth/profile.tsx    # Route definition pointing to ProfilePage
├── shared/pages/auth/
│   └── profile.tsx                        # ProfileForm view implementation
└── shared/api/profile/
    ├── useGetProfile.ts                   # TanStack Query hook fetching /profile
    ├── profile.mutation.ts                # Mutations for profile updating
    └── profile.dto.ts                     # Profile request and response types
```

## Main Components
- **`ProfileForm`** (`src/shared/pages/auth/profile.tsx`): Form component with Ant Design inputs, date picker, avatar crop uploader, and reset controls.
- **`useGetProfile`** (`src/shared/api/profile/useGetProfile.ts`): Queries user profile from backend `/profile`.
- **`useMutationProfile`** (`src/shared/api/profile/profile.mutation.ts`): Mutation handler sending updated name and date of birth.

## Business and Data Flows
1. User navigates to `/auth/profile`.
2. Component fetches profile details via `useGetProfile`.
3. If user uploads an avatar:
   - `ImgCrop` provides an aspect-ratio-locked crop modal.
   - Cropped file is sent to `mUpload` (`/static-file/upload`).
   - The returned file ID is attached to the profile update request.
4. On profile save:
   - Sends payload via `mUpdate.mutate`.
   - On success, updates `useAuthStore.setUser(profile)` and displays success feedback.

## Dependencies and Integrations
- **Core**: `useAuthStore`, `useThemeMode`, `getTokens`.
- **Domain**: `useMutationUpload` from `src/shared/api/upload/file.mutation`.

## Existing Patterns and Conventions
- Uses `antd-img-crop` for avatar cropping.
- Converts ISO dates to `dayjs` objects for Ant Design `DatePicker`.

## Extension Guide
- To add phone number or address fields, add corresponding Form items in `ProfileForm` and update `profile.dto.ts`.

## Constraints and Common Pitfalls
- Avatar upload is a two-step process: file upload first, then linking `fileId` to profile update.

## Tests and Verification
- Run `npm run build` to verify route and component compilation.

## Documentation Status
- Status: Verified
- Last Verified: 2026-10-19
- Source Paths:
  - `src/shared/pages/auth/profile.tsx`
  - `src/shared/api/profile/useGetProfile.ts`
  - `src/shared/api/profile/profile.mutation.ts`
- Known Gaps: None.
