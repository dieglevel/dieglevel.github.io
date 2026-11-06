# Module: Financial Goal

## Purpose
UI for savings goals: list/filter goal cards, create/edit, and a detail modal to contribute, withdraw, confirm or skip pending auto contributions, pause/resume and cancel (with optional refund). Money can optionally move in/out of a wallet via the shared `WalletBalanceSwitch`.

End-user guide (Vietnamese): [`docs/guides/muc-tieu-tai-chinh.md`](../../guides/muc-tieu-tai-chinh.md). Backend rules: BE `docs/ai/modules/financial-goal.md`.

## Source Map
```
src/routes/(protected)/financial/goal.tsx
src/shared/pages/financial/goal/
├── index.tsx                         # Page: header, GoalSummary, inline filters (status Segmented with counts, search, type), sorted card grid, quick contribute, delete confirm
├── goal.utils.ts                     # goalAmounts, estimateMonths (AUTO only, = BE), daysToDeadline, canContribute/canWithdraw/canCancel
└── _components/
    ├── GoalSummary.tsx               # 4 tiles: saved (+meter vs total target, excl. cancelled), in progress (+paused), completed, auto contribution per month
    ├── GoalCard.tsx                  # Clickable card (opens detail): meter, % / target, deadline tag (≤30 days warning), auto amount + day, ~months, quick "Góp tiền", ⋯ menu (view / edit / delete); paused & cancelled dimmed
    ├── AddGoalModal.tsx              # Create/edit form (no status field; AUTO → amount, day, default wallet)
    ├── GoalDetailModal.tsx           # Overview (progress block, actions incl. Edit, 4 stat tiles, settings) + History list (pending pinned on top, "show more")
    ├── GoalMoneyModal.tsx            # mode: contribute | withdraw | confirm (pending)
    └── GoalCancelModal.tsx           # Cancel + optional refund wallet (hidden when locked)
src/shared/components/wallet-balance-switch/WalletBalanceSwitch.tsx   # Shared with debt modals
src/shared/api/financial/goal/
├── goal.type.ts                      # IFinance_Goal (savingMode, walletId, wallet), IFinance_Goal_Projection, UpsertFinanceGoalDto
├── goal.enum.ts                      # TYPE / SAVING_MODE / STATUS + helpers (i18n labels)
├── goal.mutation.ts                  # create / update / delete / cancel / pause / resume, GOAL_INVALIDATE_KEYS
├── goal.keys.ts, goalHistory.keys.ts
├── useGetFinance_Category_List.ts    # (misnamed) exports useGetFinance_Goal_List → GET /financial-goal/all
├── useGetFinance_Goal_Projection.ts
└── goal-history/
    ├── goal-history.type.ts          # IFinance_GoalHistory (type, walletId, wallet)
    ├── goal-history.enum.ts          # SOURCE / STATUS / TYPE (CONTRIBUTION | WITHDRAWAL) + helpers
    ├── goal.mutation.ts              # manual-contribution / withdraw / complete / skip
    └── useGetFinance_Goal_Detail.ts  # GET /:id/detail
```

## Main Components
- **`GoalDetailModal`**: takes the selected list item only for its id; everything displayed comes from `useGetFinance_Goal_Detail` so values refresh after each mutation. Shows a warning alert + badge when `PENDING` histories exist. Withdraw is disabled (with tooltip) when `isLocked`.
- **`GoalMoneyModal`**: amount capped at remaining (contribute/confirm) or saved amount (withdraw), quick-fill button, `WalletBalanceSwitch` (debit for contribute/confirm, credit for withdraw). Default wallet: pending's `walletId` → goal's `walletId`. Sends `walletId` only when the switch is on.
- **`GoalCancelModal`**: refund via `WalletBalanceSwitch` (`isInflow`), or an alert when the goal is locked.
- **`WalletBalanceSwitch`** (shared): renders `updateWallet` + `walletId` Form.Items inside the parent form, validates insufficient balance against the current amount field, previews balance before/after. Texts are passed by the caller (`title`, `hintOn`, `hintOff`); fixed labels come from `finance:common.walletSwitch.*`.

## Business and Data Flows
1. List: `GET /financial-goal/all` → cards (filtering client-side by search/type/status).
2. Detail: `GET /:id/detail` + `GET /:id/projection` (no `monthlySavingRate` → uses the goal's AUTO amount) + wallet list.
3. Mutations use `GOAL_INVALIDATE_KEYS` = goal keys, goal-history keys, wallet list, dashboard — wallet balances and the dashboard widget refresh automatically.
4. Mutation responses are `ApiBaseResponse<T>` (`customAxios` returns the body wrapped by the BE `ResponseInterceptor`); read `res.data`.

## Existing Patterns and Conventions
- Card order: ACTIVE (nearest deadline first, no deadline last) → INACTIVE → COMPLETED → CANCELLED, then newest.
- Text uses default Typography sizes; colours come from `getTokens` (primary = in progress, success = completed). No emoji in labels.
- Status / type / history labels come from enum helpers (`FinancialGoalStatusHelper.getLabel` …) backed by `finance:common.enum.goal.*`; page strings live in `finance:goal.*` (vi/en/ko).
- Status is never edited in the form — use pause / resume / cancel.
- Card estimates use `goal.utils.estimateMonths`, which mirrors the BE projection (AUTO only).

## Constraints and Common Pitfalls
- Delete does not refund wallets; the confirmation text tells users to cancel with refund first.
- `IFinance_Goal.deadline` may arrive as an ISO string; always wrap with `dayjs`.
- The goal list endpoint does not include histories, so cards cannot show pending counts.

## Tests and Verification
- `npm run build` (route generation + Vite + tsc) and `npm run lint`.

## Documentation Status
- Status: Verified
- Last Verified: 2026-11-07
- Source Paths: files listed in Source Map.
- Known Gaps:
  - Not yet exercised in a browser against the new backend.
  - `useGetFinance_Category_List.ts` file name does not match its export.
