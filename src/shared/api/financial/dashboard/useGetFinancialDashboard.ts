import { keepPreviousData } from '@tanstack/react-query'
import { dashboardKeys } from './dashboard.keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type {
  GetFinancialDashboardQueryParams,
  IFinancialDashboardSummary,
} from './dashboard.type'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

export interface GetFinancialDashboardParams {
  queryParams?: GetFinancialDashboardQueryParams
  options?: Omit<
    UseQueryOptions<ApiBaseResponse<IFinancialDashboardSummary>>,
    'queryKey' | 'queryFn'
  >
}

export const useGetFinancialDashboard = (
  props: GetFinancialDashboardParams = {},
) => {
  const { queryParams, options } = props

  return useQueryGet<
    ApiBaseResponse<IFinancialDashboardSummary>,
    '/financial-dashboard/summary'
  >({
    endPoint: '/financial-dashboard/summary',
    queryKey: dashboardKeys.summary(queryParams),
    queryParams,
    options: {
      placeholderData: keepPreviousData,
      ...options,
    },
  })
}
