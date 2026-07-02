import type { BecomeMentorProfileFormValues } from '@/features/become-mentor/schemas'
import type { Gender } from '@/types/api/common'
import type { CurrentMentorApiResponse, UpdateCurrentMentorRequest } from '@/types/api/mentor'

export const emptyBecomeMentorProfileFormValues: BecomeMentorProfileFormValues = {
  currentCityId: '',
  currentDistrictId: '',
  currentPosition: '',
  experienceYears: '',
  fullName: '',
  gender: '',
  headline: '',
  hometownCityId: '',
  introduction: '',
  teachingStyle: '',
  workplace: ''
}

export function mapCurrentMentorToBecomeMentorProfileFormValues(
  currentMentor: CurrentMentorApiResponse
): BecomeMentorProfileFormValues {
  return {
    currentCityId: currentMentor.currentLocation.cityId
      ? String(currentMentor.currentLocation.cityId)
      : '',
    currentDistrictId: currentMentor.currentLocation.districtId
      ? String(currentMentor.currentLocation.districtId)
      : '',
    currentPosition: currentMentor.currentPosition ?? '',
    experienceYears:
      currentMentor.experienceYears === null ? '' : String(currentMentor.experienceYears),
    fullName: currentMentor.fullName ?? '',
    gender: currentMentor.gender ?? '',
    headline: currentMentor.headline ?? '',
    hometownCityId: currentMentor.hometown.cityId ? String(currentMentor.hometown.cityId) : '',
    introduction: currentMentor.introduction ?? '',
    teachingStyle: currentMentor.teachingStyle ?? '',
    workplace: currentMentor.workplace ?? ''
  }
}

export function mapBecomeMentorProfileFormValuesToRequest(
  values: BecomeMentorProfileFormValues
): UpdateCurrentMentorRequest {
  return {
    currentDistrictId: toNullableNumber(values.currentDistrictId),
    currentPosition: toNullableString(values.currentPosition),
    experienceYears: toNullableNumber(values.experienceYears),
    gender: values.gender ? (values.gender as Gender) : null,
    headline: toNullableString(values.headline),
    hometownCityId: toNullableNumber(values.hometownCityId),
    introduction: toNullableString(values.introduction),
    teachingStyle: toNullableString(values.teachingStyle),
    workplace: toNullableString(values.workplace)
  }
}

function toNullableNumber(value: string | undefined) {
  if (!value) return null

  const numericValue = Number(value)

  return Number.isNaN(numericValue) ? null : numericValue
}

function toNullableString(value: string | undefined) {
  const normalizedValue = value?.trim()

  return normalizedValue ? normalizedValue : null
}
