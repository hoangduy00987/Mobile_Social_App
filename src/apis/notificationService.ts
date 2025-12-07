import { apiService } from './apiClient'
import { NOTIFICATION_SERVICE_URL } from './constants'

export const getAllNotifications = async () => {
  const response = await apiService.get(`${NOTIFICATION_SERVICE_URL}/`)
  return response.data
}

export const markNotificationAsRead = async (notification_id: number) => {
  const response = await apiService.patch(
    `${NOTIFICATION_SERVICE_URL}/${notification_id}/read/`,
    {}
  )
  return response.data
}

export const markAllNotificationsAsRead = async () => {
  const response = await apiService.patch(`${NOTIFICATION_SERVICE_URL}/read-all/`, {})
  return response.data
}
