import { env } from '@/config/env'
import http from '@/libs/http'
import type { ApiResponse, PaginationParams } from '@/types/api/common'
import type { GetNotificationsApiResponse } from '@/types/api/notification'

const NOTIFICATION_ENDPOINTS = {
  base: 'notifications',
  unreadCount: 'notifications/unread-count',
  markAllAsRead: 'notifications/read-all'
} as const

const defaultNotificationApi = {
  getNotifications: async (
    params?: PaginationParams
  ): Promise<ApiResponse<GetNotificationsApiResponse>> =>
    (
      await http.get<ApiResponse<GetNotificationsApiResponse>>(NOTIFICATION_ENDPOINTS.base, {
        params
      })
    ).data,

  getUnreadCount: async (): Promise<ApiResponse<number>> =>
    (await http.get<ApiResponse<number>>(NOTIFICATION_ENDPOINTS.unreadCount)).data,

  markAsRead: async (id: string): Promise<ApiResponse<void>> =>
    (await http.put<ApiResponse<void>>(`${NOTIFICATION_ENDPOINTS.base}/${id}/read`)).data,

  markAllAsRead: async (): Promise<ApiResponse<void>> =>
    (await http.put<ApiResponse<void>>(NOTIFICATION_ENDPOINTS.markAllAsRead)).data,

  deleteNotification: async (id: string): Promise<ApiResponse<void>> =>
    (await http.delete<ApiResponse<void>>(`${NOTIFICATION_ENDPOINTS.base}/${id}`)).data
}

// TODO: Create mock API when needed
export const notificationApi = defaultNotificationApi
