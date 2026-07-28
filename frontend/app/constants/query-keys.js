const QUERY_KEYS = {
  auth: {
    me: ['auth', 'me']
  },
  user: {
    learnerProfile: ['user', 'learner-profile']
  },
  catalog: {
    options: ['catalog', 'options']
  },
  mentor: {
    currentProfile: ['mentor', 'current-profile'],
    currentOnboardingStatus: ['mentor', 'current-onboarding-status'],
    currentVerification: ['mentor', 'current-verification'],
    currentSchedule: ['mentor', 'current-schedule'],
    detail: (mentorId) => ['mentor', 'detail', mentorId],
    calendar: (params) => ['mentor', 'calendar', params],
    list: (params) => ['mentor', 'list', params],
    featured: (params) => ['mentor', 'featured', params]
  },
  payment: {
    detail: (paymentId) => ['payment', 'detail', paymentId],
    my: (params) => ['payment', 'me', params],
    mentorMe: (params) => ['payment', 'mentor-me', params]
  },
  booking: {
    me: ['booking', 'me'],
    my: (params) => ['booking', 'me', params],
    mentorMeBase: ['booking', 'mentor-me'],
    mentorMe: (params) => ['booking', 'mentor-me', params]
  },
  location: {
    cities: (search) => ['location', 'cities', search],
    districts: (cityId, search) => ['location', 'districts', cityId, search]
  },
  notification: {
    base: ['notification'],
    list: (params) => ['notification', 'list', params],
    unreadCount: ['notification', 'unreadCount']
  }
}
export { QUERY_KEYS }
