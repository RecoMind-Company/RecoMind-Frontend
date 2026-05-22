import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import type { TaskStatus, Task } from "../../types";
import KanbanColumn from "./KanbanColumn";
import { useGetAllTasksQuery } from "../../redux/tasksSlice";

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
  const { activeBoard, selectedDate } = useSelector(
    (s: RootState) => s.tasks,
  );
  const { data: apiTasks, isLoading } = useGetAllTasksQuery("");

  const columns = activeBoard === "plans" ? PLANS_COLUMNS : PERSONAL_COLUMNS;

  const transformedTasks = (apiTasks || []).map((apiTask: any) => {
    const now = new Date();
    const deadline = new Date(apiTask.deadLine);
    const isOverdue = deadline < now && apiTask.status !== "completed";

    let status: TaskStatus = "todo";
    if (apiTask.status === "completed") {
      status = activeBoard === "plans" ? "review" : "done";
    } else if (isOverdue) {
      status = "overdue";
    } else if (apiTask.status === "active") {
      status = "todo";
    }

    return {
      id: apiTask.questId,
      title: apiTask.title,
      description: apiTask.description || "",
      project: "Project",
      status,
      priority: "MEDIUM" as const,
      dueDate: apiTask.deadLine,
      dueDateDisplay: new Date(apiTask.deadLine).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      boardType: activeBoard,
      completed: apiTask.status === "completed",
      isLate: isOverdue,
      lateDisplay: isOverdue ? "Overdue" : undefined,
      assignees: apiTask.userAssignedQuests?.map((userId: string) => ({ id: userId, name: `User ${userId}`, role: "Member" })) || [],
      comments: [],
    } as Task;
  });

  const boardTasks = transformedTasks.filter((t: Task) => {
    if (t.boardType !== activeBoard) return false;
    return true;
  });

  if (isLoading) return <div className="text-white p-4">Loading tasks...</div>;
  console.log(apiTasks);

  return (
    <div
      className="flex gap-4 w-full overflow-x-auto pb-4"
      style={{ minHeight: 0 }}
    >
      {columns.map((col) => (
        <KanbanColumn
          key={col.status}
          status={col.status}
          label={col.label}
          dotColor={col.dotColor}
          tasks={boardTasks.filter((t: Task) => t.status === col.status)}
        />
      ))}
    </div>
  );
};

export default BoardView;