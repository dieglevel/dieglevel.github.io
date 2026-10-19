# Module: System Information

## Purpose
Real-time server health and hardware metric monitoring dashboard. Displays live CPU load, RAM usage, storage partition status, and system uptime using polled telemetry and time-series charts.

## Responsibilities and Boundaries
- Periodically poll server system metrics every 3 seconds (`POLL_INTERVAL_MS = 3000`).
- Maintain an in-memory rolling history buffer of 60 samples (3 minutes of activity).
- Render interactive area charts for CPU load history and memory consumption using Recharts.
- Render disk usage gauges and storage partition tables.

## Source Map
```
src/
├── routes/(protected)/system-information.tsx      # Protected route definition
├── shared/pages/system-infomation/
│   └── index.tsx                                  # SystemInfoPage dashboard implementation
└── shared/api/system-information/
    └── useGetSystemInformation.ts                 # TanStack Query hook calling /system-information
```

## Main Components
- **`SystemInfoPage`** (`src/shared/pages/system-infomation/index.tsx`): Main view rendering summary statistics cards (CPU, Memory, Uptime, OS platform) and charts.
- **`useGetSystemInformation`** (`src/shared/api/system-information/useGetSystemInformation.ts`): Query hook fetching system metrics from backend.

## Business and Data Flows
1. User navigates to `/system-information`.
2. Component triggers initial fetch and sets an interval timer (`setInterval(..., 3000)`).
3. New metric samples are pushed into rolling arrays:
   - `cpuHistory`
   - `memHistory`
4. Recharts renders smooth SVG area curves with colors derived from `getTokens(mode)`.
5. When the user navigates away, the polling interval is cleared.

## Dependencies and Integrations
- **Charting**: `recharts` (`AreaChart`, `BarChart`, `ResponsiveContainer`).
- **Theming**: `useThemeMode()` and `getTokens(mode)` for chart stroke/fill themes.

## Existing Patterns and Conventions
- Uses rolling window buffers to prevent unbounded memory growth on long-lived client sessions.
- Displays empty/error alerts gracefully if the backend metrics endpoint is unreachable.

## Extension Guide
- To display network I/O or process lists, expand the backend DTO and add corresponding tables in `SystemInfoPage`.

## Constraints and Common Pitfalls
- Ensure the polling interval is properly cleared on component unmount to prevent background memory leaks.

## Tests and Verification
- Run `npm run build` to verify charting components and types.

## Documentation Status
- Status: Verified
- Last Verified: 2026-10-19
- Source Paths:
  - `src/routes/(protected)/system-information.tsx`
  - `src/shared/pages/system-infomation/index.tsx`
  - `src/shared/api/system-information/useGetSystemInformation.ts`
- Known Gaps: None.
