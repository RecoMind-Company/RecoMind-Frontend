import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { setSelectedDate } from "../../redux/tasksSlice";

const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const DateNavigator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedDate = useSelector((s: RootState) => s.tasks.selectedDate);

  const selected = useMemo(() => new Date(selectedDate), [selectedDate]);

  // Get the start of the week (Monday-based)
  const weekStart = useMemo(() => {
    const d = new Date(selected);
    const day = d.getDay(); // 0=Sun
    const diff = (day === 0 ? -6 : 1) - day; // Monday = 0
    d.setDate(d.getDate() + diff);
    return d;
  }, [selected]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const today = new Date().toISOString().split("T")[0]!;

  const handlePrev = () => {
    const d = new Date(selected);
    d.setDate(d.getDate() - 7);
    dispatch(setSelectedDate(d.toISOString().split("T")[0]!));
  };

  const handleNext = () => {
    const d = new Date(selected);
    d.setDate(d.getDate() + 7);
    dispatch(setSelectedDate(d.toISOString().split("T")[0]!));
  };

  const monthYear = selected.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="mb-5">

      {/* Week strip */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={handlePrev}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <ChevronLeft size={14} color="#7f7f7f" />
        </button>

        <div className="flex flex-1 gap-1.5 justify-center">
          {weekDays.map((day) => {
            const iso = day.toISOString().split("T")[0]!;
            const isToday = iso === today;
            const isSelected = iso === selectedDate;
            const dayName = DAY_LABELS[day.getDay()];
            const dayNum = day.getDate();

            return (
              <button
                key={iso}
                onClick={() => dispatch(setSelectedDate(iso))}
                className="flex flex-col items-center justify-center rounded-xl transition-all duration-200 hover:bg-white/[0.06]"
                style={{
                  minWidth: "44px",
                  padding: "8px 6px",
                  background: isSelected
                    ? "rgba(126,227,255,0.08)"
                    : isToday
                    ? "rgba(255,255,255,0.05)"
                    : "transparent",
                  border: isSelected
                    ? "1.5px solid rgba(126,227,255,0.5)"
                    : isToday
                    ? "1px solid rgba(255,255,255,0.12)"
                    : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span
                  className="text-[9px] font-semibold mb-1"
                  style={{ color: isSelected ? "#7ee3ff" : "#7f7f7f" }}
                >
                  {isToday ? "TODAY" : dayName}
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: isSelected ? "#7ee3ff" : "#eeeeee" }}
                >
                  {dayNum}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <ChevronRight size={14} color="#7f7f7f" />
        </button>
      </div>
    </div>
  );
};

export default DateNavigator;