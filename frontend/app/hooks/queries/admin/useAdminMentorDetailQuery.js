import { useQuery } from '@tanstack/react-query'
import { mentorApi } from '@/services/mentor.api'
import { adminMentorKeys } from './useAdminMentorsQuery'
function useAdminMentorDetailQuery(mentorId) {
  return useQuery({
    queryKey: adminMentorKeys.detail(mentorId ?? 0),
    queryFn: async () => {
      const response = await mentorApi.getAdminMentorDetail(mentorId)
      return response.data
    },
    enabled: mentorId !== null
  })
}
export { useAdminMentorDetailQuery }
