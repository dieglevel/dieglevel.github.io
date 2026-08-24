import { debtKeys } from './debt.keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { IFinance_DebtHistory } from './debt.type'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

export interface GetFinance_Debt_Histories_Params {
  id: string | number
  options?: Omit<
    UseQueryOptions<ApiBaseResponse<Array<IFinance_DebtHistory>>>,
    'queryKey' | 'queryFn'
  >
}

export const useGetFinance_Debt_Histories = ({
  id,
  options,
}: GetFinance_Debt_Histories_Params) =>
  useQueryGet<
    ApiBaseResponse<Array<IFinance_DebtHistory>>,
    '/financial-debt/:id/histories'
  >({
    endPoint: `/financial-debt/:id/histories`,
    queryKey: debtKeys.histories(),
    pathParams: { id },
    options: {
      ...options,
      enabled: !!id,
    },
  })
