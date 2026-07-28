import { queryOptions, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { catalogApi } from '@/services/catalog.api'
async function fetchCatalogOptions() {
  return (await catalogApi.getCatalogOptions()).data
}
function getCatalogOptionsQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.catalog.options,
    queryFn: fetchCatalogOptions
  })
}
function useCatalogOptionsQuery() {
  return useQuery(getCatalogOptionsQueryOptions())
}
function useCatalogSubjectsQuery() {
  return useQuery({
    ...getCatalogOptionsQueryOptions(),
    select: (catalogOptions) => catalogOptions.subjects
  })
}
function useCatalogGradesQuery() {
  return useQuery({
    ...getCatalogOptionsQueryOptions(),
    select: (catalogOptions) => catalogOptions.grades
  })
}
export {
  getCatalogOptionsQueryOptions,
  useCatalogGradesQuery,
  useCatalogOptionsQuery,
  useCatalogSubjectsQuery
}
