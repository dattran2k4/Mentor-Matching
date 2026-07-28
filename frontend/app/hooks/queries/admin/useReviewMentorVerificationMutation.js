import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mentorApi } from '@/services/mentor.api'
import { adminMentorVerificationKeys } from './useAdminMentorVerificationsQuery'
function useReviewMentorVerificationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }) => {
      await mentorApi.reviewMentorVerification(id, data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminMentorVerificationKeys.lists() })
    }
  })
}
export { useReviewMentorVerificationMutation }
