import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { useQueryParams } from '@/hooks/useQueryParams'
const DISCOVER_PAGE_SIZE = 9
function useDiscoverFilters() {
  const urlQueryParams = useQueryParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(
    () => ({
      page: urlQueryParams.page || '1',
      search: urlQueryParams.search?.trim() ?? '',
      size: urlQueryParams.size || String(DISCOVER_PAGE_SIZE),
      cityId: urlQueryParams.cityId,
      districtId: urlQueryParams.districtId,
      gender: urlQueryParams.gender,
      gradeId: urlQueryParams.gradeId,
      meetingType: urlQueryParams.meetingType,
      sortBy: urlQueryParams.sortBy,
      sortDir: urlQueryParams.sortDir,
      subjectId: urlQueryParams.subjectId
    }),
    [urlQueryParams]
  )
  const parsedFilters = useMemo(() => {
    const search = filters.search
    const page = parsePositiveInteger(filters.page) ?? 1
    const size = parsePositiveInteger(filters.size) ?? DISCOVER_PAGE_SIZE
    const selectedMeetingType = parseMeetingType(filters.meetingType)
    const selectedCityId = parsePositiveInteger(filters.cityId)
    const selectedDistrictId = parsePositiveInteger(filters.districtId)
    const selectedSubjectId = parsePositiveInteger(filters.subjectId)
    const selectedGradeId = parsePositiveInteger(filters.gradeId)
    const selectedGender = parseGender(filters.gender)
    const sortBy = parseSortBy(filters.sortBy)
    const sortDir = parseSortDirection(filters.sortDir)
    const queryParams = { page, size }
    if (search) queryParams.search = search
    if (selectedMeetingType) queryParams.meetingType = selectedMeetingType
    if (selectedCityId) queryParams.cityId = selectedCityId
    if (selectedDistrictId) queryParams.districtId = selectedDistrictId
    if (selectedSubjectId) queryParams.subjectId = selectedSubjectId
    if (selectedGradeId) queryParams.gradeId = selectedGradeId
    if (selectedGender) queryParams.gender = selectedGender
    if (
      (sortBy === 'minPrice' && sortDir === 'asc') ||
      (sortBy === 'createdAt' && sortDir === 'desc')
    ) {
      queryParams.sortBy = sortBy
      queryParams.sortDir = sortDir
    }
    return {
      page,
      queryParams,
      search,
      selectedCityId,
      selectedDistrictId,
      selectedGender,
      selectedGradeId,
      selectedMeetingType,
      selectedSubjectId,
      sortBy,
      sortDir
    }
  }, [filters])
  const setFilters = useCallback(
    (updates) => {
      const nextParams = new URLSearchParams(searchParams)
      const updatedKeys = Object.keys(updates)
      updatedKeys.forEach((key) => {
        const value = updates[key]?.trim()
        if (value) nextParams.set(key, value)
        else nextParams.delete(key)
      })
      if (updatedKeys.includes('cityId')) nextParams.delete('districtId')
      if (!updatedKeys.every((key) => key === 'page')) nextParams.delete('page')
      setSearchParams(nextParams)
    },
    [searchParams, setSearchParams]
  )
  const setFilter = useCallback(
    (key, value) => {
      setFilters({ [key]: value })
    },
    [setFilters]
  )
  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams())
  }, [setSearchParams])
  return {
    ...parsedFilters,
    filters,
    resetFilters,
    setFilter,
    setFilters
  }
}
function parsePositiveInteger(value) {
  if (!value) return null
  const parsedValue = Number(value)
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null
}
function parseMeetingType(value) {
  return value === 'ONLINE' || value === 'OFFLINE' || value === 'HYBRID' ? value : null
}
function parseGender(value) {
  return value === 'MALE' || value === 'FEMALE' || value === 'OTHER' ? value : null
}
function parseSortBy(value) {
  if (
    value === 'id' ||
    value === 'fullName' ||
    value === 'gender' ||
    value === 'experienceYears' ||
    value === 'meetingType' ||
    value === 'createdAt' ||
    value === 'minPrice'
  ) {
    return value
  }
  return null
}
function parseSortDirection(value) {
  return value === 'asc' || value === 'desc' ? value : null
}
export { DISCOVER_PAGE_SIZE, useDiscoverFilters }
