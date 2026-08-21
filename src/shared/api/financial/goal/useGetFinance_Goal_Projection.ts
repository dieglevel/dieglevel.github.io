import { goalKeys } from './goal.keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import type { IFinance_Goal_Projection } from './goal.type'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

export interface GetFinance_Goal_Projection_Params {
  pathParams: {
    id: number
  }
  queryParams?: {
    monthlySavingRate?: number
  }
  options?: Omit<
    UseQueryOptions<ApiBaseResponse<IFinance_Goal_Projection>>,
    'queryKey' | 'queryFn'
  >
}

export const useGetFinance_Goal_Projection = (
  props: GetFinance_Goal_Projection_Params,
) =>
  useQueryGet<
    ApiBaseResponse<IFinance_Goal_Projection>,
    `/financial-goal/${number}/projection`,
    { monthlySavingRate?: number }
  >({
    endPoint: `/financial-goal/${props.pathParams.id}/projection`,
    queryKey: goalKeys.projection(props.pathParams.id),
    queryParams: props.queryParams,
    options: {
      enabled: !!props.pathParams.id,
      ...props.options,
    },
  })
