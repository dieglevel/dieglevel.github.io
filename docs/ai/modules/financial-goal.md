# Module: Financial Goal

## Purpose
Manages user savings and financial targets. Tracks accumulated progress against deadlines, supports manual/automatic contributions, calculates completion projections, and displays progress timelines.

## Responsibilities and Boundaries
- Display savings goals with progress rings/bars (`GoalCard`) and summary metrics (`GoalSummary`).
- Filter goals by type (`EMERGENCY_FUND`, `VACATION`, `VEHICLE`, `REAL_ESTATE`, `EDUCATION`, `OTHER`) and status (`ACTIVE`, `COMPLETED`, `CANCELLED`).
- Create and edit goals via `AddGoalModal`.
- View detailed goal progress, contribution histories, and future projections via `GoalDetailModal`.
- Support manual contribution entries linked to user wallets.

## Source Map
```
src/
├── routes/(protected)/financial/goal.tsx           # Route definition
├── shared/pages/financial/goal/
│   ├── index.tsx                                   # Goals view coordinator
│   └── _components/
│       ├── GoalSummary.tsx                         # Savings rate & total target KPI cards
│       ├── GoalCard.tsx                            # Individual goal card with progress indicator
│       ├── AddGoalModal.tsx                        # Create goal modal
│       └── GoalDetailModal.tsx                     # Contribution histories and projection views
└── shared/api/financial/goal/
    ├── goal.type.ts                                # Goal & history interfaces
    ├── goal.enum.ts                                # SAVING_MODE, STATUS, TYPE enums
    ├── goal.mutation.ts                            # Create, update, delete, contribute mutations
    └── useGetFinance_Category_List.ts              # TanStack Query hook fetching /financial-goal
```

## Main Components
- **`Goals`** (`src/shared/pages/financial/goal/index.tsx`): Main view managing filter state and goal card grids.
- **`GoalCard`**: Displays target vs. current amount, remaining days to deadline, and progress percentage.
- **`GoalDetailModal`**: Displays contribution timeline, projection estimates based on monthly saving speed, and buttons to log contributions.

## Business and Data Flows
1. User loads `/financial/goal`.
2. Fetches goals via `useGetFinance_Goal_List`.
3. To log a contribution:
   - User opens `GoalDetailModal`, enters contribution amount and source wallet.
   - Mutation posts manual contribution.
   - On success, updates `currentAmount` and recalculates remaining progress.
4. When `currentAmount >= targetAmount`, status transitions to `COMPLETED`.

## Dependencies and Integrations
- **Core**: `useThemeMode`, `convertCurrency`.
- **Domain**: Linked to `FinancialWalletModule` for contribution fund sourcing.

## Existing Patterns and Conventions
- Uses `convertCurrency` helper to format numbers according to active user preferences.
- Visual status badges: Green for completed goals, Blue for active goals.

## Extension Guide
- To display monthly contribution targets, add an amortization schedule calculation into `GoalDetailModal`.

## Constraints and Common Pitfalls
- Goals with status `COMPLETED` or `CANCELLED` should disable additional contributions.

## Tests and Verification
- Run `npm run build` to verify goal components and types.

## Documentation Status
- Status: Verified
- Last Verified: 2026-10-19
- Source Paths:
  - `src/shared/pages/financial/goal/index.tsx`
  - `src/shared/api/financial/goal/goal.mutation.ts`
- Known Gaps: None.
