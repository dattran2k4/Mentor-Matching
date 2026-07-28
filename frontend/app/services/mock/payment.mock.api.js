import { useAuthStore } from '@/stores/auth-store'
import { getMockEmailFromToken, mockUsers } from '@/services/mock/auth.mock.api'
import { mockBookingApi } from '@/services/mock/booking.mock.api'
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))
function buildCreatedResponse(data, message = 'Created') {
  return {
    status: 201,
    code: 'SUCCESS',
    success: true,
    message,
    data
  }
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
const mockPaymentApi = {
  async createPayment(payload) {
    await delay()
    const { user } = requireMockSession()
    const paymentId = Date.now()
    return buildCreatedResponse(
      {
        id: paymentId,
        bookingId: payload.bookingId,
        payerUserId: Number(user.id),
        amount: 3e5,
        paymentMethod: 'GATEWAY',
        paymentProvider: 'STRIPE',
        status: 'PENDING',
        checkoutUrl: `https://checkout.stripe.example/pay/${paymentId}`,
        expiresAt: new Date(Date.now() + 30 * 60 * 1e3).toISOString()
      },
      'Create payment successfully'
    )
  },
  async getMyPayments(params) {
    await delay()
    const bookingsResponse = await mockBookingApi.getMyBookings({ page: 1, size: 100 })
    const payments = bookingsResponse.data.data.map((booking) => {
      const status = booking.status === 'PENDING' ? 'PENDING' : 'PAID'
      return {
        id: booking.id,
        bookingId: booking.id,
        amount: booking.totalAmount,
        status,
        paidAt: status === 'PAID' ? booking.updatedAt : null,
        createdAt: booking.createdAt
      }
    })
    const filtered = params?.status
      ? payments.filter((payment) => payment.status === params.status)
      : payments
    return buildSuccessResponse(
      paginate(filtered, params?.page ?? 1, params?.size ?? 10),
      'Get my payments successfully'
    )
  },
  async getMentorPayments(params) {
    await delay()
    const { email } = requireMockSession()
    const mentorId = email === 'mentor@test.com' ? 101 : 102
    const bookingsResponse = await mockBookingApi.getMentorBookings({ page: 1, size: 100 })
    const payments = bookingsResponse.data.data
      .filter((booking) => booking.mentorId === mentorId)
      .map((booking) => {
        const status = booking.status === 'PENDING' ? 'PENDING' : 'PAID'
        return {
          id: booking.id,
          bookingId: booking.id,
          amount: booking.totalAmount,
          status,
          paidAt: status === 'PAID' ? booking.updatedAt : null,
          createdAt: booking.createdAt
        }
      })
    const filtered = params?.status
      ? payments.filter((payment) => payment.status === params.status)
      : payments
    return buildSuccessResponse(
      paginate(filtered, params?.page ?? 1, params?.size ?? 10),
      'Get mentor payments successfully'
    )
  },
  async getPaymentDetail(paymentId) {
    await delay()
    const { user } = requireMockSession()
    const bookingsResponse = await mockBookingApi.getMyBookings({ page: 1, size: 100 })
    const matchedBooking =
      bookingsResponse.data.data.find((booking) => booking.id === paymentId) ??
      bookingsResponse.data.data.find((booking) => booking.status === 'PENDING') ??
      bookingsResponse.data.data[0]
    const bookingId = matchedBooking?.id ?? paymentId
    const amount = matchedBooking?.totalAmount ?? 3e5
    const status = matchedBooking?.status === 'PENDING' ? 'PAID' : 'PAID'
    return buildSuccessResponse(
      {
        id: paymentId,
        bookingId,
        amount,
        status,
        bookingStatus: matchedBooking?.status ?? 'CONFIRMED',
        providerReferenceId: `cs_test_mock_${paymentId}`,
        providerTransactionId: `pi_mock_${paymentId}`,
        paidAt: /* @__PURE__ */ new Date().toISOString(),
        expiresAt: null,
        failureReason: null,
        createdAt: matchedBooking?.createdAt ?? /* @__PURE__ */ new Date().toISOString(),
        updatedAt: /* @__PURE__ */ new Date().toISOString()
      },
      `Get payment detail successfully for user ${user.id}`
    )
  }
}
export { mockPaymentApi }
