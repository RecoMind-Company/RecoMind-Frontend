import api from "./api";

export interface Notification {
  id: string;
  title: string;
  message: string;
  senderId: string;
  receiverId: string;
  planId: string;
  isRead: boolean;
  createdAt: string;
}

export type NotificationListResponse = Notification[];
export type UnreadCountResponse = number;

const BASE = "/Notifications";

export const notificationService = {
  async getNotifications(): Promise<NotificationListResponse> {
    const { data } = await api.get<NotificationListResponse>(BASE);
    return data;
  },
  async getReadNotifications(): Promise<NotificationListResponse> {
    const { data } = await api.get<NotificationListResponse>(
      `${BASE}/filter?isRead=true`,
    );
    return data;
  },
  async getUnreadNotifications(): Promise<NotificationListResponse> {
    const { data } = await api.get<NotificationListResponse>(
      `${BASE}/filter?isRead=false`,
    );
    return data;
  },
  async getUnreadCount(): Promise<UnreadCountResponse> {
    const { data } = await api.get<UnreadCountResponse>(`${BASE}/unread-count`);
    return data;
  },
  async markAsRead(id: string): Promise<void> {
    await api.patch(`${BASE}/${id}/mark-as-read`);
  },
  async deleteNotification(id: string): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  },
};
