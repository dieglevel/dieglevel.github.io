import { feedbackKeys } from './feedback.keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { IFeedback } from './feedback.type'
import type {
  FEEDBACK_FEATURE,
  FEEDBACK_STATUS,
  FEEDBACK_TYPE,
} from './feedback.enum'
import type {
  ApiBaseResponse,
  ApiBaseResponseWithPagination,
} from '@/shared/types/base-response'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

export interface GetFeedback_QueryParams {
  feature?: FEEDBACK_FEATURE
  type?: FEEDBACK_TYPE
  status?: FEEDBACK_STATUS
  search?: string
  page?: number
  limit?: number
  order?: 'ASC' | 'DESC'
  sort?: string
}

export interface GetFeedback_List_Params {
  queryParams?: GetFeedback_QueryParams
  options?: Omit<
    UseQueryOptions<
      ApiBaseResponse<ApiBaseResponseWithPagination<Array<IFeedback>>>
    >,
    'queryKey' | 'queryFn'
  >
}

export const useGetFeedbackList = (props?: GetFeedback_List_Params) =>
  useQueryGet<
    ApiBaseResponse<ApiBaseResponseWithPagination<Array<IFeedback>>>,
    'feedback/paging'
  >({
    endPoint: 'feedback/paging',
    queryKey: feedbackKeys.list(props?.queryParams as Record<string, unknown>),
    queryParams: props?.queryParams,
    ...props,
  })
