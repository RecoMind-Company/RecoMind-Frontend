import React, { useState } from "react";
import { X, Calendar, UserPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import {
  closeAddTaskModal,
  openInviteModal,
  closeInviteModal,
} from "../../redux/tasksSlice";
import { createTask } from "../../redux/tasksSlice";
import InviteModal from "./InviteModal";
import type { TaskPriority, TeamMember } from "../../types";

const priorityOptions: { label: string; value: TaskPriority; color: string }[] = [
  { label: "HIGH",   value: "HIGH",   color: "#df5d5d" },
  { label: "MEDIUM", value: "MEDIUM", color: "#e8a838" },
  { label: "LOW",    value: "LOW",    color: "#7ee3ff" },
];

const AddTaskModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showInviteModal, activeBoard } = useSelector((s: RootState) => s.tasks);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("HIGH");
  const [assignees, setAssignees] = useState<TeamMember[]>([]);

  const handleCreate = () => {
    if (!title.trim()) return;
    dispatch(
      createTask({
        title,
        description,
        project: "Q1 Brand Awareness",
        status: "todo",
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
        dueDateDisplay: dueDate
          ? new Date(dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          : "Due today",
        assignees,
        boardType: activeBoard,
      })
    );
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
          className="w-full max-w-sm rounded-2xl"
          style={{
            background: "#0d1b3e",
            border: "1px solid rgba(126,227,255,0.15)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4"
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

          <div className="p-5 space-y-4">
            {/* Task Name */}
            <div>
              <label style={labelStyle}>Task Name</label>
              <input
                style={inputStyle}
                placeholder="What do you need to do?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description (optional)</label>
              <textarea
                style={{ ...inputStyle, resize: "none", height: "72px" }}
                placeholder="Add more details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Date + Priority row */}
            <div className="flex gap-3">
              {/* Due date */}
              <div className="flex-1">
                <label style={labelStyle}>Due date</label>
                <div className="relative">
                  <input
                    type="date"
                    style={{ ...inputStyle, paddingRight: "36px", colorScheme: "dark" }}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                  <Calendar size={13} color="#7f7f7f" className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label style={labelStyle}>Priority</label>
                <div className="flex gap-1.5">
                  {priorityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setPriority(opt.value)}
                      className="px-2.5 py-2 rounded-lg text-[10px] font-bold transition-all duration-150"
                      style={{
                        background: priority === opt.value
                          ? `${opt.color}25`
                          : "rgba(255,255,255,0.04)",
                        color: priority === opt.value ? opt.color : "#7f7f7f",
                        border: priority === opt.value
                          ? `1px solid ${opt.color}60`
                          : "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Invite Team */}
            <button
              onClick={() => dispatch(openInviteModal())}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:bg-white/[0.04]"
              style={{ border: "1px dashed rgba(255,255,255,0.12)" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(126,227,255,0.08)", border: "1px solid rgba(126,227,255,0.2)" }}
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
              onClick={handleCreate}
              disabled={!title.trim()}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #7ee3ff 0%, #4fb8d8 100%)", color: "#060b1b" }}
            >
              Create Task
            </button>
          </div>
        </div>
      </div>

      {/* Invite modal on top */}
      {showInviteModal && <InviteModal onConfirm={handleInviteConfirm} />}
    </>
  );
};

export default AddTaskModal;