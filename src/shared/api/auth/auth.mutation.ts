import { authKeys } from './auth.keys'
import type { ApiBaseResponse } from '../../types/base-response'
import type {
  Request_Login,
  Request_Logout,
  Request_SignUp,
  Response_Login,
  Response_Logout,
  Response_SignUp,
} from './auth.dto'
import { useMutationPost } from '@/shared/lib/api/mutation/useMutation'

export const useMutationAuth = () => {
  const mLogin = useMutationPost<
    ApiBaseResponse<Response_Login>,
    Request_Login,
    '/auth/sign-in'
  >({
    endPoint: '/auth/sign-in',
    queryKey: authKeys.signIn(),
  })

  const mLogout = useMutationPost<
    ApiBaseResponse<Response_Logout>,
    Request_Logout,
    '/auth/logout'
  >({
    endPoint: '/auth/logout',
    queryKey: authKeys.logout(),
  })

  const mSignup = useMutationPost<
    Response_SignUp,
    Request_SignUp,
    '/auth/v1/signup'
  >({
    endPoint: '/auth/v1/signup',
    queryKey: authKeys.signUp(),
  })

  return { mLogin, mLogout, mSignup }
}
