import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
function useUpsertCurrentMentorAvailabilityMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ availabilityId, payload }) => {
      if (availabilityId) {
        const response2 = await mentorApi.updateCurrentMentorAvailability(availabilityId, payload)
        return {
          availabilityId,
          message: response2.message || '\u0110\xE3 c\u1EADp nh\u1EADt khung gi\u1EDD.'
        }
      }
      const response = await mentorApi.createCurrentMentorAvailability(payload)
      return {
        availabilityId: response.data.availabilityId,
        message: response.message || '\u0110\xE3 th\xEAm khung gi\u1EDD.'
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
export { useUpsertCurrentMentorAvailabilityMutation }
