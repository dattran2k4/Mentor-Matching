import { queryOptions, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { paymentApi } from '@/services/payment.api'
import { useAuthStore } from '@/stores/auth-store'
const defaultParams = {
  page: 1,
  size: 100
}
async function fetchCurrentUserPayments(params) {
  return (await paymentApi.getMyPayments(params)).data
}
function getCurrentUserPaymentsQueryOptions(params) {
  const resolvedParams = {
    ...defaultParams,
    ...params
  }
  return queryOptions({
    queryKey: QUERY_KEYS.payment.my({
      page: resolvedParams.page ?? 1,
      size: resolvedParams.size ?? 100,
      status: resolvedParams.status ?? null,
      sortBy: resolvedParams.sortBy ?? null,
      sortDir: resolvedParams.sortDir ?? null
    }),
    queryFn: () => fetchCurrentUserPayments(resolvedParams)
  })
}
function useCurrentUserPaymentsQuery(params) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  return useQuery({
    ...getCurrentUserPaymentsQueryOptions(params),
    enabled: hasHydrated && Boolean(accessToken),
    refetchOnWindowFocus: true
  })
}
export { getCurrentUserPaymentsQueryOptions, useCurrentUserPaymentsQuery }
