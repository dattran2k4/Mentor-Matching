import { useQuery } from '@tanstack/react-query'
import { statsApi } from '@/services/stats.api'
const adminStatsKeys = {
  all: ['admin-stats'],
  overview: (params) => [...adminStatsKeys.all, 'overview', params],
  timeseries: (params) => [...adminStatsKeys.all, 'timeseries', params]
}
function useAdminStatsOverviewQuery(params = {}) {
  return useQuery({
    queryKey: adminStatsKeys.overview(params),
    queryFn: async () => {
      const response = await statsApi.getOverview(params)
      return response.data
    }
  })
}
export { adminStatsKeys, useAdminStatsOverviewQuery }
