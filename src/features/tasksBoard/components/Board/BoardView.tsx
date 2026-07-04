import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import type { RootState } from "@/app/store";
import type { BoardType, TaskStatus, Task } from "../../types";
import KanbanColumn from "./KanbanColumn";
import { toLocalISODate } from "../../utils/dateUtils";
import {
  useGetAllTasksQuery,
  useGetAllTasksPersonalQuery,
} from "../../redux/tasksSlice";

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

const transformApiTask = (apiTask: any, boardType: BoardType): Task => {
  const now = new Date();
  const deadlineStr = apiTask.deadLine || apiTask.deadline || apiTask.dueDate;
  const startStr = apiTask.startDate || apiTask.start;
  const deadline = new Date(deadlineStr);
  const isOverdue = deadlineStr && deadline < now && apiTask.status !== "completed";

  let status: TaskStatus = "todo";
  if (apiTask.status === "completed") {
    status = boardType === "plans" ? "review" : "done";
  } else if (isOverdue) {
    status = "overdue";
  } else if (apiTask.status === "active" || apiTask.status === "to_do") {
    status = "todo";
  }

  const lateTaskFields = isOverdue
    ? { isLate: true as const, lateDisplay: "Overdue" }
    : { isLate: false as const, lateDisplay: undefined };

  return {
    id: apiTask.questId,
    title: apiTask.title,
    description: apiTask.description || "",
    project: "Project",
    status,
    priority: "MEDIUM" as const,
    startDate: startStr,
    dueDate: deadlineStr,
    dueDateDisplay: deadlineStr
      ? new Date(deadlineStr).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "—",
    boardType,
    completed: apiTask.status === "completed",
    ...lateTaskFields,
    assignees:
      apiTask.userAssignedQuests?.map((userId: string) => ({
        id: userId,
        name: `User ${userId}`,
        role: "Member",
      })) || [],
    comments: [],
  };
};

const BoardView: React.FC = () => {
  const { activeBoard, selectedDate } = useSelector((s: RootState) => s.tasks);
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("planId") || "";
  const { data: plansData } = useGetAllTasksQuery(planId, { skip: !planId });
  const { data: personalData } = useGetAllTasksPersonalQuery("");

  const columns = activeBoard === "plans" ? PLANS_COLUMNS : PERSONAL_COLUMNS;

  const transformedTasks = useMemo(() => {
    const plansTasks = (plansData || []).map((task: any) =>
      transformApiTask(task, "plans"),
    );
    const personalTasks = (personalData || []).map((task: any) =>
      transformApiTask(task, "personal"),
    );
    return [...plansTasks, ...personalTasks];
  }, [plansData, personalData]);

  const boardTasks = useMemo(
    () =>
      transformedTasks.filter((task: Task) => {
        if (task.boardType !== activeBoard) return false;
        const taskStartISO = task.startDate
          ? toLocalISODate(new Date(task.startDate))
          : null;
        const taskDueISO = task.dueDate
          ? toLocalISODate(new Date(task.dueDate))
          : null;
        const matchesStart = taskStartISO && taskStartISO === selectedDate;
        const matchesDue = taskDueISO && taskDueISO === selectedDate;
        return Boolean(matchesStart || matchesDue);
      }),
    [transformedTasks, activeBoard, selectedDate],
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      <div
        className=" hidden items-center justify-between rounded-2xl px-4 py-3"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#7f7f7f]">
            Active Board
          </p>
          <h2 className="text-white text-lg font-semibold">
            {activeBoard === "plans" ? "Plans Board" : "Personal Board"}
          </h2>
        </div>
        <span
          className="text-[11px] font-semibold px-3 py-1 rounded-full"
          style={{
            background: "rgba(126,227,255,0.08)",
            color: "#7ee3ff",
            border: "1px solid rgba(126,227,255,0.18)",
          }}
        >
          {boardTasks.length} tasks
        </span>
      </div>

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
    </div>
  );
};

export default BoardView;
