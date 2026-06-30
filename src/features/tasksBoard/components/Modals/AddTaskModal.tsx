import React, { useState } from "react";
import { X, Calendar, UserPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import type { AppDispatch, RootState } from "@/app/store";
import InviteModal from "./InviteModal";
import type { TaskPriority, TeamMember } from "../../types";
import { useAddTaskMutation, closeAddTaskModal, openInviteModal } from "../../redux/tasksSlice";

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
  priority: TaskPriority;
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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IAddTaskInputs>({
    defaultValues: { priority: "HIGH" },
  }); 

  const onSubmit: SubmitHandler<IAddTaskInputs> = async (data) => {
  try {
    const userIdsPayload = assignees.length > 0 
      ? assignees.map(member => member.id)
      : ["user-1"];

    const apiPayload = {
      title: data.title,
      description: data.description ?? "",
      status: 0,
      priority: priorityMap[data.priority],
      startDate: new Date(data.startDate).toISOString(),
      deadLine: new Date(data.deadLine).toISOString(),
      moduleId: "string", 
      planId: "string",
      userIds: userIdsPayload
    };

    console.log("Payload Sent to API:", apiPayload);

    // إرسال الطلب (Mutation)
    const res = await addTask(apiPayload).unwrap();

    console.log("Task created successfully:", res);
    dispatch(closeAddTaskModal());
  } catch (err) {
    console.error("Failed to create task:", err);
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
          className="w-full md:w-[45%] rounded-2xl"
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
                          {/* Priority */}
            <div>
              <label style={labelStyle}>Priority</label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-1.5">
                    {priorityOptions.map((opt) => (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => field.onChange(opt.value)}
                        className="px-2.5 py-2 rounded-lg text-[10px] font-bold transition-all duration-150"
                        style={{
                          background:
                            field.value === opt.value
                              ? `${opt.color}25`
                              : "rgba(255,255,255,0.04)",
                          color: field.value === opt.value ? opt.color : "#7f7f7f",
                          border:
                            field.value === opt.value
                              ? `1px solid ${opt.color}60`
                              : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              />
            </div>
            </div>



            {/* Invite Team */}
            <button
              type="button"
              onClick={() => dispatch(openInviteModal())}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:bg-white/[0.04]"
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