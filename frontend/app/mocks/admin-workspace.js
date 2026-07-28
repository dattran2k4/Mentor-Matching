const adminDashboardSummary = [
  {
    label: 'H\u1ED3 s\u01A1 mentor ch\u1EDD duy\u1EC7t',
    value: '6',
    helper:
      '\u01AFu ti\xEAn duy\u1EC7t c\xE1c h\u1ED3 s\u01A1 \u0111\xE3 \u0111\u1EE7 gi\u1EA5y t\u1EDD \u0111\u1EC3 kh\xF4ng ngh\u1EBDn ngu\u1ED3n cung mentor c\xF4ng khai.'
  },
  {
    label: 'Mentor c\u1EA7n r\xE0 so\xE1t x\xE1c minh',
    value: '3',
    helper:
      'Bao g\u1ED3m h\u1ED3 s\u01A1 \u0111\xE3 g\u1EEDi nh\u01B0ng thi\u1EBFu b\u01B0\u1EDBc ki\u1EC3m tra cu\u1ED1i ho\u1EB7c c\u1EA7n b\u1ED5 sung ch\u1EE9ng t\u1EEB.'
  },
  {
    label: 'B\xE1o c\xE1o \u0111ang m\u1EDF',
    value: '4',
    helper:
      'Gi\u1EEF h\xE0ng \u0111\u1EE3i b\xE1o c\xE1o nh\u1ECF \u0111\u1EC3 tr\xE1nh ph\xE1t sinh khi\u1EBFu n\u1EA1i ch\u1ED3ng ch\xE9o t\u1EEB h\u1ECDc vi\xEAn v\xE0 ph\u1EE5 huynh.'
  },
  {
    label: 'T\xE0i kho\u1EA3n c\u1EA7n theo d\xF5i',
    value: '5',
    helper:
      'C\xE1c t\xE0i kho\u1EA3n b\u1ECB kh\xF3a, kh\xF4ng ho\u1EA1t \u0111\u1ED9ng l\xE2u ng\xE0y ho\u1EB7c c\u1EA7n li\xEAn h\u1EC7 x\xE1c minh b\u1ED5 sung.'
  }
]
const adminQueueItems = [
  {
    id: 'queue-mentor-1',
    mentorName: 'Nguy\u1EC5n V\u0103n Nam',
    headline: 'Mentor To\xE1n THPT v\xE0 \xF4n thi t\u1ED1t nghi\u1EC7p',
    submittedAtLabel: '2 gi\u1EDD tr\u01B0\u1EDBc',
    approvalStatus: 'PENDING',
    verificationStatus: 'PENDING',
    offeringsSummary: 'To\xE1n l\u1EDBp 11-12 \xB7 300k/gi\u1EDD',
    note: 'Thi\u1EBFu b\u01B0\u1EDBc \u0111\u1ED1i chi\u1EBFu gi\u1EA5y t\u1EDD t\xF9y th\xE2n v\u1EDBi video gi\u1EDBi thi\u1EC7u.',
    priority: 'high'
  },
  {
    id: 'queue-mentor-2',
    mentorName: 'Tr\u1EA7n Th\u1ECB Thu',
    headline: 'Mentor Ti\u1EBFng Anh THCS, luy\u1EC7n giao ti\u1EBFp',
    submittedAtLabel: '5 gi\u1EDD tr\u01B0\u1EDBc',
    approvalStatus: 'PENDING',
    verificationStatus: 'VERIFIED',
    offeringsSummary: 'Ti\u1EBFng Anh l\u1EDBp 6-9 \xB7 260k/gi\u1EDD',
    note: '\u0110\xE3 x\xE1c minh xong, c\u1EA7n ch\u1ED1t ghi ch\xFA duy\u1EC7t tr\u01B0\u1EDBc khi hi\u1EC3n th\u1ECB c\xF4ng khai.',
    priority: 'high'
  },
  {
    id: 'queue-mentor-3',
    mentorName: 'L\xEA Th\xF9y Linh',
    headline:
      'Mentor Ng\u1EEF v\u0103n THCS, k\xE8m vi\u1EBFt \u0111o\u1EA1n v\xE0 luy\u1EC7n \u0111\u1ECDc hi\u1EC3u',
    submittedAtLabel: 'H\xF4m qua',
    approvalStatus: 'PENDING',
    verificationStatus: 'REJECTED',
    offeringsSummary: 'Ng\u1EEF v\u0103n l\u1EDBp 7-9 \xB7 240k/gi\u1EDD',
    note: 'H\u1ED3 s\u01A1 x\xE1c minh b\u1ECB tr\u1EA3 l\u1EA1i do \u1EA3nh gi\u1EA5y t\u1EDD ch\u01B0a r\xF5, c\u1EA7n ph\u1EA3n h\u1ED3i cho mentor.',
    priority: 'medium'
  }
]
const adminMentorDirectory = [
  {
    id: 'mentor-1',
    mentorName: 'Nguy\u1EC5n Minh Anh',
    headline:
      'Mentor To\xE1n THCS, luy\u1EC7n n\u1EC1n t\u1EA3ng v\xE0 \xF4n thi chuy\u1EC3n c\u1EA5p',
    approvalStatus: 'APPROVED',
    verificationStatus: 'VERIFIED',
    submittedAtLabel: 'C\u1EADp nh\u1EADt 2 ng\xE0y tr\u01B0\u1EDBc',
    offeringsSummary: 'To\xE1n l\u1EDBp 8-9 \xB7 280k/gi\u1EDD',
    activeStudentsCount: 45,
    ratingLabel: '4.9/5',
    reviewNote:
      'H\u1ED3 s\u01A1 \u1ED5n \u0111\u1ECBnh, t\u1EF7 l\u1EC7 gi\u1EEF l\u1ECBch t\u1ED1t v\xE0 \u0111ang c\xF3 nhi\u1EC1u h\u1ECDc vi\xEAn quay l\u1EA1i.'
  },
  {
    id: 'mentor-2',
    mentorName: 'Tr\u1EA7n Qu\u1ED1c Huy',
    headline: 'Mentor Ti\u1EBFng Anh giao ti\u1EBFp v\xE0 IELTS n\u1EC1n t\u1EA3ng',
    approvalStatus: 'APPROVED',
    verificationStatus: 'VERIFIED',
    submittedAtLabel: 'C\u1EADp nh\u1EADt 1 tu\u1EA7n tr\u01B0\u1EDBc',
    offeringsSummary: 'IELTS Foundation \xB7 320k/gi\u1EDD',
    activeStudentsCount: 28,
    ratingLabel: '5.0/5',
    reviewNote:
      'Kh\xF4ng c\xF3 c\u1EA3nh b\xE1o v\u1EADn h\xE0nh, ph\xF9 h\u1EE3p ti\u1EBFp t\u1EE5c m\u1EDF r\u1ED9ng l\u1ECBch d\u1EA1y.'
  },
  {
    id: 'mentor-3',
    mentorName: 'Ph\u1EA1m Gia B\u1EA3o',
    headline:
      'Mentor V\u1EADt l\xFD THPT, luy\u1EC7n b\xE0i t\u1EADp v\xE0 chuy\xEAn \u0111\u1EC1 \u0111i\u1EC7n',
    approvalStatus: 'SUSPENDED',
    verificationStatus: 'VERIFIED',
    submittedAtLabel: 'T\u1EA1m d\u1EEBng 3 ng\xE0y tr\u01B0\u1EDBc',
    offeringsSummary: 'V\u1EADt l\xFD l\u1EDBp 11-12 \xB7 310k/gi\u1EDD',
    activeStudentsCount: 6,
    ratingLabel: '4.7/5',
    reviewNote:
      '\u0110ang t\u1EA1m d\u1EEBng do c\u1EA7n r\xE0 so\xE1t ph\u1EA3n h\u1ED3i v\u1EC1 vi\u1EC7c d\u1EDDi l\u1ECBch nhi\u1EC1u l\u1EA7n.'
  }
]
const adminUsers = [
  {
    id: 'user-1',
    fullName: 'Nguy\u1EC5n Thu An',
    email: 'an.nguyen@example.com',
    role: 'LEARNER',
    userType: 'H\u1ECDc vi\xEAn',
    status: 'ACTIVE',
    joinedLabel: '12/05/2026',
    note: '\u0110ang c\xF3 3 l\u1ECBch h\u1ECDc s\u1EAFp t\u1EDBi v\xE0 ch\u01B0a c\xF3 c\u1EA3nh b\xE1o v\u1EADn h\xE0nh.'
  },
  {
    id: 'user-2',
    fullName: 'Tr\u1EA7n Qu\u1ED1c Huy',
    email: 'huy.tran@example.com',
    role: 'MENTOR',
    userType: 'Mentor',
    status: 'ACTIVE',
    joinedLabel: '10/05/2026',
    note: 'Mentor \u0111\xE3 duy\u1EC7t, h\u1ED3 s\u01A1 x\xE1c minh \u0111\u1EA7y \u0111\u1EE7 v\xE0 \u0111ang d\u1EA1y \u0111\u1EC1u.'
  },
  {
    id: 'user-3',
    fullName: 'L\xEA Minh Ch\xE2u',
    email: 'chau.le@example.com',
    role: 'PARENT',
    userType: 'Ph\u1EE5 huynh',
    status: 'INACTIVE',
    joinedLabel: '01/05/2026',
    note: 'T\u1EA1o t\xE0i kho\u1EA3n nh\u01B0ng ch\u01B0a ho\xE0n t\u1EA5t h\u1ED3 s\u01A1 h\u1ECDc vi\xEAn ho\u1EB7c \u0111\u1EB7t l\u1ECBch \u0111\u1EA7u ti\xEAn.'
  },
  {
    id: 'user-4',
    fullName: 'Ph\u1EA1m V\u0103n Duy',
    email: 'duy.pham@example.com',
    role: 'LEARNER',
    userType: 'H\u1ECDc vi\xEAn',
    status: 'BANNED',
    joinedLabel: '28/04/2026',
    note: '\u0110\xE3 kh\xF3a t\u1EA1m th\u1EDDi sau nhi\u1EC1u l\u1EA7n vi ph\u1EA1m quy \u0111\u1ECBnh li\xEAn h\u1EC7 ngo\xE0i n\u1EC1n t\u1EA3ng.'
  },
  {
    id: 'user-5',
    fullName: 'Admin \u0110i\u1EC1u H\xE0nh',
    email: 'ops.admin@example.com',
    role: 'ADMIN',
    userType: 'Qu\u1EA3n tr\u1ECB',
    status: 'ACTIVE',
    joinedLabel: '15/03/2026',
    note: 'T\xE0i kho\u1EA3n n\u1ED9i b\u1ED9 d\xF9ng \u0111\u1EC3 theo d\xF5i duy\u1EC7t mentor v\xE0 x\u1EED l\xFD b\xE1o c\xE1o.'
  }
]
const adminReports = [
  {
    id: 'report-1',
    title: 'Ph\u1EE5 huynh ph\u1EA3n \xE1nh mentor d\u1EDDi l\u1ECBch s\xE1t gi\u1EDD',
    reportType: 'Khi\u1EBFu n\u1EA1i bu\u1ED5i h\u1ECDc',
    relatedEntity: 'Booking #BK-240611-01',
    submittedAtLabel: '35 ph\xFAt tr\u01B0\u1EDBc',
    severity: 'HIGH',
    status: 'NEW',
    summary:
      'C\u1EA7n ki\u1EC3m tra l\u1ECBch s\u1EED \u0111\u1ED5i l\u1ECBch v\xE0 x\xE1c nh\u1EADn v\u1EDBi c\u1EA3 hai b\xEAn tr\u01B0\u1EDBc khi gi\u1EEF mentor ti\u1EBFp t\u1EE5c m\u1EDF l\u1ECBch.'
  },
  {
    id: 'report-2',
    title: 'N\u1ED9i dung h\u1ED3 s\u01A1 mentor ch\u01B0a kh\u1EDBp gi\u1EA5y t\u1EDD x\xE1c minh',
    reportType: 'Ki\u1EC3m tra h\u1ED3 s\u01A1 mentor',
    relatedEntity: 'Mentor L\xEA Th\xF9y Linh',
    submittedAtLabel: '2 gi\u1EDD tr\u01B0\u1EDBc',
    severity: 'MEDIUM',
    status: 'IN_REVIEW',
    summary:
      '\u0110\u1ED9i v\u1EADn h\xE0nh \u0111ang y\xEAu c\u1EA7u mentor b\u1ED5 sung \u1EA3nh gi\u1EA5y t\u1EDD v\xE0 c\u1EADp nh\u1EADt ph\u1EA7n gi\u1EDBi thi\u1EC7u c\xF4ng khai.'
  },
  {
    id: 'report-3',
    title:
      'H\u1ECDc vi\xEAn b\xE1o l\u1ED7i thanh to\xE1n ch\u01B0a c\u1EADp nh\u1EADt sau bu\u1ED5i h\u1ECDc',
    reportType: 'Thanh to\xE1n',
    relatedEntity: 'Booking #BK-240609-08',
    submittedAtLabel: 'H\xF4m qua',
    severity: 'MEDIUM',
    status: 'IN_REVIEW',
    summary:
      'Hi\u1EC7n m\u1EDBi c\xF3 tr\u1EA1ng th\xE1i theo d\xF5i n\u1ED9i b\u1ED9, ch\u01B0a c\xF3 m\xE0n h\xECnh x\u1EED l\xFD thanh to\xE1n ho\xE0n ch\u1EC9nh trong frontend.'
  },
  {
    id: 'report-4',
    title: 'Y\xEAu c\u1EA7u \u0111\xF3ng b\xE1o c\xE1o \u0111\xE3 x\u1EED l\xFD',
    reportType: 'Theo d\xF5i sau x\u1EED l\xFD',
    relatedEntity: 'User Nguyen Thu An',
    submittedAtLabel: '2 ng\xE0y tr\u01B0\u1EDBc',
    severity: 'LOW',
    status: 'CLOSED',
    summary:
      'B\xE1o c\xE1o \u0111\xE3 \u0111\u01B0\u1EE3c x\xE1c nh\u1EADn v\xE0 \u0111\xF3ng \u1EDF b\u01B0\u1EDBc v\u1EADn h\xE0nh n\u1ED9i b\u1ED9.'
  }
]
const adminSettingsGroups = [
  {
    id: 'mentor-review',
    title: 'Quy tr\xECnh duy\u1EC7t mentor',
    description:
      'C\xE1c nguy\xEAn t\u1EAFc v\u1EADn h\xE0nh m\xE0 \u0111\u1ED9i admin \u0111ang \xE1p d\u1EE5ng tr\u01B0\u1EDBc khi m\u1EDF mentor ra marketplace.',
    items: [
      {
        label: '\u0110i\u1EC1u ki\u1EC7n hi\u1EC3n th\u1ECB c\xF4ng khai',
        value:
          'Ch\u1EC9 mentor \u0111\xE3 duy\u1EC7t v\xE0 \u0111\xE3 x\xE1c minh m\u1EDBi \u0111\u01B0\u1EE3c l\xEAn danh s\xE1ch c\xF4ng khai.',
        supportLabel: '\u0110\xE3 c\xF3 quy \u01B0\u1EDBc'
      },
      {
        label: 'Ghi ch\xFA duy\u1EC7t n\u1ED9i b\u1ED9',
        value:
          'Hi\u1EC7n v\u1EABn theo d\xF5i b\u1EB1ng quy tr\xECnh n\u1ED9i b\u1ED9, ch\u01B0a c\xF3 form backend ri\xEAng cho t\u1EEBng b\u01B0\u1EDBc x\u1EED l\xFD.',
        supportLabel: 'C\u1EA7n backend'
      }
    ]
  },
  {
    id: 'reports-safety',
    title: 'B\xE1o c\xE1o v\xE0 an to\xE0n n\u1EC1n t\u1EA3ng',
    description:
      'Nh\u1EEFng \u0111i\u1EC3m \u0111\u1ED9i v\u1EADn h\xE0nh c\u1EA7n nh\xECn th\u1EA5y r\xF5 \u0111\u1EC3 tr\xE1nh overpromise moderation tooling.',
    items: [
      {
        label: 'Tr\u1EA1ng th\xE1i b\xE1o c\xE1o',
        value:
          'Frontend \u0111ang m\xF4 t\u1EA3 h\xE0ng \u0111\u1EE3i x\u1EED l\xFD, nh\u01B0ng ch\u01B0a c\xF3 workflow \u0111\xF3ng/m\u1EDF b\xE1o c\xE1o tr\u1EF1c ti\u1EBFp.',
        supportLabel: 'Ch\u01B0a h\u1ED7 tr\u1EE3'
      },
      {
        label: 'Escalation m\u1EE9c cao',
        value:
          'C\xE1c b\xE1o c\xE1o m\u1EE9c cao c\u1EA7n \u0111\u01B0\u1EE3c r\xE0 so\xE1t th\u1EE7 c\xF4ng qua \u0111\u1ED9i v\u1EADn h\xE0nh tr\u01B0\u1EDBc khi chu\u1EA9n h\xF3a th\xE0nh flow.',
        supportLabel: '\u0110\xE3 c\xF3 quy \u01B0\u1EDBc'
      }
    ]
  },
  {
    id: 'payment-ops',
    title: 'Thanh to\xE1n v\xE0 \u0111\u1ED1i so\xE1t',
    description:
      'Nh\xF3m c\xE0i \u0111\u1EB7t n\xE0y gi\u1EEF vai tr\xF2 \u0111\u1ECBnh h\u01B0\u1EDBng cho giai \u0111o\u1EA1n UI t\u0129nh, ch\u01B0a gi\u1EA3 l\u1EADp c\u1EA5u h\xECnh ho\xE0n ch\u1EC9nh.',
    items: [
      {
        label: 'Theo d\xF5i thanh to\xE1n l\u1ED7i',
        value:
          'C\xF3 th\u1EC3 hi\u1EC3n th\u1ECB tr\u1EA1ng th\xE1i v\xE0 ghi ch\xFA v\u1EADn h\xE0nh, nh\u01B0ng ch\u01B0a c\xF3 m\xE0n h\xECnh c\u1EA5u h\xECnh recovery \u0111\u1EA7y \u0111\u1EE7.',
        supportLabel: 'C\u1EA7n backend'
      },
      {
        label: 'L\u1ECBch \u0111\u1ED1i so\xE1t',
        value:
          '\u0110\u1ED1i so\xE1t sau c\xE1c bu\u1ED5i \u0111\xE3 ho\xE0n th\xE0nh l\xE0 h\u01B0\u1EDBng v\u1EADn h\xE0nh hi\u1EC7n t\u1EA1i, c\u1EA7n backend r\xF5 h\u01A1n tr\u01B0\u1EDBc khi cho s\u1EEDa tr\u1EF1c ti\u1EBFp.',
        supportLabel: 'C\u1EA7n backend'
      }
    ]
  }
]
export {
  adminDashboardSummary,
  adminMentorDirectory,
  adminQueueItems,
  adminReports,
  adminSettingsGroups,
  adminUsers
}
