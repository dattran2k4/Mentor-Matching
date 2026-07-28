import { env } from '@/config/env'
import http from '@/libs/http'
import { mockLocationApi } from '@/services/mock/location.mock.api'
const LOCATION_ENDPOINTS = {
  cities: 'locations/cities',
  cityDistricts: (cityId) => `locations/cities/${cityId}/districts`
}
const defaultLocationApi = {
  getCities: async (params) => (await http.get(LOCATION_ENDPOINTS.cities, { params })).data,
  getDistrictsByCity: async (cityId, params) =>
    (
      await http.get(LOCATION_ENDPOINTS.cityDistricts(cityId), {
        params
      })
    ).data
}
const locationApi = env.useMock ? mockLocationApi : defaultLocationApi
export { locationApi }
