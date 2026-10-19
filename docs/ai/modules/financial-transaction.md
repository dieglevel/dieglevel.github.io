# Module: Financial Transaction

## Purpose
Core personal finance ledger interface. Supports viewing, filtering, creating, updating, and deleting transactions with client-side idempotency protection, receipt uploads, split-item category allocations, and status tracking.

## Responsibilities and Boundaries
- Display searchable and paginated financial transactions table (`TransactionsTable`).
- Filter by transaction type (`INCOME`, `EXPENSE`, `TRANSFER`), status (`PENDING`, `COMPLETED`, `FAILED`), wallet, category, and date ranges.
- Enforce client-side idempotency by generating a UUID v4 via `generateIdempotencyKey()` and sending it in the `Idempotency-Key` header.
- Provide comprehensive create and update workflows (via `TransactionModal` or standalone `TransactionUpsertPage`).
- Support transaction refunds and receipt attachments.

## Source Map
```
src/
├── routes/(protected)/financial/transaction/
│   ├── index.tsx                                   # Ledger page route
│   ├── create.tsx                                  # Dedicated creation page
│   └── _updateId.tsx                               # Dedicated edit page
├── shared/pages/financial/transaction/
│   ├── index.tsx                                   # Transactions view coordinator
│   ├── _components/
│   │   ├── TransactionHeader.tsx                   # Statistics & add button
│   │   ├── TransactionSearch.tsx                   # Search inputs
│   │   ├── TransactionFilterModal.tsx              # Advanced date & category filters
│   │   ├── TransactionsTable.tsx                   # Ant Design Table with custom status badges
│   │   ├── TransactionDetail.tsx                   # Detailed transaction drawer
│   │   └── TransactionModal.tsx                    # Quick modal upsert
│   └── create/ & update/                           # Split item upsert pages
└── shared/api/financial/transaction/
    ├── transaction.type.ts                         # Transaction header & line item interfaces
    ├── transaction.enum.ts                         # TYPE & STATUS enums and helpers
    ├── transaction.mutation.ts                     # Create, update, delete with Idempotency-Key
    └── useGetFinance_Transaction_List.ts           # Query hook for paginated ledger lists
```

## Main Components
- **`Transactions`** (`src/shared/pages/financial/transaction/index.tsx`): Main ledger component maintaining filter state, pagination, and `idempotencyKeyRef`.
- **`TransactionsTable`**: Interactive table displaying formatted amounts, direction colors, wallet badges, categories, and action menus.
- **`useMutationTransaction`** (`src/shared/api/financial/transaction/transaction.mutation.ts`): Mutation hooks attaching `Idempotency-Key` on requests.

## Business and Data Flows
1. User loads `/financial/transaction`.
2. Component initializes an idempotency key ref via `useRef(generateIdempotencyKey())`.
3. Fetches paginated records via `useGetFinance_Transaction_List`.
4. When opening the transaction form:
   - User inputs amount, wallet, transaction type, description, and line items.
   - On submit, mutation attaches `headers: { 'Idempotency-Key': idempotencyKey }`.
   - On success, refetches ledger queries and generates a fresh idempotency key for subsequent entries.
5. Deleting or refunding a transaction updates associated wallet balances automatically.

## Dependencies and Integrations
- **Core**: `generateIdempotencyKey()` from `src/shared/lib/idempotency/idempotencyKey.ts`.
- **Domain**: Linked to `FinancialWalletModule` and `FinancialCategoryModule`.

## Existing Patterns and Conventions
- Always generate the idempotency key once per form session, keeping it stable across network retries.
- Displays income with positive green indicators and expenses with primary color indicators.

## Extension Guide
- To add OCR receipt parsing: upload receipt image via `useMutationUpload`, send image URL to backend OCR parser, and prefill transaction form fields.

## Constraints and Common Pitfalls
- Do NOT regenerate the idempotency key during retry attempts for the same user action; only regenerate upon successful completion or form reset.

## Tests and Verification
- Run `npm run build` to verify transaction types and routes.

## Documentation Status
- Status: Verified
- Last Verified: 2026-10-19
- Source Paths:
  - `src/shared/pages/financial/transaction/index.tsx`
  - `src/shared/api/financial/transaction/transaction.mutation.ts`
  - `src/shared/lib/idempotency/idempotencyKey.ts`
- Known Gaps: None.
