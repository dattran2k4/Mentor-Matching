function parseMentorId(value) {
  if (!value) return null
  const parsedValue = Number(value)
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null
}
function getInitialCalendarDiscoveryRange(from) {
  return {
    from,
    to: addDaysToIsoDate(from, 30)
  }
}
function getCalendarWeekView(calendar, weekStart) {
  const weekEnd = addDaysToIsoDate(weekStart, 6)
  const weekDates = calendar.dates.filter((date) => date.date >= weekStart && date.date <= weekEnd)
  const weekSlots = weekDates.flatMap((date) => date.slots)
  const nearestSlotId = weekSlots.find((slot) => slot.isBookable)?.id
  const slots = weekSlots.map((slot) => ({
    ...slot,
    isNearestBookable: slot.id === nearestSlotId
  }))
  return {
    ...calendar,
    from: weekStart,
    to: weekEnd,
    dates: weekDates.map((date) => ({
      ...date,
      slots: slots.filter((slot) => slot.date === date.date)
    })),
    slots
  }
}
function getCalendarWeekRange(weekStart) {
  return {
    from: weekStart,
    to: addDaysToIsoDate(weekStart, 6)
  }
}
function getWeekStartIso(value) {
  const date =
    typeof value === 'string' ? /* @__PURE__ */ new Date(`${value}T00:00:00`) : new Date(value)
  const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay()
  date.setDate(date.getDate() - dayOfWeek + 1)
  return toIsoDate(date)
}
function addDaysToIsoDate(value, days) {
  const date = /* @__PURE__ */ new Date(`${value}T00:00:00`)
  date.setDate(date.getDate() + days)
  return toIsoDate(date)
}
function formatWeekRange(weekStart) {
  const weekEnd = addDaysToIsoDate(weekStart, 6)
  return `${formatShortDate(weekStart)} - ${formatShortDate(weekEnd)}`
}
function formatCalendarDayLabel(value) {
  const date = /* @__PURE__ */ new Date(`${value}T00:00:00`)
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit'
  }).format(date)
}
function formatShortDate(value) {
  const date = /* @__PURE__ */ new Date(`${value}T00:00:00`)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}
function toIsoDate(date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}
export {
  addDaysToIsoDate,
  formatCalendarDayLabel,
  formatShortDate,
  formatWeekRange,
  getCalendarWeekRange,
  getCalendarWeekView,
  getInitialCalendarDiscoveryRange,
  getWeekStartIso,
  parseMentorId
}
