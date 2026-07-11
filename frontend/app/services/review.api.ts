import axios from 'axios'

import type { ApiResponse, PageQueryParams, PageResponse } from '@/types/api/common'
import type {
  CreateReviewRequest,
  MentorRatingSummaryResponse,
  MentorReviewResponse,
  UpdateReviewRequest
} from '@/types/api/review'

const REVIEW_API_URL = '/api/v1/reviews'

export const reviewApi = {
  createReview: async (payload: CreateReviewRequest) => {
    const response = await axios.post<ApiResponse<{ reviewId: number }>>(REVIEW_API_URL, payload)
    return response.data
  },

  getReviewDetail: async (id: number) => {
    const response = await axios.get<ApiResponse<MentorReviewResponse>>(`${REVIEW_API_URL}/${id}`)
    return response.data
  },

  getMentorReviews: async (mentorId: number, params?: PageQueryParams) => {
    const response = await axios.get<ApiResponse<PageResponse<MentorReviewResponse>>>(
      `${REVIEW_API_URL}/mentor/${mentorId}`,
      { params }
    )
    return response.data
  },

  getMentorRatingSummary: async (mentorId: number) => {
    const response = await axios.get<ApiResponse<MentorRatingSummaryResponse>>(
      `${REVIEW_API_URL}/mentor/${mentorId}/summary`
    )
    return response.data
  },

  updateReview: async (id: number, payload: UpdateReviewRequest) => {
    const response = await axios.put<ApiResponse<void>>(`${REVIEW_API_URL}/${id}`, payload)
    return response.data
  },

  deleteReview: async (id: number) => {
    const response = await axios.delete<ApiResponse<void>>(`${REVIEW_API_URL}/${id}`)
    return response.data
  }
}
