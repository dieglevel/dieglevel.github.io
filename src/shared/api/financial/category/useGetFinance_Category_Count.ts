import { categoryKeys } from './category.keys'
import type dayjs from 'dayjs'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { IFinance_Category } from './category.type'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

// Get<Example><Type>Params
export interface GetFinance_Category_Count_Params {
  queryParams?: {
    date?: dayjs.Dayjs | string | Date
  }

  options?: Omit<
    UseQueryOptions<ApiBaseResponse<Array<IFinance_Category>>>,
    'queryKey' | 'queryFn'
  >
}

// useGet<Example><Type>
export const useGetFinance_Category_Count = (
  props: GetFinance_Category_Count_Params,
) =>
  useQueryGet<
    ApiBaseResponse<Array<IFinance_Category>>,
    '/financial-category/list'
  >({
    endPoint: `/financial-category/list`,
    queryKey: categoryKeys.count(),
    queryParams: props.queryParams,
    ...props,
  })
