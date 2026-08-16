import { transactionKeys } from './transaction.keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { IFinance_Transaction } from './transaction.type'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

// Get<Example><Type>Params
export interface GetFinance_Transaction_View_Params {
  pathParams: {
    id: number
  }
  options?: Omit<
    UseQueryOptions<ApiBaseResponse<IFinance_Transaction>>,
    'queryKey' | 'queryFn'
  >
}

// useGet<Example><Type>
export const useGetFinance_Transaction_View = (
  props: GetFinance_Transaction_View_Params,
) =>
  useQueryGet<
    ApiBaseResponse<IFinance_Transaction>,
    '/financial-transaction/view/:id'
  >({
    endPoint: `/financial-transaction/view/:id`,
    queryKey: transactionKeys.view(),
    options: {
      enabled: !!props.pathParams.id,
    },
    ...props,
  })
