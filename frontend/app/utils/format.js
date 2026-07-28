const formatPrice = (value) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value)
const formatShortBookingDate = (value) =>
  new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit'
  }).format(new Date(value))
const formatDateTime = (value) => {
  if (!value) return 'Ch\u01B0a c\xF3'
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}
const formatTimeRange = (startTime, endTime) => `${startTime} - ${endTime}`
const getInitials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
export { formatDateTime, formatPrice, formatShortBookingDate, formatTimeRange, getInitials }
