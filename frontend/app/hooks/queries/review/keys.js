const reviewKeys = {
  all: ['reviews'],
  lists: () => [...reviewKeys.all, 'list'],
  list: (mentorId, filters) => [...reviewKeys.lists(), mentorId, filters],
  myReviews: () => [...reviewKeys.all, 'my-reviews'],
  summaries: () => [...reviewKeys.all, 'summary'],
  summary: (mentorId) => [...reviewKeys.summaries(), mentorId],
  details: () => [...reviewKeys.all, 'detail'],
  detail: (id) => [...reviewKeys.details(), id]
}
export { reviewKeys }
