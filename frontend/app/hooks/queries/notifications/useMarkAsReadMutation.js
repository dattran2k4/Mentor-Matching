import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { notificationApi } from '@/services/notification.api'
function useMarkAsReadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      await notificationApi.markAsRead(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notification.base })
    }
  })
}
export { useMarkAsReadMutation }
