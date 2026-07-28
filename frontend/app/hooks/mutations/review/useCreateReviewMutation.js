import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewKeys } from '@/hooks/queries/review/keys'
import { reviewApi } from '@/services/review.api'
function useCreateReviewMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => reviewApi.createReview(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reviewKeys.all })
    }
  })
}
export { useCreateReviewMutation }
