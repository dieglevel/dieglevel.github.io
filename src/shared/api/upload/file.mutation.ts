import { uploadKeys } from './upload.keys'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import type { IFile } from './file.type'
import { useMutationPost } from '@/shared/lib/api/mutation/useMutation'

export interface UploadRawResponse {}

export const useMutationUpload = () => {
  const mUpload = useMutationPost<
    ApiBaseResponse<IFile>,
    FormData,
    '/static/upload'
  >({
    endPoint: '/static/upload',
    queryKey: uploadKeys.raw(),
  })

  return { mUpload }
}
