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
import type { BoardType, ViewMode } from "../types";
import DateNavigator from "../components/Board/DateNavigator";
import BoardView from "../components/Board/BoardView";
import AddTaskModal from "../components/Modals/AddTaskModal";
import TaskDetailModal from "../components/Modals/TaskDetailModal";

const TodaysTasks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    activeBoard,
    viewMode,
    showAddTaskModal,
    showTaskModal,
    loading,
  } = useSelector((s: RootState) => s.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const selectedMonth = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: "#7ee3ff", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen px-4 py-6 md:px-8"
      style={{ maxWidth: "1100px", margin: "0 auto" }}
    >
      {/* ===== PAGE HEADER ===== */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold">Today's Tasks</h1>
          <p className="text-[#7f7f7f] text-sm mt-0.5">{selectedMonth}</p>
        </div>

        {/* Board / Calendar toggle */}
        <div
          className="flex items-center rounded-xl p-1 gap-1"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {([
            { mode: "board" as ViewMode, icon: <LayoutGrid size={13} />, label: "Board" },
            { mode: "calendar" as ViewMode, icon: <Calendar size={13} />, label: "Calendar" },
          ] as const).map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => dispatch(setViewMode(mode))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
              style={{
                background: viewMode === mode ? "rgba(126,227,255,0.1)" : "transparent",
                color: viewMode === mode ? "#7ee3ff" : "#7f7f7f",
                border: viewMode === mode ? "1px solid rgba(126,227,255,0.2)" : "1px solid transparent",
              }}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== DATE NAVIGATOR ===== */}
      <DateNavigator />

      {/* ===== BOARD TABS ===== */}
      <div
        className="flex items-center justify-between mb-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-0">
          {([
            { board: "plans" as BoardType, icon: <Target size={13} />, label: "Plans Board" },
            { board: "personal" as BoardType, icon: <User size={13} />, label: "Personal Board" },
          ] as const).map(({ board, icon, label }) => (
            <button
              key={board}
              onClick={() => dispatch(setActiveBoard(board))}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all duration-200 relative"
              style={{ color: activeBoard === board ? "#7ee3ff" : "#7f7f7f" }}
            >
              {icon}
              {label}
              {/* Active underline */}
              {activeBoard === board && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: "#7ee3ff" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Add Task button - only on Personal Board */}
        {activeBoard === "personal" && (
          <button
            onClick={() => dispatch(openAddTaskModal())}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #7ee3ff 0%, #4fb8d8 100%)",
              color: "#060b1b",
            }}
          >
            <Plus size={14} />
            Add Task
          </button>
        )}
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1">
        {viewMode === "board" ? (
          <BoardView />
        ) : (
          // Calendar placeholder - implement as needed
          <div
            className="flex items-center justify-center h-64 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(255,255,255,0.08)",
              color: "#7f7f7f",
              fontSize: "14px",
            }}
          >
            Calendar View — Coming Soon
          </div>
        )}
      </div>

      {/* ===== MODALS ===== */}
      {showAddTaskModal && <AddTaskModal />}
      {showTaskModal && <TaskDetailModal />}
    </div>
  );
};

export default TodaysTasks;