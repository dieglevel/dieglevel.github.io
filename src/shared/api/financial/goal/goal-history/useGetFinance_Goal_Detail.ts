import type { UseQueryOptions } from '@tanstack/react-query'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import type { IFinance_Goal } from '../goal.type'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

export interface GetFinance_Goal_Detail_Params {
  pathParams: {
    id: number
  }
  options?: Omit<
    UseQueryOptions<ApiBaseResponse<IFinance_Goal>>,
    'queryKey' | 'queryFn'
  >
}

export const useGetFinance_Goal_Detail = (
  props: GetFinance_Goal_Detail_Params,
) =>
  useQueryGet<ApiBaseResponse<IFinance_Goal>, `/financial-goal/${number}`>({
    endPoint: `/financial-goal/${props.pathParams.id}`,
    queryKey: ['getFinanceGoalDetail', props.pathParams.id],
    options: {
      enabled: !!props.pathParams.id,
    },
  })
