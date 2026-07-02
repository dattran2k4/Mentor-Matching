import { queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import type {
  MentorsQueryParams,
  MentorAvailabilityDetailApiResponse,
  MentorDetailApiResponse,
  MentorListItemApiResponse,
  MentorOptionDetailApiResponse,
  MentorSubjectDetailApiResponse
} from '@/types/api/mentor'

export type FeaturedMentorApiBundle = {
  mentor: MentorListItemApiResponse
  detail: MentorDetailApiResponse | null
  subjects: MentorSubjectDetailApiResponse[]
  traits: MentorOptionDetailApiResponse[]
  availabilities: MentorAvailabilityDetailApiResponse[]
}

export type FeaturedMentorsQueryParams = Pick<
  MentorsQueryParams,
  'page' | 'size' | 'sortBy' | 'sortDir'
>

async function fetchFeaturedMentorBundle(
  mentor: MentorListItemApiResponse
): Promise<FeaturedMentorApiBundle> {
  const [detailResult, subjectsResult, traitsResult, availabilitiesResult] =
    await Promise.allSettled([
      mentorApi.getMentorDetail(mentor.id),
      mentorApi.getMentorSubjects(mentor.id),
      mentorApi.getMentorTraits(mentor.id),
      mentorApi.getMentorAvailabilities(mentor.id)
    ])

  return {
    mentor,
    detail: detailResult.status === 'fulfilled' ? detailResult.value.data : null,
    subjects: subjectsResult.status === 'fulfilled' ? subjectsResult.value.data : [],
    traits:
      traitsResult.status === 'fulfilled'
        ? [...traitsResult.value.data.highlights, ...traitsResult.value.data.personalities].filter(
            (option, index, options) => options.findIndex(({ id }) => id === option.id) === index
          )
        : [],
    availabilities:
      availabilitiesResult.status === 'fulfilled' ? availabilitiesResult.value.data : []
  }
}

async function fetchFeaturedMentors(
  params: FeaturedMentorsQueryParams
): Promise<FeaturedMentorApiBundle[]> {
  const mentorPage = (await mentorApi.getMentors(params)).data

  return Promise.all(mentorPage.data.map(fetchFeaturedMentorBundle))
}

export function getFeaturedMentorsQueryOptions(params: FeaturedMentorsQueryParams) {
  return queryOptions({
    queryKey: QUERY_KEYS.mentor.featured({
      page: params.page ?? 1,
      size: params.size ?? 3,
      sortBy: params.sortBy ?? 'createdAt',
      sortDir: params.sortDir ?? 'desc'
    }),
    queryFn: () => fetchFeaturedMentors(params)
  })
}

export function useFeaturedMentorsQuery(params: FeaturedMentorsQueryParams) {
  return useQuery(getFeaturedMentorsQueryOptions(params))
}
