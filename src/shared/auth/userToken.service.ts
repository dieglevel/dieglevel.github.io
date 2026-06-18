import { CookieService } from '../lib/service/cookie'
import { AUTH_TOKEN_KEY } from './auth.type'
import type { User } from './auth.type'

let memoryUserToken: User | null = null

export const UserTokenService = {
  set(user: User) {
    memoryUserToken = user

    if (typeof window !== 'undefined') {
      CookieService.set(AUTH_TOKEN_KEY.USER, JSON.stringify(memoryUserToken), {
        days: 1 / 24,
      })
    }
  },

  get(): User | null {
    if (memoryUserToken) return memoryUserToken

    if (typeof window !== 'undefined') {
      const token = CookieService.get(AUTH_TOKEN_KEY.USER)
      memoryUserToken = token ? JSON.parse(token) : null
      return memoryUserToken
    }

    return null
  },

  clear() {
    memoryUserToken = null

    if (typeof window !== 'undefined') {
      CookieService.remove(AUTH_TOKEN_KEY.USER)
    }
  },
}
