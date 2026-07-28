import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
async function fetchDiscoverMentors(params) {
  return (await mentorApi.getMentors(params)).data
}
function getDiscoverMentorsQueryOptions(params) {
  return queryOptions({
    queryKey: QUERY_KEYS.mentor.list({
      page: params.page ?? 1,
      size: params.size ?? 12,
      search: params.search?.trim() || null,
      gender: params.gender ?? null,
      meetingType: params.meetingType ?? null,
      cityId: params.cityId ?? null,
      districtId: params.districtId ?? null,
      subjectId: params.subjectId ?? null,
      gradeId: params.gradeId ?? null,
      sortBy: params.sortBy ?? null,
      sortDir: params.sortDir ?? null
    }),
    queryFn: () => fetchDiscoverMentors(params),
    placeholderData: keepPreviousData
  })
}
function useDiscoverMentorsQuery(params) {
  return useQuery(getDiscoverMentorsQueryOptions(params))
}
export { getDiscoverMentorsQueryOptions, useDiscoverMentorsQuery }
