const learnerBookings = [
  {
    id: 'booking-1',
    snapshot: {
      learnerName: 'Minh Kh\xF4i',
      mentorName: 'Nguy\u1EC5n Minh Anh',
      subjectName: 'To\xE1n',
      gradeName: 'L\u1EDBp 9',
      pricePerHour: 28e4
    },
    bookingDate: '2026-06-11',
    startTime: '14:00',
    endTime: '15:30',
    meetingType: 'ONLINE',
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    totalAmount: 42e4,
    meetingLink: 'https://meet.google.com/example',
    summary:
      '\xD4n h\u1EC7 ph\u01B0\u01A1ng tr\xECnh v\xE0 luy\u1EC7n \u0111\u1EC1 ki\u1EC3m tra 45 ph\xFAt.',
    primaryAction: { label: 'V\xE0o bu\u1ED5i h\u1ECDc', variant: 'primary' },
    secondaryAction: { label: 'Xem chi ti\u1EBFt', variant: 'secondary' }
  },
  {
    id: 'booking-2',
    snapshot: {
      learnerName: 'Minh Kh\xF4i',
      mentorName: 'Tr\u1EA7n Qu\u1ED1c Huy',
      subjectName: 'IELTS',
      gradeName: 'Foundation',
      pricePerHour: 32e4
    },
    bookingDate: '2026-06-12',
    startTime: '19:30',
    endTime: '20:30',
    meetingType: 'ONLINE',
    bookingStatus: 'PENDING',
    paymentStatus: 'PENDING',
    totalAmount: 32e4,
    meetingLink: 'https://zoom.us/example',
    summary: 'Ch\u1EDD thanh to\xE1n \u0111\u1EC3 mentor gi\u1EEF ch\u1ED7 speaking foundation.',
    primaryAction: { label: 'Thanh to\xE1n', variant: 'primary' },
    secondaryAction: { label: 'Xem chi ti\u1EBFt', variant: 'secondary' }
  },
  {
    id: 'booking-3',
    snapshot: {
      learnerName: 'Minh Kh\xF4i',
      mentorName: 'L\xEA Thu H\xE0',
      subjectName: 'V\u1EADt l\xFD',
      gradeName: 'L\u1EDBp 11',
      pricePerHour: 26e4
    },
    bookingDate: '2026-06-02',
    startTime: '09:00',
    endTime: '10:30',
    meetingType: 'HYBRID',
    bookingStatus: 'COMPLETED',
    paymentStatus: 'PAID',
    totalAmount: 39e4,
    meetingAddress: 'Qu\u1EADn 7, TP.HCM',
    summary:
      'Bu\u1ED5i h\u1ECDc ho\xE0n t\u1EA5t, c\xF3 th\u1EC3 \u0111\u1EC3 l\u1EA1i \u0111\xE1nh gi\xE1 cho mentor.',
    primaryAction: { label: '\u0110\xE1nh gi\xE1 bu\u1ED5i h\u1ECDc', variant: 'primary' },
    secondaryAction: { label: 'Xem chi ti\u1EBFt', variant: 'secondary' }
  },
  {
    id: 'booking-4',
    snapshot: {
      learnerName: 'Minh Kh\xF4i',
      mentorName: 'Nguy\u1EC5n Minh Anh',
      subjectName: 'To\xE1n',
      gradeName: 'L\u1EDBp 8',
      pricePerHour: 24e4
    },
    bookingDate: '2026-05-28',
    startTime: '18:00',
    endTime: '19:00',
    meetingType: 'ONLINE',
    bookingStatus: 'CANCELLED',
    paymentStatus: 'REFUNDED',
    totalAmount: 24e4,
    summary:
      'Bu\u1ED5i h\u1ECDc \u0111\xE3 \u0111\u01B0\u1EE3c h\u1EE7y v\xE0 h\u1ECDc ph\xED \u0111\xE3 ho\xE0n l\u1EA1i.',
    primaryAction: { label: '\u0110\u1EB7t l\u1EA1i bu\u1ED5i h\u1ECDc', variant: 'secondary' },
    secondaryAction: { label: 'Xem chi ti\u1EBFt', variant: 'secondary' }
  },
  {
    id: 'booking-5',
    snapshot: {
      learnerName: 'Minh Kh\xF4i',
      mentorName: 'Tr\u1EA7n Qu\u1ED1c Huy',
      subjectName: 'Ti\u1EBFng Anh',
      gradeName: 'L\u1EDBp 12',
      pricePerHour: 3e5
    },
    bookingDate: '2026-05-24',
    startTime: '20:00',
    endTime: '21:30',
    meetingType: 'ONLINE',
    bookingStatus: 'NO_SHOW',
    paymentStatus: 'PAID',
    totalAmount: 45e4,
    summary:
      'Bu\u1ED5i h\u1ECDc kh\xF4ng di\u1EC5n ra nh\u01B0 d\u1EF1 ki\u1EBFn, c\u1EA7n xem l\u1EA1i ghi ch\xFA v\u1EDBi mentor.',
    primaryAction: { label: 'Xem ghi ch\xFA', variant: 'secondary' },
    secondaryAction: { label: 'Li\xEAn h\u1EC7 mentor', variant: 'secondary' }
  }
]
const learnerProfileDraft = {
  fullName: 'Minh Kh\xF4i',
  email: 'minhkhoi@example.com',
  phone: '0901 234 567',
  gender: 'Nam',
  birthYear: '2009',
  schoolName: 'THCS Nguy\u1EC5n Du',
  grade: 'L\u1EDBp 9',
  learningGoal:
    'C\u1EE7ng c\u1ED1 n\u1EC1n t\u1EA3ng To\xE1n \u0111\u1EC3 t\u1EF1 tin h\u01A1n tr\u01B0\u1EDBc k\u1EF3 thi v\xE0o l\u1EDBp 10, \u0111\u1ED3ng th\u1EDDi duy tr\xEC l\u1ECBch h\u1ECDc ti\u1EBFng Anh \u0111\u1EC1u m\u1ED7i tu\u1EA7n.'
}
export { learnerBookings, learnerProfileDraft }
