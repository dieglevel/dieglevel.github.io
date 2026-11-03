import { categoryKeys } from './category.keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

export interface IFinance_Category_Budget_Summary {
  month: string
  expectedIncome: number | null
  totalSpent: number
  remainingToSpend: number
  actualIncome: number
  actualSurplus: number
  allocatedTotal: number
  unallocatedIncome: number | null
  incomeWarning: boolean
  essentialTotal: number
  essentialPercent: number | null
  freeTotal: number
  freePercent: number | null
}

export const useGetFinance_Category_Budget_Summary = (
  month: string,
  options?: Omit<
    UseQueryOptions<ApiBaseResponse<IFinance_Category_Budget_Summary>>,
    'queryKey' | 'queryFn'
  >,
) =>
  useQueryGet<
    ApiBaseResponse<IFinance_Category_Budget_Summary>,
    '/financial-category/budget-summary/:month',
    { month: string }
  >({
    endPoint: '/financial-category/budget-summary/:month',
    pathParams: { month },
    queryKey: categoryKeys.summary(month),
    options,
  })
