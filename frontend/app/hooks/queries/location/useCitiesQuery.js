import { queryOptions, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { locationApi } from '@/services/location.api'
async function fetchCities(search) {
  return (await locationApi.getCities({ search })).data
}
function getCitiesQueryOptions(search) {
  return queryOptions({
    queryKey: QUERY_KEYS.location.cities(search),
    queryFn: () => fetchCities(search)
  })
}
function useCitiesQuery(search, enabled = true) {
  return useQuery({
    ...getCitiesQueryOptions(search),
    enabled
  })
}
export { getCitiesQueryOptions, useCitiesQuery }
