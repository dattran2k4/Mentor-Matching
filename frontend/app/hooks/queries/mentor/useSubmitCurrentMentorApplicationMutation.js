import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
function useSubmitCurrentMentorApplicationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const response = await mentorApi.submitCurrentMentorApplication()
      return {
        onboardingStatus: response.data,
        message:
          response.message ||
          '\u0110\xE3 g\u1EEDi h\u1ED3 s\u01A1 mentor \u0111\u1EC3 x\xE9t duy\u1EC7t.'
      }
    },
    onSuccess: ({ onboardingStatus }) => {
      queryClient.setQueryData(QUERY_KEYS.mentor.currentOnboardingStatus, onboardingStatus)
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentOnboardingStatus,
        exact: true
      })
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentProfile,
        exact: true
      })
    }
  })
}
export { useSubmitCurrentMentorApplicationMutation }
