import React, { useState } from "react";
import { X, Calendar, UserPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "@/app/store";
import InviteModal from "./InviteModal";
import type { TaskPriority, TeamMember } from "../../types";
import {
  useAddTaskMutation,
  closeAddTaskModal,
  openInviteModal,
  taskSlice,
} from "../../redux/tasksSlice";

const priorityOptions: { label: string; value: TaskPriority; color: string }[] = [
  { label: "HIGH",   value: "HIGH",   color: "#df5d5d" },
  { label: "MEDIUM", value: "MEDIUM", color: "#e8a838" },
  { label: "LOW",    value: "LOW",    color: "#7ee3ff" },
];

interface IAddTaskInputs {
  title: string;
  description?: string;
  startDate: string;
  deadLine: string;
  moduleId?: string;
  planId?: string;
}

const priorityMap: Record<TaskPriority, number> = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
};

const AddTaskModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showInviteModal } = useSelector((s: RootState) => s.tasks);
  const [addTask, { isLoading }] = useAddTaskMutation();
  const [assignees, setAssignees] = useState<TeamMember[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority>("LOW");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAddTaskInputs>();

  const onSubmit: SubmitHandler<IAddTaskInputs> = async (data) => {
  try {
    let currentUserId = "userId";
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") ?? "{}");
      if (storedUser.id) {
        currentUserId = storedUser.id;
      } else if (storedUser.userId) {
        currentUserId = storedUser.userId;
      }
    } catch {
      // keep default
    }

    const apiPayload = {
      title: data.title,
      description: data.description ?? "",
      status: 0,
      priority: priorityMap[selectedPriority],
      startDate: new Date(data.startDate).toISOString(),
      deadLine: new Date(data.deadLine).toISOString(),
      moduleId: null,
      planId: null,
      userIds: [currentUserId, ...assignees.map((a) => a.id)]
    };

    const response = await addTask(apiPayload).unwrap();
    const newTaskId =
      response?.questId ||
      response?.id ||
      response?.value?.questId ||
      response?.value?.id;

    if (newTaskId && assignees.length > 0) {
      try {
        const stored = JSON.parse(localStorage.getItem("taskAssignees") || "{}");
        stored[newTaskId] = assignees;
        localStorage.setItem("taskAssignees", JSON.stringify(stored));
      } catch {
        // ignore
      }
    }

    dispatch(taskSlice.util.invalidateTags([{ type: "Task", id: "LIST" }]));
    dispatch(closeAddTaskModal());
    setAssignees([]);
    setSelectedPriority("LOW");
  } catch (err: any) {
    console.error("Failed to create task:", err);
    toast.error(err?.data?.message || err?.message || "Failed to create task", {
      duration: 4000,
      style: {
        background: "rgba(10, 15, 30, 0.95)",
        color: "#fff",
        border: "1px solid rgba(223, 93, 93, 0.3)",
        borderRadius: "12px",
        padding: "16px",
        fontSize: "14px",
      },
    });
  }
};

  const handleInviteConfirm = (members: TeamMember[]) => {
    setAssignees((prev) => [...prev, ...members]);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "10px",
    padding: "10px 14px",
    color: "#eeeeee",
    fontSize: "13px",
    outline: "none",
  };

  const errorStyle: React.CSSProperties = {
    color: "#df5d5d",
    fontSize: "10px",
    marginTop: "4px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "11px",
    color: "#7f7f7f",
    marginBottom: "6px",
    display: "block",
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(6,11,27,0.8)", backdropFilter: "blur(8px)" }}
      >
        <div
          className="w-full md:w-[60%] rounded-2xl"
          style={{
            background: "#060B1B",
            border: "1px solid rgba(126,227,255,0.15)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="text-white font-semibold text-sm">Add New Personal Task</span>
            <button
              onClick={() => dispatch(closeAddTaskModal())}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X size={14} color="#7f7f7f" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
            {/* Task Name */}
            <div>
              <label style={labelStyle}>Task Name</label>
              <input
                style={{
                  ...inputStyle,
                  borderColor: errors.title ? "#df5d5d60" : "rgba(255,255,255,0.09)",
                }}
                placeholder="What do you need to do?"
                {...register("title", { required: "Task name is required" })}
              />
              {errors.title && <p style={errorStyle}>{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description (optional)</label>
              <textarea
                style={{ ...inputStyle, resize: "none", height: "72px" }}
                placeholder="Add more details..."
                {...register("description")}
              />
            </div>

            {/* Start Date + Deadline row */}
            <div className="flex gap-3 items-center">
              {/* Start Date */}
              <div className="flex-1">
                <label style={labelStyle}>Start Date</label>
                <div className="relative">
                  <input
                    type="date"
                    style={{
                      ...inputStyle,
                      paddingRight: "36px",
                      colorScheme: "dark",
                      borderColor: errors.startDate ? "#df5d5d60" : "rgba(255,255,255,0.09)",
                    }}
                    {...register("startDate", { required: "Required" })}
                  />
                  <Calendar
                    size={13}
                    color="#7f7f7f"
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                </div>
                {errors.startDate && <p style={errorStyle}>{errors.startDate.message}</p>}
              </div>

            
              <div className="flex-1">
  <label style={labelStyle}>Deadline</label>
  <div className="relative">
    <input
      type="date"
      style={{
        ...inputStyle,
        paddingRight: "36px",
        colorScheme: "dark",
        borderColor: errors.deadLine ? "#df5d5d60" : "rgba(255,255,255,0.09)",
      }}
      {...register("deadLine", { required: "Required" })}
    />
    <Calendar
      size={13}
      color="#7f7f7f"
      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
    />
  </div>
  {errors.deadLine && <p style={errorStyle}>{errors.deadLine.message}</p>}
</div>
            </div>

            {/* Priority */}
            <div>
              <label style={labelStyle}>Priority</label>
              <div className="flex gap-1.5">
                {priorityOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setSelectedPriority(opt.value)}
                    className="px-3 py-2 rounded-lg text-[10px] font-bold transition-all duration-150"
                    style={{
                      background:
                        selectedPriority === opt.value
                          ? `${opt.color}25`
                          : "rgba(255,255,255,0.04)",
                      color: selectedPriority === opt.value ? opt.color : "#7f7f7f",
                      border:
                        selectedPriority === opt.value
                          ? `1px solid ${opt.color}60`
                          : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>



            {/* Invite Team */}
            <button
              type="button"
              onClick={() => dispatch(openInviteModal())}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:bg-white/4"
              style={{ border: "1px dashed rgba(255,255,255,0.12)" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(126,227,255,0.08)",
                  border: "1px solid rgba(126,227,255,0.2)",
                }}
              >
                <UserPlus size={13} color="#7ee3ff" />
              </div>
              <div>
                <p className="text-white text-xs font-medium">
                  Invite Team Member (optional)
                  {assignees.length > 0 && (
                    <span className="ml-2 text-[#7ee3ff]">({assignees.length} added)</span>
                  )}
                </p>
                <p className="text-[#7f7f7f] text-[10px]">Invite someone to do this task with</p>
              </div>
            </button>

            {assignees.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {assignees.map((a, i) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-2 px-2 py-1 rounded-lg"
                    style={{
                      background: "rgba(126,227,255,0.06)",
                      border: "1px solid rgba(126,227,255,0.15)",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0"
                      style={{
                        background: `hsl(${(i * 80 + 200) % 360}, 45%, 38%)`,
                        border: "1.5px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      {a.name.charAt(0)}
                    </div>
                    <span className="text-[10px] text-[#eeeeee]">{a.name}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setAssignees((prev) => prev.filter((m) => m.id !== a.id))
                      }
                      className="text-[#7f7f7f] hover:text-[#df5d5d] transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Create button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #7ee3ff 0%, #4fb8d8 100%)",
                color: "#060b1b",
              }}
            >
              {isLoading ? "Creating..." : "Create Task"}
            </button>
          </form>
        </div>
      </div>

      {showInviteModal && <InviteModal onConfirm={handleInviteConfirm} />}
    </>
  );
};

export default AddTaskModal;
