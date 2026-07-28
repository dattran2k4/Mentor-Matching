import { useQuery } from '@tanstack/react-query'
import { mentorApi } from '@/services/mentor.api'
const adminMentorVerificationKeys = {
  all: ['admin-mentor-verifications'],
  lists: () => [...adminMentorVerificationKeys.all, 'list'],
  list: (params) => [...adminMentorVerificationKeys.lists(), params],
  details: () => [...adminMentorVerificationKeys.all, 'detail'],
  detail: (id) => [...adminMentorVerificationKeys.details(), id]
}
function useAdminMentorVerificationsQuery(params) {
  return useQuery({
    queryKey: adminMentorVerificationKeys.list(params),
    queryFn: async () => {
      const response = await mentorApi.getAdminMentorVerifications(params)
      return response.data
    }
  })
}
export { adminMentorVerificationKeys, useAdminMentorVerificationsQuery }
