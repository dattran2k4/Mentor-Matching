import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
function useUpsertCurrentMentorVerificationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      const response = await mentorApi.upsertCurrentMentorVerification(payload)
      return {
        verification: response.data,
        message: response.message || '\u0110\xE3 g\u1EEDi y\xEAu c\u1EA7u x\xE1c th\u1EF1c.'
      }
    },
    onSuccess: ({ verification }) => {
      queryClient.setQueryData(QUERY_KEYS.mentor.currentVerification, verification)
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentVerification,
        exact: true
      })
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentProfile,
        exact: true
      })
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentOnboardingStatus,
        exact: true
      })
    },
    onError: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentVerification,
        exact: true
      })
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentOnboardingStatus,
        exact: true
      })
    }
  })
}
export { useUpsertCurrentMentorVerificationMutation }
