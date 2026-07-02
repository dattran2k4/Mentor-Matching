import { useState } from 'react'

import { initialBecomeMentorFormState } from '@/features/become-mentor/become-mentor.constants'
import {
  BecomeMentorAvailabilitySection,
  BecomeMentorHero,
  BecomeMentorOfferingsSection,
  BecomeMentorProfileStep,
  BecomeMentorProgressRail,
  BecomeMentorStickyBar,
  BecomeMentorVerificationSection
} from '@/features/become-mentor/components'
import {
  useBecomeMentorAvailabilityStep,
  useBecomeMentorOfferingsStep,
  useBecomeMentorProfileStep,
  type BecomeMentorProfileStepState
} from '@/features/become-mentor/hooks'
import type { BecomeMentorVerificationFormValues } from '@/features/become-mentor/schemas'
import type {
  BecomeMentorFormState,
  BecomeMentorReadinessItem,
  BecomeMentorStep
} from '@/features/become-mentor/become-mentor.types'
import type { CurrentMentorVerificationApiResponse } from '@/types/api/mentor'

const becomeMentorStepFormIds = {
  profile: 'become-mentor-profile-form',
  offerings: 'become-mentor-offerings-form',
  availability: 'become-mentor-availability-form',
  verification: 'become-mentor-verification-form'
} satisfies Record<BecomeMentorStep['id'], string>

function getReadinessItems(formState: BecomeMentorFormState): BecomeMentorReadinessItem[] {
  return [
    {
      id: 'profile',
      label: 'Hồ sơ cá nhân và chuyên môn',
      helper:
        formState.fullName &&
        formState.currentDistrictId &&
        formState.headline &&
        formState.introduction
          ? 'Đã có cả thông tin cơ bản lẫn định vị chuyên môn'
          : 'Cần hoàn thiện thông tin cá nhân và phần giới thiệu chuyên môn',
      done: Boolean(
        formState.avatarUrl &&
        formState.fullName &&
        formState.hometownCityId &&
        formState.currentCityId &&
        formState.currentDistrictId &&
        formState.headline &&
        formState.introduction &&
        formState.teachingStyle &&
        formState.experienceYears
      )
    },
    {
      id: 'offerings',
      label: 'Môn dạy và học phí',
      helper:
        formState.offerings.length > 0
          ? `Đã có ${formState.offerings.length} môn học sẵn sàng hiển thị`
          : 'Cần thêm ít nhất một môn học cùng học phí',
      done: formState.offerings.length > 0
    },
    {
      id: 'availability',
      label: 'Lịch rảnh',
      helper:
        formState.availabilities.length > 0
          ? `Đã có ${formState.availabilities.length} khung giờ sẵn sàng nhận học viên`
          : 'Cần tạo ít nhất một khung giờ khởi tạo',
      done: formState.availabilities.length > 0
    },
    {
      id: 'verification',
      label: 'Xác minh',
      helper:
        formState.documents.idFront.mediaId && formState.documents.idBack.mediaId
          ? 'Đã chuẩn bị bộ giấy tờ cơ bản'
          : 'Còn thiếu giấy tờ để đội ngũ đối chiếu',
      done: Boolean(
        formState.verificationFullName &&
        formState.idCardNumber &&
        formState.documents.idFront.mediaId &&
        formState.documents.idBack.mediaId
      )
    }
  ]
}

function getSteps(
  readinessItems: BecomeMentorReadinessItem[],
  currentStepIndex: number
): BecomeMentorStep[] {
  return readinessItems.map((item, index) => ({
    id: item.id,
    href: `#${item.id}`,
    label: item.label,
    description: item.helper,
    status:
      index < currentStepIndex || item.done
        ? 'done'
        : index === currentStepIndex
          ? 'current'
          : 'upcoming'
  }))
}

