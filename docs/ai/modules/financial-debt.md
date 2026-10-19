# Module: Financial Debt

## Purpose
Manages loans and debts (both money borrowed from others and money lent to others), providing full lifecycle operations including partial/full repayments, debt adjustments, settlements, amount corrections, and historical audit logs.

## Responsibilities and Boundaries
- Display debt overview separating borrowed debts (`BORROWED`) from receivables (`LENT`).
- Show summary metric cards: total borrowed, total lent, net debt position, and overdue counts.
- Create new debt records specifying debtor/creditor name, amounts, and optional due dates.
- Execute debt payments (`DebtPaymentModal`) which adjust wallet balances accordingly.
- Support balance adjustments, settlements, cancellations, and original amount corrections.
- View immutable history logs via `DebtHistoryModal`.

## Source Map
```
src/
├── routes/(protected)/financial/debt.tsx           # Route definition
├── shared/pages/financial/debt/
│   ├── index.tsx                                   # DebtManagementPage view coordinator
│   └── _components/
│       ├── DebtHeader.tsx                          # Tab filters (All, Borrowed, Lent, Paid)
│       ├── DebtSummaryCards.tsx                    # Net debt KPI metrics
│       ├── DebtTable.tsx                           # Data table with status and action menu
│       ├── DebtCreateModal.tsx                     # Create debt dialog
│       ├── DebtPaymentModal.tsx                    # Payment dialog linked to wallet
│       ├── DebtAdjustModal.tsx                     # Balance adjustment dialog
│       ├── DebtHistoryModal.tsx                    # Audit trail history drawer/modal
│       └── DebtCorrectModal.tsx                    # Original amount correction dialog
└── shared/api/financial/debt/
    ├── debt.type.ts                                # Debt & history interfaces
    ├── debt.enum.ts                                # DIRECTION, STATUS, TYPE enums
    ├── debt.mutation.ts                            # Payment, adjust, settle, cancel mutations
    └── useGetFinance_Debt_List.ts                  # TanStack Query hook fetching /financial-debt/my-debts
```

## Main Components
- **`DebtManagementPage`** (`src/shared/pages/financial/debt/index.tsx`): Coordinates modals, active tabs, and queries.
- **`DebtPaymentModal`**: Selects payment wallet, payment amount, and registers a repayment transaction.
- **`DebtHistoryModal`**: Displays chronological timeline of every payment, adjustment, or settlement event.

## Business and Data Flows
1. User loads `/financial/debt`.
2. Fetches user debts via `useGetFinance_Debt_List`.
3. To record a repayment:
   - User clicks "Payment" on a debt card.
   - Selects wallet and specifies payment amount.
   - Calls `mDebt_Payment.mutateAsync`.
   - On success, reduces outstanding balance, updates wallet funds, and logs history.
4. If a debt is settled by mutual agreement, `mDebt_Settle` sets status to `PAID`.

## Dependencies and Integrations
- **Core**: `useThemeMode`, `getTokens`.
- **Domain**: Linked to `FinancialWalletModule` for funds deduction/deposit.

## Existing Patterns and Conventions
- Uses color-coded direction tags (Red for borrowed debts, Green for lent receivables).
- Formats dates using `dayjs` and highlights overdue dates.

## Extension Guide
- To add payment reminder notifications, connect debt records with `financial-notification`.

## Constraints and Common Pitfalls
- Payment amount must not exceed `outstandingAmount`.

## Tests and Verification
- Run `npm run build` to verify debt management components.

## Documentation Status
- Status: Verified
- Last Verified: 2026-10-19
- Source Paths:
  - `src/shared/pages/financial/debt/index.tsx`
  - `src/shared/api/financial/debt/debt.mutation.ts`
- Known Gaps: None.
