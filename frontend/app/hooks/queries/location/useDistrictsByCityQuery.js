import { queryOptions, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { locationApi } from '@/services/location.api'
async function fetchDistrictsByCity(cityId, search) {
  return (await locationApi.getDistrictsByCity(cityId, { search })).data
}
function getDistrictsByCityQueryOptions(cityId, search) {
  return queryOptions({
    queryKey: QUERY_KEYS.location.districts(cityId, search),
    queryFn: () => fetchDistrictsByCity(cityId, search)
  })
}
function useDistrictsByCityQuery(cityId, search = '', enabled = true) {
  return useQuery({
    queryKey: cityId
      ? QUERY_KEYS.location.districts(cityId, search)
      : ['location', 'districts', 'idle'],
    queryFn: () => fetchDistrictsByCity(cityId, search),
    enabled: Boolean(cityId) && enabled
  })
}
export { getDistrictsByCityQueryOptions, useDistrictsByCityQuery }
