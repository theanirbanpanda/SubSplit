import api from '../../../services/api';

export const fetchNotificationsApi = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const fetchUnreadCountApi = async () => {
  const response = await api.get('/notifications/unread-count');
  return response.data;
};

export const markAsReadApi = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllAsReadApi = async () => {
  const response = await api.patch('/notifications/read-all');
  return response.data;
};

export const deleteNotificationApi = async (notificationId) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
};

export const clearAllNotificationsApi = async () => {
  const response = await api.delete('/notifications');
  return response.data;
};
