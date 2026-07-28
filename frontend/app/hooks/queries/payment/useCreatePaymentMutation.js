import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { paymentApi } from '@/services/payment.api'
function useCreatePaymentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      const response = await paymentApi.createPayment(payload)
      return {
        payment: response.data,
        message:
          response.message || '\u0110\xE3 t\u1EA1o y\xEAu c\u1EA7u thanh to\xE1n th\xE0nh c\xF4ng.'
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.booking.me,
        exact: false
      })
    },
    onError: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.booking.me,
        exact: false
      })
    }
  })
}
export { useCreatePaymentMutation }
