import { useMemo, useState } from 'react'
import {
  mapMentorCalendarToViewModel,
  resolveSelectedCalendarSlot
} from '@/features/mentor-profile/mentor-calendar.mapper'
import {
  addDaysToIsoDate,
  getCalendarWeekRange,
  getCalendarWeekView,
  getInitialCalendarDiscoveryRange,
  getWeekStartIso
} from '@/features/mentor-profile/mentor-profile-calendar.utils'
import { useMentorCalendarQuery } from '@/hooks/queries/mentor/useMentorCalendarQuery'
function useMentorProfileCalendar({ mentorId }) {
  const [initialWeekStart] = useState(() => getWeekStartIso(/* @__PURE__ */ new Date()))
  const [requestedWeekStart, setRequestedWeekStart] = useState()
  const [selectedSlotIdState, setSelectedSlotId] = useState()
  const calendarRange = requestedWeekStart
    ? getCalendarWeekRange(requestedWeekStart)
    : getInitialCalendarDiscoveryRange(initialWeekStart)
  const mentorCalendarQuery = useMentorCalendarQuery(mentorId, calendarRange.from, calendarRange.to)
  const queriedCalendar = useMemo(
    () =>
      mentorCalendarQuery.data ? mapMentorCalendarToViewModel(mentorCalendarQuery.data) : null,
    [mentorCalendarQuery.data]
  )
  const displayWeekStart =
    requestedWeekStart ??
    (queriedCalendar?.slots[0] ? getWeekStartIso(queriedCalendar.slots[0].date) : initialWeekStart)
  const calendar = useMemo(
    () => (queriedCalendar ? getCalendarWeekView(queriedCalendar, displayWeekStart) : null),
    [displayWeekStart, queriedCalendar]
  )
  const selectedSlot = calendar
    ? resolveSelectedCalendarSlot(calendar.slots, selectedSlotIdState)
    : null
  const selectedSlotId = selectedSlot?.id
  const handleChangeWeek = (weekOffset) => {
    const nextWeekStart = addDaysToIsoDate(displayWeekStart, weekOffset * 7)
    setRequestedWeekStart(nextWeekStart)
  }
  return {
    calendar,
    displayWeekStart,
    isError: mentorCalendarQuery.isError,
    isLoading: mentorCalendarQuery.isLoading,
    selectedSlot,
    selectedSlotId,
    setSelectedSlotId,
    handleChangeWeek
  }
}
export { useMentorProfileCalendar }
