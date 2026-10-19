# Module: Task Board (Hanbiro Task)

## Purpose
Task management integration providing a tabular task overview, priority/status filtering, progress percentage tracking, expandable row details, note attachments, and local browser persistence.

## Responsibilities and Boundaries
- Fetch and display tasks from external task endpoints (`/api/ngw/project/task/get_my_task`).
- Filter tasks by status, priority, keywords, and completion percentage ranges.
- Support expanded row notes, custom inputs, and image attachments persisted locally via `useTaskPersistence`.
- Provide inline task completion status toggles.

## Source Map
```
src/
├── routes/(public)/hanbiroTask.tsx                 # Public route definition
└── shared/pages/task/
    ├── index.tsx                                   # TaskPage coordinator
    ├── type.ts                                     # Task API interfaces
    ├── storage.ts                                  # LocalStorage key helpers
    ├── color.ts                                    # Status and priority badge color mappings
    ├── hooks/
    │   ├── use-task-persistence.ts                 # Local storage state sync
    │   └── use-task-derived-data.ts                # Filtering and sorting logic
    └── components/
        ├── task-filter-panel.tsx                   # Filter bar
        ├── task-table-columns.tsx                  # Ant Design Table columns
        └── expanded-row-form.tsx                   # Sub-task form and note inputs
```

## Main Components
- **`TaskPage`** (`src/shared/pages/task/index.tsx`): Main view managing task fetching, loading states, and table rendering.
- **`useTaskPersistence`** (`src/shared/pages/task/hooks/use-task-persistence.ts`): Caches task modifications, notes, and completed IDs across page reloads.

## Business and Data Flows
1. User loads `/hanbiroTask`.
2. Fetches tasks using `fetch('/api/ngw/project/task/get_my_task', ...)`.
3. Combines remote task records with local customizations from `useTaskPersistence`.
4. Renders interactive table with expandable detail rows for notes and checklists.

## Dependencies and Integrations
- Ant Design Table, Form, and Card components.

## Existing Patterns and Conventions
- Uses `useCallback` and `useRef` guards to prevent duplicate concurrent network fetches.

## Extension Guide
- To connect tasks with financial budgets (e.g. project billing), map task IDs to financial category IDs.

## Constraints and Common Pitfalls
- External task API requires x-www-form-urlencoded body format.

## Tests and Verification
- Run `npm run build` to verify task typing.

## Documentation Status
- Status: Verified
- Last Verified: 2026-10-19
- Source Paths:
  - `src/shared/pages/task/index.tsx`
  - `src/shared/pages/task/hooks/use-task-persistence.ts`
- Known Gaps: None.
