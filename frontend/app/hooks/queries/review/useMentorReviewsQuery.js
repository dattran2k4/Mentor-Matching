import { useInfiniteQuery } from '@tanstack/react-query'
import { reviewApi } from '@/services/review.api'
import { reviewKeys } from './keys'
function useMentorReviewsQuery(mentorId, params) {
  return useInfiniteQuery({
    queryKey: reviewKeys.list(mentorId, params),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await reviewApi.getMentorReviews(mentorId, {
        ...params,
        page: pageParam
      })
      return response.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage
      return page < totalPages ? page + 1 : void 0
    },
    enabled: !!mentorId
  })
}
export { useMentorReviewsQuery }
