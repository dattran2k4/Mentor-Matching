import { queryOptions, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
async function fetchFeaturedMentors(params) {
  const mentorPage = (await mentorApi.getMentors(params)).data
  return mentorPage.data
}
function getFeaturedMentorsQueryOptions(params) {
  return queryOptions({
    queryKey: QUERY_KEYS.mentor.featured({
      page: params.page ?? 1,
      size: params.size ?? 3,
      sortBy: params.sortBy ?? 'createdAt',
      sortDir: params.sortDir ?? 'desc'
    }),
    queryFn: () => fetchFeaturedMentors(params)
  })
}
function useFeaturedMentorsQuery(params) {
  return useQuery(getFeaturedMentorsQueryOptions(params))
}
export { getFeaturedMentorsQueryOptions, useFeaturedMentorsQuery }
