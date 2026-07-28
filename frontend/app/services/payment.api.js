import { env } from '@/config/env'
import http from '@/libs/http'
import { mockPaymentApi } from '@/services/mock/payment.mock.api'
const PAYMENT_ENDPOINTS = {
  payments: 'payments',
  myPayments: 'payments/me',
  mentorPayments: 'payments/mentor/me'
}
const defaultPaymentApi = {
  createPayment: async (payload) => (await http.post(PAYMENT_ENDPOINTS.payments, payload)).data,
  getMyPayments: async (params) =>
    (
      await http.get(PAYMENT_ENDPOINTS.myPayments, {
        params
      })
    ).data,
  getMentorPayments: async (params) =>
    (
      await http.get(PAYMENT_ENDPOINTS.mentorPayments, {
        params
      })
    ).data,
  getPaymentDetail: async (paymentId) =>
    (await http.get(`${PAYMENT_ENDPOINTS.payments}/${paymentId}`)).data
}
const paymentApi = env.useMock ? mockPaymentApi : defaultPaymentApi
export { paymentApi }
