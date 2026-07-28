import http from '@/libs/http'
const REVIEW_API_URL = 'reviews'
const reviewApi = {
  getMyReviews: async () => {
    const response = await http.get(`${REVIEW_API_URL}/me`)
    return response.data
  },
  createReview: async (payload) => {
    const response = await http.post(REVIEW_API_URL, payload)
    return response.data
  },
  getReviewDetail: async (id) => {
    const response = await http.get(`${REVIEW_API_URL}/${id}`)
    return response.data
  },
  getMentorReviews: async (mentorId, params) => {
    const response = await http.get(`${REVIEW_API_URL}/mentor/${mentorId}`, { params })
    return response.data
  },
  getMentorRatingSummary: async (mentorId) => {
    const response = await http.get(`${REVIEW_API_URL}/mentor/${mentorId}/summary`)
    return response.data
  },
  updateReview: async (id, payload) => {
    const response = await http.put(`${REVIEW_API_URL}/${id}`, payload)
    return response.data
  },
  deleteReview: async (id) => {
    const response = await http.delete(`${REVIEW_API_URL}/${id}`)
    return response.data
  }
}
export { reviewApi }
