import type { UseQueryOptions } from '@tanstack/react-query'
import type { IFinance_Category } from './category.type'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

// Get<Example><Type>Params
export interface GetFinance_Category_List_Params {
  options?: Omit<
    UseQueryOptions<ApiBaseResponse<Array<IFinance_Category>>>,
    'queryKey' | 'queryFn'
  >
}

// useGet<Example><Type>
export const useGetFinance_Category_List = (
  props: GetFinance_Category_List_Params,
) =>
  useQueryGet<
    ApiBaseResponse<Array<IFinance_Category>>,
    '/financial-category/all'
  >({
    endPoint: `/financial-category/all`,
    queryKey: ['getFinancialCategoryList'],
    ...props,
  })
