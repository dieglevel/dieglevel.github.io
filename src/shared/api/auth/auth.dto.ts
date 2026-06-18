import type { User } from '@/shared/auth/auth.type'

export interface Request_Login {
  email: string
  password: string
}

export interface Response_Login {
  accessToken: string
  refreshToken: string
  user: User
}

export interface Request_Logout {}

export interface Response_Logout {}
