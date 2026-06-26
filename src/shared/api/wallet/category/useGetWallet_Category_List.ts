import type { UseQueryOptions } from '@tanstack/react-query'
import type { IWallet_Category } from './category.type'
import type { ApiBasePaginationRequest } from '@/shared/types/base-request'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

// Get<Example><Type>Params
interface GetWallet_Category_List_Params {
  queryParams?: {} & ApiBasePaginationRequest

  options?: Omit<
    UseQueryOptions<Array<IWallet_Category>>,
    'queryKey' | 'queryFn'
  >
}

// useGet<Example><Type>
export const useGetWallet_Category_List = (
  props: GetWallet_Category_List_Params,
) =>
  useQueryGet<Array<IWallet_Category>, '/wallet_category'>({
    endPoint: `/wallet_category`,
    queryKey: ['wallet-category'],
    ...props,
  })
