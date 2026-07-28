import { queryOptions, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import { useAuthStore } from '@/stores/auth-store'
async function fetchCurrentMentorProfile() {
  const currentMentor = (await mentorApi.getCurrentMentor()).data
  const [
    subjectsResult,
    traitsResult,
    personalityOptionsResult,
    highlightOptionsResult,
    achievementsResult,
    verificationResult
  ] = await Promise.allSettled([
    mentorApi.getCurrentMentorSubjects(),
    mentorApi.getCurrentMentorTraits(),
    mentorApi.getPersonalityOptions(),
    mentorApi.getHighlightOptions(),
    mentorApi.getCurrentMentorAchievements(),
    mentorApi.getCurrentMentorVerification()
  ])
  return {
    currentMentor,
    subjects: subjectsResult.status === 'fulfilled' ? subjectsResult.value.data : [],
    traits: traitsResult.status === 'fulfilled' ? traitsResult.value.data : null,
    personalityOptions:
      personalityOptionsResult.status === 'fulfilled' ? personalityOptionsResult.value.data : [],
    highlightOptions:
      highlightOptionsResult.status === 'fulfilled' ? highlightOptionsResult.value.data : [],
    achievements: achievementsResult.status === 'fulfilled' ? achievementsResult.value.data : [],
    verification: verificationResult.status === 'fulfilled' ? verificationResult.value.data : null
  }
}
function getCurrentMentorProfileQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.mentor.currentProfile,
    queryFn: fetchCurrentMentorProfile
  })
}
function useCurrentMentorProfileQuery(enabled = true) {
  const accessToken = useAuthStore((state) => state.accessToken)
  return useQuery({
    ...getCurrentMentorProfileQueryOptions(),
    enabled: Boolean(accessToken) && enabled
  })
}
export { getCurrentMentorProfileQueryOptions, useCurrentMentorProfileQuery }
