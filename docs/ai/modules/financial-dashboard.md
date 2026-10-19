# Module: Financial Dashboard

## Purpose
Main personal finance overview page. Aggregates and displays current wallet totals, cash flow timelines, spending distributions, goal statuses, and upcoming debt payments adjusted to the user's monthly billing cycle.

## Responsibilities and Boundaries
- Present summary metric cards: total income, total expense, net balance, savings rate, total wallet assets, and pending transactions.
- Filter dashboard metrics by timeframe (`WEEKLY`, `MONTHLY`, `YEARLY`, `ALL_TIME`) and optional `walletId`.
- Render cash flow area/bar charts and category spending donut charts.
- Display quick-access widgets for wallets, recent transactions, active savings goals, and debts.

## Source Map
```
src/
├── routes/(protected)/financial/dashboard.tsx       # Route definition
├── shared/pages/financial/dashboard/
│   ├── index.tsx                                    # Dashboard view coordinator
│   └── _components/
│       ├── DashboardHeader.tsx                      # Timeframe & wallet filter controls
│       ├── DashboardSummaryCards.tsx                # Metric KPI cards
│       ├── CashFlowChart.tsx                        # Income vs Expense timeline
│       ├── CategoryBreakdownChart.tsx               # Spending distribution chart
│       ├── WalletListWidget.tsx                     # Mini wallet balance list
│       ├── RecentTransactionsWidget.tsx             # Latest ledger transactions
│       ├── GoalsSummaryWidget.tsx                   # Savings progress bars
│       └── DebtsSummaryWidget.tsx                   # Active debt obligations
└── shared/api/financial/dashboard/
    ├── dashboard.type.ts                            # Dashboard DTOs and timeframe enums
    └── useGetFinancialDashboard.ts                  # TanStack Query hook calling /financial-dashboard/summary
```

## Main Components
- **`Dashboard`** (`src/shared/pages/financial/dashboard/index.tsx`): Coordinates state for `timeFrame` and `selectedWalletId`, passing data to individual sub-widgets.
- **`useGetFinancialDashboard`** (`src/shared/api/financial/dashboard/useGetFinancialDashboard.ts`): Queries `/financial-dashboard/summary`.

## Business and Data Flows
1. User loads `/financial/dashboard`.
2. Component requests summary from backend with selected timeframe and optional wallet filter.
3. Backend calculates metrics using user's configured `cycleStartDate` from `FinancialSettingEntity`.
4. Renders responsive grid:
   - Top: KPI metric cards.
   - Middle: Cash flow time series and category breakdown.
   - Bottom: Recent transactions, wallet list, goals, and debts.

## Dependencies and Integrations
- **Charting**: `recharts` (`ResponsiveContainer`, `BarChart`, `PieChart`).
- **Store**: Reads cycle preferences from `useSettingStore`.

## Existing Patterns and Conventions
- Uses fallback defaults for all metric values to prevent UI crashes on initial empty account state.
- Formats currency figures using the user's configured currency symbol.

## Extension Guide
- To add net-worth trends or monthly budget comparisons, add a new widget under `_components/` and include it in `index.tsx`.

## Constraints and Common Pitfalls
- Ensure chart tooltips handle zero or null amounts without throwing runtime formatting errors.

## Tests and Verification
- Run `npm run build` to verify widget composition and typing.

## Documentation Status
- Status: Verified
- Last Verified: 2026-10-19
- Source Paths:
  - `src/shared/pages/financial/dashboard/index.tsx`
  - `src/shared/api/financial/dashboard/useGetFinancialDashboard.ts`
- Known Gaps: None.
