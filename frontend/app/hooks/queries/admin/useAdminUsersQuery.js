import { useQuery } from '@tanstack/react-query'
import { userApi } from '@/services/user.api'
const adminUserKeys = {
  all: ['admin-users'],
  lists: () => [...adminUserKeys.all, 'list'],
  list: (params) => [...adminUserKeys.lists(), params]
}
function useAdminUsersQuery(params) {
  return useQuery({
    queryKey: adminUserKeys.list(params),
    queryFn: async () => {
      const response = await userApi.getAdminUsers(params)
      return response.data
    }
  })
}
export { adminUserKeys, useAdminUsersQuery }
