import { queryOptions, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import { useAuthStore } from '@/stores/auth-store'
async function fetchCurrentMentorOnboardingStatus() {
  return (await mentorApi.getCurrentMentorOnboardingStatus()).data
}
function getCurrentMentorOnboardingStatusQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.mentor.currentOnboardingStatus,
    queryFn: fetchCurrentMentorOnboardingStatus
  })
}
function useCurrentMentorOnboardingStatusQuery() {
  const accessToken = useAuthStore((state) => state.accessToken)
  return useQuery({
    ...getCurrentMentorOnboardingStatusQueryOptions(),
    enabled: Boolean(accessToken)
  })
}
export { getCurrentMentorOnboardingStatusQueryOptions, useCurrentMentorOnboardingStatusQuery }
