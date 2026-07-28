const BOOKING_STATUS_CONFIG = {
  PENDING: {
    label: 'Ch\u1EDD thanh to\xE1n',
    tone: 'warning',
    description:
      'Booking \u0111\xE3 \u0111\u01B0\u1EE3c t\u1EA1o v\xE0 \u0111ang ch\u1EDD h\u1ECDc vi\xEAn ho\xE0n t\u1EA5t thanh to\xE1n.'
  },
  CONFIRMED: {
    label: '\u0110\xE3 thanh to\xE1n',
    tone: 'success',
    description:
      'Booking \u0111\xE3 \u0111\u01B0\u1EE3c thanh to\xE1n v\xE0 gi\u1EEF ch\u1ED7 cho bu\u1ED5i h\u1ECDc.'
  },
  COMPLETED: {
    label: '\u0110\xE3 ho\xE0n th\xE0nh',
    tone: 'success',
    description: 'Bu\u1ED5i h\u1ECDc \u0111\xE3 di\u1EC5n ra xong.'
  },
  CANCELLED: {
    label: '\u0110\xE3 h\u1EE7y',
    tone: 'muted',
    description: 'Booking \u0111\xE3 b\u1ECB h\u1EE7y.'
  },
  REJECTED: {
    label: 'B\u1ECB t\u1EEB ch\u1ED1i',
    tone: 'danger',
    description:
      'Booking b\u1ECB t\u1EEB ch\u1ED1i. Flow n\xE0y s\u1EBD \u0111\u01B0\u1EE3c ho\xE0n thi\u1EC7n sau.'
  },
  NO_SHOW: {
    label: 'Kh\xF4ng tham gia',
    tone: 'danger',
    description: 'Bu\u1ED5i h\u1ECDc \u0111\u01B0\u1EE3c ghi nh\u1EADn l\xE0 kh\xF4ng tham gia.'
  }
}
const LEARNER_BOOKING_STATUS_FILTERS = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']
export { BOOKING_STATUS_CONFIG, LEARNER_BOOKING_STATUS_FILTERS }
