const mentors = [
  {
    id: 'nguyen-minh-anh',
    name: 'Nguy\u1EC5n Minh Anh',
    headline:
      'Mentor To\xE1n THCS, luy\u1EC7n n\u1EC1n t\u1EA3ng v\xE0 t\u01B0 duy gi\u1EA3i b\xE0i',
    approvalStatus: 'APPROVED',
    verificationStatus: 'VERIFIED',
    rating: 4.9,
    reviewsCount: 112,
    responseTime: 'Trong 1 gi\u1EDD',
    activeStudentsCount: 186,
    startingPrice: 28e4,
    expertise: 'To\xE1n THCS v\xE0 \xF4n thi chuy\u1EC3n c\u1EA5p',
    highlights: ['To\xE1n l\u1EDBp 8-9', '\xD4n thi l\u1EDBp 10', 'H\u1ECDc online'],
    introduction:
      'Minh Anh gi\xFAp h\u1ECDc vi\xEAn m\u1EA5t g\u1ED1c To\xE1n x\xE2y l\u1EA1i n\u1EC1n t\u1EA3ng, luy\u1EC7n ph\u01B0\u01A1ng ph\xE1p tr\xECnh b\xE0y v\xE0 b\xE1m s\xE1t m\u1EE5c ti\xEAu ki\u1EC3m tra ho\u1EB7c thi chuy\u1EC3n c\u1EA5p.',
    subjects: ['To\xE1n'],
    grades: ['L\u1EDBp 8', 'L\u1EDBp 9', '\xD4n thi l\u1EDBp 10'],
    meetingTypes: ['ONLINE', 'HYBRID'],
    availabilitySummary: 'T\u1ED1i Th\u1EE9 2, Th\u1EE9 4 v\xE0 s\xE1ng Ch\u1EE7 nh\u1EADt',
    teachingStyle:
      'Ch\u1EA9n \u0111o\xE1n l\u1ED7 h\u1ED5ng tr\u01B0\u1EDBc, chia b\xE0i theo m\u1EE5c ti\xEAu tu\u1EA7n, giao b\xE0i ng\u1EAFn sau m\u1ED7i bu\u1ED5i v\xE0 ph\u1EA3n h\u1ED3i r\xF5 ph\u1EA7n c\u1EA7n s\u1EEDa.',
    achievements: [
      'Theo s\xE1t h\u1ECDc vi\xEAn m\u1EA5t g\u1ED1c v\xE0 \xF4n thi chuy\u1EC3n c\u1EA5p',
      'C\xF3 b\xE1o c\xE1o ng\u1EAFn sau t\u1EEBng bu\u1ED5i cho ph\u1EE5 huynh',
      '\u01AFu ti\xEAn m\u1EE5c ti\xEAu \u0111i\u1EC3m s\u1ED1 v\xE0 k\u1EF9 n\u0103ng tr\xECnh b\xE0y'
    ],
    offerings: [
      {
        id: 'math-grade-9-foundation',
        subject: 'To\xE1n',
        grade: 'L\u1EDBp 9',
        proficiency: 'ADVANCED',
        pricePerHour: 28e4,
        active: true,
        teachingNote:
          'T\u1EADp trung \u0111\u1EA1i s\u1ED1, h\xECnh h\u1ECDc v\xE0 \u0111\u1EC1 chuy\u1EC3n c\u1EA5p.'
      },
      {
        id: 'math-grade-8-foundation',
        subject: 'To\xE1n',
        grade: 'L\u1EDBp 8',
        proficiency: 'INTERMEDIATE',
        pricePerHour: 24e4,
        active: true,
        teachingNote: 'C\u1EE7ng c\u1ED1 n\u1EC1n t\u1EA3ng v\xE0 th\xF3i quen l\xE0m b\xE0i.'
      }
    ],
    recurringAvailability: [
      {
        dayLabel: 'Th\u1EE9 2',
        startTime: '19:00',
        endTime: '21:00',
        meetingTypes: ['ONLINE']
      },
      {
        dayLabel: 'Th\u1EE9 4',
        startTime: '19:00',
        endTime: '21:30',
        meetingTypes: ['ONLINE', 'HYBRID']
      },
      {
        dayLabel: 'Ch\u1EE7 nh\u1EADt',
        startTime: '08:00',
        endTime: '11:00',
        meetingTypes: ['ONLINE', 'HYBRID']
      }
    ],
    specificDateAvailability: [
      {
        dateLabel: '12/06',
        startTime: '19:30',
        endTime: '21:00',
        meetingTypes: ['ONLINE'],
        note: 'T\u0103ng c\u01B0\u1EDDng tr\u01B0\u1EDBc k\u1EF3 ki\u1EC3m tra gi\u1EEFa k\u1EF3'
      },
      {
        dateLabel: '16/06',
        startTime: '08:30',
        endTime: '10:00',
        meetingTypes: ['HYBRID']
      }
    ],
    experience: [
      {
        title: 'Mentor To\xE1n c\xE1 nh\xE2n',
        company: 'Mentor Matching',
        period: '2021 - nay'
      },
      {
        title: 'Gi\xE1o vi\xEAn To\xE1n',
        company: 'Trung t\xE2m Bright Math',
        period: '2018 - 2021'
      }
    ],
    education: [
      {
        degree: 'C\u1EED nh\xE2n S\u01B0 ph\u1EA1m To\xE1n',
        school: '\u0110\u1EA1i h\u1ECDc S\u01B0 ph\u1EA1m TP.HCM'
      }
    ],
    reviews: [
      {
        name: 'Ph\u1EE5 huynh b\xE9 An',
        rating: 5,
        text: 'Mentor ch\u1EC9 ra \u0111\xFAng ph\u1EA7n con b\u1ECB h\u1ED5ng v\xE0 chia b\xE0i r\u1EA5t v\u1EEBa s\u1EE9c. Sau 6 tu\u1EA7n con t\u1EF1 tin h\u01A1n h\u1EB3n.',
        tags: [
          'Ti\u1EBFn b\u1ED9 r\xF5 r\xE0ng',
          'Ph\u1EA3n h\u1ED3i \u0111\u1EC1u cho ph\u1EE5 huynh'
        ]
      },
      {
        name: 'Minh K.',
        rating: 5,
        text: 'C\xE1ch gi\u1EA3i th\xEDch d\u1EC5 hi\u1EC3u, c\xF3 checklist l\u1ED7i sai sau m\u1ED7i bu\u1ED5i n\xEAn em bi\u1EBFt c\u1EA7n luy\u1EC7n g\xEC.',
        tags: ['D\u1EC5 hi\u1EC3u', 'B\xE1m s\xE1t m\u1EE5c ti\xEAu thi']
      }
    ]
  },
  {
    id: 'tran-quoc-huy',
    name: 'Tr\u1EA7n Qu\u1ED1c Huy',
    headline: 'Mentor Ti\u1EBFng Anh giao ti\u1EBFp v\xE0 IELTS n\u1EC1n t\u1EA3ng',
    approvalStatus: 'APPROVED',
    verificationStatus: 'VERIFIED',
    rating: 4.8,
    reviewsCount: 86,
    responseTime: 'Trong 2 gi\u1EDD',
    activeStudentsCount: 142,
    startingPrice: 32e4,
    expertise: 'Ti\u1EBFng Anh THPT, IELTS 5.0-6.5',
    highlights: ['IELTS c\u01A1 b\u1EA3n', 'Ti\u1EBFng Anh THPT', 'Online'],
    introduction:
      'Qu\u1ED1c Huy x\xE2y l\u1ED9 tr\xECnh h\u1ECDc ti\u1EBFng Anh theo m\u1EE5c ti\xEAu c\u1EE5 th\u1EC3: c\u1EA3i thi\u1EC7n \u0111i\u1EC3m tr\xEAn l\u1EDBp, luy\u1EC7n n\xF3i t\u1EF1 tin ho\u1EB7c chu\u1EA9n b\u1ECB IELTS m\u1EE9c n\u1EC1n t\u1EA3ng.',
    subjects: ['Ti\u1EBFng Anh'],
    grades: ['L\u1EDBp 10', 'L\u1EDBp 11', 'L\u1EDBp 12', 'IELTS Foundation'],
    meetingTypes: ['ONLINE'],
    availabilitySummary: 'T\u1ED1i c\xE1c ng\xE0y trong tu\u1EA7n',
    teachingStyle:
      'K\u1EBFt h\u1EE3p s\u1EEDa ph\xE1t \xE2m, luy\u1EC7n ph\u1EA3n x\u1EA1 ng\u1EAFn, t\u1EEB v\u1EF1ng theo ch\u1EE7 \u0111\u1EC1 v\xE0 b\xE0i t\u1EADp nghe-n\xF3i sau bu\u1ED5i h\u1ECDc.',
    achievements: [
      'Thi\u1EBFt k\u1EBF l\u1ED9 tr\xECnh theo m\u1EE5c ti\xEAu \u0111i\u1EC3m v\xE0 k\u1EF9 n\u0103ng',
      'Ph\u1EA3n h\u1ED3i ph\xE1t \xE2m ngay trong bu\u1ED5i h\u1ECDc',
      'Ph\xF9 h\u1EE3p h\u1ECDc vi\xEAn c\u1EA7n t\u0103ng ph\u1EA3n x\u1EA1 giao ti\u1EBFp'
    ],
    offerings: [
      {
        id: 'english-grade-12-exam',
        subject: 'Ti\u1EBFng Anh',
        grade: 'L\u1EDBp 12',
        proficiency: 'ADVANCED',
        pricePerHour: 3e5,
        active: true,
        teachingNote:
          '\xD4n ng\u1EEF ph\xE1p, \u0111\u1ECDc hi\u1EC3u v\xE0 chi\u1EBFn thu\u1EADt l\xE0m \u0111\u1EC1.'
      },
      {
        id: 'ielts-foundation',
        subject: 'IELTS',
        grade: 'Foundation',
        proficiency: 'INTERMEDIATE',
        pricePerHour: 32e4,
        active: true,
        teachingNote: 'L\u1ED9 tr\xECnh cho m\u1EE5c ti\xEAu 5.0-6.5.'
      }
    ],
    recurringAvailability: [
      {
        dayLabel: 'Th\u1EE9 3',
        startTime: '19:00',
        endTime: '21:00',
        meetingTypes: ['ONLINE']
      },
      {
        dayLabel: 'Th\u1EE9 5',
        startTime: '19:00',
        endTime: '21:00',
        meetingTypes: ['ONLINE']
      },
      {
        dayLabel: 'Th\u1EE9 7',
        startTime: '09:00',
        endTime: '11:30',
        meetingTypes: ['ONLINE']
      }
    ],
    specificDateAvailability: [
      {
        dateLabel: '13/06',
        startTime: '20:00',
        endTime: '21:30',
        meetingTypes: ['ONLINE'],
        note: 'C\xF3 th\u1EC3 th\xEAm bu\u1ED5i speaking th\u1EED'
      }
    ],
    experience: [
      {
        title: 'IELTS Mentor',
        company: 'English Pathway',
        period: '2020 - nay'
      },
      {
        title: 'Tr\u1EE3 gi\u1EA3ng Ti\u1EBFng Anh',
        company: '\u0110\u1EA1i h\u1ECDc Ngo\u1EA1i ng\u1EEF',
        period: '2018 - 2020'
      }
    ],
    education: [
      {
        degree: 'C\u1EED nh\xE2n Ng\xF4n ng\u1EEF Anh',
        school: '\u0110\u1EA1i h\u1ECDc Khoa h\u1ECDc X\xE3 h\u1ED9i v\xE0 Nh\xE2n v\u0103n'
      }
    ],
    reviews: [
      {
        name: 'Lan N.',
        rating: 5,
        text: 'M\u1ED7i bu\u1ED5i \u0111\u1EC1u c\xF3 m\u1EE5c ti\xEAu r\xF5, s\u1EEDa l\u1ED7i ph\xE1t \xE2m r\u1EA5t k\u1EF9 v\xE0 b\xE0i t\u1EADp kh\xF4ng b\u1ECB qu\xE1 t\u1EA3i.',
        tags: ['L\u1ED9 tr\xECnh r\xF5', 'Ph\xF9 h\u1EE3p h\u1ECDc n\u1EC1n t\u1EA3ng']
      }
    ]
  },
  {
    id: 'le-thu-ha',
    name: 'L\xEA Thu H\xE0',
    headline: 'Mentor V\u1EADt l\xFD THPT, h\u1ECDc qua v\xED d\u1EE5 th\u1EF1c t\u1EBF',
    approvalStatus: 'APPROVED',
    verificationStatus: 'VERIFIED',
    rating: 4.7,
    reviewsCount: 64,
    responseTime: 'Trong 3 gi\u1EDD',
    activeStudentsCount: 98,
    startingPrice: 26e4,
    expertise: 'V\u1EADt l\xFD l\u1EDBp 10-12',
    highlights: ['V\u1EADt l\xFD THPT', 'M\u1EA5t g\u1ED1c', 'Hybrid'],
    introduction:
      'Thu H\xE0 gi\xFAp h\u1ECDc vi\xEAn hi\u1EC3u b\u1EA3n ch\u1EA5t c\xF4ng th\u1EE9c qua v\xED d\u1EE5 g\u1EA7n g\u0169i, sau \u0111\xF3 luy\u1EC7n d\u1EA1ng b\xE0i theo m\u1EE9c \u0111\u1ED9 t\u1EEB c\u01A1 b\u1EA3n \u0111\u1EBFn n\xE2ng cao.',
    subjects: ['V\u1EADt l\xFD'],
    grades: ['L\u1EDBp 10', 'L\u1EDBp 11', 'L\u1EDBp 12'],
    meetingTypes: ['HYBRID', 'OFFLINE'],
    availabilitySummary:
      'Chi\u1EC1u Th\u1EE9 7 v\xE0 Ch\u1EE7 nh\u1EADt t\u1EA1i Qu\u1EADn 7 ho\u1EB7c online',
    teachingStyle:
      'D\u1EA1y theo s\u01A1 \u0111\u1ED3 kh\xE1i ni\u1EC7m, v\xED d\u1EE5 \u0111\u1EDDi s\u1ED1ng v\xE0 b\xE0i luy\u1EC7n theo c\u1EA5p \u0111\u1ED9 \u0111\u1EC3 h\u1ECDc vi\xEAn n\u1EAFm ch\u1EAFc v\xEC sao d\xF9ng c\xF4ng th\u1EE9c.',
    achievements: [
      'D\xF9ng s\u01A1 \u0111\u1ED3 kh\xE1i ni\u1EC7m \u0111\u1EC3 gi\u1EA3m h\u1ECDc v\u1EB9t',
      'C\xF3 th\u1EC3 h\u1ECDc offline t\u1EA1i Qu\u1EADn 7',
      'Ph\xF9 h\u1EE3p h\u1ECDc vi\xEAn c\u1EA7n hi\u1EC3u b\u1EA3n ch\u1EA5t c\xF4ng th\u1EE9c'
    ],
    offerings: [
      {
        id: 'physics-grade-11',
        subject: 'V\u1EADt l\xFD',
        grade: 'L\u1EDBp 11',
        proficiency: 'INTERMEDIATE',
        pricePerHour: 26e4,
        active: true,
        teachingNote:
          '\u0110i\u1EC7n h\u1ECDc, quang h\u1ECDc v\xE0 b\xE0i t\u1EADp v\u1EADn d\u1EE5ng.'
      }
    ],
    recurringAvailability: [
      {
        dayLabel: 'Th\u1EE9 7',
        startTime: '14:00',
        endTime: '17:30',
        meetingTypes: ['OFFLINE', 'HYBRID']
      },
      {
        dayLabel: 'Ch\u1EE7 nh\u1EADt',
        startTime: '15:00',
        endTime: '18:00',
        meetingTypes: ['ONLINE', 'HYBRID']
      }
    ],
    specificDateAvailability: [
      {
        dateLabel: '15/06',
        startTime: '19:00',
        endTime: '20:30',
        meetingTypes: ['ONLINE']
      }
    ],
    experience: [
      {
        title: 'Mentor V\u1EADt l\xFD',
        company: 'STEM Lab S\xE0i G\xF2n',
        period: '2019 - nay'
      }
    ],
    education: [
      {
        degree: 'Th\u1EA1c s\u0129 V\u1EADt l\xFD \u1EE9ng d\u1EE5ng',
        school: '\u0110\u1EA1i h\u1ECDc Khoa h\u1ECDc T\u1EF1 nhi\xEAn'
      }
    ],
    reviews: [
      {
        name: 'Quang P.',
        rating: 5,
        text: 'C\xF4 gi\u1EA3i th\xEDch c\xF4ng th\u1EE9c b\u1EB1ng v\xED d\u1EE5 n\xEAn em d\u1EC5 nh\u1EDB h\u01A1n, kh\xF4ng c\xF2n h\u1ECDc thu\u1ED9c m\xE1y m\xF3c.',
        tags: ['Hi\u1EC3u b\u1EA3n ch\u1EA5t', 'V\xED d\u1EE5 th\u1EF1c t\u1EBF']
      }
    ]
  },
  {
    id: 'pham-gia-bao',
    name: 'Ph\u1EA1m Gia B\u1EA3o',
    headline: 'Mentor l\u1EADp tr\xECnh Python cho h\u1ECDc sinh m\u1EDBi b\u1EAFt \u0111\u1EA7u',
    approvalStatus: 'PENDING',
    verificationStatus: 'PENDING',
    rating: 4.6,
    reviewsCount: 51,
    responseTime: 'Trong 4 gi\u1EDD',
    activeStudentsCount: 74,
    startingPrice: 3e5,
    expertise: 'Python c\u01A1 b\u1EA3n v\xE0 t\u01B0 duy thu\u1EADt to\xE1n',
    highlights: ['Python', 'Tin h\u1ECDc', 'D\u1EF1 \xE1n nh\u1ECF'],
    introduction:
      'Gia B\u1EA3o h\u01B0\u1EDBng d\u1EABn h\u1ECDc sinh l\xE0m quen v\u1EDBi Python qua b\xE0i t\u1EADp tr\u1EF1c quan, mini project v\xE0 c\xE1ch debug t\u1EEBng b\u01B0\u1EDBc.',
    subjects: ['L\u1EADp tr\xECnh'],
    grades: ['THCS', 'THPT', 'Ng\u01B0\u1EDDi m\u1EDBi b\u1EAFt \u0111\u1EA7u'],
    meetingTypes: ['ONLINE'],
    availabilitySummary: 'T\u1ED1i Th\u1EE9 3, Th\u1EE9 5 v\xE0 Ch\u1EE7 nh\u1EADt',
    teachingStyle:
      'H\u1ECDc qua mini project, gi\u1EA3i th\xEDch l\u1ED7i tr\u1EF1c ti\u1EBFp v\xE0 d\xF9ng b\xE0i t\u1EADp ng\u1EAFn \u0111\u1EC3 h\xECnh th\xE0nh t\u01B0 duy thu\u1EADt to\xE1n.',
    achievements: [
      'Ph\xF9 h\u1EE3p h\u1ECDc sinh m\u1EDBi b\u1EAFt \u0111\u1EA7u l\u1EADp tr\xECnh',
      'C\xF3 mini project sau t\u1EEBng ch\u1EB7ng',
      '\u0110ang ch\u1EDD ho\xE0n t\u1EA5t duy\u1EC7t h\u1ED3 s\u01A1'
    ],
    offerings: [
      {
        id: 'python-beginner',
        subject: 'L\u1EADp tr\xECnh Python',
        grade: 'Ng\u01B0\u1EDDi m\u1EDBi b\u1EAFt \u0111\u1EA7u',
        proficiency: 'INTERMEDIATE',
        pricePerHour: 3e5,
        active: true,
        teachingNote:
          'Bi\u1EBFn, v\xF2ng l\u1EB7p, h\xE0m, c\u1EA5u tr\xFAc d\u1EEF li\u1EC7u v\xE0 mini project.'
      }
    ],
    recurringAvailability: [
      {
        dayLabel: 'Th\u1EE9 3',
        startTime: '19:00',
        endTime: '21:00',
        meetingTypes: ['ONLINE']
      },
      {
        dayLabel: 'Th\u1EE9 5',
        startTime: '19:00',
        endTime: '21:00',
        meetingTypes: ['ONLINE']
      },
      {
        dayLabel: 'Ch\u1EE7 nh\u1EADt',
        startTime: '09:00',
        endTime: '11:30',
        meetingTypes: ['ONLINE']
      }
    ],
    specificDateAvailability: [
      {
        dateLabel: '18/06',
        startTime: '20:00',
        endTime: '21:00',
        meetingTypes: ['ONLINE'],
        note: 'L\u1ECBch s\u1EBD m\u1EDF r\u1ED9ng sau khi \u0111\u01B0\u1EE3c duy\u1EC7t'
      }
    ],
    experience: [
      {
        title: 'Mentor l\u1EADp tr\xECnh thi\u1EBFu ni\xEAn',
        company: 'Code Starter',
        period: '2022 - nay'
      }
    ],
    education: [
      {
        degree: 'K\u1EF9 s\u01B0 C\xF4ng ngh\u1EC7 th\xF4ng tin',
        school: '\u0110\u1EA1i h\u1ECDc B\xE1ch khoa TP.HCM'
      }
    ],
    reviews: [
      {
        name: 'Ph\u1EE5 huynh Minh T.',
        rating: 4,
        text: 'Bu\u1ED5i h\u1ECDc vui, c\xF3 s\u1EA3n ph\u1EA9m nh\u1ECF sau m\u1ED7i ch\u1EB7ng n\xEAn con c\xF3 \u0111\u1ED9ng l\u1EF1c ti\u1EBFp t\u1EE5c.',
        tags: ['C\xF3 mini project', 'D\u1EC5 t\u1EA1o h\u1EE9ng th\xFA']
      }
    ]
  }
]
export { mentors }
