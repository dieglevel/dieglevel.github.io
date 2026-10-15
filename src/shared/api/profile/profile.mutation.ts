import { profileKeys } from './profile.keys'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import type { IProfile } from './profile.type'
import { useMutationPost } from '@/shared/lib/api/mutation/useMutation'

export const useMutationProfile = () => {
  const mUpdate = useMutationPost<
    ApiBaseResponse<IProfile>,
    Partial<
      IProfile & {
        avatarId?: number
      }
    >,
    '/profile'
  >({
    endPoint: '/profile',
    queryKey: profileKeys.meUpdate(),
  })

  return { mUpdate }
}
