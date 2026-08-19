import { debtKeys } from './debt.keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { IFinance_Debt } from './debt.type'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

export interface GetFinance_Debt_List_Params {
  options?: Omit<
    UseQueryOptions<ApiBaseResponse<Array<IFinance_Debt>>>,
    'queryKey' | 'queryFn'
  >
}

export const useGetFinance_Debt_List = (props?: GetFinance_Debt_List_Params) =>
  useQueryGet<
    ApiBaseResponse<Array<IFinance_Debt>>,
    '/financial-debt/my-debts'
  >({
    endPoint: `/financial-debt/my-debts`,
    queryKey: debtKeys.list(),
    ...props,
  })
