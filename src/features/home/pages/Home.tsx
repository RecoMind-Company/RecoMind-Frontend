import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";

import {
  fetchHomeData,
  toggleNotifications,
} from "../redux/Homeslice";

import OverdueBanner from "../components/Overduebanner";
import WeeklyPlanCard from "../components/Weeklyplancard";
import TaskCard from "../components/Taskcard";
import ThisWeekStats from "../components/Thisweekstats";
import AIAssistantCard from "../components/Aiassistantcard";
import NotificationsPanel from "../components/Notificationspanel";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    userName,
    greeting,
    totalTasksToday,
    overdueCount,
    weeklyPlan,
    weeklyStats,
    dailyFocusTasks,
    notifications,
    notificationsOpen,
    loading,
  } = useSelector((state: RootState) => state.home);

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "#7ee3ff", borderTopColor: "transparent" }}
          />
          <span className="text-[#7f7f7f] text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 relative" style={{ maxWidth: "1100px", margin: "0 auto" }}>
      
      {/* ===== HEADER ===== */}
      <div className="flex items-start justify-between mb-6 relative">
        <div>
          <p className="text-sm" style={{ color: "#7ee3ff" }}>
            {greeting}
            <span className="text-[#df5d5d] ml-0.5">.</span>
          </p>
          <h1 className="text-white text-3xl font-bold mt-0.5">{userName}</h1>
          <p className="text-[#7f7f7f] text-sm mt-1">
            You have {totalTasksToday} tasks to focus on today
          </p>
        </div>

        {/* Bell Icon */}
        <button
          onClick={() => dispatch(toggleNotifications())}
          className="relative mt-1 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
          style={{
            background: notificationsOpen
              ? "rgba(126,227,255,0.1)"
              : "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
              stroke="#eeeeee"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.73 21a2 2 0 0 1-3.46 0"
              stroke="#eeeeee"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{ background: "#7ee3ff", color: "#060b1b" }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notifications Panel */}
        <NotificationsPanel />
      </div>

      {/* ===== OVERDUE BANNER ===== */}
      {overdueCount > 0 && (
        <OverdueBanner count={overdueCount} onViewTasks={() => {}} />
      )}

      {/* ===== WEEKLY PLAN ===== */}
      <WeeklyPlanCard plan={weeklyPlan} />

      {/* ===== MAIN CONTENT GRID ===== */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* LEFT: Daily Focus */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">Daily Focus</h2>
            <button className="text-[#7ee3ff] text-sm hover:opacity-70 transition-opacity">
              View All
            </button>
          </div>

          {dailyFocusTasks.length === 0 ? (
            <div
              className="rounded-xl p-8 text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-[#7f7f7f] text-sm">No tasks for today 🎉</p>
            </div>
          ) : (
            dailyFocusTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </div>

        {/* RIGHT: This Week + AI */}
        <div className="lg:w-64">
          <ThisWeekStats stats={weeklyStats} />
          <AIAssistantCard />
        </div>
      </div>
    </div>
  );
};

export default Home;