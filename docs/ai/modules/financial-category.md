# Module: Financial Category

## Purpose
Manages income and expense category taxonomies, supporting hierarchical parent-child category trees, monthly budgets, custom icons, hex colors, and category archiving.

## Responsibilities and Boundaries
- Display categories as an interactive tree structure using Ant Design's `Tree`.
- Calculate budget progress and spending totals bounded by the user's billing cycle start date (`cycleStartDate`).
- Provide creation and editing modals with integrated `ColorPicker` and `IconPicker`.
- Support category archiving to preserve historical transactions while hiding unused categories.
- Provide category drilldown detail modals displaying category-specific transactions.

## Source Map
```
src/
├── routes/(protected)/financial/category.tsx       # Route definition
├── shared/pages/financial/category/
│   ├── index.tsx                                   # Categories tree view coordinator
│   └── _components/
│       ├── CategoryModal.tsx                       # Create / Edit category modal
│       ├── CategoryTreeNode.tsx                    # Individual tree row rendering
│       └── CategoryDetailModal.tsx                 # Category transaction breakdown
└── shared/api/financial/category/
    ├── category.type.ts                            # Category interface & DTOs
    ├── category.mutation.ts                        # Mutations (create, update, delete, archive)
    └── useGetFinance_Category_List.ts              # TanStack Query hook fetching /financial-category/list
```

## Main Components
- **`Categories`** (`src/shared/pages/financial/category/index.tsx`): Main view building hierarchical category trees from flat or nested API responses.
- **`CategoryModal`**: Modal handling name, type (`INCOME` / `EXPENSE`), hex color, icon, parent category selector, and monthly budget.
- **`CategoryTreeNode`**: Custom renderer displaying color badge, icon, budget progress bar, and action dropdowns (add subcategory, edit, archive).

## Business and Data Flows
1. User opens `/financial/category`.
2. Computes the current billing cycle range using `setting.cycleStartDate`.
3. Fetches categories and associated spending totals for the cycle period.
4. Renders tree with budget progress bars (`currentSpending / monthlyBudget`).
5. On category creation or update, mutation invalidates `category.keys` and re-renders the tree.

## Dependencies and Integrations
- **Core**: `useThemeMode`, `getTokens`, `useSettingStore`.
- **UI Components**: `ColorPicker`, `IconPicker`.

## Existing Patterns and Conventions
- Uses `useSettingStore` to ensure budget bars calculate expenses based on billing cycle dates rather than calendar months.
- Validates hex colors and provides preset color palettes.

## Extension Guide
- To support auto-categorization rules (e.g. regex on transaction descriptions), add keyword tags into `CategoryModal`.

## Constraints and Common Pitfalls
- Parent categories cannot select themselves or their own descendants as parents.

## Tests and Verification
- Run `npm run build` to verify category tree interfaces.

## Documentation Status
- Status: Verified
- Last Verified: 2026-10-19
- Source Paths:
  - `src/shared/pages/financial/category/index.tsx`
  - `src/shared/api/financial/category/useGetFinance_Category_List.ts`
- Known Gaps: None.
