import { useEffect, useState } from 'react'
import { useDeleteCurrentMentorAvailabilityMutation } from '@/hooks/queries/mentor/useDeleteCurrentMentorAvailabilityMutation'
import { useCurrentMentorOnboardingStatusQuery } from '@/hooks/queries/mentor/useCurrentMentorOnboardingStatusQuery'
import { useCurrentMentorScheduleQuery } from '@/hooks/queries/mentor/useCurrentMentorScheduleQuery'
import { useUpsertCurrentMentorAvailabilityMutation } from '@/hooks/queries/mentor/useUpsertCurrentMentorAvailabilityMutation'
import {
  mapAvailabilityDraftToRequests,
  mapMentorAvailabilityToBecomeMentorAvailabilityWindow
} from '../mappers/availability.mapper'
import { becomeMentorAvailabilitySchema } from '../schemas/availability.schema'
const initialAvailabilityDraft = {
  mode: 'RECURRING',
  selectedDays: ['2', '4'],
  specificDate: '',
  startTime: '18:00',
  endTime: '20:00'
}
function useBecomeMentorAvailabilityStep({ availabilities, onSubmitStep, setFormState }) {
  const [availabilityDraft, setAvailabilityDraft] = useState(initialAvailabilityDraft)
  const [editingAvailabilityId, setEditingAvailabilityId] = useState(null)
  const onboardingStatusQuery = useCurrentMentorOnboardingStatusQuery()
  const shouldFetchCurrentSchedule = Boolean(onboardingStatusQuery.data?.mentorProfileCreated)
  const currentScheduleQuery = useCurrentMentorScheduleQuery(shouldFetchCurrentSchedule, {
    suppressNotFound: true
  })
  const upsertCurrentMentorAvailabilityMutation = useUpsertCurrentMentorAvailabilityMutation()
  const deleteCurrentMentorAvailabilityMutation = useDeleteCurrentMentorAvailabilityMutation()
  const stepValidation = becomeMentorAvailabilitySchema.safeParse({ availabilities })
  const stepError = stepValidation.success
    ? void 0
    : stepValidation.error.flatten().fieldErrors.availabilities?.[0]
  const editingAvailability =
    availabilities.find((item) => item.id === editingAvailabilityId) ?? null
  useEffect(() => {
    if (!currentScheduleQuery.data) return
    setFormState((current) => ({
      ...current,
      availabilities: currentScheduleQuery.data.availabilities.map(
        mapMentorAvailabilityToBecomeMentorAvailabilityWindow
      )
    }))
  }, [currentScheduleQuery.data, setFormState])
  const resetAvailabilityDraft = () => {
    setAvailabilityDraft(initialAvailabilityDraft)
    setEditingAvailabilityId(null)
  }
  const syncAvailabilitiesFromServer = async () => {
    const nextResult = await currentScheduleQuery.refetch()
    if (!nextResult.data) return
    setFormState((current) => ({
      ...current,
      availabilities: nextResult.data.availabilities.map(
        mapMentorAvailabilityToBecomeMentorAvailabilityWindow
      )
    }))
  }
  const saveAvailability = async () => {
    const draft = {
      endTime: availabilityDraft.endTime,
      id: editingAvailabilityId ?? `availability-${Date.now()}`,
      mentorAvailabilityId: editingAvailability?.mentorAvailabilityId ?? null,
      mode: availabilityDraft.mode,
      selectedDays:
        availabilityDraft.mode === 'RECURRING' ? availabilityDraft.selectedDays.slice() : [],
      specificDate:
        availabilityDraft.mode === 'SPECIFIC_DATE' ? availabilityDraft.specificDate : '',
      startTime: availabilityDraft.startTime
    }
    if (!draft.startTime || !draft.endTime) return
    if (draft.mode === 'RECURRING' && draft.selectedDays.length === 0) return
    if (draft.mode === 'SPECIFIC_DATE' && !draft.specificDate) return
    const saveRequests = mapAvailabilityDraftToRequests(
      availabilityDraft,
      editingAvailability?.mentorAvailabilityId ?? null
    )
    for (const request of saveRequests) {
      await upsertCurrentMentorAvailabilityMutation.mutateAsync(request)
    }
    await syncAvailabilitiesFromServer()
    resetAvailabilityDraft()
  }
  const editAvailability = (availability) => {
    setEditingAvailabilityId(availability.id)
    setAvailabilityDraft({
      mode: availability.mode,
      selectedDays: availability.selectedDays,
      specificDate: availability.specificDate,
      startTime: availability.startTime,
      endTime: availability.endTime
    })
  }
  const removeAvailability = async (availabilityId) => {
    const availability = availabilities.find((item) => item.id === availabilityId)
    if (availability?.mentorAvailabilityId) {
      await deleteCurrentMentorAvailabilityMutation.mutateAsync(availability.mentorAvailabilityId)
      await syncAvailabilitiesFromServer()
    } else {
      setFormState((current) => ({
        ...current,
        availabilities: current.availabilities.filter((item) => item.id !== availabilityId)
      }))
    }
    if (editingAvailabilityId === availabilityId) {
      resetAvailabilityDraft()
    }
  }
  const submitAvailabilityStep = () => {
    if (stepValidation.success) {
      onSubmitStep()
    }
  }
  return {
    availabilityDraft,
    isEditing: Boolean(editingAvailabilityId),
    isError:
      onboardingStatusQuery.isError || (shouldFetchCurrentSchedule && currentScheduleQuery.isError),
    isDeleting: deleteCurrentMentorAvailabilityMutation.isPending,
    isLoading:
      onboardingStatusQuery.isLoading ||
      (shouldFetchCurrentSchedule && currentScheduleQuery.isLoading),
    isSaving: upsertCurrentMentorAvailabilityMutation.isPending,
    onDraftChange: setAvailabilityDraft,
    onEditAvailability: editAvailability,
    onRemoveAvailability: removeAvailability,
    onResetDraft: resetAvailabilityDraft,
    /* Thử tải lại trạng thái onboarding và lịch hiện tại. */
    onRetry: () => {
      void onboardingStatusQuery.refetch()
      if (shouldFetchCurrentSchedule) {
        void currentScheduleQuery.refetch()
      }
    },
    onSaveAvailability: saveAvailability,
    onSubmitStep: submitAvailabilityStep,
    stepError
  }
}
export { useBecomeMentorAvailabilityStep }
