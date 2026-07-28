import { env } from '@/config/env'
import http from '@/libs/http'
import { mockAuthApi } from '@/services/mock/auth.mock.api'
const AUTH_ENDPOINTS = {
  login: 'auth/login',
  register: 'auth/register',
  logout: 'auth/logout'
}
const defaultAuthApi = {
  login: async (payload) => (await http.post(AUTH_ENDPOINTS.login, payload)).data,
  register: async (payload) => (await http.post(AUTH_ENDPOINTS.register, payload)).data,
  logout: async () => (await http.post(AUTH_ENDPOINTS.logout, {})).data
}
const authApi = env.useMock ? mockAuthApi : defaultAuthApi
export { authApi }
