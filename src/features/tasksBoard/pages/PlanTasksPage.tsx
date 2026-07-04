import React, { useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetAllTasksQuery } from "../redux/tasksSlice";
import { useGetAllPlansQuery } from "../redux/plansSlice";
import type { Task, TaskStatus } from "../types";
import PlanSidebar from "../components/SideBar/PlanSidebar";
import TaskCard from "../components/Board/TaskCard";
import PlanCommentsPanel from "../components/PlanBoard/PlanCommentsPanel";
import PlanTaskDetailPanel from "../components/PlanBoard/PlanTaskDetailPanel";
import CommentIcon from "@/assets/images/comments-line_svgrepo.com.png";

const COLUMNS: { status: TaskStatus; label: string; dotColor: string }[] = [
  { status: "overdue", label: "Overdue", dotColor: "#df5d5d" },
  { status: "todo", label: "To-Do", dotColor: "#7ee3ff" },
  { status: "review", label: "Review/Done", dotColor: "#64b883" },
];

const transformApiTask = (apiTask: any, planName: string): Task => {
  const now = new Date();
  const deadlineStr = apiTask.deadLine || apiTask.deadline || apiTask.dueDate;
  const startStr = apiTask.startDate || apiTask.start;
  const deadline = new Date(deadlineStr);
  const isOverdue = deadlineStr && deadline < now && apiTask.status !== "completed";

  let status: TaskStatus = "todo";
  if (apiTask.status === "completed") {
    status = "review";
  } else if (isOverdue) {
    status = "overdue";
  } else if (apiTask.status === "active" || apiTask.status === "to_do") {
    status = "todo";
  }

  const priorityRaw = String(apiTask.priority || "Medium").toUpperCase();
  const priority =
    priorityRaw === "HIGH" || priorityRaw === "LOW"
      ? (priorityRaw as Task["priority"])
      : "MEDIUM";

  return {
    id: apiTask.questId,
    title: apiTask.title,
    description: apiTask.description || "",
    project: planName,
    status,
    priority,
    startDate: startStr,
    dueDate: deadlineStr,
    dueDateDisplay: deadlineStr
      ? new Date(deadlineStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "—",
    boardType: "plans" as const,
    completed: apiTask.status === "completed",
    isLate: isOverdue || undefined,
    lateDisplay: isOverdue ? "Overdue" : undefined,
    assignees:
      apiTask.userAssignedQuests?.map((userId: string) => ({
        id: userId,
        name: `User ${userId}`,
        role: "Member",
      })) || [],
    comments: [],
  };
};

const CalendarStats: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const overdue = tasks.filter((t) => t.status === "overdue").length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const cards = [
    { label: "Total Tasks", value: total, sub: "This plan", accent: "#eeeeee" },
    { label: "Completed", value: completed, sub: `${pct}% done`, accent: "#64b883" },
    { label: "Overdue", value: overdue, sub: "Need attention", accent: "#df5d5d" },
    { label: "To-Do", value: todo, sub: "Active now", accent: "#7ee3ff" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl p-4"
          style={{ background: "#141A2B", border: "1px solid #7EE3FF40" }}
        >
          <p className="text-xl font-semibold mb-1" style={{ color: c.accent, fontFamily: "sans-serif" }}>
            {c.label}
          </p>
          <p className="text-2xl font-bold text-white leading-none mb-1">{c.value}</p>
          <p className="text-[14px]" style={{ color: "#7f7f7f" }}>{c.sub}</p>
        </div>
      ))}
    </div>
  );
};

const PlanTasksPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("planId") || "";
  const planNameFromUrl = searchParams.get("planName") || "";

  const { data: tasksData, isLoading } = useGetAllTasksQuery(planId, {
    skip: !planId || planId === "",
  });
  const { data: allPlans } = useGetAllPlansQuery();

  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskOverrides, setTaskOverrides] = useState<Record<string, TaskStatus>>({});

  const resolvedPlanName = useMemo(() => {
    if (planNameFromUrl) return planNameFromUrl;
    const plan = (allPlans || []).find(
      (p: { id: string; goal: string; description: string | null }) => p.id === planId,
    );
    return plan?.goal || plan?.description || "Plan";
  }, [planNameFromUrl, allPlans, planId]);

  const tasks = useMemo(() => {
    const base = (tasksData || []).map((t: any) => transformApiTask(t, resolvedPlanName));
    return base.map((t: Task) => {
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
  }, [tasksData, resolvedPlanName, taskOverrides]);

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, status: TaskStatus) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData("taskId");
      setDragOverColumn(null);
      if (!taskId) return;
      setTaskOverrides((prev) => ({ ...prev, [taskId]: status }));
    },
    [],
  );

  if (isLoading) {
    return (
      <>
        <PlanSidebar />
        <div
          className="flex items-center justify-center min-h-[60vh]"
          style={{ paddingLeft: "80px" }}
        >
          <div
            className="w-10 h-10 rounded-full border-2 animate-spin"
            style={{ borderColor: "#7ee3ff", borderTopColor: "transparent" }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PlanSidebar />

      <div
        className="flex flex-col py-6 md:px-8 overflow-x-hidden"
        style={{ paddingLeft: "80px" }}
      >
        {/* ===== HEADER ===== */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-white text-2xl font-bold" style={{ fontFamily: "sans-serif" }}>
              {resolvedPlanName}
            </h1>
          </div>

          {/* Comments icon */}
          <button
            onClick={() => setCommentsOpen((v) => !v)}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
            style={{
              background: commentsOpen
                ? "rgba(126,227,255,0.12)"
                : "rgba(255,255,255,0.04)",
              border: commentsOpen
                ? "1px solid rgba(126,227,255,0.25)"
                : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <img
              src={CommentIcon}
              alt="Comments"
              className="w-[18px] h-[18px]"
              style={{
                filter: commentsOpen
                  ? "brightness(0) saturate(100%) invert(71%) sepia(38%) saturate(2759%) hue-rotate(157deg) brightness(101%) contrast(91%)"
                  : "none",
                opacity: commentsOpen ? 1 : 0.6,
              }}
            />
          </button>
        </div>

        {/* ===== STATS ===== */}
        <CalendarStats tasks={tasks} />

        {/* ===== KANBAN ===== */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-4 h-full min-w-max">
            {COLUMNS.map((col) => {
              const colTasks = tasks.filter((t: Task) => t.status === col.status);
              const isOver = dragOverColumn === col.status;

              return (
                <div
                  key={col.status}
                  className="flex flex-col rounded-2xl p-4 transition-all duration-200"
                  style={{
                    flex: "1 1 0",
                    minWidth: "280px",
                    maxWidth: "420px",
                    background: isOver
                      ? "rgba(126,227,255,0.04)"
                      : "rgba(255,255,255,0.02)",
                    border: isOver
                      ? "1px solid rgba(126,227,255,0.2)"
                      : "1px solid rgba(255,255,255,0.05)",
                    minHeight: "400px",
                  }}
                  onDragOver={(e) => handleDragOver(e, col.status)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col.status)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: col.dotColor,
                          boxShadow: `0 0 8px ${col.dotColor}60`,
                        }}
                      />
                      <span className="text-white font-semibold text-sm">{col.label}</span>
                    </div>
                    <span
                      className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.08)", color: "#7f7f7f" }}
                    >
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="bg-[#0F1E35] mb-[10px] p-[2px] rounded-lg w-full" />

                  <div className="flex-1 overflow-y-auto pr-0.5" style={{ scrollbarWidth: "none" }}>
                    {colTasks.length === 0 ? (
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
                      colTasks.map((task: Task) => (
                        <div key={task.id} onClick={() => setSelectedTask(task)}>
                          <TaskCard task={task} onDragStart={handleDragStart} />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Task detail panel */}
      {selectedTask && (
        <PlanTaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {/* Plan comments panel — slide in from right */}
      <PlanCommentsPanel
        planId={planId}
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
      />
    </>
  );
};

export default PlanTasksPage;
