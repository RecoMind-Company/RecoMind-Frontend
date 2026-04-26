import React from "react";

interface OverdueBannerProps {
  count: number;
  onViewTasks?: () => void;
}

const OverdueBanner: React.FC<OverdueBannerProps> = ({ count, onViewTasks }) => {
  return (
    <div
      className="flex items-center justify-between rounded-xl px-5 py-4 mb-5"
      style={{
        background: "linear-gradient(135deg, rgba(223,93,93,0.15) 0%, rgba(223,93,93,0.08) 100%)",
        border: "1px solid rgba(223,93,93,0.3)",
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-[#df5d5d] text-lg">⊙</span>
        <div>
          <p className="text-[#df5d5d] font-semibold text-sm">
            {count} Tasks are overdue
          </p>
          <p className="text-[#7f7f7f] text-xs mt-0.5">
            These tasks need immediate attention to keep your plans on track.
          </p>
        </div>
      </div>
      <button
        onClick={onViewTasks}
        className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, #1a2a4a 0%, #243560 100%)",
          border: "1px solid rgba(126,227,255,0.2)",
        }}
      >
        View Tasks
      </button>
    </div>
  );
};

export default OverdueBanner;