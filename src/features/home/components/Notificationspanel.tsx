import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import {
  closeNotifications,
  markAllNotificationsRead,
} from "../redux/Homeslice";

const NotificationsPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, notificationsOpen } = useSelector(
    (state: RootState) => state.home
  );
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

  if (!notificationsOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      ref={panelRef}
      className="absolute top-16 right-4 z-50 w-80 rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: "#0a1020",
        border: "1px solid rgba(255,255,255,0.08)",
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
      <div className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: "#7ee3ff", color: "#060b1b" }}
            >
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={() => dispatch(markAllNotificationsRead())}
          className="text-[#7ee3ff] text-xs hover:opacity-70 transition-opacity"
        >
          Mark all read
        </button>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-10 text-center text-[#7f7f7f] text-sm">
            No notifications
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="px-5 py-4 transition-colors duration-150 hover:bg-white/[0.02] cursor-pointer relative"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
              {/* Unread dot */}
              {!notif.isRead && (
                <span
                  className="absolute top-4 right-4 w-2 h-2 rounded-full"
                  style={{ background: "#7ee3ff" }}
                />
              )}

              <p className="text-[#7f7f7f] text-[10px] mb-1.5">
                ◆ {notif.project}
              </p>

              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #2a4a7f 0%, #1a3060 100%)",
                    border: "1.5px solid rgba(126,227,255,0.2)",
                    color: "#7ee3ff",
                  }}
                >
                  {notif.sender.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium">{notif.sender}</p>
                  <p className="text-[#7f7f7f] text-[10px] mt-0.5">{notif.time}</p>
                  <p className="text-[#b8adad] text-xs mt-1 leading-relaxed truncate">
                    "{notif.message}"
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;