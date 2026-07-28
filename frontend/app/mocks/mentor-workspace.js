import { mentors } from '@/constants/mentors'
const mentorProfile = mentors.find((mentor) => mentor.id === 'nguyen-minh-anh') ?? mentors[0]
const buildOfferingLabel = (offering) => `${offering.subject} \xB7 ${offering.grade}`
const mentorWorkspaceProfile = mentorProfile
const mentorWorkspaceSummary = [
  {
    label: 'Bu\u1ED5i d\u1EA1y s\u1EAFp t\u1EDBi',
    value: '6',
    helper:
      'Bao g\u1ED3m l\u1ECBch \u0111\xE3 x\xE1c nh\u1EADn v\xE0 m\u1ED9t bu\u1ED5i ch\u1EDD h\u1ECDc vi\xEAn thanh to\xE1n'
  },
  {
    label: 'H\u1ECDc vi\xEAn \u0111ang theo h\u1ECDc',
    value: '14',
    helper: 'T\xEDnh theo h\u1ECDc vi\xEAn c\xF3 bu\u1ED5i trong 30 ng\xE0y g\u1EA7n nh\u1EA5t'
  },
  {
    label: 'Thu nh\u1EADp ch\u1EDD v\u1EC1',
    value: '4,2 tri\u1EC7u',
    helper:
      'C\xE1c bu\u1ED5i \u0111\xE3 ho\xE0n th\xE0nh, \u0111ang ch\u1EDD \u0111\u1ED1i so\xE1t v\xE0 chi tr\u1EA3'
  }
]
const mentorUpcomingSessions = [
  {
    id: 'mentor-session-1',
    studentName: 'Minh Kh\xF4i',
    subject: 'To\xE1n',
    grade: 'L\u1EDBp 9',
    bookingDate: '2026-06-11',
    startTime: '14:00',
    endTime: '15:30',
    meetingType: 'ONLINE',
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    prepNote:
      '\xD4n h\u1EC7 ph\u01B0\u01A1ng tr\xECnh v\xE0 ch\u1ED1t checklist l\u1ED7i sai tr\u01B0\u1EDBc b\xE0i ki\u1EC3m tra 45 ph\xFAt.',
    action: { label: 'V\xE0o bu\u1ED5i h\u1ECDc', variant: 'primary' }
  },
  {
    id: 'mentor-session-2',
    studentName: 'Ng\u1ECDc Linh',
    subject: 'To\xE1n',
    grade: 'L\u1EDBp 8',
    bookingDate: '2026-06-12',
    startTime: '19:00',
    endTime: '20:00',
    meetingType: 'ONLINE',
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    prepNote:
      'Ki\u1EC3m tra b\xE0i t\u1EADp v\u1EC1 ph\xE2n t\xEDch \u0111a th\u1EE9c v\xE0 giao th\xEAm 2 c\xE2u luy\u1EC7n t\u1EF1 l\xE0m.',
    action: { label: 'M\u1EDF ghi ch\xFA', variant: 'secondary' }
  },
  {
    id: 'mentor-session-3',
    studentName: 'Gia H\xE2n',
    subject: 'To\xE1n',
    grade: '\xD4n thi l\u1EDBp 10',
    bookingDate: '2026-06-13',
    startTime: '08:30',
    endTime: '10:00',
    meetingType: 'HYBRID',
    bookingStatus: 'PENDING',
    paymentStatus: 'PENDING',
    prepNote:
      'Gi\u1EEF ch\u1ED7 t\u1EA1m th\u1EDDi, ch\u1EDD h\u1ECDc vi\xEAn ho\xE0n t\u1EA5t thanh to\xE1n \u0111\u1EC3 x\xE1c nh\u1EADn bu\u1ED5i chuy\xEAn \u0111\u1EC1 h\xECnh h\u1ECDc.',
    action: { label: 'Theo d\xF5i thanh to\xE1n', variant: 'secondary' }
  }
]
const mentorRecurringAvailability = mentorProfile.recurringAvailability
const mentorSpecificDateAvailability = mentorProfile.specificDateAvailability
const mentorScheduleNotes = [
  'Khung gi\u1EDD l\u1EB7p l\u1EA1i d\xF9ng cho l\u1ECBch d\u1EA1y c\u1ED1 \u0111\u1ECBnh m\u1ED7i tu\u1EA7n, ph\xF9 h\u1EE3p h\u1ECDc vi\xEAn h\u1ECDc \u0111\u1EC1u v\xE0 ph\u1EE5 huynh c\u1EA7n l\u1ECBch \u1ED5n \u0111\u1ECBnh.',
  'Khung gi\u1EDD theo ng\xE0y c\u1EE5 th\u1EC3 d\xF9ng cho t\u0103ng c\u01B0\u1EDDng tr\u01B0\u1EDBc ki\u1EC3m tra, \u0111\u1ED5i l\u1ECBch tu\u1EA7n \u0111\xF3 ho\u1EB7c m\u1EDF th\xEAm ca ng\u1EAFn h\u1EA1n.',
  'Bu\u1ED5i \u0111\xE3 \u0111\u01B0\u1EE3c \u0111\u1EB7t c\u1EA7n theo d\xF5i ri\xEAng v\u1EDBi availability \u0111\u1EC3 tr\xE1nh hi\u1EC3u availability l\xE0 l\u1ECBch \u0111\xE3 ch\u1ED1t.'
]
const mentorStudents = [
  {
    id: 'student-1',
    studentName: 'Minh Kh\xF4i',
    learnerGoal:
      'C\u1EE7ng c\u1ED1 \u0111\u1EA1i s\u1ED1 l\u1EDBp 9 v\xE0 t\u1EF1 tin h\u01A1n tr\u01B0\u1EDBc k\u1EF3 thi v\xE0o l\u1EDBp 10.',
    recentOffering: 'To\xE1n \xB7 L\u1EDBp 9',
    bookingCount: 8,
    bookingStatus: 'CONFIRMED',
    nextSession: {
      bookingDate: '2026-06-11',
      startTime: '14:00',
      endTime: '15:30'
    },
    recentSummary:
      '\u0110\xE3 ho\xE0n th\xE0nh 6 bu\u1ED5i, ti\u1EBFn b\u1ED9 r\xF5 \u1EDF ph\u1EA7n tr\xECnh b\xE0y v\xE0 ki\u1EC3m tra nh\xE1p.'
  },
  {
    id: 'student-2',
    studentName: 'Ng\u1ECDc Linh',
    learnerGoal:
      'Gi\u1EEF n\u1EC1n t\u1EA3ng To\xE1n l\u1EDBp 8 \u1ED5n \u0111\u1ECBnh v\xE0 gi\u1EA3m l\u1ED7i sai c\u01A1 b\u1EA3n.',
    recentOffering: 'To\xE1n \xB7 L\u1EDBp 8',
    bookingCount: 5,
    bookingStatus: 'CONFIRMED',
    nextSession: {
      bookingDate: '2026-06-12',
      startTime: '19:00',
      endTime: '20:00'
    },
    recentSummary:
      'C\u1EA7n g\u1EEDi l\u1EA1i \u1EA3nh b\xE0i l\xE0m tr\u01B0\u1EDBc bu\u1ED5i sau \u0111\u1EC3 ch\u1ED1t ph\u1EA7n ph\xE2n t\xEDch \u0111a th\u1EE9c.'
  },
  {
    id: 'student-3',
    studentName: 'Gia H\xE2n',
    learnerGoal:
      'Luy\u1EC7n chuy\xEAn \u0111\u1EC1 h\xECnh h\u1ECDc tr\u01B0\u1EDBc k\u1EF3 thi th\u1EED \u0111\u1EA7u th\xE1ng.',
    recentOffering: 'To\xE1n \xB7 \xD4n thi l\u1EDBp 10',
    bookingCount: 1,
    bookingStatus: 'PENDING',
    nextSession: {
      bookingDate: '2026-06-13',
      startTime: '08:30',
      endTime: '10:00'
    },
    recentSummary:
      'M\u1EDBi \u0111\u1EB7t bu\u1ED5i \u0111\u1EA7u ti\xEAn, \u0111ang ch\u1EDD thanh to\xE1n \u0111\u1EC3 ch\u1ED1t t\xE0i li\u1EC7u v\xE0 \u0111\u1ECBa \u0111i\u1EC3m.'
  },
  {
    id: 'student-4',
    studentName: 'B\u1EA3o Nam',
    learnerGoal:
      '\xD4n l\u1EA1i n\u1EC1n t\u1EA3ng h\xECnh h\u1ECDc sau khi ngh\u1EC9 h\u1ECDc 2 tu\u1EA7n.',
    recentOffering: 'To\xE1n \xB7 L\u1EDBp 8',
    bookingCount: 3,
    bookingStatus: 'COMPLETED',
    recentSummary:
      '\u0110\xE3 ho\xE0n th\xE0nh bu\u1ED5i g\u1EA7n nh\u1EA5t, \u0111ang ch\u1EDD ph\u1EE5 huynh x\xE1c nh\u1EADn l\u1ECBch h\u1ECDc ti\u1EBFp theo.'
  }
]
const mentorEarningsSummary = {
  availableBalance: 125e5,
  pendingPayout: 42e5,
  projectedThisMonth: 87e5,
  completedSessionsThisMonth: 18,
  platformFeeRate: '5%',
  payoutWindow:
    '\u0110\u1ED1i so\xE1t v\xE0o ng\xE0y 15 h\u1EB1ng th\xE1ng cho c\xE1c bu\u1ED5i \u0111\xE3 ho\xE0n th\xE0nh.'
}
const mentorEarningsTransactions = [
  {
    id: 'txn-1',
    label: 'Bu\u1ED5i To\xE1n l\u1EDBp 9 \xB7 Minh Kh\xF4i',
    detail: 'Bu\u1ED5i h\u1ECDc ng\xE0y 08/06 \xB7 Sau ph\xED n\u1EC1n t\u1EA3ng',
    amount: 399e3,
    paymentStatus: 'PAID',
    bookedAt: '2026-06-08'
  },
  {
    id: 'txn-2',
    label: 'Bu\u1ED5i To\xE1n l\u1EDBp 8 \xB7 Ng\u1ECDc Linh',
    detail:
      '\u0110\xE3 ho\xE0n th\xE0nh, ch\u1EDD \u0111\u1ED1i so\xE1t k\u1EF3 chi tr\u1EA3 ti\u1EBFp theo',
    amount: 228e3,
    paymentStatus: 'PENDING',
    bookedAt: '2026-06-09'
  },
  {
    id: 'txn-3',
    label: 'Ho\xE0n ti\u1EC1n bu\u1ED5i h\u1EE7y \xB7 Ph\u1EE5 huynh B\u1EA3o Nam',
    detail:
      'Bu\u1ED5i 28/05 \u0111\xE3 h\u1EE7y, ho\xE0n l\u1EA1i h\u1ECDc ph\xED cho h\u1ECDc vi\xEAn',
    amount: -24e4,
    paymentStatus: 'REFUNDED',
    bookedAt: '2026-05-28'
  },
  {
    id: 'txn-4',
    label: 'Bu\u1ED5i t\u0103ng c\u01B0\u1EDDng chuy\xEAn \u0111\u1EC1',
    detail: 'Thanh to\xE1n l\u1ED7i, h\u1ECDc vi\xEAn ch\u01B0a gi\u1EEF ch\u1ED7 th\xE0nh c\xF4ng',
    amount: 32e4,
    paymentStatus: 'FAILED',
    bookedAt: '2026-06-10'
  }
]
const mentorProfileChecklist = [
  {
    label: 'Gi\u1EDBi thi\u1EC7u v\xE0 phong c\xE1ch d\u1EA1y',
    done: Boolean(mentorProfile.introduction && mentorProfile.teachingStyle),
    helper:
      'Gi\xFAp h\u1ECDc vi\xEAn hi\u1EC3u mentor d\u1EA1y theo nh\u1ECBp n\xE0o v\xE0 ph\xF9 h\u1EE3p v\u1EDBi ai.'
  },
  {
    label: 'Offerings theo m\xF4n v\xE0 l\u1EDBp',
    done: mentorProfile.offerings.some((offering) => offering.active),
    helper:
      '\u01AFu ti\xEAn m\xF4 t\u1EA3 r\xF5 subject, grade, m\u1EE9c \u0111\u1ED9 v\xE0 h\u1ECDc ph\xED.'
  },
  {
    label: 'X\xE1c minh v\xE0 duy\u1EC7t h\u1ED3 s\u01A1',
    done:
      mentorProfile.approvalStatus === 'APPROVED' &&
      mentorProfile.verificationStatus === 'VERIFIED',
    helper:
      'C\u1EA7n hi\u1EC3n th\u1ECB trung th\u1EF1c \u0111\u1EC3 ph\u1EE5 huynh v\xE0 h\u1ECDc vi\xEAn y\xEAn t\xE2m \u0111\u1EB7t l\u1ECBch.'
  }
]
const mentorProfileHighlights = [
  '\u01AFu ti\xEAn gi\u1EEF offerings g\u1ECDn, r\xF5 m\u1EE9c gi\xE1 v\xE0 ph\u1EA1m vi l\u1EDBp \u0111\u1EC3 h\u1ECDc vi\xEAn ch\u1ECDn nhanh h\u01A1n.',
  'Teaching content trong milestone n\xE0y l\xE0 giao di\u1EC7n t\u0129nh, ch\u01B0a thay th\u1EBF workflow ch\u1EC9nh s\u1EEDa th\u1EF1c tr\xEAn backend.',
  'Approval v\xE0 verification \u0111\u01B0\u1EE3c hi\u1EC3n th\u1ECB ri\xEAng \u0111\u1EC3 kh\xF4ng tr\u1ED9n l\u1EABn quy tr\xECnh duy\u1EC7t v\u1EDBi m\u1EE9c \u0111\u1ED9 x\xE1c minh.'
]
const mentorTeachingContent = [
  {
    title: 'Chu\u1EA9n b\u1ECB tr\u01B0\u1EDBc bu\u1ED5i h\u1ECDc',
    description:
      'G\u1EEDi checklist ng\u1EAFn ho\u1EB7c \u1EA3nh b\xE0i t\u1EADp c\u1EA7n xem tr\u01B0\u1EDBc \u0111\u1EC3 bu\u1ED5i h\u1ECDc \u0111i th\u1EB3ng v\xE0o ph\u1EA7n h\u1ECDc vi\xEAn \u0111ang v\u01B0\u1EDBng.'
  },
  {
    title: 'Trong bu\u1ED5i h\u1ECDc',
    description:
      'M\u1EDF \u0111\u1EA7u b\u1EB1ng ch\u1EA9n \u0111o\xE1n nhanh, gi\u1EA3i m\u1EABu m\u1ED9t d\u1EA1ng then ch\u1ED1t, sau \u0111\xF3 \u0111\u1EC3 h\u1ECDc vi\xEAn t\u1EF1 l\xE0m t\u1EEBng b\u01B0\u1EDBc v\u1EDBi ph\u1EA3n h\u1ED3i tr\u1EF1c ti\u1EBFp.'
  },
  {
    title: 'Sau bu\u1ED5i h\u1ECDc',
    description:
      'T\xF3m t\u1EAFt 2 \u0111\u1EBFn 3 \xFD c\u1EA7n nh\u1EDB, giao b\xE0i v\u1EEBa s\u1EE9c v\xE0 ghi ch\xFA ri\xEAng cho ph\u1EE5 huynh khi c\u1EA7n theo d\xF5i th\xEAm.'
  }
]
const mentorOfferingSummaries = mentorProfile.offerings.map((offering) => ({
  ...offering,
  label: buildOfferingLabel(offering)
}))
const proficiencyLabelMap = {
  BASIC: 'C\u01A1 b\u1EA3n',
  INTERMEDIATE: 'Trung b\xECnh',
  ADVANCED: 'N\xE2ng cao',
  EXPERT: 'Chuy\xEAn s\xE2u'
}
export {
  mentorEarningsSummary,
  mentorEarningsTransactions,
  mentorOfferingSummaries,
  mentorProfileChecklist,
  mentorProfileHighlights,
  mentorRecurringAvailability,
  mentorScheduleNotes,
  mentorSpecificDateAvailability,
  mentorStudents,
  mentorTeachingContent,
  mentorUpcomingSessions,
  mentorWorkspaceProfile,
  mentorWorkspaceSummary,
  proficiencyLabelMap
}
