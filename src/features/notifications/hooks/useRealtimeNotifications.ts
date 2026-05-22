import { useEffect, useRef, useState } from "react";
import { useNotifications, useUnreadCount } from "./useNotifications";

export const useRealtimeNotifications = () => {
  const notificationsQuery = useNotifications();
  const unreadCountQuery = useUnreadCount();
  const [hasNew, setHasNew] = useState(false);
  const lastIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const list = notificationsQuery.data ?? [];
    const currentIds = new Set(list.map((n) => n.id));
    const lastIds = lastIdsRef.current;

    let detectedNew = false;
    currentIds.forEach((id) => {
      if (!lastIds.has(id)) detectedNew = true;
    });

    if (detectedNew) setHasNew(true);
    lastIdsRef.current = currentIds;
  }, [notificationsQuery.data]);

  useEffect(() => {
    if (!notificationsQuery.isFetching) {
      setHasNew(false);
    }
  }, [notificationsQuery.isFetching]);

  return {
    notifications: notificationsQuery.data ?? [],
    unreadCount: unreadCountQuery.data ?? 0,
    loading: notificationsQuery.isLoading || unreadCountQuery.isLoading,
    error: notificationsQuery.error ?? unreadCountQuery.error,
    refetchNotifications: notificationsQuery.refetch,
    refetchUnreadCount: unreadCountQuery.refetch,
    hasNew,
  };
};
