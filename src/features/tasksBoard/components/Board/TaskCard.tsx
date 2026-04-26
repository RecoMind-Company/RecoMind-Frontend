import React, { useRef } from "react";
import { Clock, AlertTriangle, Calendar, GripVertical } from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store";
import type { Task, TaskStatus } from "../../types";
import { openTaskModal, localMoveTask, localToggleComplete, setDragOver } from "../../redux/tasksSlice";

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
}

const priorityConfig = {
  HIGH:   { color: "#df5d5d", bg: "rgba(223,93,93,0.12)",   border: "rgba(223,93,93,0.25)" },
  MEDIUM: { color: "#e8a838", bg: "rgba(232,168,56,0.12)",  border: "rgba(232,168,56,0.25)" },
  LOW:    { color: "#7ee3ff", bg: "rgba(126,227,255,0.10)", border: "rgba(126,227,255,0.2)" },
};

const TaskCard: React.FC<TaskCardProps> = ({ task, isDragging, onDragStart }) => {
  const dispatch = useDispatch<AppDispatch>();
  const p = priorityConfig[task.priority];
  const isCompleted = task.completed;

  const handleCheckbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(localToggleComplete(task.id));
  };

  const handleCardClick = () => {
    dispatch(openTaskModal(task));
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, task.id)}
      onClick={handleCardClick}
      className="group relative rounded-xl p-3.5 mb-2.5 cursor-pointer select-none transition-all duration-200"
      style={{
        background: isDragging
          ? "rgba(126,227,255,0.08)"
          : "rgba(255,255,255,0.04)",
        border: isDragging
          ? "1px solid rgba(126,227,255,0.35)"
          : "1px solid rgba(255,255,255,0.07)",
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? "rotate(2deg)" : "none",
        boxShadow: isDragging
          ? "0 8px 32px rgba(0,0,0,0.4)"
          : "none",
      }}
    >
      {/* Grip handle - visible on hover */}
      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 transition-opacity">
        <GripVertical size={12} color="#7f7f7f" />
      </div>

      {/* Red dot for overdue */}
      {task.status === "overdue" && (
        <span
          className="absolute top-3 right-3 w-2 h-2 rounded-full"
          style={{ background: "#df5d5d", boxShadow: "0 0 6px #df5d5d" }}
        />
      )}

      {/* Project label */}
      <p className="text-[10px] mb-2" style={{ color: "rgba(126,227,255,0.6)" }}>
        ◆ {task.project}
      </p>

      {/* Title row with checkbox */}
      <div className="flex items-start gap-2">
        {/* Checkbox */}
        <button
          onClick={handleCheckbox}
          className="flex-shrink-0 mt-0.5 w-4 h-4 rounded flex items-center justify-center transition-all duration-200"
          style={{
            border: isCompleted ? "none" : "1.5px solid rgba(255,255,255,0.25)",
            background: isCompleted ? "#7ee3ff" : "transparent",
          }}
        >
          {isCompleted && (
            <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="#060b1b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <h4
          className="text-sm font-medium leading-snug flex-1"
          style={{
            color: isCompleted ? "#7f7f7f" : "#eeeeee",
            textDecoration: isCompleted ? "line-through" : "none",
          }}
        >
          {task.title}
        </h4>
      </div>

      {/* Due / Late info */}
      <div className="flex items-center justify-between mt-2.5">
        <div className="flex items-center gap-1.5">
          {task.isLate ? (
            <AlertTriangle size={11} color="#df5d5d" />
          ) : task.status === "review" || task.status === "done" ? (
            <Calendar size={11} color="#7f7f7f" />
          ) : (
            <Clock size={11} color="#7f7f7f" />
          )}
          <span
            className="text-[11px]"
            style={{ color: task.isLate ? "#df5d5d" : "#7f7f7f" }}
          >
            {task.isLate ? task.lateDisplay : task.dueDateDisplay}
          </span>
        </div>

        {/* Priority badge - only on non-done */}
        {!isCompleted && (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
            style={{ background: p.bg, color: p.color, border: `1px solid ${p.border}` }}
          >
            {task.priority}
          </span>
        )}
      </div>

      {/* Assignees */}
      {task.assignees.length > 0 && (
        <div className="flex items-center gap-1 mt-2.5">
          {task.assignees.slice(0, 3).map((a, i) => (
            <div
              key={a.id}
              title={a.name}
              className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold"
              style={{
                background: `hsl(${(i * 80 + 200) % 360}, 45%, 38%)`,
                border: "1.5px solid rgba(255,255,255,0.12)",
                marginLeft: i > 0 ? "-5px" : "0",
              }}
            >
              {a.name.charAt(0)}
            </div>
          ))}
          {task.assignees.length > 3 && (
            <span className="text-[9px] text-[#7f7f7f] ml-1">+{task.assignees.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;