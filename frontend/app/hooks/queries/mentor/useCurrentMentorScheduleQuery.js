import { queryOptions, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import { useAuthStore } from '@/stores/auth-store'
import { isAxiosNotFoundError } from '@/utils/http-error'
async function fetchCurrentMentorSchedule(suppressNotFound = false) {
  try {
    const currentMentor = (await mentorApi.getCurrentMentor()).data
    const availabilities = (await mentorApi.getCurrentMentorAvailabilities()).data
    return {
      currentMentor,
      availabilities
    }
  } catch (error) {
    if (suppressNotFound && isAxiosNotFoundError(error)) {
      return {
        currentMentor: null,
        availabilities: []
      }
    }
    throw error
  }
}
function getCurrentMentorScheduleQueryOptions(suppressNotFound = false) {
  return queryOptions({
    queryKey: QUERY_KEYS.mentor.currentSchedule,
    queryFn: () => fetchCurrentMentorSchedule(suppressNotFound)
  })
}
function useCurrentMentorScheduleQuery(enabled = true, options) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const suppressNotFound = options?.suppressNotFound ?? false
  return useQuery({
    ...getCurrentMentorScheduleQueryOptions(suppressNotFound),
    enabled: Boolean(accessToken) && enabled
  })
}
export { getCurrentMentorScheduleQueryOptions, useCurrentMentorScheduleQuery }
