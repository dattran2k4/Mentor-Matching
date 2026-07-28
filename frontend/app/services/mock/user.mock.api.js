import { ROLES } from '@/constants/roles'
import { useAuthStore } from '@/stores/auth-store'
import { getMockEmailFromToken, mockUsers } from '@/services/mock/auth.mock.api'
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))
function buildSuccessResponse(data, message = 'Success') {
  return {
    status: 200,
    code: 'SUCCESS',
    success: true,
    message,
    data
  }
}
const mockUserProfileStateByEmail = {
  'learner@test.com': {
    phone: '0900000001',
    userType: 'STUDENT'
  },
  'mentor@test.com': {
    phone: '0900000002',
    userType: 'WORKING_ADULT'
  },
  'admin@test.com': {
    phone: '0900000003',
    userType: 'WORKING_ADULT'
  }
}
const mockLearnerProfileStateByEmail = {
  'learner@test.com': {
    id: 1,
    userId: 1,
    gender: 'MALE',
    birthYear: 2009,
    schoolName: 'THCS Nguyen Du',
    gradeId: 8,
    learningGoal: 'Cung co nen tang Toan va Tieng Anh de cai thien ket qua hoc tap.',
    createdAt: '2026-06-01T09:00:00',
    updatedAt: '2026-06-09T09:00:00'
  }
}
let adminUserRecords = [
  {
    id: 1,
    fullName: 'H\u1ECDc vi\xEAn Test',
    email: 'learner@test.com',
    phone: '0900000001',
    role: 'LEARNER',
    userType: 'STUDENT',
    status: 'ACTIVE',
    createdAt: '2026-05-01T09:00:00'
  },
  {
    id: 2,
    fullName: 'Mentor Test',
    email: 'mentor@test.com',
    phone: '0900000002',
    role: 'MENTOR',
    userType: 'WORKING_ADULT',
    status: 'ACTIVE',
    createdAt: '2026-05-01T09:00:00'
  },
  {
    id: 3,
    fullName: 'Admin Test',
    email: 'admin@test.com',
    phone: '0900000003',
    role: 'ADMIN',
    userType: 'WORKING_ADULT',
    status: 'ACTIVE',
    createdAt: '2026-05-01T09:00:00'
  },
  {
    id: 4,
    fullName: 'Tran Quoc Huy',
    email: 'huy.tran@test.com',
    phone: '0900000004',
    role: 'MENTOR',
    userType: 'WORKING_ADULT',
    status: 'ACTIVE',
    createdAt: '2026-05-10T09:00:00'
  },
  {
    id: 5,
    fullName: 'Ngoc Linh',
    email: 'linh.ngoc@test.com',
    phone: '0900000005',
    role: 'LEARNER',
    userType: 'STUDENT',
    status: 'INACTIVE',
    createdAt: '2026-05-15T09:00:00'
  },
  {
    id: 6,
    fullName: 'Pham Van Spam',
    email: 'spam.account@test.com',
    phone: '0900000006',
    role: 'LEARNER',
    userType: 'STUDENT',
    status: 'BANNED',
    createdAt: '2026-05-20T09:00:00'
  }
]
function paginateAdminUsers(items, page = 1, size = 10) {
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / size))
  const startIndex = (page - 1) * size
  return {
    page,
    pageSize: size,
    totalPages,
    totalItems,
    data: items.slice(startIndex, startIndex + size)
  }
}
function toAdminUserDetail(item) {
  return {
    ...item,
    totalBookings: item.role === 'LEARNER' ? 3 : 0,
    totalSpent: item.role === 'LEARNER' ? 75e4 : 0
  }
}
function getCurrentMockSession() {
  const email = getMockEmailFromToken(useAuthStore.getState().accessToken)
  if (!email || !mockUsers[email]) {
    throw new Error('Phi\xEAn \u0111\u0103ng nh\u1EADp mock kh\xF4ng h\u1EE3p l\u1EC7')
  }
  return {
    email,
    user: mockUsers[email]
  }
}
function getCurrentUserResponse(email, user) {
  const profileState = mockUserProfileStateByEmail[email] ?? {
    phone: '',
    userType: null
  }
  return {
    id: Number(user.id),
    email: user.email,
    fullName: user.fullName,
    phone: profileState.phone,
    role: user.roles[0] ?? ROLES.LEARNER,
    userType: profileState.userType,
    status: 'ACTIVE'
  }
}
function getEmptyLearnerProfile(userId) {
  return {
    id: null,
    userId,
    gender: null,
    birthYear: null,
    schoolName: null,
    gradeId: null,
    learningGoal: null,
    createdAt: null,
    updatedAt: null
  }
}
const mockUserApi = {
  async publicCheck() {
    await delay()
    return buildSuccessResponse('User public endpoint is reachable')
  },
  async getCurrentUser() {
    await delay()
    const { email, user } = getCurrentMockSession()
    return buildSuccessResponse(
      getCurrentUserResponse(email, user),
      'Get current user successfully'
    )
  },
  async updateCurrentUser(payload) {
    await delay()
    const { email, user } = getCurrentMockSession()
    mockUsers[email] = {
      ...user,
      fullName: payload.fullName
    }
    mockUserProfileStateByEmail[email] = {
      phone: payload.phone,
      userType: payload.userType
    }
    return buildSuccessResponse(
      getCurrentUserResponse(email, mockUsers[email]),
      'Update user profile successfully'
    )
  },
  async getCurrentLearnerProfile() {
    await delay()
    const { email, user } = getCurrentMockSession()
    return buildSuccessResponse(
      mockLearnerProfileStateByEmail[email] ?? getEmptyLearnerProfile(Number(user.id))
    )
  },
  async upsertCurrentLearnerProfile(payload) {
    await delay()
    const { email, user } = getCurrentMockSession()
    const currentProfile =
      mockLearnerProfileStateByEmail[email] ?? getEmptyLearnerProfile(Number(user.id))
    const now = /* @__PURE__ */ new Date().toISOString()
    const nextProfile = {
      ...currentProfile,
      gender: payload.gender ?? null,
      birthYear: payload.birthYear ?? null,
      schoolName: payload.schoolName ?? null,
      gradeId: payload.gradeId ?? null,
      learningGoal: payload.learningGoal ?? null,
      id: currentProfile.id ?? Number(user.id),
      createdAt: currentProfile.createdAt ?? now,
      updatedAt: now
    }
    mockLearnerProfileStateByEmail[email] = nextProfile
    return buildSuccessResponse(nextProfile, 'Save learner profile successfully')
  },
  async authCheck() {
    await delay()
    getCurrentMockSession()
    return buildSuccessResponse('Authenticated user endpoint is reachable')
  },
  async adminCheck() {
    await delay()
    const { user } = getCurrentMockSession()
    if (!user.roles.includes(ROLES.ADMIN)) {
      throw new Error('Mock user is not allowed to access admin endpoint')
    }
    return buildSuccessResponse('Admin endpoint is reachable')
  },
  async getAdminUsers(params) {
    await delay()
    getCurrentMockSession()
    const normalizedSearch = params?.search?.trim().toLowerCase() ?? ''
    const filtered = adminUserRecords.filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.fullName.toLowerCase().includes(normalizedSearch) ||
        item.email.toLowerCase().includes(normalizedSearch)
      const matchesRole = !params?.role || item.role === params.role
      const matchesStatus = !params?.status || item.status === params.status
      return matchesSearch && matchesRole && matchesStatus
    })
    return buildSuccessResponse(
      paginateAdminUsers(filtered, params?.page ?? 1, params?.size ?? 10),
      'Get admin users successfully'
    )
  },
  async getAdminUserDetail(userId) {
    await delay()
    getCurrentMockSession()
    const item = adminUserRecords.find((record) => record.id === userId)
    if (!item) {
      throw new Error('Mock user not found')
    }
    return buildSuccessResponse(toAdminUserDetail(item), 'Get admin user detail successfully')
  },
  async updateUserStatus(userId, payload) {
    await delay()
    getCurrentMockSession()
    adminUserRecords = adminUserRecords.map((item) =>
      item.id === userId
        ? { ...item, status: payload.action === 'BAN' ? 'BANNED' : 'ACTIVE' }
        : item
    )
    const updated = adminUserRecords.find((record) => record.id === userId)
    if (!updated) {
      throw new Error('Mock user not found')
    }
    return buildSuccessResponse(toAdminUserDetail(updated), 'Update user status successfully')
  }
}
export { mockUserApi }
