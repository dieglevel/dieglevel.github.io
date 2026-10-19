# Module: Static File / Upload

## Purpose
Provides reusable file upload components, progress indicators, multipart form data building, and file preview capabilities across the frontend application.

## Responsibilities and Boundaries
- Support various upload UI variants (`card`, `circle`, `dragger`, `text`) via `FormUpload`.
- Enforce file count, size limits, and MIME type restrictions (`accept="image/*"`, etc.).
- Multipart form data generation using `createUploadFormData()`.
- API mutations calling `/static-file/upload` via `useMutationUpload`.

## Source Map
```
src/
├── routes/(public)/upload.tsx            # Upload component demo route
├── shared/components/form/upload/        # FormUpload component implementation
└── shared/api/upload/
    ├── file.mutation.ts                  # mUpload mutation hook
    ├── file.type.ts                      # Upload payload and helper builders
    ├── file.enum.ts                      # FileType enum (AVATAR, RECEIPT, ATTACHMENT)
    └── upload.keys.ts                    # Query keys for upload cache
```

## Main Components
- **`FormUpload`** (`src/shared/components/form/upload/`): Ant Design Upload wrapper supporting circular avatar uploads, drag-and-drop zones, and multi-file grids.
- **`useMutationUpload`** (`src/shared/api/upload/file.mutation.ts`): Mutation handler sending `multipart/form-data` payloads to `/static-file/upload`.
- **`createUploadFormData()`** (`src/shared/api/upload/file.type.ts`): Utility appending file blobs, folders, and metadata into a valid `FormData` object.

## Business and Data Flows
1. User selects or drops a file into `FormUpload`.
2. Component triggers change handler with `UploadFile` array.
3. On submission or immediately, `mUpload.mutate` transfers the file.
4. Backend responds with `FileEntity` metadata (`id`, `url`, `status: TEMP`).
5. The returned `id` or `url` is attached to entity records (e.g. Profile avatar, Transaction receipt).

## Dependencies and Integrations
- **Third-Party**: `antd-img-crop` for image cropping.
- **Backend**: Connects to `StaticFileModule` on the NestJS backend.

## Existing Patterns and Conventions
- Always construct FormData using `createUploadFormData()`.
- Specify explicit `accept` and `maxCount` props to guard against oversized payloads.

## Extension Guide
- To support direct S3 / presigned URL uploads: update `file.mutation.ts` to request a presigned URL before streaming directly to object storage.

## Constraints and Common Pitfalls
- Uploaded files default to temporary status (`TEMP`) until committed to an entity.

## Tests and Verification
- Run `npm run build` to verify upload component types.

## Documentation Status
- Status: Verified
- Last Verified: 2026-10-19
- Source Paths:
  - `src/routes/(public)/upload.tsx`
  - `src/shared/api/upload/file.mutation.ts`
  - `src/shared/api/upload/file.type.ts`
- Known Gaps: None.
