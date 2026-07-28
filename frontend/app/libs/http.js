import axios from 'axios'
import { env } from '@/config/env'
import { path } from '@/config/path'
import { isMockAccessToken } from '@/services/mock/auth.mock.api'
import { HttpStatusCode } from '@/constants/http-status'
import { useAuthStore } from '@/stores/auth-store'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from '@/utils/http-error'
import { getCurrentLocale } from '@/utils/locale'
const REFRESH_TOKEN_URL = 'auth/refresh-token'
class HttpClient {
  instance
  refreshTokenRequest
  constructor() {
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: env.apiBaseUrl,
      timeout: 3e4,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        const accessToken = useAuthStore.getState().accessToken
        const locale = getCurrentLocale()
        if (config.headers) {
          config.headers['Accept-Language'] = locale
        }
        if (accessToken && config.headers && config.url !== REFRESH_TOKEN_URL) {
          config.headers.Authorization = accessToken.startsWith('Bearer ')
            ? accessToken
            : `Bearer ${accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const statusCode = error.response?.status
        if (statusCode === HttpStatusCode.Forbidden) {
          if (window.location.pathname !== path.forbidden) {
            window.location.assign(path.forbidden)
          }
          return Promise.reject(error)
        }
        if (statusCode !== HttpStatusCode.Unauthorized) {
          const accessToken = useAuthStore.getState().accessToken
          const isNetworkError = !error.response
          const skipNotify = env.useMock && (isNetworkError || isMockAccessToken(accessToken))
          if (skipNotify) return Promise.reject(error)
          return Promise.reject(error)
        }
        if (isAxiosUnauthorizedError(error)) {
          const config = error.config
          const requestUrl = config?.url || ''
          if (config && isAxiosExpiredTokenError(error) && requestUrl !== REFRESH_TOKEN_URL) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  this.refreshTokenRequest = null
                })
            return this.refreshTokenRequest.then((accessToken) => {
              return this.instance({
                ...config,
                headers: {
                  ...config.headers,
                  Authorization: `Bearer ${accessToken}`
                }
              })
            })
          }
          this.logoutAndRedirect()
        }
        return Promise.reject(error)
      }
    )
  }
  redirectToLogin() {
    if (window.location.pathname !== path.login) {
      window.location.assign(path.login)
    }
  }
  logoutAndRedirect() {
    useAuthStore.getState().logout()
    this.redirectToLogin()
  }
  handleRefreshToken() {
    const { setAccessToken } = useAuthStore.getState()
    return this.instance
      .post(REFRESH_TOKEN_URL, {})
      .then((res) => {
        const accessToken = res.data.data.accessToken
        setAccessToken(accessToken)
        return accessToken
      })
      .catch((error) => {
        this.logoutAndRedirect()
        throw error
      })
  }
}
const http = new HttpClient().instance
var stdin_default = http
export { stdin_default as default }
