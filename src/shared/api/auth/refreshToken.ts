import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { ApiBaseResponse } from '../../types/base-response'
import type { IProfile } from '../profile/profile.type'

export type RefreshTokenResponse = ApiBaseResponse<{
  accessToken: string
  refreshToken: string
  user: IProfile
}>

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
})

export const refreshTokenRequest = (
  refreshToken: string,
): Promise<AxiosResponse<RefreshTokenResponse>> =>
  refreshClient.post('/auth/refresh-token', {
    refreshToken,
  })
