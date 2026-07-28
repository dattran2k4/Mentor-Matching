import { ROLES } from '@/constants/roles'
const MOCK_TOKEN_PREFIX = 'mock:'
const MOCK_PASSWORD = '123456'
const mockUsers = {
  'learner@test.com': {
    id: '1',
    email: 'learner@test.com',
    fullName: 'H\u1ECDc vi\xEAn Test',
    phone: '0900000001',
    userType: 'STUDENT',
    status: 'ACTIVE',
    roles: [ROLES.LEARNER]
  },
  'mentor@test.com': {
    id: '2',
    email: 'mentor@test.com',
    fullName: 'Mentor Test',
    phone: '0900000002',
    userType: 'WORKING_ADULT',
    status: 'ACTIVE',
    roles: [ROLES.MENTOR]
  },
  'admin@test.com': {
    id: '3',
    email: 'admin@test.com',
    fullName: 'Admin Test',
    phone: '0900000003',
    userType: 'WORKING_ADULT',
    status: 'ACTIVE',
    roles: [ROLES.ADMIN]
  }
}
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))
function getMockEmailFromToken(token) {
  if (!token?.startsWith(MOCK_TOKEN_PREFIX)) return null
  return token.slice(MOCK_TOKEN_PREFIX.length)
}
function isMockAccessToken(token) {
  return Boolean(getMockEmailFromToken(token))
}
function buildSuccessResponse(data, message = 'Success') {
  return {
    status: 200,
    code: 'SUCCESS',
    success: true,
    message,
    data
  }
}
function buildCreatedResponse(data, message = 'Created') {
  return {
    status: 201,
    code: 'SUCCESS',
    success: true,
    message,
    data
  }
}
function buildAuthResponse(email, user) {
  return {
    accessToken: `${MOCK_TOKEN_PREFIX}${email}`,
    accessTokenExpiresIn: 3600,
    refreshTokenExpiresIn: 604800,
    user: {
      id: Number(user.id),
      email: user.email,
      fullName: user.fullName,
      role: user.roles[0] ?? ROLES.LEARNER
    }
  }
}
const mockAuthApi = {
  async login(payload) {
    await delay()
    const email = payload.email.trim().toLowerCase()
    const user = mockUsers[email]
    if (!user || payload.password !== MOCK_PASSWORD) {
      throw new Error(
        'Email ho\u1EB7c m\u1EADt kh\u1EA9u kh\xF4ng \u0111\xFAng. D\xF9ng m\u1EADt kh\u1EA9u 123456 cho t\xE0i kho\u1EA3n test.'
      )
    }
    return buildSuccessResponse(buildAuthResponse(email, user), 'Login successfully')
  },
  async register(payload) {
    await delay()
    const email = payload.email.trim().toLowerCase()
    if (mockUsers[email]) {
      throw new Error('Email \u0111\xE3 t\u1ED3n t\u1EA1i trong mock data.')
    }
    if (payload.password !== payload.confirmPassword) {
      throw new Error('M\u1EADt kh\u1EA9u x\xE1c nh\u1EADn kh\xF4ng kh\u1EDBp.')
    }
    const nextUserId = String(Object.keys(mockUsers).length + 1)
    mockUsers[email] = {
      id: nextUserId,
      email,
      fullName: payload.fullName,
      phone: '',
      userType: 'STUDENT',
      status: 'ACTIVE',
      roles: [ROLES.LEARNER]
    }
    return buildCreatedResponse(buildAuthResponse(email, mockUsers[email]), 'Register successfully')
  },
  async refreshToken() {
    await delay()
    const mockAccessToken = localStorage.getItem('auth-storage')
    if (!mockAccessToken) {
      throw new Error('Kh\xF4ng c\xF3 phi\xEAn mock \u0111\u1EC3 refresh token.')
    }
    const parsedState = JSON.parse(mockAccessToken)
    const email = getMockEmailFromToken(parsedState.state?.accessToken ?? null)
    if (!email || !mockUsers[email]) {
      throw new Error('Phi\xEAn mock kh\xF4ng h\u1EE3p l\u1EC7 \u0111\u1EC3 refresh token.')
    }
    return buildSuccessResponse(
      buildAuthResponse(email, mockUsers[email]),
      'Refresh token successfully'
    )
  },
  async logout() {
    await delay()
    return buildSuccessResponse(null, 'Logout successfully')
  }
}
export { MOCK_TOKEN_PREFIX, getMockEmailFromToken, isMockAccessToken, mockAuthApi, mockUsers }
