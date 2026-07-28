import { env } from '@/config/env'
import http from '@/libs/http'
import { mockStatsApi } from '@/services/mock/stats.mock.api'
const STATS_ENDPOINTS = {
  overview: 'admin/stats/overview',
  timeseries: 'admin/stats/timeseries'
}
const defaultStatsApi = {
  getOverview: async (params) =>
    (
      await http.get(STATS_ENDPOINTS.overview, {
        params
      })
    ).data,
  getTimeseries: async (params) =>
    (
      await http.get(STATS_ENDPOINTS.timeseries, {
        params
      })
    ).data
}
const statsApi = env.useMock ? mockStatsApi : defaultStatsApi
export { statsApi }
