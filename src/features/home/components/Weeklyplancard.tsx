import React from "react";
import CircularProgress from "./Circularprogress";
import type { WeeklyPlan } from "../redux/Homeslice";

interface WeeklyPlanCardProps {
  plan: WeeklyPlan;
}

const WeeklyPlanCard: React.FC<WeeklyPlanCardProps> = ({ plan }) => {
  return (
    <div
      className="rounded-2xl p-6 mb-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0d1b3e 0%, #091428 100%)",
        border: "1px solid rgba(126,227,255,0.1)",
      }}
    >
      {/* Subtle glow */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(126,227,255,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl font-bold">{plan.title}</h2>
          <p className="text-[#7ee3ff] text-xs mt-1">{plan.subtitle}</p>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#64b883] inline-block" />
              <span className="text-[#b8adad] text-xs">{plan.tasksDone} tasks done</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#7ee3ff] inline-block" />
              <span className="text-[#b8adad] text-xs">{plan.inProgress} in progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#df5d5d] inline-block" />
              <span className="text-[#b8adad] text-xs">{plan.overdue} overdue</span>
            </div>
          </div>
        </div>

        <CircularProgress percentage={plan.completionPercentage} size={85} strokeWidth={6} />
      </div>
    </div>
  );
};

export default WeeklyPlanCard;