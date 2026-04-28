import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import type { TaskStatus } from "../../types";
import KanbanColumn from "./KanbanColumn";

const PLANS_COLUMNS: { status: TaskStatus; label: string; dotColor: string }[] =
  [
    { status: "overdue", label: "Overdue", dotColor: "#df5d5d" },
    { status: "todo", label: "To-Do", dotColor: "#7ee3ff" },
    { status: "review", label: "Review/Done", dotColor: "#64b883" },
  ];

const PERSONAL_COLUMNS: {
  status: TaskStatus;
  label: string;
  dotColor: string;
}[] = [
  { status: "overdue", label: "Overdue", dotColor: "#df5d5d" },
  { status: "todo", label: "To-Do", dotColor: "#7ee3ff" },
  { status: "done", label: "Done", dotColor: "#64b883" },
];

const BoardView: React.FC = () => {
  const { tasks, activeBoard, selectedDate } = useSelector(
    (s: RootState) => s.tasks,
  );

  const columns = activeBoard === "plans" ? PLANS_COLUMNS : PERSONAL_COLUMNS;

  // Filter: same boardType AND same calendar date as selectedDate
  const boardTasks = tasks.filter((t) => {
    if (t.boardType !== activeBoard) return false;
    // Compare only the date part (YYYY-MM-DD)
    const taskDate = new Date(t.dueDate).toISOString().split("T")[0];
    return taskDate === selectedDate;
  });

  return (
    <div
      className="flex gap-4 flex-1 overflow-x-auto pb-4"
      style={{ minHeight: 0 }}
    >
      {columns.map((col) => (
        <KanbanColumn
          key={col.status}
          status={col.status}
          label={col.label}
          dotColor={col.dotColor}
          tasks={boardTasks.filter((t) => t.status === col.status)}
        />
      ))}
    </div>
  );
};

export default BoardView;
