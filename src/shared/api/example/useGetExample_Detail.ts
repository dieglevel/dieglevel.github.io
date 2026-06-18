import type { UseQueryOptions } from '@tanstack/react-query'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import type { IExample } from './example.type'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

// Get<Example><Type>Params
interface GetExample_Detail_Params {
  pathParams: {
    id: number | string
  }
  queryParams?: {
    status?: 'active' | 'inactive' | 'pending'
  }

  options?: Omit<
    UseQueryOptions<ApiBaseResponse<IExample>>,
    'queryKey' | 'queryFn'
  >
}

// useGet<Example><Type>
export const useGetExample_Detail = (props: GetExample_Detail_Params) =>
  useQueryGet<ApiBaseResponse<IExample>, '/admin/examples/:id'>({
    endPoint: `/admin/examples/:id`,
    queryKey: ['admin-examples', props.pathParams.id],
    options: {
      enabled: !!props.pathParams.id,
    },
    ...props,
  })
