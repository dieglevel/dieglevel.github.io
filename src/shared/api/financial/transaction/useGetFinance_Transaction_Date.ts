import { transactionKeys } from './transaction.keys'
import type dayjs from 'dayjs'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { IFinance_Transaction } from './transaction.type'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

// Get<Example><Type>Params
export interface GetWallet_Transaction_Date_Params {
  queryParams?: {
    date?: dayjs.Dayjs | string | Date
  }

  options?: Omit<
    UseQueryOptions<ApiBaseResponse<Array<IFinance_Transaction>>>,
    'queryKey' | 'queryFn'
  >
}

// useGet<Example><Type>
export const useGetWallet_Transaction_Date = (
  props: GetWallet_Transaction_Date_Params,
) =>
  useQueryGet<
    ApiBaseResponse<Array<IFinance_Transaction>>,
    '/financial-transaction/get-with-date'
  >({
    endPoint: `/financial-transaction/get-with-date`,
    queryKey: transactionKeys.date(),
    queryParams: props.queryParams,
    ...props,
  })
