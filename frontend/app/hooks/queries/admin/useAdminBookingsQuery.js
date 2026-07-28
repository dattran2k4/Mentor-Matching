import { useQuery } from '@tanstack/react-query'
import { bookingApi } from '@/services/booking.api'
const adminBookingKeys = {
  all: ['admin-bookings'],
  lists: () => [...adminBookingKeys.all, 'list'],
  list: (params) => [...adminBookingKeys.lists(), params]
}
function useAdminBookingsQuery(params) {
  return useQuery({
    queryKey: adminBookingKeys.list(params),
    queryFn: async () => {
      const response = await bookingApi.getBookings(params)
      return response.data
    }
  })
}
export { adminBookingKeys, useAdminBookingsQuery }
