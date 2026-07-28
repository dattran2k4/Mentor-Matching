import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
function useCreateCurrentMentorAchievementMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      const response = await mentorApi.createCurrentMentorAchievement(payload)
      return {
        achievement: response.data,
        message: response.message || '\u0110\xE3 t\u1EA1o th\xE0nh t\u1EF1u m\u1EDBi.'
      }
    },
    onSuccess: ({ achievement }) => {
      queryClient.setQueryData(QUERY_KEYS.mentor.currentProfile, (currentData) =>
        currentData
          ? {
              ...currentData,
              achievements: [...currentData.achievements, achievement]
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
export { useCreateCurrentMentorAchievementMutation }
