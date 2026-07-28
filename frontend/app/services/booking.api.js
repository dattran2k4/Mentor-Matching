import { env } from '@/config/env'
import http from '@/libs/http'
import { mockBookingApi } from '@/services/mock/booking.mock.api'
const BOOKING_ENDPOINTS = {
  bookings: 'bookings',
  myBookings: 'bookings/me',
  myMentorBookings: 'bookings/mentor/me',
  completeBooking: (bookingId) => `bookings/${bookingId}/complete`,
  forceCancelBooking: (bookingId) => `bookings/${bookingId}/force-cancel`
}
const defaultBookingApi = {
  createBooking: async (payload) => (await http.post(BOOKING_ENDPOINTS.bookings, payload)).data,
  getBookings: async (params) =>
    (
      await http.get(BOOKING_ENDPOINTS.bookings, {
        params
      })
    ).data,
  getMyBookings: async (params) =>
    (
      await http.get(BOOKING_ENDPOINTS.myBookings, {
        params
      })
    ).data,
  getMentorBookings: async (params) =>
    (
      await http.get(BOOKING_ENDPOINTS.myMentorBookings, {
        params
      })
    ).data,
  completeBookingByMentor: async (bookingId) =>
    (await http.patch(BOOKING_ENDPOINTS.completeBooking(bookingId))).data,
  forceCancelBooking: async (bookingId, payload) =>
    (await http.patch(BOOKING_ENDPOINTS.forceCancelBooking(bookingId), payload)).data
}
const bookingApi = env.useMock ? mockBookingApi : defaultBookingApi
export { bookingApi }
