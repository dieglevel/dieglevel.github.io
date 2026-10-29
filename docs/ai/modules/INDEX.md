# Module Index

Searchable index of all analyzed frontend modules. Use this to locate the relevant documentation before inspecting source code.

## 1. Identity & Core Modules

| Module | Responsibility | Documentation | Primary Route / Path | Key Components / Hooks |
|---|---|---|---|---|
| **Auth** | Sign in, sign up, token persistence, silent refresh | [auth.md](auth.md) | `src/routes/(public)/(empty-layout)/login.tsx` | `useAuthStore`, `AuthTokenService`, `useMutationAuth` |
| **Profile** | User profile view, avatar crop and upload | [profile.md](profile.md) | `src/routes/(protected)/auth/profile.tsx` | `ProfilePage`, `useGetProfile`, `useMutationProfile` |
| **Feedback** | User feedback, bug reporting, screenshots | [feedback.md](feedback.md) | `src/routes/(public)/feedback.tsx` | `FeedbackPage`, `useMutationFeedback`, `useGetFeedbackList` |
| **Static File / Upload** | File upload components, previews, cropping | [static-file.md](static-file.md) | `src/routes/(public)/upload.tsx` | `useMutationUpload`, `antd-img-crop` |
| **System Information** | Server health and hardware metrics monitoring | [system-information.md](system-information.md) | `src/routes/(protected)/system-information.tsx` | `useGetSystemInformation`, metric cards |

## 2. Financial Domain Modules

| Module | Responsibility | Documentation | Primary Route / Path | Key Components / Hooks |
|---|---|---|---|---|
| **Financial Dashboard** | Consolidated summary, cash flow charts, cycle tracking | [financial-dashboard.md](financial-dashboard.md) | `src/routes/(protected)/financial/dashboard.tsx` | `useGetFinance_Dashboard_Summary`, Recharts charts |
| **Financial Wallet** | Multi-wallet list, balance tracking, transfers, API keys | [financial-wallet.md](financial-wallet.md) | `src/routes/(protected)/financial/wallet.tsx` | `useGetFinance_Wallet_List`, transfer modal, API key generator |
| **Financial Category** | Category hierarchy, icons, colors, budgets, archiving | [financial-category.md](financial-category.md) | `src/routes/(protected)/financial/category.tsx` | `useGetFinance_Category_List`, CategoryTree, ColorPicker |
| **Financial Transaction** | Ledger transactions, filters, idempotency upsert | [financial-transaction.md](financial-transaction.md) | `src/routes/(protected)/financial/transaction/` | `generateIdempotencyKey`, `TransactionUpsertPage`, filters |
| **Financial Debt** | Debt & loan tracking, repayments, settlements, history | [financial-debt.md](financial-debt.md) | `src/routes/(protected)/financial/debt.tsx` | `useGetFinance_Debt_List`, DebtActionModal, DebtHistory |
| **Financial Goal** | Savings targets, contributions, projections | [financial-goal.md](financial-goal.md) | `src/routes/(protected)/financial/goal.tsx` | `useGetFinance_Goal_List`, GoalDetailModal, projection |
| **Financial Recurring** | Recurring expense schedules, frequency, execution | [financial-recurring.md](financial-recurring.md) | `src/routes/(protected)/financial/recurring.tsx` | `useGetFinance_Recurring_List`, AddRecurringModal |
| **Financial Settings** | Theme mode, currency, billing cycle start date, locale | [financial-settings.md](financial-settings.md) | `src/routes/(protected)/financial/setting.tsx` | `useSettingStore`, `SettingsAppearance`, `SettingsLocalization` |

## 3. Utility & Experimental Modules

| Module | Responsibility | Documentation | Primary Route / Path | Key Components |
|---|---|---|---|---|
| **Task Board** | Hanbiro Task Kanban board with color tags | [task.md](task.md) | `src/routes/(public)/hanbiroTask.tsx` | `TaskPage`, localStorage persistence |
| **Demos & Experiments** | Three.js 3D animations, music visualizer, component showcase | [demos-and-experiments.md](demos-and-experiments.md) | `src/routes/(public)/demo/`, `/music.tsx`, `/talking-driving.tsx` | Three.js Canvas, Fiber, Audio visualizers |

---

**How to use**: Find your target module → read its documentation → inspect the entry-point source → follow imports for deeper context.
