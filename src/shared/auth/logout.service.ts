import { AccessTokenService } from './accessToken.service'
import { useAuthStore } from './auth.store'
import { RefreshTokenService } from './refreshToken.service'
import { UserTokenService } from './userToken.service'

export const LogoutService = {
  logout(canRedirect: boolean = true) {
    // Clear user token and other related data
    UserTokenService.clear()
    // You can also clear other data related to the user session here

    AccessTokenService.clear()
    RefreshTokenService.clear()

    useAuthStore.getState().clearAuth()

    // Optionally, you can redirect the user to the login page or home page
    if (typeof window !== 'undefined' && canRedirect) {
      window.location.href = '/' // Redirect to login page
    }
  },
}
