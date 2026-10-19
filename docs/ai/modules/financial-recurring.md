# Module: Financial Recurring

## Purpose
Manages scheduled recurring income and expense rules (subscriptions, utility bills, salary payments, loan amortization), providing frequency configurations, automated execution triggers, and reminder toggles.

## Responsibilities and Boundaries
- Display recurring schedules table with status, amount, frequency, next run date, and wallet allocation.
- Filter recurring rules by type (`BILL`, `SUBSCRIPTION`, `SALARY`, `OTHER`) and active status.
- Create and edit recurring rules via `AddRecurringModal`.
- Toggle between automated ledger transaction creation (`isAutoCreate = true`) and reminder notification mode (`reminderOnly = true`).
- Provide manual "Run Due" action trigger to process pending schedules immediately.

## Source Map
```
src/
├── routes/(protected)/financial/recurring.tsx      # Route definition
├── shared/pages/financial/recurring/
│   ├── index.tsx                                   # Recurring schedules view coordinator
│   └── _components/
│       ├── RecurringSummary.tsx                    # Active count & monthly projected totals
│       └── AddRecurringModal.tsx                   # Schedule configuration dialog
└── shared/api/financial/recurring/
    ├── recurring.type.ts                           # Interface definitions
    └── useGetFinance_Recurring_List.ts             # TanStack Query hook fetching /financial-recurring
```

## Main Components
- **`RecurringPage`** (`src/shared/pages/financial/recurring/index.tsx`): Main view managing rule table, filters, and ad-hoc execution triggers.
- **`AddRecurringModal`**: Dialog configuring frequency (`WEEKLY`, `MONTHLY`, `EVERY_N_DAYS`), execution day/interval, amount, destination wallet, and category.
- **`RecurringSummary`**: KPI cards showing monthly projected recurring commitments and active rule counts.

## Business and Data Flows
1. User loads `/financial/recurring`.
2. Fetches active schedules via `useGetFinance_Recurring_List`.
3. User creates a rule specifying frequency, wallet, and execution options (`isAutoCreate` vs `reminderOnly`).
4. On scheduled backend intervals, the cron creates transactions or notifications.
5. User can manually trigger execution via "Run Due Now", calling `/financial-recurring/run-due`.

## Dependencies and Integrations
- **Core**: `useThemeMode`, `convertCurrency`.
- **Domain**: Relates to `FinancialTransactionModule` and `FinancialWalletModule`.

## Existing Patterns and Conventions
- Uses `IconRenderer` to display wallet and category icons within the schedule table.
- Formats dates and upcoming run dates using `dayjs`.

## Extension Guide
- To add pause/resume for subscription rules (e.g. temporary summer gym pause), toggle `isActive` without deleting the rule.

## Constraints and Common Pitfalls
- Every recurring schedule must be linked to a valid `walletId`.

## Tests and Verification
- Run `npm run build` to verify recurring components.

## Documentation Status
- Status: Verified
- Last Verified: 2026-10-19
- Source Paths:
  - `src/shared/pages/financial/recurring/index.tsx`
  - `src/shared/pages/financial/recurring/_components/AddRecurringModal.tsx`
- Known Gaps: None.
