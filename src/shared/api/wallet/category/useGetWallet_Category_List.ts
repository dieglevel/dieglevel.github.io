import type { UseQueryOptions } from '@tanstack/react-query'
import type { IWallet_Category } from './category.type'
import type { ApiBasePaginationRequest } from '@/shared/types/base-request'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

// Get<Example><Type>Params
interface GetWallet_Category_List_Params {
  queryParams?: {} & ApiBasePaginationRequest

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
    ...props,
  })
