import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/services/auth.api'
import { useAuthStore } from '@/stores/auth-store'
function useLoginMutation() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  return useMutation({
    mutationFn: (payload) => authApi.login(payload),
    onSuccess: (response) => {
      const data = response.data
      setAccessToken(data.accessToken)
    }
  })
}
export { useLoginMutation }
