import { goalKeys } from './goal.keys'
import type dayjs from 'dayjs'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { IFinance_Goal } from './goal.type'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

export interface GetFinance_Goal_List_Params {
  queryParams?: {
    date?: dayjs.Dayjs | string | Date
    status?: string
    type?: string
  }
  options?: Omit<
    UseQueryOptions<ApiBaseResponse<Array<IFinance_Goal>>>,
    'queryKey' | 'queryFn'
  >
}

/**
 * Hook để lấy danh sách các mục tiêu tài chính
 * - Auto retry 3 lần nếu lỗi
 * - Cache 5 phút (300000ms)
 * - Stale time 1 phút
 */
export const useGetFinance_Goal_List = (
  props: GetFinance_Goal_List_Params = {},
) =>
  useQueryGet<ApiBaseResponse<Array<IFinance_Goal>>, '/financial-goal/all'>({
    endPoint: `/financial-goal/all`,
    queryKey: goalKeys.list(),
    queryParams: props.queryParams,
    // Default options untuk error handling
    ...{
      retry: 3,
      retryDelay: (attemptIndex: any) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 60000, // 1 minute
      gcTime: 300000, // 5 minutes (formerly cacheTime in v4)
      ...props.options,
    },
  })
