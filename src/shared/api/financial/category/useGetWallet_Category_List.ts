import type dayjs from 'dayjs'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { IWallet_Category } from './category.type'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

// Get<Example><Type>Params
export interface GetWallet_Category_List_Params {
  queryParams?: {
    date?: dayjs.Dayjs | string | Date
  }

  options?: Omit<
    UseQueryOptions<ApiBaseResponse<Array<IWallet_Category>>>,
    'queryKey' | 'queryFn'
  >
}

// useGet<Example><Type>
export const useGetWallet_Category_List = (
  props: GetWallet_Category_List_Params,
) =>
  useQueryGet<
    ApiBaseResponse<Array<IWallet_Category>>,
    '/financial-category/with-transaction-count'
  >({
    endPoint: `/financial-category/with-transaction-count`,
    queryKey: ['getFinancialCategoryList'],
    queryParams: props.queryParams,
    ...props,
  })
