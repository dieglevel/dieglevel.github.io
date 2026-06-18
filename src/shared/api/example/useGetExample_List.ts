import type { UseQueryOptions } from '@tanstack/react-query'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import type { IExample } from './example.type'
import type { ApiBasePaginationRequest } from '@/shared/types/base-request'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

// Get<Example><Type>Params
interface GetExample_List_Params {
  queryParams?: {
    status?: 'active' | 'inactive' | 'pending'
  } & ApiBasePaginationRequest

  options?: Omit<
    UseQueryOptions<ApiBaseResponse<IExample>>,
    'queryKey' | 'queryFn'
  >
}

// useGet<Example><Type>
export const useGetExample_List = (props: GetExample_List_Params) =>
  useQueryGet<ApiBaseResponse<IExample>, '/admin/examples'>({
    endPoint: `/admin/examples`,
    queryKey: ['admin-examples'],
    ...props,
  })
