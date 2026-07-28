import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
function useUpdateCurrentMentorTraitsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      const response = await mentorApi.updateCurrentMentorTraits(payload)
      return {
        traits: response.data,
        message:
          response.message ||
          'N\u1ED5i b\u1EADt v\xE0 \u0111\u1EB7c \u0111i\u1EC3m \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt th\xE0nh c\xF4ng.'
      }
    },
    onSuccess: ({ traits }) => {
      queryClient.setQueryData(QUERY_KEYS.mentor.currentProfile, (currentData) =>
        currentData
          ? {
              ...currentData,
              traits
            }
          : currentData
      )
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentProfile,
        exact: true
      })
    },
    onError: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentProfile,
        exact: true
      })
    }
  })
}
export { useUpdateCurrentMentorTraitsMutation }
