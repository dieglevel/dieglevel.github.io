import type { UseQueryOptions } from '@tanstack/react-query'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import type { IFinance_IncomePlan } from './income-plan.type'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'
import { useMutationPut } from '@/shared/lib/api/mutation/useMutation'

export const useGetFinance_IncomePlan = (
  month: string,
  options?: Omit<
    UseQueryOptions<ApiBaseResponse<IFinance_IncomePlan | null>>,
    'queryKey' | 'queryFn'
  >,
) =>
  useQueryGet<
    ApiBaseResponse<IFinance_IncomePlan | null>,
    '/financial-income-plan/:month',
    { month: string }
  >({
    endPoint: '/financial-income-plan/:month',
    pathParams: { month },
    queryKey: ['financial', 'income-plan', month],
    options,
  })

export const useMutationFinance_IncomePlan = () =>
  useMutationPut<
    IFinance_IncomePlan,
    { expectedAmount: number },
    'financial-income-plan/:month',
    { month: string }
  >({
    endPoint: 'financial-income-plan/:month',
    queryKey: ['financial', 'income-plan'],
  })
