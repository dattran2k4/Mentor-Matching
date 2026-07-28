import { useQuery } from '@tanstack/react-query'
import { statsApi } from '@/services/stats.api'
import { adminStatsKeys } from './useAdminStatsOverviewQuery'
function useAdminStatsTimeseriesQuery(params = {}) {
  return useQuery({
    queryKey: adminStatsKeys.timeseries(params),
    queryFn: async () => {
      const response = await statsApi.getTimeseries(params)
      return response.data
    }
  })
}
export { useAdminStatsTimeseriesQuery }
