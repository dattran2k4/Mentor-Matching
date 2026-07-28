import http from '@/libs/http'
import { NotificationStatus } from '@/types/models/notification'
const NOTIFICATION_ENDPOINTS = {
  base: 'notifications',
  unreadCount: 'notifications/unread-count',
  markAllAsRead: 'notifications/mark-all-read'
}
const defaultNotificationApi = {
  getNotifications: async (params) => {
    const response = await http.get(NOTIFICATION_ENDPOINTS.base, { params })
    const apiResponse = response.data
    const pageResponse = apiResponse.data
    const mappedPageResponse = {
      ...pageResponse,
      data: (pageResponse.data || []).map((item) => ({
        id: item.id.toString(),
        userId: item.userId.toString(),
        title: item.title,
        content: item.message,
        type: item.type,
        status: item.isRead ? NotificationStatus.READ : NotificationStatus.UNREAD,
        createdDate: item.createdAt,
        lastModifiedDate: item.createdAt
      }))
    }
    return {
      ...apiResponse,
      data: mappedPageResponse
    }
  },
  getUnreadCount: async () => (await http.get(NOTIFICATION_ENDPOINTS.unreadCount)).data,
  markAsRead: async (id) => (await http.patch(`${NOTIFICATION_ENDPOINTS.base}/${id}/read`)).data,
  markAllAsRead: async () => (await http.post(NOTIFICATION_ENDPOINTS.markAllAsRead)).data,
  deleteNotification: async (id) => (await http.delete(`${NOTIFICATION_ENDPOINTS.base}/${id}`)).data
}
const notificationApi = defaultNotificationApi
export { notificationApi }
