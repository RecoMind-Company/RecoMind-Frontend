import React, { useMemo, useState, useCallback, useEffect } from "react";
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
import { useGetAllPlansQuery } from "../../redux/plansSlice";

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

const transformApiTask = (
  apiTask: any,
  boardType: BoardType,
  planName?: string,
  planNameMap?: Record<string, string>,
): Task => {
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

  const priorityRaw = String(apiTask.priority || "Medium").toUpperCase();
  const priority =
    priorityRaw === "HIGH" || priorityRaw === "LOW"
      ? (priorityRaw as Task["priority"])
      : "MEDIUM";

  return {
    id: apiTask.questId,
    title: apiTask.title,
    description: apiTask.description || "",
    project: planName || (apiTask.planId && planNameMap?.[apiTask.planId]) || "Plan",
    status,
    priority,
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
  const planName = searchParams.get("planName") || "";
  const [taskOverrides, setTaskOverrides] = useState<Record<string, TaskStatus>>(() => {
    try {
      const stored = localStorage.getItem("taskOverrides:board");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("taskOverrides:board", JSON.stringify(taskOverrides));
    } catch {
      // ignore
    }
  }, [taskOverrides]);
  const { data: plansData } = useGetAllTasksQuery(planId, { skip: !planId || planId === "" });
  const { data: personalData } = useGetAllTasksPersonalQuery("");
  const { data: allPlans } = useGetAllPlansQuery();

  const handleDrop = useCallback((taskId: string, status: TaskStatus) => {
    setTaskOverrides((prev) => ({ ...prev, [taskId]: status }));
  }, []);

  const planNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    (allPlans || []).forEach((p) => {
      map[p.id] = p.goal || p.description || "Plan";
    });
    return map;
  }, [allPlans]);

  const columns = activeBoard === "plans" ? PLANS_COLUMNS : PERSONAL_COLUMNS;

  const transformedTasks = useMemo(() => {
    const plansTasks = (plansData || []).map((task: any) =>
      transformApiTask(task, "plans", planName, planNameMap),
    );
    const personalTasks = (personalData || []).map((task: any) =>
      transformApiTask(task, "personal", "", planNameMap),
    );
    const all = [...plansTasks, ...personalTasks];
    return all.map((t: Task) => {
      const override = taskOverrides[t.id];
      if (override) {
        return {
          ...t,
          status: override,
          completed: override === "review" || override === "done",
        };
      }
      return t;
    });
  }, [plansData, personalData, planName, planNameMap, taskOverrides]);

  const boardTasks = useMemo(
    () =>
      transformedTasks.filter((task: Task) => {
        if (task.boardType !== activeBoard) return false;
        if (activeBoard === "plans" && planId) {
          return true;
        }
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
    [transformedTasks, activeBoard, selectedDate, planId],
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
            onDropOverride={handleDrop}
          />
        ))}
      </div>
    </div>
  );
};

export default BoardView;
