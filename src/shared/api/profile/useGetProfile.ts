import { profileKeys } from './profile.keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { ApiBaseResponse } from '@/shared/types/base-response'
import type { IProfile } from './profile.type'
import { useQueryGet } from '@/shared/lib/api/mutation/useQueryGet'

// Get<Example><Type>Params
export interface GetProfile_Params {
  options?: Omit<
    UseQueryOptions<ApiBaseResponse<IProfile>>,
    'queryKey' | 'queryFn'
  >
}

// useGet<Example><Type>
export const useGetProfile = (props: GetProfile_Params) =>
  useQueryGet<ApiBaseResponse<IProfile>, '/profile/me'>({
    endPoint: `/profile/me`,
    queryKey: profileKeys.me(),
    ...props,
  })
