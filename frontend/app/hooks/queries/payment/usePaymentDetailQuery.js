import { queryOptions, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { paymentApi } from '@/services/payment.api'
import { useAuthStore } from '@/stores/auth-store'
const MINIMUM_PAYMENT_DETAIL_DELAY_MS = 1e3
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
async function fetchPaymentDetail(paymentId) {
  const [response] = await Promise.all([
    paymentApi.getPaymentDetail(paymentId),
    delay(MINIMUM_PAYMENT_DETAIL_DELAY_MS)
  ])
  return response.data
}
function getPaymentDetailQueryOptions(paymentId) {
  return queryOptions({
    queryKey: QUERY_KEYS.payment.detail(paymentId),
    queryFn: () => fetchPaymentDetail(paymentId)
  })
}
function usePaymentDetailQuery(paymentId) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  return useQuery({
    queryKey: QUERY_KEYS.payment.detail(paymentId ?? 0),
    queryFn: () => fetchPaymentDetail(paymentId ?? 0),
    enabled:
      hasHydrated && Boolean(accessToken) && Number.isInteger(paymentId) && Number(paymentId) > 0
  })
}
export { getPaymentDetailQueryOptions, usePaymentDetailQuery }
