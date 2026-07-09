export type GradeLevelGroupApiResponse = 'PRIMARY' | 'SECONDARY' | 'HIGH_SCHOOL'

export type CatalogCategoryApiResponse = {
  id: number
  name: string
  description: string
}

export type CatalogSubjectApiResponse = {
  id: number
  categoryId: number
  name: string
  description: string
}

export type CatalogGradeApiResponse = {
  id: number
  name: string
  levelGroup: GradeLevelGroupApiResponse
}

export type CatalogOptionsApiResponse = {
  categories: CatalogCategoryApiResponse[]
  subjects: CatalogSubjectApiResponse[]
  grades: CatalogGradeApiResponse[]
}

export type CreateSubjectRequest = {
  categoryId: number
  name: string
  description?: string
}

export type UpdateSubjectRequest = {
  categoryId: number
  name: string
  description?: string
}
