import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingApi } from '@/services/booking.api'
import { adminBookingKeys } from './useAdminBookingsQuery'
function useForceCancelBookingMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }) => {
      await bookingApi.forceCancelBooking(id, data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminBookingKeys.lists() })
    }
  })
}
export { useForceCancelBookingMutation }
