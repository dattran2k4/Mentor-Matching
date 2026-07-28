import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
function useDeleteCurrentMentorAchievementMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (achievementId) => {
      const response = await mentorApi.deleteCurrentMentorAchievement(achievementId)
      return {
        achievementId,
        message: response.message || '\u0110\xE3 x\xF3a th\xE0nh t\u1EF1u.'
      }
    },
    onSuccess: ({ achievementId }) => {
      queryClient.setQueryData(QUERY_KEYS.mentor.currentProfile, (currentData) =>
        currentData
          ? {
              ...currentData,
              achievements: currentData.achievements.filter((item) => item.id !== achievementId)
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
export { useDeleteCurrentMentorAchievementMutation }
