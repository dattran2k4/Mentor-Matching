import { queryOptions, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { userApi } from '@/services/user.api'
import { useAuthStore } from '@/stores/auth-store'
async function fetchCurrentLearnerProfile() {
  return (await userApi.getCurrentLearnerProfile()).data
}
function getCurrentLearnerProfileQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.user.learnerProfile,
    queryFn: fetchCurrentLearnerProfile
  })
}
function useCurrentLearnerProfileQuery() {
  const accessToken = useAuthStore((state) => state.accessToken)
  return useQuery({
    ...getCurrentLearnerProfileQueryOptions(),
    enabled: Boolean(accessToken)
  })
}
export { getCurrentLearnerProfileQueryOptions, useCurrentLearnerProfileQuery }
