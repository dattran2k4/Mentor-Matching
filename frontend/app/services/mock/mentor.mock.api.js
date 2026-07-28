import { useAuthStore } from '@/stores/auth-store'
import { getMockEmailFromToken, mockUsers } from '@/services/mock/auth.mock.api'
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))
function buildSuccessResponse(data, message = 'Success') {
  return {
    status: 200,
    code: 'SUCCESS',
    success: true,
    message,
    data
  }
}
function buildCreatedResponse(data, message = 'Created') {
  return {
    status: 201,
    code: 'SUCCESS',
    success: true,
    message,
    data
  }
}
function paginate(items, page = 1, size = 10) {
  const pageSize = size
  const currentPage = page
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  return {
    page: currentPage,
    pageSize,
    totalPages,
    totalItems,
    data: items.slice(startIndex, startIndex + pageSize)
  }
}
function requireMockSession() {
  const email = getMockEmailFromToken(useAuthStore.getState().accessToken)
  if (!email || !mockUsers[email]) {
    throw new Error('Phi\xEAn \u0111\u0103ng nh\u1EADp mock kh\xF4ng h\u1EE3p l\u1EC7')
  }
  return {
    email,
    user: mockUsers[email]
  }
}
const personalityOptions = [
  {
    id: 1,
    name: 'Ki\xEAn nh\u1EABn',
    description: 'Gi\u1EA3i th\xEDch ch\u1EADm r\xE3i, theo t\u1EEBng b\u01B0\u1EDBc.'
  },
  {
    id: 2,
    name: 'Truy\u1EC1n c\u1EA3m h\u1EE9ng',
    description:
      'T\u1EA1o \u0111\u1ED9ng l\u1EF1c v\xE0 gi\u1EEF nh\u1ECBp h\u1ECDc t\xEDch c\u1EF1c.'
  },
  {
    id: 3,
    name: 'K\u1EF7 lu\u1EADt',
    description:
      'B\xE1m s\xE1t k\u1EBF ho\u1EA1ch v\xE0 theo d\xF5i ti\u1EBFn \u0111\u1ED9 \u0111\u1EC1u.'
  }
]
const highlightOptions = [
  {
    id: 11,
    name: '\xD4n thi chuy\u1EC3n c\u1EA5p',
    description: 'Ph\xF9 h\u1EE3p h\u1ECDc vi\xEAn c\xF3 m\u1EE5c ti\xEAu thi c\u1EED.'
  },
  {
    id: 12,
    name: 'H\u1ECDc online',
    description: 'Linh ho\u1EA1t v\u1EDBi l\u1ECBch h\u1ECDc t\u1EEB xa.'
  },
  {
    id: 13,
    name: 'M\u1EA5t g\u1ED1c',
    description: 'C\xF3 th\u1EC3 \u0111i t\u1EEB n\u1EC1n t\u1EA3ng c\u01A1 b\u1EA3n.'
  }
]
const mentorDirectory = [
  {
    id: 101,
    userId: 2,
    fullName: 'Mentor Test',
    avatarUrl: 'https://example.com/mock-mentor-1.jpg',
    gender: 'MALE',
    hometown: { cityId: 1, cityName: 'Ho Chi Minh', districtId: null, districtName: null },
    currentLocation: {
      cityId: 1,
      cityName: 'Ho Chi Minh',
      districtId: 103,
      districtName: 'Thu Duc'
    },
    headline: 'Mentor Toan THCS va on thi chuyen cap',
    introduction: 'Dong hanh cung hoc vien xay nen tang va giai bai co he thong.',
    teachingStyle: 'Chia muc tieu tung tuan, giao bai ngan va review loi sai ro rang.',
    experienceYears: 5,
    currentPosition: 'Mentor toan ca nhan',
    workplace: 'Freelance',
    education: 'Cu nhan Su pham Toan',
    major: 'Su pham Toan',
    meetingType: 'HYBRID',
    createdAt: '2026-05-01T09:00:00',
    updatedAt: '2026-06-09T09:00:00'
  },
  {
    id: 102,
    userId: 4,
    fullName: 'Tran Quoc Huy',
    avatarUrl: 'https://example.com/mock-mentor-2.jpg',
    gender: 'MALE',
    hometown: { cityId: 2, cityName: 'Ha Noi', districtId: null, districtName: null },
    currentLocation: { cityId: 2, cityName: 'Ha Noi', districtId: 202, districtName: 'Cau Giay' },
    headline: 'Mentor Tieng Anh giao tiep va IELTS nen tang',
    introduction: 'Tap trung speaking, phat am va lo trinh hoc co muc tieu ro.',
    teachingStyle: 'Ket hop luyen phan xa va bai tap sau moi buoi.',
    experienceYears: 4,
    currentPosition: 'IELTS Mentor',
    workplace: 'English Pathway',
    education: 'Cu nhan Ngon ngu Anh',
    major: 'Ngon ngu Anh',
    meetingType: 'ONLINE',
    createdAt: '2026-04-15T09:00:00',
    updatedAt: '2026-06-08T09:00:00'
  }
]
const mentorListItems = mentorDirectory.map((mentor, index) => ({
  id: mentor.id,
  userId: mentor.userId,
  fullName: mentor.fullName,
  avatarUrl: mentor.avatarUrl,
  gender: mentor.gender,
  headline: mentor.headline,
  experienceYears: mentor.experienceYears,
  currentPosition: mentor.currentPosition,
  workplace: mentor.workplace,
  education: mentor.education,
  major: mentor.major,
  meetingType: mentor.meetingType,
  approvalStatus: index === 0 ? 'APPROVED' : 'PENDING',
  verificationStatus: index === 0 ? 'VERIFIED' : 'PENDING',
  minPrice: index === 0 ? 28e4 : 32e4,
  createdAt: mentor.createdAt
}))
const mentorSubjectsByMentorId = {
  101: [
    {
      id: 1001,
      subjectGradeId: 5001,
      subjectId: 1,
      subjectName: 'Toan',
      gradeId: 8,
      gradeName: 'Lop 8',
      proficiencyLevel: 'INTERMEDIATE',
      teachingNote: 'Cung co nen tang va sua bai theo dang.',
      pricePerHour: 24e4,
      active: true
    },
    {
      id: 1002,
      subjectGradeId: 5002,
      subjectId: 1,
      subjectName: 'Toan',
      gradeId: 9,
      gradeName: 'Lop 9',
      proficiencyLevel: 'ADVANCED',
      teachingNote: 'On thi chuyen cap va luyen de.',
      pricePerHour: 28e4,
      active: true
    }
  ],
  102: [
    {
      id: 1003,
      subjectGradeId: 5003,
      subjectId: 9,
      subjectName: 'Tieng Anh',
      gradeId: 12,
      gradeName: 'Lop 12',
      proficiencyLevel: 'ADVANCED',
      teachingNote: 'Tap trung ngu phap va doc hieu.',
      pricePerHour: 3e5,
      active: true
    }
  ]
}
const mentorTraitsByMentorId = {
  101: {
    personalities: [personalityOptions[0], personalityOptions[2]],
    highlights: [highlightOptions[0], highlightOptions[2]]
  },
  102: {
    personalities: [personalityOptions[1]],
    highlights: [highlightOptions[1]]
  }
}
const mentorAchievementsByMentorId = {
  101: [
    {
      id: 7001,
      title: 'Chung chi nghiep vu su pham',
      description: 'Hoan thanh khoa boi duong nghiep vu su pham.',
      achievementType: 'CERTIFICATE',
      issuer: 'Truong Dai hoc Su pham',
      achievedAt: '2023-08-15',
      proofUrl: 'https://example.com/certificate-1.jpg',
      verified: true
    }
  ],
  102: [
    {
      id: 7002,
      title: 'IELTS 8.0',
      description: 'Chung chi IELTS con hieu luc.',
      achievementType: 'EXAM_SCORE',
      issuer: 'IELTS',
      achievedAt: '2024-03-10',
      proofUrl: 'https://example.com/ielts-1.jpg',
      verified: true
    }
  ]
}
const mentorAvailabilitiesByMentorId = {
  101: [
    {
      id: 8001,
      availabilityType: 'RECURRING',
      dayOfWeek: 2,
      availableDate: null,
      startTime: '19:00:00',
      endTime: '21:00:00'
    },
    {
      id: 8002,
      availabilityType: 'SPECIFIC_DATE',
      dayOfWeek: null,
      availableDate: '2026-06-12',
      startTime: '08:00:00',
      endTime: '10:00:00'
    }
  ],
  102: [
    {
      id: 8003,
      availabilityType: 'RECURRING',
      dayOfWeek: 4,
      availableDate: null,
      startTime: '19:00:00',
      endTime: '21:00:00'
    }
  ]
}
const adminMentorVerifications = [
  {
    id: 9001,
    mentorId: 101,
    userId: 2,
    accountFullName: 'Mentor Test',
    accountEmail: 'mentor@test.com',
    accountPhone: '0900000002',
    approvalStatus: 'APPROVED',
    approvalNote: 'Ho so day du',
    fullName: 'Mentor Test',
    idCardNumber: '079123456789',
    idCardFrontUrl: 'https://example.com/id-front.jpg',
    idCardBackUrl: 'https://example.com/id-back.jpg',
    selfieWithIdUrl: 'https://example.com/selfie.jpg',
    verificationStatus: 'VERIFIED',
    verifiedBy: 3,
    verifiedAt: '2026-06-01T09:00:00',
    rejectionReason: null,
    createdAt: '2026-05-28T09:00:00',
    updatedAt: '2026-06-01T09:00:00'
  }
]
let currentMentorState = {
  id: 101,
  userId: 2,
  fullName: 'Mentor Test',
  avatarUrl: 'https://example.com/mock-mentor-1.jpg',
  avatarMediaId: 9901,
  gender: 'MALE',
  hometown: { cityId: 1, cityName: 'Ho Chi Minh', districtId: null, districtName: null },
  currentLocation: { cityId: 1, cityName: 'Ho Chi Minh', districtId: 103, districtName: 'Thu Duc' },
  headline: 'Mentor Toan THCS va on thi chuyen cap',
  introduction: 'Dong hanh cung hoc vien xay nen tang va giai bai co he thong.',
  teachingStyle: 'Chia muc tieu tung tuan, giao bai ngan va review loi sai ro rang.',
  experienceYears: 5,
  currentPosition: 'Mentor toan ca nhan',
  workplace: 'Freelance',
  education: 'Cu nhan Su pham Toan',
  major: 'Su pham Toan',
  meetingType: 'HYBRID',
  approvalStatus: 'APPROVED',
  approvalNote: 'Ho so hop le',
  verificationStatus: 'VERIFIED',
  verificationRejectionReason: null,
  createdAt: '2026-05-01T09:00:00',
  updatedAt: '2026-06-09T09:00:00'
}
let currentMentorTraitsState = {
  personalityOptionIds: [1, 3],
  highlightOptionIds: [11, 13]
}
let currentMentorVerificationState = {
  id: 9001,
  mentorId: 101,
  fullName: 'Mentor Test',
  idCardNumber: '079123456789',
  idCardFrontUrl: 'https://example.com/id-front.jpg',
  idCardFrontMediaId: 9902,
  idCardBackUrl: 'https://example.com/id-back.jpg',
  idCardBackMediaId: 9903,
  selfieWithIdUrl: 'https://example.com/selfie.jpg',
  selfieWithIdMediaId: 9904,
  verificationStatus: 'VERIFIED',
  verifiedBy: 3,
  verifiedAt: '2026-06-01T09:00:00',
  rejectionReason: null,
  createdAt: '2026-05-28T09:00:00',
  updatedAt: '2026-06-01T09:00:00'
}
function getMentorTraitsDetailFromState() {
  const personalities = personalityOptions.filter((option) =>
    currentMentorTraitsState.personalityOptionIds.includes(option.id)
  )
  const highlights = highlightOptions.filter((option) =>
    currentMentorTraitsState.highlightOptionIds.includes(option.id)
  )
  return {
    personalities,
    highlights
  }
}
function filterMentorItemsBySearch(items, search) {
  const normalizedQuery = search?.trim().toLowerCase()
  if (!normalizedQuery) return items
  return items.filter((item) => {
    return (
      item.fullName.toLowerCase().includes(normalizedQuery) ||
      (item.headline ?? '').toLowerCase().includes(normalizedQuery)
    )
  })
}
function normalizeDate(value) {
  return /* @__PURE__ */ new Date(`${value}T00:00:00`)
}
function toIsoDate(value) {
  const year = value.getFullYear()
  const month = `${value.getMonth() + 1}`.padStart(2, '0')
  const day = `${value.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}
function buildMentorCalendar(mentorId, from, to) {
  const fromDate = normalizeDate(from)
  const toDate = normalizeDate(to)
  const availabilities = mentorAvailabilitiesByMentorId[mentorId] ?? []
  const dates = []
  for (
    let cursor = new Date(fromDate);
    cursor.getTime() <= toDate.getTime();
    cursor.setDate(cursor.getDate() + 1)
  ) {
    const currentDate = new Date(cursor)
    const isoDate = toIsoDate(currentDate)
    const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay()
    const availableWindows = availabilities
      .filter((item) => {
        if (item.availabilityType === 'SPECIFIC_DATE') return item.availableDate === isoDate
        return item.availabilityType === 'RECURRING' && item.dayOfWeek === dayOfWeek
      })
      .sort((left, right) => left.startTime.localeCompare(right.startTime))
      .map((item) => ({
        startTime: item.startTime,
        endTime: item.endTime
      }))
    dates.push({
      date: isoDate,
      availableWindows
    })
  }
  return {
    mentorId,
    from,
    to,
    dates
  }
}
function normalizeAvailabilityPayload(payload) {
  return {
    id: 0,
    availabilityType: payload.availabilityType,
    dayOfWeek: payload.availabilityType === 'RECURRING' ? (payload.dayOfWeek ?? null) : null,
    availableDate:
      payload.availabilityType === 'SPECIFIC_DATE' ? (payload.availableDate ?? null) : null,
    startTime: payload.startTime,
    endTime: payload.endTime
  }
}
function filterByMeetingType(items, meetingType) {
  if (!meetingType) return items
  return items.filter((item) => item.meetingType === meetingType)
}
function getCurrentMentorOnboardingStatus() {
  const subjects = mentorSubjectsByMentorId[currentMentorState.id] ?? []
  const achievements = mentorAchievementsByMentorId[currentMentorState.id] ?? []
  return {
    mentorProfileCreated: Boolean(currentMentorState.id),
    profileDetailsCompleted: Boolean(
      currentMentorState.avatarUrl &&
      currentMentorState.headline &&
      currentMentorState.introduction &&
      currentMentorState.teachingStyle
    ),
    verificationSubmitted: currentMentorVerificationState.verificationStatus !== 'UNVERIFIED',
    verificationStatus: currentMentorVerificationState.verificationStatus,
    subjectCount: subjects.length,
    personalityCount: currentMentorTraitsState.personalityOptionIds.length,
    highlightCount: currentMentorTraitsState.highlightOptionIds.length,
    achievementCount: achievements.length,
    approvalStatus: currentMentorState.approvalStatus,
    onboardingCompleted:
      currentMentorState.approvalStatus === 'APPROVED' &&
      currentMentorVerificationState.verificationStatus === 'VERIFIED'
  }
}
const mockMentorApi = {
  async createCurrentMentor(payload) {
    await delay()
    requireMockSession()
    currentMentorState = {
      ...currentMentorState,
      ...payload,
      approvalStatus: 'DRAFT',
      updatedAt: /* @__PURE__ */ new Date().toISOString()
    }
    return buildCreatedResponse(currentMentorState, 'Create mentor profile successfully')
  },
  async getCurrentMentor() {
    await delay()
    requireMockSession()
    return buildSuccessResponse(currentMentorState, 'Get current mentor profile successfully')
  },
  async getCurrentMentorOnboardingStatus() {
    await delay()
    requireMockSession()
    return buildSuccessResponse(
      getCurrentMentorOnboardingStatus(),
      'Get current mentor onboarding status successfully'
    )
  },
  async submitCurrentMentorApplication() {
    await delay()
    requireMockSession()
    currentMentorState = {
      ...currentMentorState,
      approvalStatus: 'PENDING',
      updatedAt: /* @__PURE__ */ new Date().toISOString()
    }
    return buildSuccessResponse(
      getCurrentMentorOnboardingStatus(),
      'Submit current mentor application successfully'
    )
  },
  async updateCurrentMentor(payload) {
    await delay()
    requireMockSession()
    currentMentorState = {
      ...currentMentorState,
      ...payload,
      hometown: {
        ...currentMentorState.hometown,
        cityId: payload.hometownCityId ?? currentMentorState.hometown.cityId
      },
      currentLocation: {
        ...currentMentorState.currentLocation,
        districtId: payload.currentDistrictId ?? currentMentorState.currentLocation.districtId
      },
      updatedAt: /* @__PURE__ */ new Date().toISOString()
    }
    return buildSuccessResponse(currentMentorState, 'Update mentor profile successfully')
  },
  async updateCurrentMentorAvatar(payload) {
    await delay()
    requireMockSession()
    currentMentorState = {
      ...currentMentorState,
      avatarMediaId: payload.avatarMediaId,
      avatarUrl: `https://example.com/media/${payload.avatarMediaId}.jpg`,
      updatedAt: /* @__PURE__ */ new Date().toISOString()
    }
    return buildSuccessResponse(currentMentorState, 'Update mentor avatar successfully')
  },
  async getMentors(params) {
    await delay()
    const filteredItems = filterByMeetingType(
      filterMentorItemsBySearch(mentorListItems, params?.search),
      params?.meetingType
    )
    return buildSuccessResponse(
      paginate(filteredItems, params?.page ?? 1, params?.size ?? 10),
      'Get mentors successfully'
    )
  },
  async getMentorDetail(mentorId) {
    await delay()
    const mentor = mentorDirectory.find((item) => item.id === mentorId) ?? mentorDirectory[0]
    return buildSuccessResponse(mentor, 'Get mentor detail successfully')
  },
  async getCurrentMentorSubjects() {
    await delay()
    requireMockSession()
    return buildSuccessResponse(
      mentorSubjectsByMentorId[currentMentorState.id] ?? [],
      'Get current mentor subjects successfully'
    )
  },
  async upsertCurrentMentorSubject(payload) {
    await delay()
    requireMockSession()
    const currentSubjects = mentorSubjectsByMentorId[currentMentorState.id] ?? []
    const nextSubject = {
      id: payload.id ?? Date.now(),
      subjectGradeId: payload.subjectGradeId,
      subjectId: currentSubjects[0]?.subjectId ?? 1,
      subjectName: currentSubjects[0]?.subjectName ?? 'Toan',
      gradeId: currentSubjects[0]?.gradeId ?? 8,
      gradeName: currentSubjects[0]?.gradeName ?? 'Lop 8',
      proficiencyLevel: payload.proficiencyLevel,
      teachingNote: payload.teachingNote ?? null,
      pricePerHour: payload.pricePerHour,
      active: payload.active
    }
    const subjectIndex = currentSubjects.findIndex((item) => item.id === nextSubject.id)
    if (subjectIndex >= 0) {
      currentSubjects[subjectIndex] = nextSubject
    } else {
      currentSubjects.push(nextSubject)
    }
    mentorSubjectsByMentorId[currentMentorState.id] = currentSubjects
    return buildSuccessResponse(nextSubject, 'Save current mentor subject successfully')
  },
  async deleteCurrentMentorSubject(mentorSubjectId) {
    await delay()
    requireMockSession()
    mentorSubjectsByMentorId[currentMentorState.id] = (
      mentorSubjectsByMentorId[currentMentorState.id] ?? []
    ).filter((subject) => subject.id !== mentorSubjectId)
    return buildSuccessResponse(null, 'Delete current mentor subject successfully')
  },
  async getMentorSubjects(mentorId) {
    await delay()
    return buildSuccessResponse(
      mentorSubjectsByMentorId[mentorId] ?? [],
      'Get mentor subjects successfully'
    )
  },
  async getCurrentMentorTraits() {
    await delay()
    requireMockSession()
    return buildSuccessResponse(currentMentorTraitsState, 'Get current mentor traits successfully')
  },
  async updateCurrentMentorTraits(payload) {
    await delay()
    requireMockSession()
    currentMentorTraitsState = payload
    return buildSuccessResponse(
      currentMentorTraitsState,
      'Update current mentor traits successfully'
    )
  },
  async getPersonalityOptions() {
    await delay()
    return buildSuccessResponse(personalityOptions, 'Get personality options successfully')
  },
  async getHighlightOptions() {
    await delay()
    return buildSuccessResponse(highlightOptions, 'Get highlight options successfully')
  },
  async getMentorTraits(mentorId) {
    await delay()
    const traits =
      mentorId === currentMentorState.id
        ? getMentorTraitsDetailFromState()
        : (mentorTraitsByMentorId[mentorId] ?? { personalities: [], highlights: [] })
    return buildSuccessResponse(traits, 'Get mentor traits successfully')
  },
  async getCurrentMentorAchievements() {
    await delay()
    requireMockSession()
    return buildSuccessResponse(
      mentorAchievementsByMentorId[currentMentorState.id] ?? [],
      'Get current mentor achievements successfully'
    )
  },
  async createCurrentMentorAchievement(payload) {
    await delay()
    requireMockSession()
    const nextAchievement = {
      id: Date.now(),
      title: payload.title,
      description: payload.description ?? null,
      achievementType: payload.achievementType,
      issuer: payload.issuer ?? null,
      achievedAt: payload.achievedAt ?? null,
      proofUrl: payload.proofUrl ?? null,
      verified: false
    }
    mentorAchievementsByMentorId[currentMentorState.id] = [
      ...(mentorAchievementsByMentorId[currentMentorState.id] ?? []),
      nextAchievement
    ]
    return buildCreatedResponse(nextAchievement, 'Create current mentor achievement successfully')
  },
  async updateCurrentMentorAchievement(achievementId, payload) {
    await delay()
    requireMockSession()
    const currentAchievements = mentorAchievementsByMentorId[currentMentorState.id] ?? []
    const currentAchievement = currentAchievements.find((item) => item.id === achievementId)
    if (!currentAchievement) {
      throw new Error('Mock mentor achievement not found')
    }
    const nextAchievement = {
      ...currentAchievement,
      title: payload.title,
      description: payload.description ?? null,
      achievementType: payload.achievementType,
      issuer: payload.issuer ?? null,
      achievedAt: payload.achievedAt ?? null,
      proofUrl: payload.proofUrl ?? null
    }
    mentorAchievementsByMentorId[currentMentorState.id] = currentAchievements.map((item) =>
      item.id === achievementId ? nextAchievement : item
    )
    return buildSuccessResponse(nextAchievement, 'Update current mentor achievement successfully')
  },
  async deleteCurrentMentorAchievement(achievementId) {
    await delay()
    requireMockSession()
    mentorAchievementsByMentorId[currentMentorState.id] = (
      mentorAchievementsByMentorId[currentMentorState.id] ?? []
    ).filter((item) => item.id !== achievementId)
    return buildSuccessResponse(null, 'Delete current mentor achievement successfully')
  },
  async getMentorAchievements(mentorId) {
    await delay()
    return buildSuccessResponse(
      mentorAchievementsByMentorId[mentorId] ?? [],
      'Get mentor achievements successfully'
    )
  },
  async getCurrentMentorVerification() {
    await delay()
    requireMockSession()
    return buildSuccessResponse(
      currentMentorVerificationState,
      'Get current mentor verification successfully'
    )
  },
  async upsertCurrentMentorVerification(payload) {
    await delay()
    requireMockSession()
    currentMentorVerificationState = {
      ...currentMentorVerificationState,
      fullName: payload.fullName,
      idCardNumber: payload.idCardNumber ?? null,
      idCardFrontMediaId: payload.idCardFrontMediaId,
      idCardFrontUrl: `https://example.com/media/${payload.idCardFrontMediaId}.jpg`,
      idCardBackMediaId: payload.idCardBackMediaId,
      idCardBackUrl: `https://example.com/media/${payload.idCardBackMediaId}.jpg`,
      selfieWithIdMediaId: payload.selfieWithIdMediaId ?? null,
      selfieWithIdUrl: payload.selfieWithIdMediaId
        ? `https://example.com/media/${payload.selfieWithIdMediaId}.jpg`
        : null,
      verificationStatus: 'PENDING',
      updatedAt: /* @__PURE__ */ new Date().toISOString()
    }
    return buildSuccessResponse(
      currentMentorVerificationState,
      'Save current mentor verification successfully'
    )
  },
  async getMentorAvailabilities(mentorId) {
    await delay()
    return buildSuccessResponse(
      mentorAvailabilitiesByMentorId[mentorId] ?? [],
      'Get mentor availabilities successfully'
    )
  },
  async getCurrentMentorAvailabilities() {
    await delay()
    requireMockSession()
    return buildSuccessResponse(
      mentorAvailabilitiesByMentorId[currentMentorState.id] ?? [],
      'Get current mentor availabilities successfully'
    )
  },
  async createCurrentMentorAvailability(payload) {
    await delay()
    requireMockSession()
    const currentAvailabilities = mentorAvailabilitiesByMentorId[currentMentorState.id] ?? []
    const nextAvailabilityId =
      currentAvailabilities.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1
    mentorAvailabilitiesByMentorId[currentMentorState.id] = [
      ...currentAvailabilities,
      {
        ...normalizeAvailabilityPayload(payload),
        id: nextAvailabilityId
      }
    ]
    return buildCreatedResponse(
      { availabilityId: nextAvailabilityId },
      'Create current mentor availability successfully'
    )
  },
  async updateCurrentMentorAvailability(availabilityId, payload) {
    await delay()
    requireMockSession()
    mentorAvailabilitiesByMentorId[currentMentorState.id] = (
      mentorAvailabilitiesByMentorId[currentMentorState.id] ?? []
    ).map((item) =>
      item.id === availabilityId
        ? {
            ...normalizeAvailabilityPayload(payload),
            id: availabilityId
          }
        : item
    )
    return buildSuccessResponse(null, 'Update current mentor availability successfully')
  },
  async deleteCurrentMentorAvailability(availabilityId) {
    await delay()
    requireMockSession()
    mentorAvailabilitiesByMentorId[currentMentorState.id] = (
      mentorAvailabilitiesByMentorId[currentMentorState.id] ?? []
    ).filter((item) => item.id !== availabilityId)
    return buildSuccessResponse(null, 'Delete current mentor availability successfully')
  },
  async getMentorCalendarBooking(mentorId, from, to) {
    await delay()
    return buildSuccessResponse(
      buildMentorCalendar(mentorId, from, to),
      'Get mentor calendar successfully'
    )
  },
  async getAdminMentors(params) {
    await delay()
    requireMockSession()
    const filteredItems = filterByMeetingType(
      filterMentorItemsBySearch(mentorListItems, params?.search).filter((item) =>
        params?.approvalStatus ? item.approvalStatus === params.approvalStatus : true
      ),
      params?.meetingType
    )
    return buildSuccessResponse(
      paginate(filteredItems, params?.page ?? 1, params?.size ?? 10),
      'Get admin mentors successfully'
    )
  },
  async getAdminMentorDetail(mentorId) {
    await delay()
    requireMockSession()
    const detail = mentorDirectory.find((item) => item.id === mentorId) ?? mentorDirectory[0]
    const adminDetail = {
      ...detail,
      email: mentorId === 101 ? 'mentor@test.com' : 'mentor2@test.com',
      phone: mentorId === 101 ? '0900000002' : '0900000004',
      approvalStatus: mentorId === 101 ? 'APPROVED' : 'PENDING',
      approvalNote: mentorId === 101 ? 'Ho so hop le' : null
    }
    return buildSuccessResponse(adminDetail, 'Get admin mentor detail successfully')
  },
  async reviewMentorApproval(mentorId, payload) {
    await delay()
    requireMockSession()
    const currentDetailResponse = await this.getAdminMentorDetail(mentorId)
    const approvalStatusByAction = {
      APPROVE: 'APPROVED',
      REJECT: 'REJECTED',
      SUSPEND: 'SUSPENDED',
      REACTIVATE: 'APPROVED'
    }
    const approvalStatus = approvalStatusByAction[payload.action]
    const nextDetail = {
      ...currentDetailResponse.data,
      approvalStatus,
      approvalNote: payload.approvalNote ?? null
    }
    return buildSuccessResponse(nextDetail, 'Review mentor approval successfully')
  },
  async getAdminMentorVerifications(params) {
    await delay()
    requireMockSession()
    const items = adminMentorVerifications
      .filter((item) => (params?.status ? item.verificationStatus === params.status : true))
      .map((item) => ({
        id: item.id,
        mentorId: item.mentorId,
        userId: item.userId,
        accountFullName: item.accountFullName,
        accountEmail: item.accountEmail,
        verificationStatus: item.verificationStatus,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }))
    return buildSuccessResponse(
      paginate(items, params?.page ?? 1, params?.size ?? 10),
      'Get mentor verifications successfully'
    )
  },
  async getAdminMentorVerificationDetail(verificationId) {
    await delay()
    requireMockSession()
    const verification =
      adminMentorVerifications.find((item) => item.id === verificationId) ??
      adminMentorVerifications[0]
    return buildSuccessResponse(verification, 'Get mentor verification detail successfully')
  },
  async reviewMentorVerification(verificationId, payload) {
    await delay()
    requireMockSession()
    const currentVerificationResponse = await this.getAdminMentorVerificationDetail(verificationId)
    const nextVerification = {
      ...currentVerificationResponse.data,
      verificationStatus: payload.action === 'VERIFY' ? 'VERIFIED' : 'REJECTED',
      rejectionReason: payload.action === 'REJECT' ? (payload.rejectionReason ?? null) : null,
      verifiedAt: payload.action === 'VERIFY' ? /* @__PURE__ */ new Date().toISOString() : null
    }
    return buildSuccessResponse(nextVerification, 'Review mentor verification successfully')
  }
}
export { mockMentorApi }
