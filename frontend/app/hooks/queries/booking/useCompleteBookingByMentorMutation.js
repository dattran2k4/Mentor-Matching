import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { bookingApi } from '@/services/booking.api'
function useCompleteBookingByMentorMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (bookingId) => bookingApi.completeBookingByMentor(bookingId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.booking.mentorMeBase })
    }
  })
}
export { useCompleteBookingByMentorMutation }
