import type { UseQueryOptions } from '@tanstack/react-query'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import type { IFinance_GoalHistory } from './goal-history.type'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

export interface GetFinance_Goal_History_List_Params {
  pathParams: {
    goalId: number
  }
  queryParams?: {
    page?: number
    limit?: number
  }
  options?: Omit<
    UseQueryOptions<ApiBaseResponse<Array<IFinance_GoalHistory>>>,
    'queryKey' | 'queryFn'
  >
}

export const useGetFinance_Goal_History_List = (
  props: GetFinance_Goal_History_List_Params,
) =>
  useQueryGet<
    ApiBaseResponse<Array<IFinance_GoalHistory>>,
    `/financial-goal/${number}/history`
  >({
    endPoint: `/financial-goal/${props.pathParams.goalId}/history`,
    queryKey: ['getFinanceGoalHistoryList', props.pathParams.goalId],
    queryParams: props.queryParams,
    options: {
      enabled: !!props.pathParams.goalId,
    },
  })
