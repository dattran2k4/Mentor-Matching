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
function buildCreatedResponse(data, message = 'Created') {
  return {
    status: 201,
    code: 'SUCCESS',
    success: true,
    message,
    data
  }
}
function requireMockSession() {
  const email = getMockEmailFromToken(useAuthStore.getState().accessToken)
  if (!email || !mockUsers[email]) {
    throw new Error('Phi\xEAn \u0111\u0103ng nh\u1EADp mock kh\xF4ng h\u1EE3p l\u1EC7')
  }
  return {
    email,
    user: mockUsers[email]
  }
}
function paginate(items, page = 1, size = 10) {
  const pageSize = size
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startIndex = (page - 1) * pageSize
  return {
    page,
    pageSize,
    totalPages,
    totalItems,
    data: items.slice(startIndex, startIndex + pageSize)
  }
}
function normalizeQuery(value) {
  return value?.trim().toLowerCase() ?? ''
}
function isWithinDateRange(value, from, to) {
  if (from && value < from) return false
  if (to && value > to) return false
  return true
}
let mockBookings = [
  {
    id: 2001,
    studentUserId: 1,
    studentName: 'H\u1ECDc vi\xEAn Test',
    mentorId: 101,
    mentorName: 'Mentor Test',
    mentorSubjectId: 1002,
    subjectName: 'Toan',
    gradeName: 'Lop 9',
    bookingDate: '2026-06-11',
    startTime: '14:00:00',
    endTime: '15:30:00',
    pricePerHour: 28e4,
    totalAmount: 42e4,
    meetingType: 'ONLINE',
    meetingLink: 'https://meet.example.com/session-2001',
    meetingAddress: null,
    status: 'CONFIRMED',
    note: 'On he phuong trinh va hinh hoc.',
    cancelledBy: null,
    cancelReason: null,
    createdAt: '2026-06-09T09:00:00',
    updatedAt: '2026-06-09T09:00:00'
  },
  {
    id: 2002,
    studentUserId: 1,
    studentName: 'H\u1ECDc vi\xEAn Test',
    mentorId: 102,
    mentorName: 'Tran Quoc Huy',
    mentorSubjectId: 1003,
    subjectName: 'Tieng Anh',
    gradeName: 'Lop 12',
    bookingDate: '2026-06-13',
    startTime: '19:00:00',
    endTime: '20:00:00',
    pricePerHour: 3e5,
    totalAmount: 3e5,
    meetingType: 'ONLINE',
    meetingLink: 'https://meet.example.com/session-2002',
    meetingAddress: null,
    status: 'PENDING',
    note: 'Tap trung speaking va phat am.',
    cancelledBy: null,
    cancelReason: null,
    createdAt: '2026-06-10T09:00:00',
    updatedAt: '2026-06-10T09:00:00'
  },
  {
    id: 2003,
    studentUserId: 5,
    studentName: 'Ngoc Linh',
    mentorId: 101,
    mentorName: 'Mentor Test',
    mentorSubjectId: 1001,
    subjectName: 'Toan',
    gradeName: 'Lop 8',
    bookingDate: '2026-06-12',
    startTime: '19:00:00',
    endTime: '20:00:00',
    pricePerHour: 24e4,
    totalAmount: 24e4,
    meetingType: 'ONLINE',
    meetingLink: 'https://meet.example.com/session-2003',
    meetingAddress: null,
    status: 'CONFIRMED',
    note: 'On phan tich da thuc.',
    cancelledBy: null,
    cancelReason: null,
    createdAt: '2026-06-10T11:00:00',
    updatedAt: '2026-06-10T11:00:00'
  }
]
function filterCommonBookings(bookings, params) {
  return bookings.filter((booking) => {
    const mentorQuery = normalizeQuery(params?.mentorName)
    const studentQuery = normalizeQuery(params?.studentName)
    if (params?.status && booking.status !== params.status) return false
    if (params?.meetingType && booking.meetingType !== params.meetingType) return false
    if (mentorQuery && !booking.mentorName.toLowerCase().includes(mentorQuery)) return false
    if (studentQuery && !booking.studentName.toLowerCase().includes(studentQuery)) return false
    return isWithinDateRange(booking.bookingDate, params?.bookingDateFrom, params?.bookingDateTo)
  })
}
const mockBookingApi = {
  async createBooking(payload) {
    await delay()
    const { user } = requireMockSession()
    const durationHours =
      (Number(payload.endTime.slice(0, 2)) * 60 +
        Number(payload.endTime.slice(3, 5)) -
        (Number(payload.startTime.slice(0, 2)) * 60 + Number(payload.startTime.slice(3, 5)))) /
      60
    const pricePerHour = 28e4
    const bookingId = Date.now()
    mockBookings = [
      {
        id: bookingId,
        studentUserId: Number(user.id),
        studentName: user.fullName,
        mentorId: payload.mentorId,
        mentorName: payload.mentorId === 101 ? 'Mentor Test' : 'Tran Quoc Huy',
        mentorSubjectId: payload.mentorSubjectId,
        subjectName: payload.mentorSubjectId === 1003 ? 'Tieng Anh' : 'Toan',
        gradeName: payload.mentorSubjectId === 1003 ? 'Lop 12' : 'Lop 9',
        bookingDate: payload.bookingDate,
        startTime: payload.startTime,
        endTime: payload.endTime,
        pricePerHour,
        totalAmount: Math.max(pricePerHour * durationHours, 0),
        meetingType: payload.meetingType,
        meetingLink:
          payload.meetingType === 'ONLINE' ? `https://meet.example.com/session-${bookingId}` : null,
        meetingAddress: payload.meetingType === 'OFFLINE' ? 'Quan 7, TP.HCM' : null,
        status: 'PENDING',
        note: payload.note ?? null,
        cancelledBy: null,
        cancelReason: null,
        createdAt: /* @__PURE__ */ new Date().toISOString(),
        updatedAt: /* @__PURE__ */ new Date().toISOString()
      },
      ...mockBookings
    ]
    return buildCreatedResponse({ bookingId }, 'Create booking successfully')
  },
  async getBookings(params) {
    await delay()
    requireMockSession()
    const filtered = filterCommonBookings(mockBookings, params)
    return buildSuccessResponse(
      paginate(filtered, params?.page ?? 1, params?.size ?? 10),
      'Get bookings successfully'
    )
  },
  async getMyBookings(params) {
    await delay()
    const { user } = requireMockSession()
    const filtered = mockBookings.filter((booking) => {
      if (booking.studentUserId !== Number(user.id)) return false
      if (params?.status && booking.status !== params.status) return false
      if (params?.meetingType && booking.meetingType !== params.meetingType) return false
      return true
    })
    return buildSuccessResponse(
      paginate(filtered, params?.page ?? 1, params?.size ?? 10),
      'Get my bookings successfully'
    )
  },
  async getMentorBookings(params) {
    await delay()
    const { email } = requireMockSession()
    const mentorId = email === 'mentor@test.com' ? 101 : 102
    const filtered = mockBookings.filter((booking) => {
      if (booking.mentorId !== mentorId) return false
      if (params?.status && booking.status !== params.status) return false
      if (params?.meetingType && booking.meetingType !== params.meetingType) return false
      return isWithinDateRange(booking.bookingDate, params?.bookingDateFrom, params?.bookingDateTo)
    })
    return buildSuccessResponse(
      paginate(filtered, params?.page ?? 1, params?.size ?? 10),
      'Get mentor bookings successfully'
    )
  },
  async completeBookingByMentor(bookingId) {
    await delay()
    requireMockSession()
    mockBookings = mockBookings.map((booking) =>
      booking.id === bookingId
        ? {
            ...booking,
            status: 'COMPLETED',
            updatedAt: /* @__PURE__ */ new Date().toISOString()
          }
        : booking
    )
    return buildSuccessResponse(null, 'Complete booking successfully')
  },
  async forceCancelBooking(bookingId, payload) {
    await delay()
    requireMockSession()
    mockBookings = mockBookings.map((booking) =>
      booking.id === bookingId
        ? {
            ...booking,
            status: 'CANCELLED',
            cancelledBy: 0,
            cancelReason: payload.cancelReason,
            updatedAt: /* @__PURE__ */ new Date().toISOString()
          }
        : booking
    )
    return buildSuccessResponse(null, 'Force cancel booking successfully')
  }
}
export { mockBookingApi }
