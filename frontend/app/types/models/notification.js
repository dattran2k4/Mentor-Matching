var NotificationStatus = /* @__PURE__ */ ((NotificationStatus2) => {
  NotificationStatus2['UNREAD'] = 'UNREAD'
  NotificationStatus2['READ'] = 'READ'
  return NotificationStatus2
})(NotificationStatus || {})
var NotificationType = /* @__PURE__ */ ((NotificationType2) => {
  NotificationType2['SYSTEM'] = 'SYSTEM'
  NotificationType2['BOOKING_CREATED'] = 'BOOKING_CREATED'
  NotificationType2['BOOKING_CONFIRMED'] = 'BOOKING_CONFIRMED'
  NotificationType2['BOOKING_REJECTED'] = 'BOOKING_REJECTED'
  NotificationType2['BOOKING_COMPLETED'] = 'BOOKING_COMPLETED'
  NotificationType2['BOOKING_CANCELLED'] = 'BOOKING_CANCELLED'
  NotificationType2['REVIEW_CREATED'] = 'REVIEW_CREATED'
  return NotificationType2
})(NotificationType || {})
export { NotificationStatus, NotificationType }
