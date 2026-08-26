/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import axios from 'axios'
import {
  LOCAL_STORAGE_KEY,
  LocalStorageService,
} from '../service/local-storage'
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import type { RefreshTokenResponse } from '@/shared/api/auth/refreshToken'
import { refreshTokenRequest } from '@/shared/api/auth/refreshToken'
import { AuthTokenService } from '@/shared/auth/authToken.service'
import { useAuthStore } from '@/shared/auth/auth.store'

// 1. Tạo Singleton Instance duy nhất bên ngoài hàm
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
})

let refreshPromise: Promise<AxiosResponse<RefreshTokenResponse>> | null = null

// Hàm trợ lý xử lý Đăng xuất & Đổ hướng
const handleLogout = () => {
  AuthTokenService.clearTokens()
  useAuthStore.getState().clearAuth()

  if (typeof window !== 'undefined') {
    LocalStorageService.set(
      LOCAL_STORAGE_KEY.CURRENT_PAGE,
      window.location.pathname,
    )
    window.location.href = '/login'
  }
}

// Interceptor cho Request: Thêm Bearer Token
instance.interceptors.request.use((config) => {
  const token = AuthTokenService.getAccessToken()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor cho Response: Xử lý Refresh Token tự động
instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (axios.isCancel(error)) {
      console.warn('Request cancelled:', error.message)
      return Promise.reject(error)
    }

    // Xử lý lỗi 401 Unauthorized
    if (error.response?.status === 401) {
      const originalRequest = error.config

      // Bỏ qua nếu endpoint bị lỗi chính là sign-in hoặc refresh-token
      if (
        originalRequest?.url?.includes('auth/sign-in') ||
        originalRequest?.url?.includes('auth/refresh-token')
      ) {
        return Promise.reject(error)
      }

      // Tránh lặp vô hạn retry
      if (originalRequest && !originalRequest.headers['x-refresh-retry']) {
        const refreshToken = AuthTokenService.getRefreshToken()

        if (!refreshToken) {
          handleLogout()
          return Promise.reject(error)
        }

        originalRequest.headers['x-refresh-retry'] = 'true'

        try {
          // Xử lý bất đồng bộ tránh race condition cho các request song song
          if (!refreshPromise) {
            refreshPromise = refreshTokenRequest(refreshToken).finally(() => {
              refreshPromise = null
            })
          }

          const refreshResponse = await refreshPromise
          const {
            accessToken,
            refreshToken: newRefreshToken,
            user,
          } = refreshResponse.data.data

          // Cập nhật Storage & Store
          AuthTokenService.setTokens(accessToken, newRefreshToken, user)
          useAuthStore.getState().setAuth({
            user,
            accessToken,
            refreshToken: newRefreshToken,
            isAuthenticated: true,
          })

          // Gán Access Token mới cho request ban đầu bị lỗi
          originalRequest.headers.Authorization = `Bearer ${accessToken}`

          // Thực hiện lại request ban đầu với instance duy nhất
          return instance.request(originalRequest)
        } catch (refreshError) {
          handleLogout()
          return Promise.reject(refreshError)
        }
      }
    }

    if (error.response?.status && error.response.status >= 500) {
      console.error('CRITICAL SERVER ERROR:', error.response.status)
    }

    return Promise.reject(error)
  },
)

// Main wrapper function sử dụng instance đã được khởi tạo
export const customAxios = <T = unknown>(
  config: AxiosRequestConfig,
): Promise<T> => {
  return instance.request<T>(config).then((res) => res.data)
}
