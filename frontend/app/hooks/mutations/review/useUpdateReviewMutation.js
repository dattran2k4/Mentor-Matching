import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewKeys } from '@/hooks/queries/review/keys'
import { reviewApi } from '@/services/review.api'
function useUpdateReviewMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => reviewApi.updateReview(id, payload),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: reviewKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: reviewKeys.summaries() })
      void queryClient.invalidateQueries({ queryKey: reviewKeys.detail(id) })
    }
  })
}
export { useUpdateReviewMutation }
