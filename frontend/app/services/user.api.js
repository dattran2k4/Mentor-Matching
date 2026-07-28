import { env } from '@/config/env'
import http from '@/libs/http'
import { mockUserApi } from '@/services/mock/user.mock.api'
const USER_ENDPOINTS = {
  publicCheck: 'users/public-check',
  me: 'users/me',
  learnerProfile: 'users/me/learner-profile',
  authCheck: 'users/auth-check',
  adminCheck: 'users/admin-check',
  adminUsers: 'admin/users',
  adminUserDetail: (userId) => `admin/users/${userId}`,
  adminUserStatus: (userId) => `admin/users/${userId}/status`
}
const defaultUserApi = {
  publicCheck: async () => (await http.get(USER_ENDPOINTS.publicCheck)).data,
  getCurrentUser: async () => (await http.get(USER_ENDPOINTS.me)).data,
  updateCurrentUser: async (payload) => (await http.put(USER_ENDPOINTS.me, payload)).data,
  getCurrentLearnerProfile: async () => (await http.get(USER_ENDPOINTS.learnerProfile)).data,
  upsertCurrentLearnerProfile: async (payload) =>
    (await http.put(USER_ENDPOINTS.learnerProfile, payload)).data,
  authCheck: async () => (await http.get(USER_ENDPOINTS.authCheck)).data,
  adminCheck: async () => (await http.get(USER_ENDPOINTS.adminCheck)).data,
  getAdminUsers: async (params) =>
    (
      await http.get(USER_ENDPOINTS.adminUsers, {
        params
      })
    ).data,
  getAdminUserDetail: async (userId) =>
    (await http.get(USER_ENDPOINTS.adminUserDetail(userId))).data,
  updateUserStatus: async (userId, payload) =>
    (await http.patch(USER_ENDPOINTS.adminUserStatus(userId), payload)).data
}
const userApi = env.useMock ? mockUserApi : defaultUserApi
export { userApi }
