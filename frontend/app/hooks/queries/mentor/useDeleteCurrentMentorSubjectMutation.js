import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
function useDeleteCurrentMentorSubjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (mentorSubjectId) => {
      const response = await mentorApi.deleteCurrentMentorSubject(mentorSubjectId)
      return {
        mentorSubjectId,
        message: response.message || '\u0110\xE3 x\xF3a m\xF4n d\u1EA1y.'
      }
    },
    onSuccess: ({ mentorSubjectId }) => {
      queryClient.setQueryData(QUERY_KEYS.mentor.currentProfile, (currentData) =>
        currentData
          ? {
              ...currentData,
              subjects: currentData.subjects.filter((subject) => subject.id !== mentorSubjectId)
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
export { useDeleteCurrentMentorSubjectMutation }
