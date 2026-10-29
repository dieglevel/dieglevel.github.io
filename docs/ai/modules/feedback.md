# Module: Feedback (Frontend)

## Purpose
Enables users to send feedback, bug reports, and improvement requests directly from the web client. Allows attaching 1-to-N images/screenshots using the `staticFile` upload mechanism, selecting the relevant system feature, and reviewing past feedback entries.

## Responsibilities and Boundaries
- Public and authenticated feedback submission interface (`src/shared/pages/feedback/components/FeedbackModal.tsx`).
- Integration with static-file upload API (`useMutationUpload`, `createUploadFormData`) to upload screenshots and attach file IDs to the feedback payload.
- Paginated feedback list display (`FeedbackCard.tsx`) with status and type tags.
- Filtering feedback items by system feature, feedback type, status, and search keywords (`FeedbackFilter.tsx`).
- Standardized file and folder structure:
  - Route: `src/routes/(public)/feedback.tsx` containing only the index export from `@/shared/pages/feedback`.
  - Page & subcomponents: `src/shared/pages/feedback/` divided into modular components (`components/FeedbackFilter.tsx`, `components/FeedbackCard.tsx`, `components/FeedbackModal.tsx`).
  - API layer: `src/shared/api/feedback/` (`feedback.enum.ts`, `feedback.type.ts`, `feedback.mutation.ts`, `feedback.keys.ts`, `useGetFeedbackList.ts`).

## Source Map
```
src/
├── routes/(public)/
│   └── feedback.tsx                                 # TanStack Router route definition
├── shared/
│   ├── api/feedback/
│   │   ├── feedback.enum.ts                         # Enums + BaseEnumHelper implementations
│   │   ├── feedback.type.ts                         # IFeedback (extends IBaseEntity) & request DTOs
│   │   ├── feedback.keys.ts                         # Query keys factory
│   │   ├── feedback.mutation.ts                     # useMutationPost, useMutationPatch, useMutationDelete
│   │   └── useGetFeedbackList.ts                    # useQueryGet for feedback/paging
│   └── pages/feedback/
│       ├── index.tsx                                # Main page coordinator
│       └── components/
│           ├── FeedbackModal.tsx                    # Submit modal with staticFile upload
│           ├── FeedbackFilter.tsx                   # Filter bar
│           └── FeedbackCard.tsx                     # Card displaying individual feedback & screenshots
```

## Data and Upload Flow
1. User opens feedback modal and selects `feature` (e.g. `DASHBOARD`, `TRANSACTION`), `type` (`BUG`, `FEATURE_REQUEST`), enters title and description, and selects up to 8 screenshot images.
2. Upon submission:
   - Client iterates over selected files, calling `mUpload.mutateAsync({ body: createUploadFormData({ file, fileType: FileType.OTHER }) })`.
   - Obtains array of uploaded file IDs (`fileIds: [id1, id2, ...]`).
   - Dispatches `mFeedback_Create.mutateAsync({ body: { title, content, feature, type, fileIds, ... } })` to `POST /feedback`.
3. Client automatically invalidates query cache `[feedbackKeys.list()]` and refetches the paginated feedback list.
