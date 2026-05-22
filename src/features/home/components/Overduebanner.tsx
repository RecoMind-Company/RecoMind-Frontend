import React from "react";
import { AlertCircle } from "lucide-react";

interface OverdueBannerProps {
  count: number;
  onViewTasks?: () => void;
}

const OverdueBanner: React.FC<OverdueBannerProps> = ({ count, onViewTasks }) => {
  return (
    <div
      className="flex items-center justify-between rounded-xl px-5 py-4 mb-5"
      style={{
        background:
          "radial-gradient(303.7% 3274.22% at 100% 25.96%, rgba(82, 5, 5, 0.4) 0%, rgba(20, 26, 43, 0.4) 100%)",
      }}
    >
      <div className="flex items-center gap-3">
        <div>
          <p
            className="text-[#df5d5d]"
            style={{
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "28px",
              letterSpacing: "0px",
            }}
          >
            <span className="inline-flex items-center mr-2">
              <AlertCircle size={20} className="text-[#df5d5d]" />
            </span>
            {count} Tasks are overdue
          </p>
          <p
            className="mt-0.5"
            style={{
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "20px",
              letterSpacing: "0px",
              color: "#CBCBCB",
            }}
          >
            These tasks need immediate attention to keep your plans on track.
          </p>
        </div>
      </div>
      <button
        onClick={onViewTasks}
        className="px-4 py-3 rounded-[14px] text-lg font-medium text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          backgroundColor: "#454A55A6"
        }}
      >
        View Tasks
      </button>
    </div>
  );
};

export default OverdueBanner;