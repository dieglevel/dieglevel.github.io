# Current Session

## 2026-11-20: /bill-to-excel — kéo dòng sang bảng khác (dnd)

- Added `@dnd-kit/core` ^6.3.1. Rows have `groupId`; page holds `groups` (default "Chung"). New `bill-table.tsx`: one group = droppable card with its own totals, "chia tất cả", Copy, editable name, delete (rows go back to the first table); each row has a drag handle.
- Drop targets: any table card, a "Kéo dòng vào đây để tạo bảng mới" zone, and a floating dock at the bottom of the viewport (shown while dragging) with the other tables + "Bảng mới", so no scrolling is needed. Collision is pointer-based (`pointerWithin`, dock wins over the card underneath; keyboard drag falls back to `rectIntersection`) — the default overlay-rect check dropped onto the neighbouring dock chip.
- Summary card lists totals per table + overall; "Copy tất cả bảng" writes each table's TSV preceded by its name, blank line between (`buildGroupsTsv`). Re-pasting JSON resets to one table.
- Verification: `tsc --noEmit`, scoped ESLint/Prettier, 6 unit tests pass; headless Chromium (CDP mouse events) on the BHX order: dragged a row to the new-table zone and another onto the dock chip, totals 109.383 + 36.563 = 145.946, no console errors.

## 2026-11-20: /bill-to-excel — JSON hoá đơn → Excel

- New public tool route `src/routes/(public)/bill-to-excel.tsx`, page `src/shared/pages/bill-to-excel/`: paste an order JSON (full response, `data`, or any array of objects with `productName`; tested with a BHX order) → editable table.
- Line amount = `quantity × salePrice` (salePrice 0 = free item); matches the BHX `totalAmount`. Bill info shows order id, store, date, total, `listDiscount` (points), paid, saved.
- Cells edit in place; number cells accept expressions (`145000/3`) or an operator applied to the current value (`/2`, `*3`, `-5000`). Editing SL/đơn giá recomputes thành tiền. Per-row and all-rows split 1 / 2 / 3 with a "Phần chia" column; hide rows (excluded from totals and copy); add row.
- Copy to clipboard as TSV: pick columns, header row, total row, decimal separator (`,` default for Vietnamese Excel). Money rounded to đồng.
- Split labels use `/2` `/3` because the theme font renders `÷` like `+`.
- Menu: Tools → "Hoá đơn → Excel" (`menu.bill-to-excel` in vi/en/ko, `FileSpreadsheet` icon).
- Verification: `tsc --noEmit`, scoped ESLint/Prettier, `bill.utils.test.ts` (5 tests) pass; `vite build` + headless Chromium via CDP: pasted the order JSON, total 145.946 matches the bill, `/2` edit, `/3` split and hide row work, no console errors. Clipboard copy itself not exercised in headless (TSV output covered by the unit test).

## 2026-11-16: Danh mục / Giao dịch theo chu kỳ

- Category "Đã chi tháng này" was double counted: BE already rolls child `totalAmount` into the parent, but the page summed every node (budget too). Now sums root categories only (spent includes archived roots, budget excludes them).
- Category cycle range: `setting` was read with `getState()` (non-reactive → fell back to day 1 before settings loaded), `.date(31)` overflowed short months, and ISO timestamps could shift a day on a UTC server. New `src/shared/utils/helper/cycle.ts` (`getCycleMonth`, `getCycleRange`, date-only strings); month picker = cycle that starts in that month.
- Transaction page: list and Thu/Chi totals now filtered by `transactionDate` over the selected cycle (default current cycle), month picker in the toolbar shows the date range; page resets to 1 on change.
- Also: `staff-of-homa` model → `staff.glb` (meshopt + webp, 9.5 MB → 597 KB, `--join false --flatten false` to keep mesh names); `useFrame` no longer traverses the scene; model wrapped in `Suspense`.
- Verification: `tsc --noEmit`, scoped ESLint, Prettier pass. Not checked in a browser.

