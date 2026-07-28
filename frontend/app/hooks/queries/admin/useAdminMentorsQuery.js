import { useQuery } from '@tanstack/react-query'
import { mentorApi } from '@/services/mentor.api'
const adminMentorKeys = {
  all: ['admin-mentors'],
  lists: () => [...adminMentorKeys.all, 'list'],
  list: (params) => [...adminMentorKeys.lists(), params],
  details: () => [...adminMentorKeys.all, 'detail'],
  detail: (mentorId) => [...adminMentorKeys.details(), mentorId]
}
function useAdminMentorsQuery(params) {
  return useQuery({
    queryKey: adminMentorKeys.list(params),
    queryFn: async () => {
      const response = await mentorApi.getAdminMentors(params)
      return response.data
    }
  })
}
export { adminMentorKeys, useAdminMentorsQuery }
