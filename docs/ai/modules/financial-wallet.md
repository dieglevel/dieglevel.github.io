# Module: Financial Wallet

## Purpose
Manages financial wallets and accounts (cash, bank accounts, credit cards, e-wallets, investments), displaying balances, spending limits, inter-wallet transfers, and automated external ingestion API key management.

## Responsibilities and Boundaries
- Display user wallets in an animated grid layout (`AnimatedGrid`) with summary metric cards.
- Filter wallets by type (`CASH`, `BANK`, `CREDIT_CARD`, `E_WALLET`, `INVESTMENT`) and locked status (`isLockedForDailySpending`).
- Create and edit wallets via `WalletModal`, configuring icons, hex colors, institutions, and masked account numbers.
- Execute inter-wallet money transfers via `WalletTransferModal`.
- View transfer audit history via `TransferHistory`.
- Generate and display external integration API keys (`wapi_<hex>`) for mobile notification listeners.

## Source Map
```
src/
├── routes/(protected)/financial/wallet.tsx         # Route definition
├── shared/pages/financial/wallet/
│   ├── index.tsx                                   # Wallets view coordinator
│   ├── _hooks/
│   │   └── useWalletActions.ts                     # Wallet CRUD & transfer modal state
│   └── _components/
│       ├── WalletHeader.tsx                        # Search, tab filtering, and new wallet button
│       ├── WalletSummaryCards.tsx                  # Total net worth, cash, bank, credit stats
│       ├── WalletCard.tsx                          # Individual wallet card with balance & action menu
│       ├── WalletForm.tsx                          # Wallet creation / edit modal
│       ├── WalletTransferModal.tsx                 # Inter-wallet transfer dialog
│       └── TransferHistory.tsx                     # Drawer/table of past transfers
└── shared/api/financial/wallet/
    ├── wallet.type.ts                              # Wallet interface, transfer DTOs
    ├── wallet.mutation.ts                          # Create, update, delete, transfer, and apiKey mutations
    └── useGetFinancial_Wallet_List.ts              # TanStack Query hook fetching /financial-wallet
```

## Main Components
- **`Wallets`** (`src/shared/pages/financial/wallet/index.tsx`): Main coordinator filtering wallets by tab and search term.
- **`useWalletActions`** (`src/shared/pages/financial/wallet/_hooks/useWalletActions.ts`): Encapsulates modal open/close states, mutation triggers, and toast notifications.
- **`WalletTransferModal`**: Handles source/destination wallet selection, transfer amounts, and fee inputs.

## Business and Data Flows
1. User opens `/financial/wallet`.
2. Component fetches wallets via `useGetFinance_Wallet_List`.
3. To transfer money:
   - User clicks "Transfer", selects source and destination wallets.
   - Enters amount and optional fee.
   - Mutation posts to `/financial-wallet/transfer`.
   - On success, refetches wallet balances and updates transfer history.
4. To link an external Android listener:
   - User clicks "Generate API Key" on a wallet card.
   - Server returns `wapi_<hex>`, displayed for configuration in the mobile forwarder.

## Dependencies and Integrations
- **Core**: `useThemeMode`, `getTokens`.
- **Domain**: Relates to `financial-wallet-transfer` and `financial-record` on the backend.

## Existing Patterns and Conventions
- Uses `AnimatedGrid` with framer-motion transitions for smooth card re-ordering.
- Enforces masked representation (`accountNumberMasked`) for financial privacy.

## Extension Guide
- To add currency conversion during cross-currency wallet transfers, integrate exchange rates into `WalletTransferModal`.

## Constraints and Common Pitfalls
- Source and destination wallets cannot be the same account during a transfer.

## Tests and Verification
- Run `npm run build` to verify wallet types and components.

## Documentation Status
- Status: Verified
- Last Verified: 2026-10-19
- Source Paths:
  - `src/shared/pages/financial/wallet/index.tsx`
  - `src/shared/pages/financial/wallet/_hooks/useWalletActions.ts`
  - `src/shared/api/financial/wallet/useGetFinancial_Wallet_List.ts`
- Known Gaps: None.
