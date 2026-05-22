import { createContext, useContext, useMemo } from "react";
import { useRealtimeNotifications } from "../hooks/useRealtimeNotifications";

interface NotificationContextValue {
  notifications: ReturnType<typeof useRealtimeNotifications>["notifications"];
  unreadCount: number;
  loading: boolean;
  error: unknown;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    refetchNotifications,
    refetchUnreadCount,
  } = useRealtimeNotifications();

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      error,
      refreshNotifications: () => {
        refetchNotifications();
        refetchUnreadCount();
      },
    }),
    [
      notifications,
      unreadCount,
      loading,
      error,
      refetchNotifications,
      refetchUnreadCount,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotificationContext must be used within NotificationProvider",
    );
  }
  return ctx;
};
