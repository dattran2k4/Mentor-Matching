import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
function useUpsertCurrentMentorSubjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      const response = await mentorApi.upsertCurrentMentorSubject(payload)
      return {
        subject: response.data,
        message: response.message || '\u0110\xE3 l\u01B0u m\xF4n d\u1EA1y.'
      }
    },
    onSuccess: ({ subject }) => {
      queryClient.setQueryData(QUERY_KEYS.mentor.currentProfile, (currentData) =>
        currentData
          ? {
              ...currentData,
              subjects: upsertSubject(currentData.subjects, subject)
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
function upsertSubject(subjects, nextSubject) {
  const subjectExists = subjects.some((subject) => subject.id === nextSubject.id)
  return subjectExists
    ? subjects.map((subject) => (subject.id === nextSubject.id ? nextSubject : subject))
    : [...subjects, nextSubject]
}
export { useUpsertCurrentMentorSubjectMutation }
