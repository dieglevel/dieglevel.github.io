import type { User } from '@/shared/auth/auth.type'

export interface Request_Login {
  identifier: string
  password: string
}

export interface Response_Login {
  accessToken: string
  refreshToken: string
  user: User
}

export interface Request_Logout {}

export interface Response_Logout {}

export interface Request_SignUp {
  email: string
  password: string
}

export interface Response_SignUp {
  access_token: string
  token_type: string
  expires_in: number
  expires_at: number
  refresh_token: string
  user: User
}