## 2026-11-09: Debt — gộp theo người

- Active tab groups debts by person: people with ≥ 2 active debts get a card with "Họ nợ mình" / "Mình nợ họ" (+ net when both), "Thu/Trả theo người" (FIFO, `person-payment`) and "Gộp N khoản" (merge into the oldest).
- New "Vay thêm / Cho vay thêm" action (`/:id/increase`) reusing `DebtPaymentModal` (`mode="increase"`); create form detects an active debt of the same person + direction and offers to add to it instead.
- New status tab "Đã gộp" (`MERGED`), history types INCREASED / MERGED_IN / MERGED_OUT; summary excludes merged debts. i18n vi/en/ko.
- Follow-up: payment modal no longer caps the amount; shows a warning that the excess is recorded as interest. New history type `INTEREST`.
- Verification: `tsc`, scoped ESLint and `npm run build` pass. Not checked in a browser; needs BE migration `1794000007000` applied.

## 2026-11-07: Goal page visual refresh

- New summary tiles, inline status/search/type filters with counts, sorted clickable cards with meter, quick "Góp tiền" and ⋯ menu; removed emoji and hard-coded font sizes in the goal form.
- Detail modal: progress block + meter, action row (contribute / withdraw / pause / edit / cancel), 4 stat tiles (remaining, monthly, estimate, deadline + pace), history as a list with pending entries pinned on top.
- Verification: `tsc`, scoped ESLint and `npm run build` pass. Not checked in a browser.

## 2026-11-07: Financial goal overhaul

