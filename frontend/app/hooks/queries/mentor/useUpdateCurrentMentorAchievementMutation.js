import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
function useUpdateCurrentMentorAchievementMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ achievementId, payload }) => {
      const response = await mentorApi.updateCurrentMentorAchievement(achievementId, payload)
      return {
        achievement: response.data,
        message: response.message || '\u0110\xE3 c\u1EADp nh\u1EADt th\xE0nh t\u1EF1u.'
      }
    },
    onSuccess: ({ achievement }) => {
      queryClient.setQueryData(QUERY_KEYS.mentor.currentProfile, (currentData) =>
        currentData
          ? {
              ...currentData,
              achievements: currentData.achievements.map((item) =>
                item.id === achievement.id ? achievement : item
              )
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
export { useUpdateCurrentMentorAchievementMutation }
