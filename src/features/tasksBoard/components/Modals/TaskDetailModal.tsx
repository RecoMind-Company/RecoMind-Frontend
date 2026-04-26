import React, { useState } from "react";
import { X, Clock, Calendar, MessageSquare, CornerDownLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { closeTaskModal, localToggleComplete } from "../../redux/tasksSlice";
import { addComment } from "../../redux/tasksSlice";

const priorityConfig = {
  HIGH:   { color: "#df5d5d", bg: "rgba(223,93,93,0.15)",   border: "rgba(223,93,93,0.3)" },
  MEDIUM: { color: "#e8a838", bg: "rgba(232,168,56,0.15)",  border: "rgba(232,168,56,0.3)" },
  LOW:    { color: "#7ee3ff", bg: "rgba(126,227,255,0.10)", border: "rgba(126,227,255,0.2)" },
};

const TaskDetailModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const task = useSelector((s: RootState) => s.tasks.selectedTask);
  const allTasks = useSelector((s: RootState) => s.tasks.tasks);
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "comments">("details");

  if (!task) return null;

  // Get fresh task from store (so comments update reactively)
  const freshTask = allTasks.find((t) => t.id === task.id) || task;
  const p = priorityConfig[freshTask.priority];
  const isCompleted = freshTask.completed;

  const handleComment = () => {
    if (!commentText.trim()) return;
    dispatch(addComment({ taskId: freshTask.id, text: commentText }));
    setCommentText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(6,11,27,0.85)", backdropFilter: "blur(10px)" }}
      onClick={() => dispatch(closeTaskModal())}
    >
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{
          background: "#0a1628",
          border: "1.5px solid rgba(126,227,255,0.15)",
          maxHeight: "88vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={() => dispatch(closeTaskModal())}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <X size={14} color="#7f7f7f" />
        </button>

        <div className="flex h-full" style={{ maxHeight: "88vh" }}>
          {/* ===== LEFT PANEL ===== */}
          <div
            className="flex-1 p-6 overflow-y-auto"
            style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Column label */}
            <p className="text-[#7f7f7f] text-xs font-semibold uppercase tracking-wider mb-4">
              {freshTask.status === "review"
                ? "Review/Done"
                : freshTask.status === "done"
                ? "Done"
                : freshTask.status === "todo"
                ? "To-Do"
                : "ToDo"}
            </p>

            {/* Title with checkbox */}
            <div className="flex items-start gap-3 mb-4">
              <button
                onClick={() => dispatch(localToggleComplete(freshTask.id))}
                className="flex-shrink-0 mt-1 w-5 h-5 rounded flex items-center justify-center transition-all duration-200"
                style={{
                  border: isCompleted ? "none" : "1.5px solid rgba(255,255,255,0.3)",
                  background: isCompleted ? "#7ee3ff" : "transparent",
                }}
              >
                {isCompleted && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#060b1b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <h2
                className="text-white text-lg font-bold leading-snug"
                style={{
                  textDecoration: isCompleted ? "line-through" : "none",
                  color: isCompleted ? "#7f7f7f" : "#eeeeee",
                }}
              >
                {freshTask.title}
              </h2>
            </div>

            {/* Badges row */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {freshTask.status === "review" || freshTask.status === "done" ? (
                  <Calendar size={11} color="#7f7f7f" />
                ) : (
                  <Clock size={11} color="#7f7f7f" />
                )}
                <span className="text-[11px] text-[#b8adad]">{freshTask.dueDateDisplay}</span>
              </div>
              {(["HIGH", "MEDIUM", "LOW"] as const).map((pr) => (
                <span
                  key={pr}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-lg"
                  style={{
                    background: freshTask.priority === pr ? priorityConfig[pr].bg : "rgba(255,255,255,0.04)",
                    color: freshTask.priority === pr ? priorityConfig[pr].color : "#7f7f7f",
                    border: freshTask.priority === pr
                      ? `1px solid ${priorityConfig[pr].border}`
                      : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {pr}
                </span>
              ))}
            </div>

            {/* Project tag */}
            <span
              className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full mb-5"
              style={{ background: "rgba(126,227,255,0.08)", color: "#7ee3ff", border: "1px solid rgba(126,227,255,0.15)" }}
            >
              ◆ {freshTask.project}
            </span>

            {/* Description */}
            {freshTask.description && (
              <div className="mb-5">
                <p className="text-[#7f7f7f] text-[10px] uppercase tracking-wider font-semibold mb-2">Task Description</p>
                <p className="text-[#b8adad] text-sm leading-relaxed">{freshTask.description}</p>
              </div>
            )}

            {/* Members */}
            {freshTask.assignees.length > 0 && (
              <div>
                <p className="text-[#7f7f7f] text-[10px] uppercase tracking-wider font-semibold mb-3">Members</p>
                <div className="space-y-2">
                  {freshTask.assignees.map((member, i) => (
                    <div key={member.id + i} className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: `hsl(${(i * 80 + 200) % 360}, 45%, 35%)`,
                          border: "1.5px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <span className="text-[#b8adad] text-sm">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ===== RIGHT PANEL: COMMENTS ===== */}
          <div className="w-64 flex flex-col p-5">
            {/* Comments tab button */}
            <button
              onClick={() => setActiveTab(activeTab === "comments" ? "details" : "comments")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-5 self-end transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#eeeeee",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              <MessageSquare size={13} />
              Comments
              {freshTask.comments.length > 0 && (
                <span
                  className="text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: "#7ee3ff", color: "#060b1b" }}
                >
                  {freshTask.comments.length}
                </span>
              )}
            </button>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-3" style={{ scrollbarWidth: "none" }}>
              {freshTask.comments.length === 0 ? (
                <p className="text-[#7f7f7f] text-xs text-center mt-8">No comments yet</p>
              ) : (
                freshTask.comments.map((comment) => (
                  <div key={comment.id}>
                    <div className="flex items-start gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{
                          background: "linear-gradient(135deg, #2a4a7f 0%, #1a3060 100%)",
                          border: "1.5px solid rgba(126,227,255,0.15)",
                          color: "#7ee3ff",
                        }}
                      >
                        {comment.author.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <p className="text-white text-xs font-semibold">{comment.author}</p>
                          <p className="text-[#7f7f7f] text-[9px]">{comment.time}</p>
                        </div>
                        <p className="text-[#b8adad] text-xs leading-relaxed">{comment.text}</p>
                        <button className="text-[#7ee3ff] text-[10px] mt-1 flex items-center gap-1 hover:opacity-70 transition-opacity">
                          <CornerDownLeft size={9} />
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment input */}
            <div className="relative">
              <input
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  padding: "9px 36px 9px 12px",
                  color: "#eeeeee",
                  fontSize: "11px",
                  outline: "none",
                }}
                placeholder="Enter Your Comment Here..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 disabled:opacity-30 transition-opacity"
              >
                <CornerDownLeft size={13} color="#7ee3ff" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;