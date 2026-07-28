import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/services/user.api'
import { adminUserKeys } from './useAdminUsersQuery'
function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }) => {
      await userApi.updateUserStatus(id, data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() })
    }
  })
}
export { useUpdateUserStatusMutation }
