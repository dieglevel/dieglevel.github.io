import type dayjs from 'dayjs'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { IFinance_Goal } from './goal.type'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

// Get<Example><Type>Params
export interface GetFinance_Goal_List_Params {
  queryParams?: {
    date?: dayjs.Dayjs | string | Date
  }

  options?: Omit<
    UseQueryOptions<ApiBaseResponse<Array<IFinance_Goal>>>,
    'queryKey' | 'queryFn'
  >
}

// useGet<Example><Type>
export const useGetFinance_Goal_List = (props: GetFinance_Goal_List_Params) =>
  useQueryGet<ApiBaseResponse<Array<IFinance_Goal>>, '/financial-goal/all'>({
    endPoint: `/financial-goal/all`,
    queryKey: ['getFinancialGoalList'],
    queryParams: props.queryParams,
    ...props,
  })
