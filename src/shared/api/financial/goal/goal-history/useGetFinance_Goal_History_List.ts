import type { UseQueryOptions } from '@tanstack/react-query'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import type { IFinance_Goal_Detail } from '../goal.type'
import { goalHistoryKeys } from '../goalHistory.keys'
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
    UseQueryOptions<ApiBaseResponse<IFinance_Goal_Detail>>,
    'queryKey' | 'queryFn'
  >
}

export const useGetFinance_Goal_History_List = (
  props: GetFinance_Goal_History_List_Params,
) =>
  useQueryGet<
    ApiBaseResponse<IFinance_Goal_Detail>,
    `/financial-goal/${number}/detail`
  >({
    endPoint: `/financial-goal/${props.pathParams.goalId}/detail`,
    queryKey: goalHistoryKeys.list(props.pathParams.goalId),
    queryParams: props.queryParams,
    options: {
      enabled: !!props.pathParams.goalId,
    },
  })
