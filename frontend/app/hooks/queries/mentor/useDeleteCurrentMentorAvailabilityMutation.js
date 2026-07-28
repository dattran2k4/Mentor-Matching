import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
function useDeleteCurrentMentorAvailabilityMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (availabilityId) => {
      const response = await mentorApi.deleteCurrentMentorAvailability(availabilityId)
      return {
        availabilityId,
        message: response.message || '\u0110\xE3 x\xF3a khung gi\u1EDD.'
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentSchedule,
        exact: true
      })
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentOnboardingStatus,
        exact: true
      })
    }
  })
}
export { useDeleteCurrentMentorAvailabilityMutation }
