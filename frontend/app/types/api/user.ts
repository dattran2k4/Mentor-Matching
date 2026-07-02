import type { Gender } from '@/types/api/common'
import type { UserStatus } from '@/types/models/user'

export type UserRoleApiResponse = 'LEARNER' | 'MENTOR' | 'ADMIN' | 'MANAGER'

export type UserTypeApiResponse = 'STUDENT' | 'PARENT' | 'UNIVERSITY_STUDENT' | 'WORKING_ADULT'

export type CurrentUserApiResponse = {
  id: number
  fullName: string
  email: string
  phone: string
  role: UserRoleApiResponse
  userType: UserTypeApiResponse | null
  status: UserStatus
}

export type UpdateCurrentUserRequest = {
  fullName: string
  phone: string
  userType: UserTypeApiResponse
}

export type LearnerProfileApiResponse = {
  id: number | null
  userId: number
  gender: Gender | null
  birthYear: number | null
  schoolName: string | null
  gradeId: number | null
  learningGoal: string | null
  createdAt: string | null
  updatedAt: string | null
}

export type UpdateCurrentLearnerProfileRequest = {
  gender?: Gender | null
  birthYear?: number | null
  schoolName?: string | null
  gradeId?: number | null
  learningGoal?: string | null
}
