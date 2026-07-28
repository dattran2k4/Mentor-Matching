import axios from 'axios'
import { EXPIRED_TOKEN_ERROR_CODE } from '@/constants/auth'
function isAxiosUnauthorizedError(error) {
  return axios.isAxiosError(error) && error.response?.status === 401
}
function isAxiosNotFoundError(error) {
  return axios.isAxiosError(error) && error.response?.status === 404
}
function isAxiosExpiredTokenError(error) {
  const code = error.response?.data?.code
  return code === EXPIRED_TOKEN_ERROR_CODE
}
export { isAxiosExpiredTokenError, isAxiosNotFoundError, isAxiosUnauthorizedError }
