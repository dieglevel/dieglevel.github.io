import type { UseQueryOptions } from '@tanstack/react-query'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import type { IFinance_Goal_Detail } from '../goal.type'
import { goalKeys } from '../goal.keys'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

export interface GetFinance_Goal_Detail_Params {
  pathParams: {
    id: number
  }
  options?: Omit<
    UseQueryOptions<ApiBaseResponse<IFinance_Goal_Detail>>,
    'queryKey' | 'queryFn'
  >
}

export const useGetFinance_Goal_Detail = (
  props: GetFinance_Goal_Detail_Params,
) =>
  useQueryGet<
    ApiBaseResponse<IFinance_Goal_Detail>,
    `/financial-goal/${number}/detail`
  >({
    endPoint: `/financial-goal/${props.pathParams.id}/detail`,
    queryKey: goalKeys.detail(props.pathParams.id),
    options: {
      enabled: !!props.pathParams.id,
    },
  })