- Goal detail modal rebuilt: data from the detail API (refreshes after actions), contribute / withdraw / confirm-pending via `GoalMoneyModal`, cancel + refund via `GoalCancelModal`, pause / resume, pending alert + badge, history with type / source / wallet.
- Shared `src/shared/components/wallet-balance-switch/WalletBalanceSwitch.tsx` (replaces debt's `DebtWalletImpact`; debt modals migrated).
- Form: no status field, default auto-contribution wallet, "Khóa rút tiền" explained; cards use `goal.utils` (same estimate rule as BE) and translated labels; dead modal in `index.tsx` and unused `GoalModal.tsx` removed; mutations invalidate goal, history, wallet and dashboard keys.
- User guide: `docs/guides/muc-tieu-tai-chinh.md`.
- Verification: `npm run build` passes; `npm run lint` only shows 6 pre-existing issues in untouched files. Not tested in a browser (backend dev server cannot start — see BE SESSION_LOG).

## 2026-11-02: Added category presentation views

- Added switchable tree, card grid, remaining-budget, and split-detail views for the financial category page.
- Reused the existing category query, budget calculations, CRUD mutations, and detail modal handlers.
- Verification: category files pass scoped ESLint; `npm run build` passes. Full-repo lint still reports pre-existing config/demo/module issues.

## 2026-11-02: Integrated budget and transaction-date APIs

- Updated FE contracts and screens for `transactionDate`, monthly budget metrics, income plans, and category budget summary.
- Category page now edits expected monthly income and displays budget remainder separately from actual surplus.
- Transaction list/detail/forms use date-only transaction dates while preserving `createdAt` as creation time.
- Verification: `npm run build` and scoped ESLint pass.

## Status

Completed

## Objective

Establish a persistent, multi-agent AI documentation and context system for the React 19 / Vite frontend repository (`/home/hanbiro/dieglevel_workspace/initial/FE`), enabling seamless context retrieval, architectural consistency, and cross-session resumption for AI coding agents (Claude Code, Codex, Cursor, etc.).

## Work Completed

1. Analyzed frontend repository architecture, tech stack (React 19, TypeScript, Vite 7, TanStack Router, TanStack Query, Zustand, Ant Design 6, Three.js), and conventions.
2. Verified all core abstractions: `customAxios` (with concurrent 401 token refresh queue), `queryClient`, `generateIdempotencyKey`, `AuthTokenService`, `useAuthStore`, `AppThemeProvider`, `design-token.ts`, `useSettingStore`, and `MainLayout`.
3. Created AI agent instructions in `AGENTS.md` and tool-specific setup in `CLAUDE.md`.
4. Formulated the **Core Source Protection Policy** in `AGENTS.md` to protect routing, auth, theme, and network abstractions.
5. Created foundational system documentation:
   - `docs/ai/PROJECT_CONTEXT.md` (Tech stack, commands, structure, and standards)
   - `docs/ai/ARCHITECTURE.md` (System topology, routing, auth refresh pipeline, token engine, idempotency protocol)
   - `docs/ai/DECISIONS.md` (Verified architectural decisions log / ADRs 001 through 008)
   - `docs/ai/core/CORE_OVERVIEW.md` (Shared infrastructure reference)
   - `docs/ai/modules/INDEX.md` (Searchable index of all frontend modules)
6. Created granular module documentation for all 14 frontend feature domains:
   - Identity & Core: `auth.md`, `profile.md`, `static-file.md`, `system-information.md`
   - Financial Domain: `financial-dashboard.md`, `financial-wallet.md`, `financial-category.md`, `financial-transaction.md`, `financial-debt.md`, `financial-goal.md`, `financial-recurring.md`, `financial-settings.md`
   - Utility & Experiments: `task.md`, `demos-and-experiments.md`
7. Established session continuity protocols via `SESSION_LOG.md` and `SESSION_HISTORY.md`.

## Files Created or Updated

- `AGENTS.md`
- `CLAUDE.md`
- `SESSION_LOG.md`
- `SESSION_HISTORY.md`
- `docs/ai/PROJECT_CONTEXT.md`
- `docs/ai/ARCHITECTURE.md`
- `docs/ai/DECISIONS.md`
- `docs/ai/core/CORE_OVERVIEW.md`
- `docs/ai/modules/INDEX.md`
- `docs/ai/modules/auth.md`
- `docs/ai/modules/profile.md`
- `docs/ai/modules/static-file.md`
- `docs/ai/modules/system-information.md`
- `docs/ai/modules/financial-dashboard.md`
- `docs/ai/modules/financial-wallet.md`
- `docs/ai/modules/financial-category.md`
- `docs/ai/modules/financial-transaction.md`
- `docs/ai/modules/financial-debt.md`
- `docs/ai/modules/financial-goal.md`
- `docs/ai/modules/financial-recurring.md`
- `docs/ai/modules/financial-settings.md`
- `docs/ai/modules/task.md`
- `docs/ai/modules/demos-and-experiments.md`

## Verification Results

- Executed `npm run build` (`tsr generate && vite build && tsc`): Clean build, exit code 0.
- Executed `npm run test`: Noted 0 test files present (exit code 1 expected until test specs are added).
- Executed `npm run lint`: Identified pre-existing formatting / config notices in `eslint.config.js` and demo components.
- Ran `git status`: Confirmed zero application source files modified.

## Unresolved Issues

- None. All architectural claims are grounded directly in active source code.

## Next Steps

- Future AI sessions should follow the context-loading workflow in `AGENTS.md` (read `SESSION_LOG.md` -> `docs/ai/PROJECT_CONTEXT.md` -> target module doc).

## Relevant Documentation

- [AGENTS.md](AGENTS.md)
- [PROJECT_CONTEXT.md](docs/ai/PROJECT_CONTEXT.md)
- [ARCHITECTURE.md](docs/ai/ARCHITECTURE.md)
- [CORE_OVERVIEW.md](docs/ai/core/CORE_OVERVIEW.md)
- [INDEX.md](docs/ai/modules/INDEX.md)
- [DECISIONS.md](docs/ai/DECISIONS.md)
