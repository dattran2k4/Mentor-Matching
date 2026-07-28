import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { notificationApi } from '@/services/notification.api'
import { useAuthStore } from '@/stores/auth-store'
function useNotificationsQuery(params) {
  const accessToken = useAuthStore((state) => state.accessToken)
  return useQuery({
    queryKey: QUERY_KEYS.notification.list(params),
    queryFn: async () => (await notificationApi.getNotifications(params)).data,
    enabled: Boolean(accessToken)
  })
}
export { useNotificationsQuery }
