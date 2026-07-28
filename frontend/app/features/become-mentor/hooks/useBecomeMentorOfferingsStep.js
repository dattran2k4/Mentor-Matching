import { useEffect, useState } from 'react'
import { useCurrentMentorProfileQuery } from '@/hooks/queries/mentor/useCurrentMentorProfileQuery'
import { useDeleteCurrentMentorSubjectMutation } from '@/hooks/queries/mentor/useDeleteCurrentMentorSubjectMutation'
import { useUpsertCurrentMentorSubjectMutation } from '@/hooks/queries/mentor/useUpsertCurrentMentorSubjectMutation'
import {
  mapMentorSubjectToBecomeMentorOffering,
  mapOfferingFormValuesToRequest
} from '../mappers/offering.mapper'
function useBecomeMentorOfferingsStep({ offerings, setFormState }) {
  const [editingOfferingId, setEditingOfferingId] = useState(null)
  const currentProfileQuery = useCurrentMentorProfileQuery()
  const upsertCurrentMentorSubjectMutation = useUpsertCurrentMentorSubjectMutation()
  const deleteCurrentMentorSubjectMutation = useDeleteCurrentMentorSubjectMutation()
  const editingOffering = offerings.find((offering) => offering.id === editingOfferingId) ?? null
  useEffect(() => {
    if (!currentProfileQuery.data) return
    setFormState((current) => ({
      ...current,
      offerings: currentProfileQuery.data.subjects.map(mapMentorSubjectToBecomeMentorOffering)
    }))
  }, [currentProfileQuery.data, setFormState])
  const resetOfferingDraft = () => {
    setEditingOfferingId(null)
  }
  const saveOffering = async (values) => {
    const response = await upsertCurrentMentorSubjectMutation.mutateAsync(
      mapOfferingFormValuesToRequest(values, editingOffering?.mentorSubjectId ?? null)
    )
    const savedOffering = mapMentorSubjectToBecomeMentorOffering(response.subject)
    setFormState((current) => ({
      ...current,
      offerings: editingOffering
        ? current.offerings.map((item) => (item.id === editingOffering.id ? savedOffering : item))
        : [...current.offerings, savedOffering]
    }))
    setEditingOfferingId(null)
  }
  const editOffering = (offering) => {
    setEditingOfferingId(offering.id)
  }
  const removeOffering = async (offeringId) => {
    const offering = offerings.find((item) => item.id === offeringId)
    if (offering?.mentorSubjectId) {
      await deleteCurrentMentorSubjectMutation.mutateAsync(offering.mentorSubjectId)
    }
    setFormState((current) => ({
      ...current,
      offerings: current.offerings.filter((item) => item.id !== offeringId)
    }))
    if (editingOfferingId === offeringId) {
      resetOfferingDraft()
    }
  }
  return {
    editingOffering,
    isDeleting: deleteCurrentMentorSubjectMutation.isPending,
    isEditing: Boolean(editingOfferingId),
    isError: currentProfileQuery.isError,
    isLoading: currentProfileQuery.isLoading,
    isSaving: upsertCurrentMentorSubjectMutation.isPending,
    onEditOffering: editOffering,
    onRemoveOffering: removeOffering,
    onResetDraft: resetOfferingDraft,
    /* Thử tải lại hồ sơ mentor để đồng bộ offerings. */
    onRetry: () => {
      void currentProfileQuery.refetch()
    },
    onSaveOffering: saveOffering
  }
}
export { useBecomeMentorOfferingsStep }
