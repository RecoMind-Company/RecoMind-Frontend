import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import type { Task } from "../../types";
import {
  setCalendarSelectedDate,
  setCalendarMonth,
  setViewMode,
} from "../../redux/tasksSlice";

// ===============================================================
// HELPERS
// ===============================================================

/** Get "YYYY-MM-DD" from a Date object */
const toISO = (d: Date) => d.toISOString().split("T")[0] ?? d.toISOString();

/** Parse "YYYY-MM" → { year, month (0-based) } */
const parseMonth = (m: string) => {
  const parts = m.split("-");
  const year = Number(parts[0]) || new Date().getFullYear();
  const monthRaw = Number(parts[1]);
  const month = Number.isFinite(monthRaw)
    ? monthRaw - 1
    : new Date().getMonth();
  return { year, month };
};

/** Get all tasks whose dueDate falls on a given ISO date */
const getTasksForDate = (tasks: Task[], iso: string) =>
  tasks.filter((t) => toISO(new Date(t.dueDate)) === iso);

const todayISO = toISO(new Date());

// Status-based pill colours
const statusColor = (t: Task) => {
  if (t.status === "overdue")
    return {
      bg: "rgba(223,93,93,0.25)",
      text: "#df5d5d",
      border: "rgba(223,93,93,0.4)",
    };
  if (t.status === "review" || t.completed)
    return {
      bg: "rgba(100,184,131,0.2)",
      text: "#64b883",
      border: "rgba(100,184,131,0.35)",
    };
  return {
    bg: "rgba(126,227,255,0.12)",
    text: "#7ee3ff",
    border: "rgba(126,227,255,0.25)",
  };
};

// ===============================================================
// SUB-COMPONENTS
// ===============================================================

// ---- Stats cards row ----
const StatsRow: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const overdue = tasks.filter((t) => t.status === "overdue").length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const cards = [
    {
      label: "Total Tasks",
      value: total,
      sub: "This month",
      accent: "#eeeeee",
    },
    {
      label: "Completed",
      value: completed,
      sub: `${pct}% done`,
      accent: "#64b883",
    },
    {
      label: "Overdue",
      value: overdue,
      sub: "Need attention",
      accent: "#df5d5d",
    },
    { label: "To-Do", value: todo, sub: "Active now", accent: "#7ee3ff" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl p-4"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: c.accent }}>
            {c.label}
          </p>
          <p className="text-2xl font-bold text-white leading-none mb-1">
            {c.value}
          </p>
          <p className="text-[11px]" style={{ color: "#7f7f7f" }}>
            {c.sub}
          </p>
        </div>
      ))}
    </div>
  );
};

