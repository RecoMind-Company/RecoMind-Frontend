import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import {
  setCalendarMonth,
  setCalendarSelectedDate,
  setSelectedDate,
} from "../../redux/tasksSlice";
import { toLocalISODate } from "../../utils/dateUtils";

const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const DateNavigator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedDate = useSelector((s: RootState) => s.tasks.selectedDate);

  const selected = useMemo(() => new Date(selectedDate), [selectedDate]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(selected);
      d.setDate(selected.getDate() + i - 3);
      return d;
    });
  }, [selected]);

  const today = toLocalISODate(new Date());

  const handlePrev = () => {
    const d = new Date(selected);
    d.setDate(d.getDate() - 7);
    const iso = toLocalISODate(d);
    dispatch(setSelectedDate(iso));
    dispatch(setCalendarSelectedDate(iso));
    dispatch(
      setCalendarMonth(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      ),
    );
  };

  const handleNext = () => {
    const d = new Date(selected);
    d.setDate(d.getDate() + 7);
    const iso = toLocalISODate(d);
    dispatch(setSelectedDate(iso));
    dispatch(setCalendarSelectedDate(iso));
    dispatch(
      setCalendarMonth(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      ),
    );
  };

  const setDateSelection = (iso: string) => {
    dispatch(setSelectedDate(iso));
    dispatch(setCalendarSelectedDate(iso));
    const d = new Date(iso + "T12:00:00");
    dispatch(
      setCalendarMonth(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      ),
    );
  };

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
            const iso = toLocalISODate(day);
            const isToday = iso === today;
            const isSelected = iso === selectedDate;
            const dayName = DAY_LABELS[day.getDay()];
            const dayNum = day.getDate();

            return (
              <button
                key={iso}
                onClick={() => setDateSelection(iso)}
                className="flex flex-col items-center justify-center rounded-xl transition-all duration-200 hover:bg-white/6"
                style={{
                  minWidth: "44px",
                  padding: "8px 6px",

                  background: isSelected
                    ? "#0E152A"
                    : isToday
                      ? "rgba(255,255,255,0.05)"
                      : "transparent",

                  border: isSelected
                    ? "1.5px solid rgba(126,227,255,0.5)"
                    : isToday
                      ? "1px solid #7EE3FF"
                      : "1px solid rgba(255,255,255,0.06)",

                  boxShadow: isSelected
                    ? "0 0 18px rgba(126,227,255,0.40)"
                    : isToday
                      ? "0 0 10px rgba(126,227,255,0.22)"
                      : "none",
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
