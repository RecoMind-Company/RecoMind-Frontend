import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import type { Task, TaskStatus } from "../../types";
import { localMoveTask, setDragOver } from "../../redux/tasksSlice";
import TaskCard from "./TaskCard";

interface KanbanColumnProps {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  dotColor: string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, label, tasks, dotColor }) => {
  const dispatch = useDispatch<AppDispatch>();
  const dragOverColumn = useSelector((s: RootState) => s.tasks.dragOverColumn);
  const isOver = dragOverColumn === status;

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    dispatch(setDragOver(status));
  };

  const handleDragLeave = () => {
    dispatch(setDragOver(null));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      dispatch(localMoveTask({ taskId, newStatus: status }));
      // TODO: also call API via moveTask thunk
      // dispatch(moveTask({ taskId, newStatus: status }));
    }
    dispatch(setDragOver(null));
  };

  return (
    <div
      className="flex-1 min-w-0 flex flex-col rounded-2xl p-4 transition-all duration-200"
      style={{
        background: isOver
          ? "rgba(126,227,255,0.04)"
          : "rgba(255,255,255,0.02)",
        border: isOver
          ? "1px solid rgba(126,227,255,0.2)"
          : "1px solid rgba(255,255,255,0.05)",
        minHeight: "400px",
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background: dotColor,
              boxShadow: `0 0 8px ${dotColor}60`,
            }}
          />
          <span className="text-white font-semibold text-sm">{label}</span>
        </div>
        <span
          className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "#7f7f7f",
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Tasks list */}
      <div className="flex-1 overflow-y-auto pr-0.5" style={{ scrollbarWidth: "none" }}>
        {tasks.length === 0 ? (
          <div
            className="flex items-center justify-center h-24 rounded-xl"
            style={{
              border: "1px dashed rgba(255,255,255,0.1)",
              color: "#7f7f7f",
              fontSize: "12px",
            }}
          >
            Drop tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDragStart={handleDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;