// ---- Selected day tasks panel ----
const DayTasksPanel: React.FC<{ date: string | null; tasks: Task[] }> = ({
  date,
  tasks,
}) => {
  if (!date) return null;

  const dayTasks = getTasksForDate(tasks, date);
  const label = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="rounded-2xl mb-5 overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="text-white font-semibold text-sm">
          {label} – Tasks
        </span>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{
            background:
              dayTasks.length > 0
                ? "rgba(126,227,255,0.12)"
                : "rgba(255,255,255,0.06)",
            color: dayTasks.length > 0 ? "#7ee3ff" : "#7f7f7f",
            border:
              dayTasks.length > 0 ? "1px solid rgba(126,227,255,0.2)" : "none",
          }}
        >
          {dayTasks.length} {dayTasks.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      {/* Tasks */}
      <div className="p-4 space-y-2">
        {dayTasks.length === 0 ? (
          <p className="text-[#7f7f7f] text-sm py-4 text-center">
            No tasks for this day
          </p>
        ) : (
          dayTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderLeft: `3px solid ${statusColor(task).text}`,
              }}
            >
              <span
                className="flex-1 text-sm font-medium"
                style={{
                  color: task.completed ? "#7f7f7f" : "#eeeeee",
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              >
                {task.title}
              </span>

              {/* Personal badge */}
              {task.boardType === "personal" && (
                <span
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0"
                  style={{
                    background: "rgba(126,227,255,0.08)",
                    color: "#7ee3ff",
                    border: "1px solid rgba(126,227,255,0.2)",
                  }}
                >
                  Personal
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ---- Single calendar day cell ----
const DayCell: React.FC<{
  date: Date | null; // null = padding cell
  isCurrentMonth: boolean;
  tasks: Task[];
  isToday: boolean;
  isSelected: boolean;
  onClick: () => void;
}> = ({ date, isCurrentMonth, tasks, isToday, isSelected, onClick }) => {
  if (!date) {
    return <div className="rounded-xl" style={{ minHeight: "80px" }} />;
  }

  const MAX_PILLS = 2;
  const shown = tasks.slice(0, MAX_PILLS);
  const hidden = tasks.length - MAX_PILLS;

  return (
    <button
      onClick={onClick}
      className="rounded-xl p-2 text-left transition-all duration-150 w-full"
      style={{
        minHeight: "80px",
        background: isSelected
          ? "rgba(126,227,255,0.06)"
          : isToday
            ? "rgba(126,227,255,0.04)"
            : "rgba(255,255,255,0.025)",
        border: isSelected
          ? "1.5px solid rgba(126,227,255,0.4)"
          : isToday
            ? "1.5px solid rgba(126,227,255,0.2)"
            : "1px solid rgba(255,255,255,0.06)",
        cursor: "pointer",
      }}
    >
      {/* Day number + Today label */}
      <div className="flex items-center gap-1 mb-1.5">
        {isToday && (
          <span
            className="text-[9px] font-semibold"
            style={{ color: "#7ee3ff" }}
          >
            Today
          </span>
        )}
        <span
          className="text-xs font-semibold ml-auto"
          style={{
            color: isCurrentMonth
              ? isSelected
                ? "#7ee3ff"
                : "#eeeeee"
              : "#7f7f7f4a",
          }}
        >
          {date.getDate()}
        </span>
      </div>

      {/* Task pills */}
      <div className="space-y-1">
        {shown.map((t) => {
          const c = statusColor(t);
          return (
            <div
              key={t.id}
              className="rounded px-1.5 py-0.5 text-[9px] font-medium truncate leading-tight"
              style={{
                background: c.bg,
                color: c.text,
                border: `1px solid ${c.border}`,
              }}
            >
              {t.completed && "✓ "}
              {t.title}
            </div>
          );
        })}
        {hidden > 0 && (
          <div className="text-[8px] pl-1" style={{ color: "#7f7f7f" }}>
            +{hidden} more
          </div>
        )}
      </div>
    </button>
  );
};

// ===============================================================
// MAIN COMPONENT
// ===============================================================
const CalendarView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, calendarSelectedDate, calendarMonth } = useSelector(
    (s: RootState) => s.tasks,
  );

  const { year, month } = useMemo(
    () => parseMonth(calendarMonth),
    [calendarMonth],
  );

  // All days in the grid (including padding from prev/next month)
  const gridDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: { date: Date | null; isCurrentMonth: boolean }[] = [];

    // Prev month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(year, month, d), isCurrentMonth: true });
    }
    // Next month padding to fill 6 rows × 7 cols = 42
    while (cells.length < 42) {
      cells.push({
        date: new Date(
          year,
          month + 1,
          cells.length - daysInMonth - firstDay + 1,
        ),
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [year, month]);

  // Month stats = all tasks in this calendar month
  const monthTasks = useMemo(() => {
    return tasks.filter((t) => {
      const d = new Date(t.dueDate);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [tasks, year, month]);

  const goToPrevMonth = () => {
    const d = new Date(year, month - 1, 1);
    dispatch(
      setCalendarMonth(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      ),
    );
    dispatch(setCalendarSelectedDate(null));
  };

  const goToNextMonth = () => {
    const d = new Date(year, month + 1, 1);
    dispatch(
      setCalendarMonth(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      ),
    );
    dispatch(setCalendarSelectedDate(null));
  };

  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const DAY_HEADERS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div
      className="flex flex-col px-4 py-6 md:px-8 pb-10"
      style={{ maxWidth: "900px", margin: "0 auto" }}
    >
      {/* ===== TOP BAR ===== */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-white text-2xl font-bold">My Tasks</h1>

        {/* Board / Calendar toggle */}
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
                  mode === "calendar" ? "rgba(126,227,255,0.1)" : "transparent",
                color: mode === "calendar" ? "#7ee3ff" : "#7f7f7f",
                border:
                  mode === "calendar"
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

      {/* ===== MONTH NAV ===== */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPrevMonth}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <ChevronLeft size={16} color="#7f7f7f" />
        </button>

        <h2 className="text-white text-lg font-bold">{monthLabel}</h2>

        <button
          onClick={goToNextMonth}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <ChevronRight size={16} color="#7f7f7f" />
        </button>
      </div>

      {/* ===== STATS ROW ===== */}
      <StatsRow tasks={monthTasks} />

      {/* ===== SELECTED DAY PANEL ===== */}
      {calendarSelectedDate && (
        <DayTasksPanel date={calendarSelectedDate} tasks={tasks} />
      )}

      {/* ===== CALENDAR GRID ===== */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Day-of-week headers */}
        <div
          className="grid grid-cols-7 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          {DAY_HEADERS.map((h) => (
            <div
              key={h}
              className="py-3 text-center text-[10px] font-semibold tracking-wider"
              style={{ color: "#7f7f7f" }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {Array.from({ length: 6 }, (_, rowIdx) => (
          <div
            key={rowIdx}
            className="grid grid-cols-7 gap-px"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            {gridDays.slice(rowIdx * 7, rowIdx * 7 + 7).map((cell, colIdx) => {
              const isoDate = cell.date ? toISO(cell.date) : "";
              const dayTasks = cell.date ? getTasksForDate(tasks, isoDate) : [];
              const isToday = isoDate === todayISO;
              const isSelected = isoDate === calendarSelectedDate;

              return (
                <div
                  key={colIdx}
                  className="p-1"
                  style={{ background: "rgba(6,11,27,0.6)" }}
                >
                  <DayCell
                    date={cell.date}
                    isCurrentMonth={cell.isCurrentMonth}
                    tasks={dayTasks}
                    isToday={isToday}
                    isSelected={isSelected}
                    onClick={() => {
                      if (!cell.date) return;
                      if (isSelected) {
                        dispatch(setCalendarSelectedDate(null));
                      } else {
                        dispatch(setCalendarSelectedDate(isoDate));
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
