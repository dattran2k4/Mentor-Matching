import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mapCurrentUserApiResponse } from '@/hooks/queries/auth/useCurrentUserQuery'
import { userApi } from '@/services/user.api'
function useUpdateCurrentUserProfileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ learnerProfile, user }) => {
      const currentUserResponse = await userApi.updateCurrentUser(user)
      const learnerProfileResponse = await userApi.upsertCurrentLearnerProfile(learnerProfile)
      return {
        currentUser: mapCurrentUserApiResponse(currentUserResponse.data),
        learnerProfile: learnerProfileResponse.data,
        message:
          learnerProfileResponse.message ||
          currentUserResponse.message ||
          'L\u01B0u h\u1ED3 s\u01A1 th\xE0nh c\xF4ng.'
      }
    },
    onSuccess: ({ currentUser, learnerProfile }) => {
      queryClient.setQueryData(QUERY_KEYS.auth.me, currentUser)
      queryClient.setQueryData(QUERY_KEYS.user.learnerProfile, learnerProfile)
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me, exact: true })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.learnerProfile, exact: true })
    },
    onError: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me, exact: true })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.learnerProfile, exact: true })
    }
  })
}
export { useUpdateCurrentUserProfileMutation }
