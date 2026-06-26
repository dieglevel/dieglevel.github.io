import type { User } from '@/shared/auth/auth.type'

export interface Request_Login {
  email: string
  password: string
}

export interface Response_Login {
  access_token: string
  token_type: string
  expires_in: number
  expires_at: number
  refresh_token: string
  user: User
  weak_password: any
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
