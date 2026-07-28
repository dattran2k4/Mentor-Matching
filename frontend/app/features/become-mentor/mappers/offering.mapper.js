const defaultProficiencyLevel = 'INTERMEDIATE'
function mapMentorSubjectToBecomeMentorOffering(subject) {
  return {
    gradeId: String(subject.gradeId),
    gradeLevel: formatGradeLabel(subject.gradeName),
    id: String(subject.id),
    mentorSubjectId: subject.id,
    pricePerHour: String(subject.pricePerHour),
    subject: subject.subjectName,
    subjectGradeId: String(subject.subjectGradeId),
    subjectId: String(subject.subjectId),
    teachingNote: subject.teachingNote ?? ''
  }
}
function mapOfferingFormValuesToRequest(values, mentorSubjectId) {
  return {
    active: true,
    id: mentorSubjectId,
    pricePerHour: Number(values.pricePerHour.replace(/\D/g, '')),
    proficiencyLevel: defaultProficiencyLevel,
    subjectGradeId: Number(values.subjectGradeId),
    teachingNote: values.teachingNote.trim() || null
  }
}
function formatGradeLabel(value) {
  return value.replace(/^Lop\s+/i, 'L\u1EDBp ')
}
export { formatGradeLabel, mapMentorSubjectToBecomeMentorOffering, mapOfferingFormValuesToRequest }
