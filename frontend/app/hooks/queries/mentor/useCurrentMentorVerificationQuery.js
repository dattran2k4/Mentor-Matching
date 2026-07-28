import { queryOptions, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import { useAuthStore } from '@/stores/auth-store'
async function fetchCurrentMentorVerification() {
  return (await mentorApi.getCurrentMentorVerification()).data
}
function getCurrentMentorVerificationQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.mentor.currentVerification,
    queryFn: fetchCurrentMentorVerification
  })
}
function useCurrentMentorVerificationQuery(enabled = true) {
  const accessToken = useAuthStore((state) => state.accessToken)
  return useQuery({
    ...getCurrentMentorVerificationQueryOptions(),
    enabled: Boolean(accessToken) && enabled
  })
}
export { getCurrentMentorVerificationQueryOptions, useCurrentMentorVerificationQuery }
