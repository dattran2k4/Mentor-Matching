function mapDiscoverMentorToCard(mentor) {
  const meetingTypes = unique([mentor.meetingType].filter((value) => Boolean(value)))
  const highlights = unique([mentor.currentPosition, mentor.workplace, mentor.education]).slice(
    0,
    3
  )
  return {
    id: String(mentor.id),
    name: mentor.fullName,
    avatarUrl: mentor.avatarUrl,
    experienceYears: mentor.experienceYears,
    headline:
      mentor.headline?.trim() ||
      [mentor.currentPosition, mentor.workplace].filter(Boolean).join(' \xB7 ') ||
      'Mentor c\xF4ng khai \u0111ang s\u1EB5n s\xE0ng cho h\u1ECDc vi\xEAn m\u1EDBi.',
    approvalStatus: null,
    verificationStatus: null,
    rating: null,
    reviewsCount: null,
    responseTime: null,
    activeStudentsCount: null,
    startingPrice: mentor.minPrice,
    expertise:
      mentor.headline?.trim() ||
      [mentor.currentPosition, mentor.workplace, mentor.education].filter(Boolean).join(' \xB7 ') ||
      'Th\xF4ng tin gi\u1EDBi thi\u1EC7u chi ti\u1EBFt \u0111ang \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt trong h\u1ED3 s\u01A1 mentor.',
    highlights,
    subjects: [],
    grades: [],
    meetingTypes,
    availabilitySummary:
      meetingTypes.map(formatMeetingType).join(' / ') ||
      'Xem l\u1ECBch chi ti\u1EBFt trong h\u1ED3 s\u01A1 mentor.',
    offerings: [],
    specificDateAvailability: []
  }
}
function formatMeetingType(meetingType) {
  if (meetingType === 'ONLINE') return 'Online'
  if (meetingType === 'OFFLINE') return 'Offline'
  return 'Hybrid'
}
function unique(values) {
  return values.filter((value, index, items) => {
    return value !== null && value !== void 0 && items.indexOf(value) === index
  })
}
export { mapDiscoverMentorToCard }
