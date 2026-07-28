import { queryOptions, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { paymentApi } from '@/services/payment.api'
import { useAuthStore } from '@/stores/auth-store'
const defaultParams = {
  page: 1,
  size: 100
}
async function fetchCurrentMentorPayments(params) {
  return (await paymentApi.getMentorPayments(params)).data
}
function getCurrentMentorPaymentsQueryOptions(params) {
  const resolvedParams = {
    ...defaultParams,
    ...params
  }
  return queryOptions({
    queryKey: QUERY_KEYS.payment.mentorMe({
      page: resolvedParams.page ?? 1,
      size: resolvedParams.size ?? 100,
      status: resolvedParams.status ?? null,
      sortBy: resolvedParams.sortBy ?? null,
      sortDir: resolvedParams.sortDir ?? null
    }),
    queryFn: () => fetchCurrentMentorPayments(resolvedParams)
  })
}
function useCurrentMentorPaymentsQuery(params) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  return useQuery({
    ...getCurrentMentorPaymentsQueryOptions(params),
    enabled: hasHydrated && Boolean(accessToken),
    refetchOnWindowFocus: true
  })
}
export { getCurrentMentorPaymentsQueryOptions, useCurrentMentorPaymentsQuery }
