import type dayjs from 'dayjs'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { IFinance_Transaction } from './transaction.type'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

// Get<Example><Type>Params
export interface GetWallet_Transaction_List_Params {
  queryParams?: {
    date?: dayjs.Dayjs | string | Date
  }

  options?: Omit<
    UseQueryOptions<ApiBaseResponse<Array<IFinance_Transaction>>>,
    'queryKey' | 'queryFn'
  >
}

// useGet<Example><Type>
export const useGetWallet_Transaction_List = (
  props: GetWallet_Transaction_List_Params,
) =>
  useQueryGet<
    ApiBaseResponse<Array<IFinance_Transaction>>,
    '/financial-transaction/all'
  >({
    endPoint: `/financial-transaction/all`,
    queryKey: ['getFinancialTransactionList'],
    queryParams: props.queryParams,
    ...props,
  })
