import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  notificationService,
  type NotificationListResponse,
  type UnreadCountResponse,
} from "@/services/notification.service";

const POLL_INTERVAL_MS = 10000;
const hasToken = () => !!localStorage.getItem("token");

export const useNotifications = () =>
  useQuery<NotificationListResponse>({
    queryKey: ["notifications", "all"],
    queryFn: notificationService.getNotifications,
    enabled: hasToken(),
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: true,
  });

export const useReadNotifications = () =>
  useQuery<NotificationListResponse>({
    queryKey: ["notifications", "read"],
    queryFn: notificationService.getReadNotifications,
    enabled: hasToken(),
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: true,
  });

export const useUnreadNotifications = () =>
  useQuery<NotificationListResponse>({
    queryKey: ["notifications", "unread"],
    queryFn: notificationService.getUnreadNotifications,
    enabled: hasToken(),
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: true,
  });

export const useUnreadCount = () =>
  useQuery<UnreadCountResponse>({
    queryKey: ["notifications", "unread-count"],
    queryFn: notificationService.getUnreadCount,
    enabled: hasToken(),
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: true,
  });

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });
};
