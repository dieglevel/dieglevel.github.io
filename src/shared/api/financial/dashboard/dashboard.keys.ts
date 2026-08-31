import type { GetFinancialDashboardQueryParams } from './dashboard.type'

export const dashboardKeys = {
  all: ['financial', 'dashboard'] as const,
  summary: (queryParams?: GetFinancialDashboardQueryParams) =>
    [...dashboardKeys.all, 'summary', queryParams] as const,
}
