function mapMentorProfileToViewModel(bundle) {
  const { achievements, detail, subjects, traits } = bundle
  const meetingTypes = unique([detail.meetingType].filter((value) => Boolean(value)))
  const offerings = subjects.map((item) => ({
    id: String(item.id),
    mentorSubjectId: item.id,
    subject: item.subjectName,
    grade: item.gradeName,
    proficiency: item.proficiencyLevel,
    pricePerHour: item.pricePerHour,
    active: item.active,
    teachingNote:
      item.teachingNote?.trim() ||
      'Mentor s\u1EBD c\u1EADp nh\u1EADt th\xEAm m\u1EE5c ti\xEAu v\xE0 c\xE1ch tri\u1EC3n khai cho offering n\xE0y.'
  }))
  const startingPrice =
    offerings.length > 0
      ? offerings.reduce(
          (lowestPrice, offering) => Math.min(lowestPrice, offering.pricePerHour),
          offerings[0].pricePerHour
        )
      : null
  return {
    id: String(detail.id),
    mentorId: detail.id,
    name: detail.fullName,
    avatarUrl: detail.avatarUrl || null,
    headline:
      detail.headline?.trim() ||
      [detail.currentPosition, detail.workplace].filter(Boolean).join(' \xB7 ') ||
      'Mentor c\xF4ng khai \u0111ang s\u1EB5n s\xE0ng cho h\u1ECDc vi\xEAn m\u1EDBi.',
    approvalStatus: null,
    verificationStatus: null,
    rating: null,
    reviewsCount: null,
    responseTime: null,
    activeStudentsCount: null,
    startingPrice,
    expertise:
      detail.introduction?.trim() ||
      detail.teachingStyle?.trim() ||
      detail.headline?.trim() ||
      'Th\xF4ng tin gi\u1EDBi thi\u1EC7u chi ti\u1EBFt \u0111ang \u0111\u01B0\u1EE3c mentor c\u1EADp nh\u1EADt th\xEAm.',
    highlights: buildHighlights(detail, traits),
    introduction:
      detail.introduction?.trim() ||
      'Mentor ch\u01B0a b\u1ED5 sung ph\u1EA7n gi\u1EDBi thi\u1EC7u chi ti\u1EBFt cho h\u1ED3 s\u01A1 c\xF4ng khai n\xE0y.',
    subjects: unique(subjects.map((item) => item.subjectName)),
    grades: unique(subjects.map((item) => item.gradeName)),
    meetingTypes,
    availabilitySummary: buildAvailabilitySummary(detail, meetingTypes),
    teachingStyle:
      detail.teachingStyle?.trim() ||
      'Phong c\xE1ch gi\u1EA3ng d\u1EA1y \u0111ang \u0111\u01B0\u1EE3c mentor c\u1EADp nh\u1EADt th\xEAm trong h\u1ED3 s\u01A1 c\xF4ng khai.',
    achievements: buildAchievementHighlights(achievements),
    offerings,
    experience: buildExperience(detail, achievements),
    education: buildEducation(detail),
    reviews: [],
    reviewsUnavailableReason:
      'Backend public hi\u1EC7n ch\u01B0a cung c\u1EA5p d\u1EEF li\u1EC7u \u0111\xE1nh gi\xE1 cho h\u1ED3 s\u01A1 mentor n\xE0y.',
    bookableMeetingType: toBookableMeetingType(detail.meetingType)
  }
}
function formatMeetingTypeLabel(meetingType) {
  if (meetingType === 'ONLINE') return 'Online'
  if (meetingType === 'OFFLINE') return 'Offline'
  return 'Hybrid'
}
function formatTimeLabel(value) {
  return value.slice(0, 5)
}
function buildHighlights(detail, traits) {
  return unique([
    ...(traits?.highlights.map((item) => item.name) ?? []),
    ...(traits?.personalities.map((item) => item.name) ?? []),
    detail.major,
    detail.currentPosition,
    detail.workplace,
    detail.education
  ]).slice(0, 6)
}
function buildAchievementHighlights(achievements) {
  const normalized = achievements
    .map((item) => formatAchievementSummary(item))
    .filter((item) => Boolean(item))
  return normalized.length
    ? normalized
    : [
        'Mentor ch\u01B0a c\xF4ng khai th\xEAm ch\u1EE9ng ch\u1EC9 ho\u1EB7c th\xE0nh t\xEDch tr\xEAn h\u1ED3 s\u01A1 n\xE0y.'
      ]
}
function buildExperience(detail, achievements) {
  const items = []
  if (detail.currentPosition || detail.workplace || detail.experienceYears !== null) {
    items.push({
      title: detail.currentPosition?.trim() || 'Kinh nghi\u1EC7m chuy\xEAn m\xF4n',
      company: detail.workplace?.trim() || null,
      period:
        detail.experienceYears !== null
          ? `${detail.experienceYears} n\u0103m kinh nghi\u1EC7m`
          : 'Mentor ch\u01B0a c\xF4ng khai th\u1EDDi l\u01B0\u1EE3ng kinh nghi\u1EC7m'
    })
  }
  achievements
    .filter((item) => item.achievementType === 'WORK_EXPERIENCE')
    .forEach((item) => {
      items.push({
        title: item.title,
        company: item.issuer?.trim() || null,
        period:
          formatAchievementDate(item.achievedAt) ||
          'M\u1ED1c th\u1EDDi gian \u0111ang c\u1EADp nh\u1EADt'
      })
    })
  return dedupeExperience(items)
}
function buildEducation(detail) {
  const degree = detail.education?.trim() || null
  const school = detail.major?.trim() || null
  if (!degree && !school) return []
  return [
    {
      degree: degree || school || 'Th\xF4ng tin h\u1ECDc v\u1EA5n \u0111ang c\u1EADp nh\u1EADt',
      school:
        degree && school
          ? school
          : 'Mentor ch\u01B0a c\xF4ng khai th\xEAm tr\u01B0\u1EDDng h\u1ECDc ho\u1EB7c chuy\xEAn ng\xE0nh chi ti\u1EBFt.'
    }
  ]
}
function buildAvailabilitySummary(detail, meetingTypes) {
  const locationLabel = [detail.currentLocation.districtName, detail.currentLocation.cityName]
    .filter(Boolean)
    .join(', ')
  const meetingLabel = meetingTypes.map(formatMeetingTypeLabel).join(' / ')
  return (
    [locationLabel, meetingLabel].filter(Boolean).join(' \xB7 ') ||
    'L\u1ECBch d\u1EA1y c\xF4ng khai \u0111ang \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt th\xEAm.'
  )
}
function formatAchievementSummary(item) {
  const dateLabel = formatAchievementDate(item.achievedAt)
  const issuer = item.issuer?.trim()
  const typeLabel = formatAchievementType(item.achievementType)
  return [item.title, issuer || typeLabel, dateLabel].filter(Boolean).join(' \xB7 ')
}
function formatAchievementDate(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('vi-VN', { month: '2-digit', year: 'numeric' }).format(date)
}
function formatAchievementType(value) {
  if (value === 'AWARD') return 'Gi\u1EA3i th\u01B0\u1EDFng'
  if (value === 'CERTIFICATE') return 'Ch\u1EE9ng ch\u1EC9'
  if (value === 'EXAM_SCORE') return 'Th\xE0nh t\xEDch h\u1ECDc t\u1EADp'
  if (value === 'COMPETITION') return 'Cu\u1ED9c thi'
  if (value === 'PROJECT') return 'D\u1EF1 \xE1n'
  return 'Kinh nghi\u1EC7m th\u1EF1c t\u1EBF'
}
function dedupeExperience(items) {
  return items.filter((item, index, allItems) => {
    return (
      allItems.findIndex(
        (candidate) =>
          candidate.title === item.title &&
          candidate.company === item.company &&
          candidate.period === item.period
      ) === index
    )
  })
}
function toBookableMeetingType(meetingType) {
  if (meetingType === 'ONLINE' || meetingType === 'OFFLINE') return meetingType
  return null
}
function unique(values) {
  return values.filter((value, index, items) => {
    return value !== null && value !== void 0 && items.indexOf(value) === index
  })
}
export { formatMeetingTypeLabel, formatTimeLabel, mapMentorProfileToViewModel }
