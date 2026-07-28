import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mentorApi } from '@/services/mentor.api'
import { adminMentorKeys } from './useAdminMentorsQuery'
function useReviewMentorApprovalMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }) => {
      await mentorApi.reviewMentorApproval(id, data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminMentorKeys.lists() })
    }
  })
}
export { useReviewMentorApprovalMutation }
