import { useQuery } from '@tanstack/react-query'
import { mentorApi } from '@/services/mentor.api'
import { adminMentorVerificationKeys } from './useAdminMentorVerificationsQuery'
function useAdminMentorVerificationDetailQuery(verificationId) {
  return useQuery({
    queryKey: adminMentorVerificationKeys.detail(verificationId ?? 0),
    queryFn: async () => {
      const response = await mentorApi.getAdminMentorVerificationDetail(verificationId)
      return response.data
    },
    enabled: verificationId !== null
  })
}
export { useAdminMentorVerificationDetailQuery }
