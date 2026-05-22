import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { closeNotifications } from "../redux/Homeslice";
import {
  useDeleteNotification,
  useMarkAsRead,
} from "@/features/notifications/hooks/useNotifications";
import { useNotificationContext } from "@/features/notifications/context/NotificationContext";
import { formatNotificationDate } from "@/features/notifications/utils/formatNotificationDate";

const NotificationsPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notificationsOpen } = useSelector((state: RootState) => state.home);
  const { notifications, unreadCount, loading, error } =
    useNotificationContext();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();
  const [activeFilter, setActiveFilter] = useState<
    "all" | "unread" | "comments" | "tasks" | "plans"
  >("all");
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        dispatch(closeNotifications());
      }
    };
    if (notificationsOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notificationsOpen, dispatch]);

  const filteredNotifications = useMemo(() => {
    const list = notifications ?? [];
    if (activeFilter === "unread") return list.filter((n) => !n.isRead);

    const classify = (title: string) => {
      const t = title.toLowerCase();
      if (t.includes("comment")) return "comments";
      if (t.includes("task")) return "tasks";
      if (t.includes("plan")) return "plans";
      return "all";
    };

    if (activeFilter === "all") return list;
    return list.filter((n) => classify(n.title) === activeFilter);
  }, [notifications, activeFilter]);

  if (!notificationsOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute top-16 right-4 z-50 w-105 rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: "#0b1327",
        border: "1px solid rgba(126,227,255,0.12)",
        animation: "slideDown 0.2s ease",
      }}
    >
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-sm">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "#7ee3ff", color: "#060b1b" }}
            >
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {(
            [
              { key: "all", label: "All" },
              { key: "unread", label: "Unread" },
              { key: "comments", label: "Comments" },
              { key: "tasks", label: "Tasks" },
              { key: "plans", label: "Plans" },
            ] as const
          ).map((pill) => {
            const isActive = activeFilter === pill.key;
            return (
              <button
                key={pill.key}
                onClick={() => setActiveFilter(pill.key)}
                className="text-[10px] font-semibold px-3 py-1 rounded-full transition-all"
                style={{
                  background: isActive
                    ? "rgba(126,227,255,0.18)"
                    : "rgba(255,255,255,0.04)",
                  color: isActive ? "#7ee3ff" : "#8ea0c7",
                  border: isActive
                    ? "1px solid rgba(126,227,255,0.3)"
                    : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div className="max-h-105 overflow-y-auto px-4 pb-4">
        {loading && (
          <div className="py-6 text-center text-[#7f7f7f] text-sm">
            Loading notifications...
          </div>
        )}
        {!loading && !!error && (
          <div className="py-6 text-center text-[#7f7f7f] text-sm">
            Failed to load notifications
          </div>
        )}
        {!loading && !error && filteredNotifications.length === 0 && (
          <div className="py-6 text-center text-[#7f7f7f] text-sm">
            No notifications
          </div>
        )}

        {!loading &&
          !error &&
          filteredNotifications.map((notif) => {
            const title = notif.title || "Notification";
            const badgeColor = title.toLowerCase().includes("overdue")
              ? "#ff6b6b"
              : "#7ee3ff";
            const badgeLabel = title.toLowerCase().includes("overdue")
              ? "Overdue Task"
              : title.toLowerCase().includes("plan")
                ? "New Plan Added"
                : "New Message";
            const senderLabel = notif.senderId || "System";
            const planLabel = notif.planId
              ? `Plan ${notif.planId}`
              : "Notification";

            return (
              <div
                key={notif.id}
                className="rounded-2xl px-4 py-4 mb-3 cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(17,26,52,0.9) 0%, rgba(11,19,39,0.9) 100%)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                }}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-[#7f7f7f]">{planLabel}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color: badgeColor }}
                    >
                      {badgeLabel}
                    </span>
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: badgeColor }}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 mt-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #2a4a7f 0%, #1a3060 100%)",
                      border: "1.5px solid rgba(126,227,255,0.2)",
                      color: "#7ee3ff",
                    }}
                  >
                    {title.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold">
                      {senderLabel}
                    </p>
                    <p className="text-[#7f7f7f] text-[10px] mt-0.5">
                      {formatNotificationDate(notif.createdAt)}
                    </p>
                    <p className="text-[#b8adad] text-xs mt-1 leading-relaxed">
                      "{notif.message}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <button
                    className="text-[10px] text-[#7ee3ff] hover:opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                  >
                    Delete
                  </button>
                  {!notif.isRead && (
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(126,227,255,0.12)",
                        color: "#7ee3ff",
                        border: "1px solid rgba(126,227,255,0.2)",
                      }}
                    >
                      Unread
                    </span>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default NotificationsPanel;
