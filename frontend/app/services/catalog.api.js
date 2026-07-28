import { env } from '@/config/env'
import http from '@/libs/http'
import { mockCatalogApi } from '@/services/mock/catalog.mock.api'
const CATALOG_ENDPOINTS = {
  options: 'catalog/options',
  adminSubjects: 'admin/catalog/subjects',
  adminGrades: 'admin/catalog/grades'
}
const defaultCatalogApi = {
  getCatalogOptions: async () => (await http.get(CATALOG_ENDPOINTS.options)).data,
  createSubject: async (data) => (await http.post(CATALOG_ENDPOINTS.adminSubjects, data)).data,
  updateSubject: async (id, data) =>
    (await http.put(`${CATALOG_ENDPOINTS.adminSubjects}/${id}`, data)).data,
  deleteSubject: async (id) => (await http.delete(`${CATALOG_ENDPOINTS.adminSubjects}/${id}`)).data,
  createGrade: async (data) => (await http.post(CATALOG_ENDPOINTS.adminGrades, data)).data,
  updateGrade: async (id, data) =>
    (await http.put(`${CATALOG_ENDPOINTS.adminGrades}/${id}`, data)).data,
  deleteGrade: async (id) => (await http.delete(`${CATALOG_ENDPOINTS.adminGrades}/${id}`)).data
}
const catalogApi = env.useMock ? mockCatalogApi : defaultCatalogApi
export { catalogApi }
