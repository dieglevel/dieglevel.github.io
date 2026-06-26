export const AUTH_TOKEN_KEY = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'auth_user',
}

export interface User {
  id: string
  aud: string
  role: string
  email: string
  email_confirmed_at: string
  phone: string
  confirmed_at: string
  last_sign_in_at: string
  app_metadata: {
    provider: string
    providers: Array<string>
  }
  user_metadata: {
    email: string
    email_verified: boolean
    phone_verified: boolean
    sub: string
  }
  identities: Array<{
    identity_id: string
    id: string
    user_id: string
    identity_data: {
      email: string
      email_verified: boolean
      phone_verified: boolean
      sub: string
    }
    provider: string
    last_sign_in_at: string
    created_at: string
    updated_at: string
    email: string
  }>
  created_at: string
  updated_at: string
  is_anonymous: boolean
}

export enum UserRoleEnum {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

export const UserRoleMapper: Record<keyof typeof UserRoleEnum, string> = {
  CUSTOMER: 'Khách hàng',
  ADMIN: 'Quản trị viên',
}
