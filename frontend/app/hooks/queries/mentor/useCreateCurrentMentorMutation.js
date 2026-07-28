import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
function useCreateCurrentMentorMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      const response = await mentorApi.createCurrentMentor(payload)
      return {
        currentMentor: response.data,
        message:
          response.message ||
          'H\u1ED3 s\u01A1 mentor \u0111\xE3 \u0111\u01B0\u1EE3c t\u1EA1o th\xE0nh c\xF4ng.'
      }
    },
    onSuccess: ({ currentMentor }) => {
      queryClient.setQueryData(QUERY_KEYS.mentor.currentProfile, (currentData) =>
        currentData
          ? {
              ...currentData,
              currentMentor
            }
          : currentData
      )
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentProfile,
        exact: true
      })
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentOnboardingStatus,
        exact: true
      })
    }
  })
}
export { useCreateCurrentMentorMutation }
