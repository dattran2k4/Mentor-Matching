function mapMentorCalendarToViewModel(calendar) {
  const slots = calendar.dates
    .flatMap((date) =>
      date.availableWindows.map((window) => ({
        id: buildCalendarSlotId(calendar.mentorId, date.date, window.startTime, window.endTime),
        date: date.date,
        startTime: window.startTime,
        endTime: window.endTime,
        isBookable: true,
        isNearestBookable: false
      }))
    )
    .sort(compareCalendarSlots)
  const nearestBookableSlot = slots.find((slot) => slot.isBookable)
  const slotsWithNearest = slots.map((slot) => ({
    ...slot,
    isNearestBookable: slot.id === nearestBookableSlot?.id
  }))
  return {
    mentorId: calendar.mentorId,
    from: calendar.from,
    to: calendar.to,
    dates: calendar.dates.map((date) => ({
      date: date.date,
      slots: slotsWithNearest.filter((slot) => slot.date === date.date)
    })),
    slots: slotsWithNearest
  }
}
function resolveSelectedCalendarSlot(slots, selectedSlotId) {
  return (
    slots.find((slot) => slot.id === selectedSlotId && slot.isBookable) ??
    slots.find((slot) => slot.isNearestBookable && slot.isBookable) ??
    slots.find((slot) => slot.isBookable) ??
    null
  )
}
function buildCalendarSlotId(mentorId, date, startTime, endTime) {
  return `${mentorId}:${date}:${startTime}:${endTime}`
}
function compareCalendarSlots(left, right) {
  return (
    left.date.localeCompare(right.date) ||
    left.startTime.localeCompare(right.startTime) ||
    left.endTime.localeCompare(right.endTime)
  )
}
export { mapMentorCalendarToViewModel, resolveSelectedCalendarSlot }
