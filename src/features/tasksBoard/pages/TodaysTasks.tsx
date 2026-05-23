import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LayoutGrid, Calendar, Target, User, Plus } from "lucide-react";
import type { AppDispatch, RootState } from "@/app/store";
import {
  fetchTasks,
  setActiveBoard,
  setViewMode,
  openAddTaskModal,
} from "../redux/tasksSlice";
import type { BoardType } from "../types";
import DateNavigator from "../components/Board/DateNavigator";
import BoardView from "../components/Board/BoardView";
import CalendarView from "../components/Calendar/CalendarView";
import AddTaskModal from "../components/Modals/AddTaskModal";
import TaskDetailModal from "../components/Modals/TaskDetailModal";
import PlanSidebar from "../components/SideBar/PlanSidebar";

const TodaysTasks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    activeBoard,
    viewMode,
    showAddTaskModal,
    showTaskModal,
    selectedDate,
    loading,
  } = useSelector((s: RootState) => s.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{
            borderColor: "#7ee3ff",
            borderTopColor: "transparent",
          }}
        />
      </div>
    );
  }

  if (viewMode === "calendar") {
    return (
      <>
        <PlanSidebar />

        <div style={{ paddingLeft: "80px" }}>
          <CalendarView />
        </div>

        {showTaskModal && <TaskDetailModal />}
      </>
    );
  }

  return (
    <>
      <PlanSidebar />

      <div
        className="flex flex-col min-h-dvh py-6 md:px-8 overflow-x-hidden"
        style={{ paddingLeft: "80px" }}
      >
        {/* ===== PAGE HEADER ===== */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-white text-2xl font-bold">Today's Tasks</h1>

            <p className="text-[#7f7f7f] text-sm mt-0.5">
              {new Date(selectedDate + "T12:00:00").toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  year: "numeric",
                },
              )}
            </p>
          </div>

          {/* ===== VIEW MODE ===== */}
          <div
            className="flex items-center rounded-xl p-1 gap-1"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {[
              {
                mode: "board" as const,
                icon: <LayoutGrid size={13} />,
                label: "Board",
              },
              {
                mode: "calendar" as const,
                icon: <Calendar size={13} />,
                label: "Calendar",
              },
            ].map(({ mode, icon, label }) => (
              <button
                key={mode}
                onClick={() => dispatch(setViewMode(mode))}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                style={{
                  background:
                    viewMode === mode ? "rgba(126,227,255,0.1)" : "transparent",

                  color: viewMode === mode ? "#7ee3ff" : "#7f7f7f",

                  border:
                    viewMode === mode
                      ? "1px solid rgba(126,227,255,0.2)"
                      : "1px solid transparent",
                }}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== DATE STRIP ===== */}
        <DateNavigator />

        {/* ===== BOARD TABS ===== */}
        <div
          className="flex items-center justify-between mb-5"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex items-center justify-around w-full">
            {/* Plans Board */}
            <button
              onClick={() => dispatch(setActiveBoard("plans" as BoardType))}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all duration-200 relative"
              style={{
                color: activeBoard === "plans" ? "#7ee3ff" : "#7f7f7f",
              }}
            >
              <Target size={13} />
              Plans Board
              {activeBoard === "plans" && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: "#7ee3ff" }}
                />
              )}
            </button>

            {/* Personal Board + Add Task */}
            <div className="flex items-center gap-2 relative">
              <button
                onClick={() =>
                  dispatch(setActiveBoard("personal" as BoardType))
                }
                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all duration-200 relative"
                style={{
                  color: activeBoard === "personal" ? "#7ee3ff" : "#7f7f7f",
                }}
              >
                <User size={13} />
                Personal Board
                {activeBoard === "personal" && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: "#7ee3ff" }}
                  />
                )}
              </button>

              {activeBoard === "personal" && (
                <button
                  onClick={() => dispatch(openAddTaskModal())}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(135deg, #7ee3ff 0%, #4fb8d8 100%)",

                    color: "#060b1b",
                  }}
                >
                  <Plus size={14} />

                  <span className="hidden md:block">Add Task</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ===== KANBAN ===== */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex h-full min-w-max">
            <BoardView />
          </div>
        </div>

        {/* ===== MODALS ===== */}
        {showAddTaskModal && <AddTaskModal />}
        {showTaskModal && <TaskDetailModal />}
      </div>
    </>
  );
};

export default TodaysTasks;
