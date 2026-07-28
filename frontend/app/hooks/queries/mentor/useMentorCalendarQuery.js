import { queryOptions, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
async function fetchMentorCalendar(mentorId, from, to) {
  const response = await mentorApi.getMentorCalendarBooking(mentorId, from, to)
  return response.data
}
function getMentorCalendarQueryOptions(mentorId, from, to) {
  return queryOptions({
    queryKey: QUERY_KEYS.mentor.calendar({ mentorId, from, to }),
    queryFn: () => fetchMentorCalendar(mentorId, from, to)
  })
}
function useMentorCalendarQuery(mentorId, from, to) {
  return useQuery({
    ...getMentorCalendarQueryOptions(mentorId ?? 0, from ?? '', to ?? ''),
    enabled: Boolean(mentorId && mentorId > 0 && from && to)
  })
}
export { getMentorCalendarQueryOptions, useMentorCalendarQuery }
