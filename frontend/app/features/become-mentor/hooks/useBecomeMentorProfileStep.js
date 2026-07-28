import { useEffect, useEffectEvent, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useMediaUploadField } from '@/hooks/media/useMediaUploadField'
import { useCitiesQuery } from '@/hooks/queries/location/useCitiesQuery'
import { useDistrictsByCityQuery } from '@/hooks/queries/location/useDistrictsByCityQuery'
import { useCreateCurrentMentorMutation } from '@/hooks/queries/mentor/useCreateCurrentMentorMutation'
import { useCurrentMentorOnboardingStatusQuery } from '@/hooks/queries/mentor/useCurrentMentorOnboardingStatusQuery'
import { useCurrentMentorProfileQuery } from '@/hooks/queries/mentor/useCurrentMentorProfileQuery'
import { useUpdateCurrentMentorAvatarMutation } from '@/hooks/queries/mentor/useUpdateCurrentMentorAvatarMutation'
import { useUpdateCurrentMentorMutation } from '@/hooks/queries/mentor/useUpdateCurrentMentorMutation'
import {
  emptyBecomeMentorProfileFormValues,
  mapBecomeMentorProfileFormValuesToRequest,
  mapCurrentMentorToBecomeMentorProfileFormValues
} from '../mappers/profile.mapper'
import { becomeMentorProfileSchema } from '../schemas/profile.schema'
const becomeMentorProfileResolver = zodResolver(becomeMentorProfileSchema)
function useBecomeMentorProfileStep({ formId, onSubmit, profileState }) {
  const onboardingStatusQuery = useCurrentMentorOnboardingStatusQuery()
  const shouldFetchCurrentProfile = Boolean(onboardingStatusQuery.data?.mentorProfileCreated)
  const currentProfileQuery = useCurrentMentorProfileQuery(shouldFetchCurrentProfile)
  const createCurrentMentorMutation = useCreateCurrentMentorMutation()
  const updateCurrentMentorMutation = useUpdateCurrentMentorMutation()
  const updateCurrentMentorAvatarMutation = useUpdateCurrentMentorAvatarMutation()
  const form = useForm({
    resolver: becomeMentorProfileResolver,
    defaultValues: {
      ...emptyBecomeMentorProfileFormValues,
      ...profileState
    }
  })
  const currentMentor = currentProfileQuery.data?.currentMentor
  const existingAvatarUrl = currentMentor?.avatarUrl || ''
  const existingAvatarMediaId = currentMentor?.avatarMediaId ?? null
  const avatarField = useMediaUploadField({
    initialValue: {
      fileName: '',
      mediaId: existingAvatarMediaId,
      previewUrl: existingAvatarUrl
    },
    purpose: 'AVATAR'
  })
  const currentCityId = useWatch({ control: form.control, name: 'currentCityId' })
  const currentCityIdNumber = currentCityId ? Number(currentCityId) : null
  const citiesQuery = useCitiesQuery('')
  const districtsQuery = useDistrictsByCityQuery(currentCityIdNumber)
  const cityOptions = useMemo(
    () => (citiesQuery.data ?? []).map((city) => ({ label: city.name, value: String(city.id) })),
    [citiesQuery.data]
  )
  const districtOptions = useMemo(
    () =>
      (districtsQuery.data ?? []).map((district) => ({
        label: district.name,
        value: String(district.id)
      })),
    [districtsQuery.data]
  )
  const hydrateAvatarField = useEffectEvent((mentor) => {
    avatarField.syncValue({
      fileName: '',
      mediaId: mentor.avatarMediaId ?? null,
      previewUrl: mentor.avatarUrl ?? ''
    })
  })
  useEffect(() => {
    if (!currentMentor) return
    form.reset(mapCurrentMentorToBecomeMentorProfileFormValues(currentMentor))
    hydrateAvatarField(currentMentor)
  }, [currentMentor, form])
  const handleSubmit = form.handleSubmit(async (values) => {
    avatarField.setErrorMessage(null)
    if (!avatarField.value.mediaId && !avatarField.value.previewUrl) {
      avatarField.setErrorMessage('Vui l\xF2ng ch\u1ECDn \u1EA3nh \u0111\u1EA1i di\u1EC7n')
      return
    }
    const payload = mapBecomeMentorProfileFormValuesToRequest(values)
    const profileResult = shouldFetchCurrentProfile
      ? await updateCurrentMentorMutation.mutateAsync(payload)
      : await createCurrentMentorMutation.mutateAsync(payload)
    let savedCurrentMentor = profileResult.currentMentor
    if (
      avatarField.value.mediaId &&
      avatarField.value.mediaId !== savedCurrentMentor.avatarMediaId
    ) {
      const avatarResult = await updateCurrentMentorAvatarMutation.mutateAsync({
        avatarMediaId: avatarField.value.mediaId
      })
      savedCurrentMentor = avatarResult.currentMentor
    }
    onSubmit(values, savedCurrentMentor)
  })
  const isLoading =
    onboardingStatusQuery.isLoading || (shouldFetchCurrentProfile && currentProfileQuery.isLoading)
  const isError =
    onboardingStatusQuery.isError || (shouldFetchCurrentProfile && currentProfileQuery.isError)
  const isSubmitting =
    createCurrentMentorMutation.isPending ||
    updateCurrentMentorMutation.isPending ||
    updateCurrentMentorAvatarMutation.isPending ||
    avatarField.isUploading
  return {
    formId,
    isError,
    isLoading,
    isSubmitting,
    /* Thử tải lại onboarding và hồ sơ mentor hiện tại. */
    onRetry: () => {
      void onboardingStatusQuery.refetch()
      if (shouldFetchCurrentProfile) {
        void currentProfileQuery.refetch()
      }
    },
    onSubmit: handleSubmit,
    personalSectionProps: {
      avatarErrorMessage: avatarField.errorMessage,
      avatarPreviewUrl: avatarField.value.previewUrl,
      cityOptions,
      control: form.control,
      currentCityId,
      districtOptions,
      errors: form.formState.errors,
      isCitiesLoading: citiesQuery.isLoading,
      isDistrictsLoading: districtsQuery.isLoading,
      onAvatarChange: avatarField.handleFileChange,
      /* Đổi thành phố và xóa quận/huyện cũ để chọn lại. */
      onCurrentCityChange: (cityId) => {
        form.setValue('currentCityId', cityId, { shouldDirty: true, shouldValidate: true })
        form.setValue('currentDistrictId', '', { shouldDirty: true, shouldValidate: false })
        form.clearErrors('currentDistrictId')
      },
      onCurrentDistrictChange: (districtId) => {
        form.setValue('currentDistrictId', districtId, {
          shouldDirty: true,
          shouldValidate: true
        })
      },
      register: form.register
    },
    status: onboardingStatusQuery.data,
    teachingSectionProps: {
      control: form.control,
      errors: form.formState.errors,
      register: form.register
    }
  }
}
export { useBecomeMentorProfileStep }