export default function BecomeMentorPage() {
  const [formState, setFormState] = useState(initialBecomeMentorFormState)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const readinessItems = getReadinessItems(formState)
  const steps = getSteps(readinessItems, currentStepIndex)
  const completedCount = readinessItems.filter((item) => item.done).length
  const currentStep = steps[currentStepIndex]
  const profileState: BecomeMentorProfileStepState = {
    currentCityId: formState.currentCityId,
    currentDistrictId: formState.currentDistrictId,
    currentPosition: formState.currentPosition,
    experienceYears: formState.experienceYears,
    fullName: formState.fullName,
    gender: formState.gender,
    headline: formState.headline,
    hometownCityId: formState.hometownCityId,
    introduction: formState.introduction,
    teachingStyle: formState.teachingStyle,
    workplace: formState.workplace
  }
  const profileStep = useBecomeMentorProfileStep({
    formId: becomeMentorStepFormIds.profile,
    onSubmit: (values, savedCurrentMentor) => {
      setFormState((current) => ({
        ...current,
        avatarMediaId: savedCurrentMentor.avatarMediaId,
        avatarUrl: savedCurrentMentor.avatarUrl ?? current.avatarUrl,
        currentCityId: savedCurrentMentor.currentLocation.cityId
          ? String(savedCurrentMentor.currentLocation.cityId)
          : values.currentCityId,
        currentDistrictId: savedCurrentMentor.currentLocation.districtId
          ? String(savedCurrentMentor.currentLocation.districtId)
          : values.currentDistrictId,
        currentLocation:
          savedCurrentMentor.currentLocation.districtName ||
          savedCurrentMentor.currentLocation.cityName ||
          values.currentDistrictId,
        currentPosition: values.currentPosition ?? '',
        experienceYears: values.experienceYears,
        fullName: savedCurrentMentor.fullName || values.fullName,
        gender: savedCurrentMentor.gender ?? values.gender ?? '',
        headline: values.headline,
        hometown: savedCurrentMentor.hometown.cityName || values.hometownCityId,
        hometownCityId: savedCurrentMentor.hometown.cityId
          ? String(savedCurrentMentor.hometown.cityId)
          : values.hometownCityId,
        introduction: values.introduction,
        teachingStyle: values.teachingStyle,
        workplace: values.workplace ?? ''
      }))
      goToStep(currentStepIndex + 1)
    },
    profileState
  })

  const offeringsStep = useBecomeMentorOfferingsStep({
    offerings: formState.offerings,
    setFormState
  })

  const availabilityStep = useBecomeMentorAvailabilityStep({
    availabilities: formState.availabilities,
    onSubmitStep: () => goToStep(currentStepIndex + 1),
    setFormState
  })

  const goToStep = (index: number) => {
    setCurrentStepIndex(Math.max(0, Math.min(index, steps.length - 1)))
  }

  const submitVerification = (
    values: BecomeMentorVerificationFormValues,
    verification: CurrentMentorVerificationApiResponse
  ) => {
    setFormState((current) => mapVerificationValuesToFormState(current, values, verification))
    goToStep(currentStepIndex + 1)
  }

  const renderCurrentStep = () => {
    switch (currentStep.id) {
      case 'profile':
        return <BecomeMentorProfileStep {...profileStep} />
      case 'offerings':
        return (
          <BecomeMentorOfferingsSection
            editingOffering={offeringsStep.editingOffering}
            formId={becomeMentorStepFormIds.offerings}
            isDeleting={offeringsStep.isDeleting}
            isEditing={offeringsStep.isEditing}
            isError={offeringsStep.isError}
            isLoading={offeringsStep.isLoading}
            isSaving={offeringsStep.isSaving}
            onEditOffering={offeringsStep.onEditOffering}
            onRemoveOffering={offeringsStep.onRemoveOffering}
            onResetDraft={offeringsStep.onResetDraft}
            onRetry={offeringsStep.onRetry}
            onSaveOffering={offeringsStep.onSaveOffering}
            onSubmitStep={() => goToStep(currentStepIndex + 1)}
            offerings={formState.offerings}
          />
        )
      case 'availability':
        return (
          <BecomeMentorAvailabilitySection
            availabilities={formState.availabilities}
            availabilityDraft={availabilityStep.availabilityDraft}
            formId={becomeMentorStepFormIds.availability}
            isDeleting={availabilityStep.isDeleting}
            isEditing={availabilityStep.isEditing}
            isError={availabilityStep.isError}
            isLoading={availabilityStep.isLoading}
            isSaving={availabilityStep.isSaving}
            onDraftChange={availabilityStep.onDraftChange}
            onEditAvailability={availabilityStep.onEditAvailability}
            onRemoveAvailability={availabilityStep.onRemoveAvailability}
            onResetDraft={availabilityStep.onResetDraft}
            onRetry={availabilityStep.onRetry}
            onSaveAvailability={availabilityStep.onSaveAvailability}
            onSubmitStep={availabilityStep.onSubmitStep}
            stepError={availabilityStep.stepError}
          />
        )
      case 'verification':
        return (
          <BecomeMentorVerificationSection
            documents={formState.documents}
            formId={becomeMentorStepFormIds.verification}
            idCardNumber={formState.idCardNumber}
            onHydrate={(values, verification) => {
              setFormState((current) =>
                mapVerificationValuesToFormState(current, values, verification)
              )
            }}
            onSubmit={submitVerification}
            verificationFullName={formState.verificationFullName}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className='relative py-8 md:py-10'>
      <div className='absolute inset-0 -z-10 bg-[linear-gradient(180deg,#f8fafc_0%,#f3f8ff_40%,#f8fafc_100%)]' />
      <div className='page-container space-y-8'>
        <BecomeMentorHero completedCount={completedCount} totalCount={readinessItems.length} />

        <div className='grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)] xl:items-start'>
          <div className='xl:sticky xl:top-24'>
            <BecomeMentorProgressRail onSelectStep={goToStep} steps={steps} />
          </div>

          <div className='space-y-6'>
            <section className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-7'>
              <div className='flex flex-col gap-3 border-b border-slate-100 pb-5 md:flex-row md:items-end md:justify-between'>
                <div className='space-y-1'>
                  <p className='text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase'>
                    Bước {currentStepIndex + 1}
                  </p>
                  <h2 className='text-2xl font-semibold text-slate-900'>{currentStep.label}</h2>
                </div>
                <div className='rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600'>
                  {currentStep.description}
                </div>
              </div>
            </section>

            {renderCurrentStep()}
          </div>
        </div>

        <BecomeMentorStickyBar
          completedCount={completedCount}
          currentStepIndex={currentStepIndex}
          currentStepFormId={becomeMentorStepFormIds[currentStep.id]}
          currentStepLabel={currentStep.label}
          isFirstStep={currentStepIndex === 0}
          isLastStep={currentStepIndex === steps.length - 1}
          isSubmitting={currentStep.id === 'profile' && profileStep.isSubmitting}
          onBack={() => goToStep(currentStepIndex - 1)}
          totalCount={readinessItems.length}
        />
      </div>
    </div>
  )
}

function mapVerificationValuesToFormState(
  current: BecomeMentorFormState,
  values: BecomeMentorVerificationFormValues,
  verification: CurrentMentorVerificationApiResponse
): BecomeMentorFormState {
  return {
    ...current,
    documents: {
      idBack: {
        fileName: values.documents.idBack.fileName,
        mediaId: verification.idCardBackMediaId,
        previewUrl: verification.idCardBackUrl ?? values.documents.idBack.previewUrl
      },
      idFront: {
        fileName: values.documents.idFront.fileName,
        mediaId: verification.idCardFrontMediaId,
        previewUrl: verification.idCardFrontUrl ?? values.documents.idFront.previewUrl
      },
      selfieWithId: {
        fileName: values.documents.selfieWithId.fileName,
        mediaId: verification.selfieWithIdMediaId,
        previewUrl: verification.selfieWithIdUrl ?? values.documents.selfieWithId.previewUrl
      }
    },
    idCardNumber: values.idCardNumber,
    verificationFullName: values.verificationFullName
  }
}
