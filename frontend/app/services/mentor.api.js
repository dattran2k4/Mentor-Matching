import { env } from '@/config/env'
import http from '@/libs/http'
import { mockMentorApi } from '@/services/mock/mentor.mock.api'
const MENTOR_ENDPOINTS = {
  me: 'mentors/me',
  myAvatar: 'mentors/me/avatar',
  myOnboardingStatus: 'mentors/me/onboarding-status',
  mySubmission: 'mentors/me/submission',
  mentors: 'mentors',
  mentorDetail: (mentorId) => `mentors/${mentorId}`,
  mySubjects: 'mentors/me/subjects',
  mySubjectDetail: (mentorSubjectId) => `mentors/me/subjects/${mentorSubjectId}`,
  mentorSubjects: (mentorId) => `mentors/${mentorId}/subjects`,
  myTraits: 'mentors/me/traits',
  personalityOptions: 'mentors/personality-options',
  highlightOptions: 'mentors/highlight-options',
  mentorTraits: (mentorId) => `mentors/${mentorId}/traits`,
  myAchievements: 'mentors/me/achievements',
  myAchievementDetail: (achievementId) => `mentors/me/achievements/${achievementId}`,
  mentorAchievements: (mentorId) => `mentors/${mentorId}/achievements`,
  myVerification: 'mentors/me/verification',
  myAvailabilities: 'scheduling/me/availabilities',
  myAvailabilityDetail: (availabilityId) => `scheduling/me/availabilities/${availabilityId}`,
  mentorAvailabilities: (mentorId) => `mentors/${mentorId}/availabilities`,
  mentorCalendarBooking: (mentorId) => `mentors/${mentorId}/calendar-booking`,
  adminMentors: 'admin/mentors',
  adminMentorDetail: (mentorId) => `admin/mentors/${mentorId}`,
  adminMentorApproval: (mentorId) => `admin/mentors/${mentorId}/approval`,
  adminMentorVerifications: 'admin/mentor-verifications',
  adminMentorVerificationDetail: (verificationId) => `admin/mentor-verifications/${verificationId}`
}
const defaultMentorApi = {
  createCurrentMentor: async (payload) => (await http.post(MENTOR_ENDPOINTS.me, payload)).data,
  getCurrentMentor: async () => (await http.get(MENTOR_ENDPOINTS.me)).data,
  getCurrentMentorOnboardingStatus: async () =>
    (await http.get(MENTOR_ENDPOINTS.myOnboardingStatus)).data,
  submitCurrentMentorApplication: async () => (await http.post(MENTOR_ENDPOINTS.mySubmission)).data,
  updateCurrentMentor: async (payload) => (await http.put(MENTOR_ENDPOINTS.me, payload)).data,
  updateCurrentMentorAvatar: async (payload) =>
    (await http.patch(MENTOR_ENDPOINTS.myAvatar, payload)).data,
  getMentors: async (params) => (await http.get(MENTOR_ENDPOINTS.mentors, { params })).data,
  getMentorDetail: async (mentorId) =>
    (await http.get(MENTOR_ENDPOINTS.mentorDetail(mentorId))).data,
  getCurrentMentorSubjects: async () => (await http.get(MENTOR_ENDPOINTS.mySubjects)).data,
  upsertCurrentMentorSubject: async (payload) =>
    (await http.put(MENTOR_ENDPOINTS.mySubjects, payload)).data,
  deleteCurrentMentorSubject: async (mentorSubjectId) =>
    (await http.delete(MENTOR_ENDPOINTS.mySubjectDetail(mentorSubjectId))).data,
  getMentorSubjects: async (mentorId) =>
    (await http.get(MENTOR_ENDPOINTS.mentorSubjects(mentorId))).data,
  getCurrentMentorTraits: async () => (await http.get(MENTOR_ENDPOINTS.myTraits)).data,
  updateCurrentMentorTraits: async (payload) =>
    (await http.put(MENTOR_ENDPOINTS.myTraits, payload)).data,
  getPersonalityOptions: async () => (await http.get(MENTOR_ENDPOINTS.personalityOptions)).data,
  getHighlightOptions: async () => (await http.get(MENTOR_ENDPOINTS.highlightOptions)).data,
  getMentorTraits: async (mentorId) =>
    (await http.get(MENTOR_ENDPOINTS.mentorTraits(mentorId))).data,
  getCurrentMentorAchievements: async () => (await http.get(MENTOR_ENDPOINTS.myAchievements)).data,
  createCurrentMentorAchievement: async (payload) =>
    (await http.post(MENTOR_ENDPOINTS.myAchievements, payload)).data,
  updateCurrentMentorAchievement: async (achievementId, payload) =>
    (await http.put(MENTOR_ENDPOINTS.myAchievementDetail(achievementId), payload)).data,
  deleteCurrentMentorAchievement: async (achievementId) =>
    (await http.delete(MENTOR_ENDPOINTS.myAchievementDetail(achievementId))).data,
  getMentorAchievements: async (mentorId) =>
    (await http.get(MENTOR_ENDPOINTS.mentorAchievements(mentorId))).data,
  getCurrentMentorVerification: async () => (await http.get(MENTOR_ENDPOINTS.myVerification)).data,
  upsertCurrentMentorVerification: async (payload) =>
    (await http.put(MENTOR_ENDPOINTS.myVerification, payload)).data,
  getMentorAvailabilities: async (mentorId) =>
    (await http.get(MENTOR_ENDPOINTS.mentorAvailabilities(mentorId))).data,
  getCurrentMentorAvailabilities: async () =>
    (await http.get(MENTOR_ENDPOINTS.myAvailabilities)).data,
  createCurrentMentorAvailability: async (payload) =>
    (await http.post(MENTOR_ENDPOINTS.myAvailabilities, payload)).data,
  updateCurrentMentorAvailability: async (availabilityId, payload) =>
    (await http.put(MENTOR_ENDPOINTS.myAvailabilityDetail(availabilityId), payload)).data,
  deleteCurrentMentorAvailability: async (availabilityId) =>
    (await http.delete(MENTOR_ENDPOINTS.myAvailabilityDetail(availabilityId))).data,
  getMentorCalendarBooking: async (mentorId, from, to) =>
    (
      await http.get(MENTOR_ENDPOINTS.mentorCalendarBooking(mentorId), {
        params: { from, to }
      })
    ).data,
  getAdminMentors: async (params) =>
    (
      await http.get(MENTOR_ENDPOINTS.adminMentors, {
        params
      })
    ).data,
  getAdminMentorDetail: async (mentorId) =>
    (await http.get(MENTOR_ENDPOINTS.adminMentorDetail(mentorId))).data,
  reviewMentorApproval: async (mentorId, payload) =>
    (await http.patch(MENTOR_ENDPOINTS.adminMentorApproval(mentorId), payload)).data,
  getAdminMentorVerifications: async (params) =>
    (await http.get(MENTOR_ENDPOINTS.adminMentorVerifications, { params })).data,
  getAdminMentorVerificationDetail: async (verificationId) =>
    (await http.get(MENTOR_ENDPOINTS.adminMentorVerificationDetail(verificationId))).data,
  reviewMentorVerification: async (verificationId, payload) =>
    (await http.patch(MENTOR_ENDPOINTS.adminMentorVerificationDetail(verificationId), payload)).data
}
const mentorApi = env.useMock ? mockMentorApi : defaultMentorApi
export { mentorApi }
