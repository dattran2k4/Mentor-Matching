import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
function useUpdateCurrentMentorAvatarMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      const response = await mentorApi.updateCurrentMentorAvatar(payload)
      return {
        currentMentor: response.data,
        message:
          response.message ||
          '\u1EA2nh \u0111\u1EA1i di\u1EC7n mentor \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt.'
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
    }
  })
}
export { useUpdateCurrentMentorAvatarMutation }
