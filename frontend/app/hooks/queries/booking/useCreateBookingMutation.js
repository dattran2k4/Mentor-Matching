import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { bookingApi } from '@/services/booking.api'
function useCreateBookingMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      const response = await bookingApi.createBooking(payload)
      return {
        bookingId: response.data.bookingId,
        message:
          response.message ||
          '\u0110\xE3 g\u1EEDi y\xEAu c\u1EA7u \u0111\u1EB7t l\u1ECBch th\xE0nh c\xF4ng.'
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.booking.me,
        exact: false
      })
    }
  })
}
export { useCreateBookingMutation }
