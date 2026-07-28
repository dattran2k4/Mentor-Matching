import axios from 'axios'
import { useEffect, useEffectEvent, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useMediaUploadField } from '@/hooks/media/useMediaUploadField'
import { useCurrentMentorOnboardingStatusQuery } from '@/hooks/queries/mentor/useCurrentMentorOnboardingStatusQuery'
import { useCurrentMentorVerificationQuery } from '@/hooks/queries/mentor/useCurrentMentorVerificationQuery'
import { useUpsertCurrentMentorVerificationMutation } from '@/hooks/queries/mentor/useUpsertCurrentMentorVerificationMutation'
import { becomeMentorVerificationSchema } from '../schemas/verification.schema'
function useBecomeMentorVerificationForm({
  documents,
  idCardNumber,
  onHydrate,
  onSubmit,
  verificationFullName
}) {
  const [uploadingDocumentKey, setUploadingDocumentKey] = useState(null)
  const [submitErrorMessage, setSubmitErrorMessage] = useState(null)
  const onboardingStatusQuery = useCurrentMentorOnboardingStatusQuery()
  const shouldFetchCurrentVerification = Boolean(onboardingStatusQuery.data?.mentorProfileCreated)
  const currentMentorVerificationQuery = useCurrentMentorVerificationQuery(
    shouldFetchCurrentVerification
  )
  const upsertCurrentMentorVerificationMutation = useUpsertCurrentMentorVerificationMutation()
  const idFrontField = useMediaUploadField({
    initialValue: documents.idFront,
    purpose: 'VERIFICATION'
  })
  const idBackField = useMediaUploadField({
    initialValue: documents.idBack,
    purpose: 'VERIFICATION'
  })
  const selfieWithIdField = useMediaUploadField({
    initialValue: documents.selfieWithId,
    purpose: 'VERIFICATION'
  })
  const form = useForm({
    resolver: zodResolver(becomeMentorVerificationSchema),
    defaultValues: {
      documents,
      idCardNumber,
      verificationFullName
    }
  })
  const hydrateState = useEffectEvent((values, verification) => {
    onHydrate?.(values, verification)
  })
  const hydrateDocumentFields = useEffectEvent((values) => {
    idFrontField.syncValue(values.documents.idFront)
    idBackField.syncValue(values.documents.idBack)
    selfieWithIdField.syncValue(values.documents.selfieWithId)
  })
  const watchedVerificationFullName = useWatch({
    control: form.control,
    name: 'verificationFullName'
  })
  const watchedIdCardNumber = useWatch({ control: form.control, name: 'idCardNumber' })
  const verificationStatus = currentMentorVerificationQuery.data?.verificationStatus ?? 'UNVERIFIED'
  const rejectionReason = currentMentorVerificationQuery.data?.rejectionReason ?? null
  const requiresProfile = onboardingStatusQuery.data
    ? !onboardingStatusQuery.data.mentorProfileCreated
    : false
  const isLocked = verificationStatus === 'PENDING' || verificationStatus === 'VERIFIED'
  const isLoading =
    onboardingStatusQuery.isLoading ||
    (shouldFetchCurrentVerification && currentMentorVerificationQuery.isLoading)
  const isError =
    onboardingStatusQuery.isError ||
    (shouldFetchCurrentVerification && currentMentorVerificationQuery.isError)
  const isSubmitting =
    upsertCurrentMentorVerificationMutation.isPending ||
    idFrontField.isUploading ||
    idBackField.isUploading ||
    selfieWithIdField.isUploading
  const canSubmit =
    !requiresProfile &&
    !isLocked &&
    !uploadingDocumentKey &&
    Boolean(
      watchedVerificationFullName.trim() &&
      watchedIdCardNumber.trim() &&
      idFrontField.value.mediaId &&
      idBackField.value.mediaId
    )
  useEffect(() => {
    if (!currentMentorVerificationQuery.data) return
    const nextValues = mapCurrentMentorVerificationToFormValues(currentMentorVerificationQuery.data)
    form.reset(nextValues)
    hydrateDocumentFields(nextValues)
    hydrateState(nextValues, currentMentorVerificationQuery.data)
  }, [currentMentorVerificationQuery.data, form])
  useEffect(() => {
    form.setValue('documents.idFront', idFrontField.value, { shouldValidate: false })
  }, [form, idFrontField.value])
  useEffect(() => {
    form.setValue('documents.idBack', idBackField.value, { shouldValidate: false })
  }, [form, idBackField.value])
  useEffect(() => {
    form.setValue('documents.selfieWithId', selfieWithIdField.value, { shouldValidate: false })
  }, [form, selfieWithIdField.value])
  const handleDocumentFileChange = (key) => async (event) => {
    if (isLocked) return
    setSubmitErrorMessage(null)
    form.clearErrors(`documents.${key}.mediaId`)
    setUploadingDocumentKey(key)
    try {
      await getFieldByKey(key, idFrontField, idBackField, selfieWithIdField).handleFileChange(event)
    } catch (error) {
      form.setError(`documents.${key}.mediaId`, {
        message:
          getFieldByKey(key, idFrontField, idBackField, selfieWithIdField).errorMessage ||
          getVerificationErrorMessage(error),
        type: 'manual'
      })
    } finally {
      setUploadingDocumentKey(null)
      event.target.value = ''
    }
  }
  const clearDocument = (key) => {
    if (isLocked) return
    setSubmitErrorMessage(null)
    getFieldByKey(key, idFrontField, idBackField, selfieWithIdField).clear()
  }
  const handleSubmit = form.handleSubmit(async (values) => {
    if (requiresProfile || isLocked) return
    setSubmitErrorMessage(null)
    try {
      const response = await upsertCurrentMentorVerificationMutation.mutateAsync({
        fullName: values.verificationFullName.trim(),
        idCardNumber: values.idCardNumber.trim() || null,
        idCardFrontMediaId: idFrontField.value.mediaId,
        idCardBackMediaId: idBackField.value.mediaId,
        selfieWithIdMediaId: selfieWithIdField.value.mediaId
      })
      const nextValues = mapCurrentMentorVerificationToFormValues(response.verification)
      form.reset(nextValues)
      await onSubmit(nextValues, response.verification)
    } catch (error) {
      setSubmitErrorMessage(getVerificationErrorMessage(error))
    }
  })
  return {
    canSubmit,
    clearDocument,
    control: form.control,
    errors: form.formState.errors,
    handleDocumentFileChange,
    isError,
    isLoading,
    isLocked,
    isSubmitting,
    onRetry: () => {
      setSubmitErrorMessage(null)
      void onboardingStatusQuery.refetch()
      if (shouldFetchCurrentVerification) {
        void currentMentorVerificationQuery.refetch()
      }
    },
    onSubmit: handleSubmit,
    register: form.register,
    rejectionReason,
    requiresProfile,
    selectedDocuments: {
      idBack: idBackField.value,
      idFront: idFrontField.value,
      selfieWithId: selfieWithIdField.value
    },
    status: verificationStatus,
    submitErrorMessage,
    uploadingDocumentKey
  }
}
function mapCurrentMentorVerificationToFormValues(verification) {
  return {
    verificationFullName: verification.fullName ?? '',
    idCardNumber: verification.idCardNumber ?? '',
    documents: {
      idFront: {
        fileName: '',
        mediaId: verification.idCardFrontMediaId,
        previewUrl: verification.idCardFrontUrl ?? ''
      },
      idBack: {
        fileName: '',
        mediaId: verification.idCardBackMediaId,
        previewUrl: verification.idCardBackUrl ?? ''
      },
      selfieWithId: {
        fileName: '',
        mediaId: verification.selfieWithIdMediaId,
        previewUrl: verification.selfieWithIdUrl ?? ''
      }
    }
  }
}
function getVerificationErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Kh\xF4ng k\u1EBFt n\u1ED1i \u0111\u01B0\u1EE3c m\xE1y ch\u1EE7.'
    return (
      error.response.data?.message ||
      'Kh\xF4ng th\u1EC3 x\u1EED l\xFD \u1EA3nh ho\u1EB7c l\u01B0u x\xE1c minh l\xFAc n\xE0y.'
    )
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Kh\xF4ng th\u1EC3 x\u1EED l\xFD \u1EA3nh ho\u1EB7c l\u01B0u x\xE1c minh l\xFAc n\xE0y.'
}
function getFieldByKey(key, idFrontField, idBackField, selfieWithIdField) {
  if (key === 'idFront') return idFrontField
  if (key === 'idBack') return idBackField
  return selfieWithIdField
}
export { useBecomeMentorVerificationForm }
