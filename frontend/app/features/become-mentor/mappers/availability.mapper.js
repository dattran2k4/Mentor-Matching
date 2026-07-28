function mapMentorAvailabilityToBecomeMentorAvailabilityWindow(availability) {
  return {
    endTime: availability.endTime.slice(0, 5),
    id: String(availability.id),
    mentorAvailabilityId: availability.id,
    mode: availability.availabilityType,
    selectedDays:
      availability.availabilityType === 'RECURRING' && availability.dayOfWeek
        ? [String(availability.dayOfWeek)]
        : [],
    specificDate:
      availability.availabilityType === 'SPECIFIC_DATE' ? (availability.availableDate ?? '') : '',
    startTime: availability.startTime.slice(0, 5)
  }
}
function mapAvailabilityDraftToRequests(draft, mentorAvailabilityId) {
  const basePayload = {
    endTime: `${draft.endTime}:00`,
    startTime: `${draft.startTime}:00`
  }
  if (draft.mode === 'RECURRING') {
    return draft.selectedDays.map((dayValue, index) => ({
      availabilityId: index === 0 ? mentorAvailabilityId : null,
      payload: {
        ...basePayload,
        availabilityType: 'RECURRING',
        availableDate: null,
        dayOfWeek: Number(dayValue)
      }
    }))
  }
  return [
    {
      availabilityId: mentorAvailabilityId,
      payload: {
        ...basePayload,
        availabilityType: 'SPECIFIC_DATE',
        availableDate: draft.specificDate,
        dayOfWeek: null
      }
    }
  ]
}
export { mapAvailabilityDraftToRequests, mapMentorAvailabilityToBecomeMentorAvailabilityWindow }
