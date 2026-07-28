import { queryOptions, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
async function fetchMentorProfile(mentorId) {
  const detail = (await mentorApi.getMentorDetail(mentorId)).data
  const [subjectsResult, traitsResult, achievementsResult] = await Promise.allSettled([
    mentorApi.getMentorSubjects(mentorId),
    mentorApi.getMentorTraits(mentorId),
    mentorApi.getMentorAchievements(mentorId)
  ])
  return {
    detail,
    subjects: subjectsResult.status === 'fulfilled' ? subjectsResult.value.data : [],
    traits: traitsResult.status === 'fulfilled' ? traitsResult.value.data : null,
    achievements: achievementsResult.status === 'fulfilled' ? achievementsResult.value.data : []
  }
}
function getMentorProfileQueryOptions(mentorId) {
  return queryOptions({
    queryKey: QUERY_KEYS.mentor.detail(mentorId),
    queryFn: () => fetchMentorProfile(mentorId)
  })
}
function useMentorProfileQuery(mentorId) {
  return useQuery({
    ...getMentorProfileQueryOptions(mentorId ?? 0),
    enabled: Boolean(mentorId && mentorId > 0)
  })
}
export { getMentorProfileQueryOptions, useMentorProfileQuery }
