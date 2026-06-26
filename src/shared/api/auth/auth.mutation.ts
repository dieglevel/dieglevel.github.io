import type { ApiBaseResponse } from '../../types/base-response'
import type {
  Request_Login,
  Request_Logout,
  Response_Login,
  Response_Logout,
} from './auth.dto'
import { useMutationPost } from '@/shared/lib/api/mutation/useMutation'

export const useMutationAuth = () => {
  const mLogin = useMutationPost<
    ApiBaseResponse<Response_Login>,
    Request_Login,
    '/auth/login'
  >({
    endPoint: '/auth/login',
    queryKey: ['auth', 'login'],
  })

  const mLogout = useMutationPost<
    ApiBaseResponse<Response_Logout>,
    Request_Logout,
    '/auth/logout'
  >({
    endPoint: '/auth/logout',
    queryKey: ['auth', 'logout'],
  })

  const mSignup = useMutationPost<
    ApiBaseResponse<Response_Login>,
    Request_Login,
    '/auth/signup'
  >({
    endPoint: '/auth/signup',
    queryKey: ['auth', 'signup'],
  })

  return { mLogin, mLogout, mSignup }
}
