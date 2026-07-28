import { path } from '@/config/path'
const SUBJECT_ICON_RULES = [
  { icon: 'Sigma', keywords: ['to\xE1n', 'math'] },
  { icon: 'BookOpen', keywords: ['anh', 'english', 'ielts'] },
  { icon: 'Atom', keywords: ['l\xFD', 'physics'] },
  { icon: 'FlaskConical', keywords: ['h\xF3a', 'chemistry'] },
  { icon: 'PenLine', keywords: ['v\u0103n', 'literature'] },
  { icon: 'Code2', keywords: ['l\u1EADp tr\xECnh', 'code', 'programming', 'tin h\u1ECDc'] },
  { icon: 'Dna', keywords: ['sinh', 'biology'] },
  { icon: 'Globe2', keywords: ['\u0111\u1ECBa', 'geography'] },
  { icon: 'Landmark', keywords: ['s\u1EED', 'history'] }
]
function mapCatalogSubjectToHomeCard(subject, catalogOptions) {
  const category = catalogOptions.categories.find((item) => item.id === subject.categoryId)
  const params = new URLSearchParams({
    search: subject.name,
    subjectId: String(subject.id)
  })
  return {
    id: String(subject.id),
    name: subject.name,
    icon: resolveSubjectIcon(subject.name, category?.name),
    description:
      subject.description?.trim() ||
      (category?.name
        ? `Thu\u1ED9c nh\xF3m ${category.name.toLowerCase()} trong danh m\u1EE5c m\xF4n h\u1ECDc hi\u1EC7n c\xF3.`
        : 'Danh m\u1EE5c m\xF4n h\u1ECDc \u0111ang \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt th\xEAm th\xF4ng tin m\xF4 t\u1EA3.'),
    badgeLabel: category?.name ?? 'Danh m\u1EE5c m\xF4n h\u1ECDc',
    href: `${path.discover}?${params.toString()}`
  }
}
function mapFeaturedMentorToCard(mentor) {
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
    approvalStatus: 'APPROVED',
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
function resolveSubjectIcon(subjectName, categoryName) {
  const haystack = `${subjectName} ${categoryName ?? ''}`.toLowerCase()
  return (
    SUBJECT_ICON_RULES.find((rule) => rule.keywords.some((keyword) => haystack.includes(keyword)))
      ?.icon ?? 'BookOpen'
  )
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
export { mapCatalogSubjectToHomeCard, mapFeaturedMentorToCard }
