import React from "react";
import type { Task } from "../redux/Homeslice";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const statusConfig = {
  overdue: {
    label: "Overdue",
    bg: "rgba(223,93,93,0.15)",
    color: "#df5d5d",
    border: "rgba(223,93,93,0.25)",
    dot: "#df5d5d",
  },
  "in-progress": {
    label: "In Progress",
    bg: "rgba(126,227,255,0.1)",
    color: "#7ee3ff",
    border: "rgba(126,227,255,0.2)",
    dot: "#7ee3ff",
  },
  todo: {
    label: "To-Do",
    bg: "rgba(180,180,180,0.1)",
    color: "#b8adad",
    border: "rgba(180,180,180,0.2)",
    dot: "#b8adad",
  },
  completed: {
    label: "Completed",
    bg: "rgba(100,184,131,0.1)",
    color: "#64b883",
    border: "rgba(100,184,131,0.2)",
    dot: "#64b883",
  },
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const config = statusConfig[task.status];

  return (
    <div
      onClick={onClick}
      className="rounded-xl p-4 mb-3 cursor-pointer transition-all duration-200 hover:translate-y-[-1px]"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Project label */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: config.dot }} />
            <span className="text-[10px]" style={{ color: config.dot }}>
              {task.project}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-white font-semibold text-sm mb-2">{task.title}</h4>

          {/* Due date */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#df5d5d] text-xs">⏰</span>
            <span
              className="text-xs"
              style={{ color: task.status === "overdue" ? "#df5d5d" : "#7f7f7f" }}
            >
              {task.dueDate}
            </span>
          </div>

          {/* Assignee avatars */}
          <div className="flex items-center gap-1 mt-3">
            {task.assignees.map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{
                  background: `hsl(${(i * 60 + 200) % 360}, 50%, 40%)`,
                  border: "1.5px solid rgba(255,255,255,0.15)",
                  marginLeft: i > 0 ? "-6px" : "0",
                }}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
        </div>

        {/* Status badge */}
        <span
          className="text-[10px] font-medium px-2.5 py-1 rounded-full ml-3 flex-shrink-0"
          style={{
            background: config.bg,
            color: config.color,
            border: `1px solid ${config.border}`,
          }}
        >
          + {config.label}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;