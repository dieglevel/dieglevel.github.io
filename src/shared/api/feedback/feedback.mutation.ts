import { feedbackKeys } from './feedback.keys'
import type {
  Feedback_Create_Request,
  Feedback_UpdateStatus_Request,
  IFeedback,
} from './feedback.type'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import {
  useMutationDelete,
  useMutationPatch,
  useMutationPost,
} from '@/shared/lib/api/mutation/useMutation'

export const useMutationFeedback = () => {
  const mFeedback_Create = useMutationPost<
    ApiBaseResponse<IFeedback>,
    Feedback_Create_Request,
    'feedback'
  >({
    endPoint: 'feedback',
    queryKey: [feedbackKeys.list()],
  })

  const mFeedback_UpdateStatus = useMutationPatch<
    ApiBaseResponse<IFeedback>,
    Feedback_UpdateStatus_Request,
    'feedback/:id/status',
    { id: string | number }
  >({
    endPoint: 'feedback/:id/status',
    queryKey: [feedbackKeys.list()],
  })

  const mFeedback_Delete = useMutationDelete<
    ApiBaseResponse<{ message: string; isDeleted: boolean }>,
    void,
    'feedback/:id',
    { id: string | number }
  >({
    endPoint: 'feedback/:id',
    queryKey: [feedbackKeys.list()],
  })

  return {
    mFeedback_Create,
    mFeedback_UpdateStatus,
    mFeedback_Delete,
  }
}
