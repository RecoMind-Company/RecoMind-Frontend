import React from "react";
import type { WeeklyStats } from "../redux/Homeslice";

interface ThisWeekStatsProps {
  stats: WeeklyStats;
}

const ThisWeekStats: React.FC<ThisWeekStatsProps> = ({ stats }) => {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "#0E152A",
      }}
    >
      <h3 className="text-white font-medium text-xl mb-4">This week</h3>

      <div className="space-y-3">
        {/* In Progress */}
        <div className="flex items-center justify-between py-2.5 px-3 "
          style={{ borderBottom: "1px solid rgba(126,227,255,0.08)" }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-[#7ee3ff] text-sm">⏳</span>
            <span className="text-[#b8adad] text-sm">In Progress</span>
          </div>
          <span
            className="text-sm font-semibold w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#454A5599", color: "#ffffff" }}
          >
            {stats.inProgress}
          </span>
        </div>

        {/* Completed */}
        <div className="flex items-center justify-between py-2.5 px-3 "
          style={{ borderBottom: "1px solid rgba(100,184,131,0.08)" }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-[#64b883] text-sm">✓</span>
            <span className="text-[#b8adad] text-sm">Completed</span>
          </div>
          <span
            className="text-sm font-semibold w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#454A5599", color: "#ffffff" }}
          >
            {stats.completed}
          </span>
        </div>

        {/* Overdue */}
        <div className="flex items-center justify-between py-2.5 px-3 "
        >
          <div className="flex items-center gap-2.5">
            <span className="text-[#df5d5d] text-sm">⚠</span>
            <span className="text-[#b8adad] text-sm">Overdue</span>
          </div>
          <span
            className="text-sm font-semibold w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#454A5599", color: "#ffffff" }}
          >
            {stats.overdue}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ThisWeekStats;