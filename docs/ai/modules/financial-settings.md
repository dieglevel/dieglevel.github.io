# Module: Financial Settings

## Purpose
Manages user financial preferences including appearance theme modes, display currencies, localization languages, monthly billing cycle start dates, and security/notification toggles.

## Responsibilities and Boundaries
- Update user settings via `PATCH /financial-setting`.
- Synchronize theme mode (`LIGHT` / `DARK`) with `AppThemeProvider` and localStorage.
- Configure `cycleStartDate` (1-31), governing period boundaries across categories, reports, and dashboards.
- Configure default display currency (`VND`, `USD`, etc.).
- Configure application language (`vi` / `en`) with immediate `i18next` switching.

## Source Map
```
src/
├── routes/(protected)/financial/setting.tsx        # Route definition
├── shared/pages/financial/settings/
│   ├── index.tsx                                   # Settings view coordinator
│   ├── SettingsAppearance.tsx                      # Theme mode & aesthetic selection
│   ├── SettingsLocalization.tsx                    # Currency, cycle date, language
│   ├── SettingsNotifications.tsx                   # Alert preference toggles
│   ├── SettingsSecurity.tsx                        # Two-factor & session timeout preferences
│   ├── SettingsDataManagement.tsx                  # Data export / clear options
│   └── types.ts                                    # Sub-settings types
├── shared/pages/financial/_store/
│   └── setting.store.ts                            # Zustand store caching current user settings
└── shared/api/financial/setting/
    ├── setting.type.ts                             # Settings interface & patch DTOs
    ├── setting.enum.ts                             # CURRENCY, LANGUAGE, THEME enums
    └── setting.mutation.ts                         # Mutation hook calling PATCH /financial-setting
```

## Main Components
- **`Settings`** (`src/shared/pages/financial/settings/index.tsx`): Main view coordinating tabbed settings sections and mutations.
- **`useSettingStore`** (`src/shared/pages/financial/_store/setting.store.ts`): Global store holding the active user configuration.
- **`SettingsLocalization`**: Allows users to specify their financial month start date (e.g., payday on the 5th) and display currency.

## Business and Data Flows
1. User loads `/financial/setting`.
2. Component reads active settings from `useSettingStore`.
3. User alters a preference (e.g. changes language to English or updates cycle date):
   - Triggers `handleSaveSettings()`.
   - Sends payload to `mUpdate.mutateAsync`.
   - On success:
     - If theme changed: calls `toggle()` / updates `LOCAL_STORAGE_KEY.THEME`.
     - If language changed: calls `i18n.changeLanguage()`.
     - Updates `useSettingStore` to ensure all dependent pages recalculate periods.

## Dependencies and Integrations
- **Core**: `useThemeMode`, `LocalStorageService`, `i18next`.
- **Domain**: Governs period math across `financial-dashboard`, `financial-category`, and `financial-report`.

## Existing Patterns and Conventions
- Uses partial patch updates (`Partial<IFinance_Setting>`) so individual sections save independently.

## Extension Guide
- To add new currency formats or date formats: add options into `SettingsLocalization` and handle them in `format-money.ts`.

## Constraints and Common Pitfalls
- `cycleStartDate` must be between 1 and 31.

## Tests and Verification
- Run `npm run build` to verify settings components.

## Documentation Status
- Status: Verified
- Last Verified: 2026-10-19
- Source Paths:
  - `src/shared/pages/financial/settings/index.tsx`
  - `src/shared/pages/financial/_store/setting.store.ts`
  - `src/shared/api/financial/setting/setting.mutation.ts`
- Known Gaps: None.
