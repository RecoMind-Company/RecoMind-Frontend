import React, { useState } from "react";
import { X, Clock, Calendar, CornerDownLeft, UserPlus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAddTaskCommentMutation, useGetTaskCommentsQuery, useGetTaskByIdQuery } from "../../redux/tasksSlice";
import CommentIcon from "../../../../assets/images/comments-line_svgrepo.com.png";
import InviteModal from "../Modals/InviteModal";
import type { Task, TeamMember } from "../../types";

interface ApiComment {
  id: string;
  userComment: string;
  userId: string;
  questId: string;
  createdAt: string;
  updatedAt: string | null;
  isUpdated: boolean;
}

interface PlanTaskDetailPanelProps {
  task: Task | null;
  onClose: () => void;
}

const priorityConfig = {
  HIGH: { color: "#df5d5d", bg: "rgba(223,93,93,0.15)", border: "rgba(223,93,93,0.3)" },
  MEDIUM: { color: "#e8a838", bg: "rgba(232,168,56,0.15)", border: "rgba(232,168,56,0.3)" },
  LOW: { color: "#7ee3ff", bg: "rgba(126,227,255,0.10)", border: "rgba(126,227,255,0.2)" },
};

const toTitleCase = (value: string) =>
  value
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const memberFromAssignedUser = (assignedUser: any, index: number): TeamMember => {
  const userId =
    typeof assignedUser === "string"
      ? assignedUser
      : assignedUser?.userId ||
        assignedUser?.employeeId ||
        assignedUser?.id ||
        assignedUser?.user?.id ||
        `assigned-${index}`;
  const parts = String(userId).split("-");
  const rawName =
    assignedUser?.name ||
    assignedUser?.fullName ||
    assignedUser?.userName ||
    assignedUser?.user?.name ||
    parts[1] ||
    String(userId);
  const rawRole = assignedUser?.role || parts[2] || "member";

  return {
    id: String(userId),
    name: toTitleCase(String(rawName)) || String(userId),
    role: toTitleCase(String(rawRole)) || "Member",
  };
};

const getAssignedUsers = (apiTask: any, fallback: TeamMember[]) => {
  const source =
    apiTask?.userAssignedQuests ||
    apiTask?.assignedUsers ||
    apiTask?.assignees ||
    apiTask?.users;

  if (!Array.isArray(source)) return fallback;
  return source.map(memberFromAssignedUser);
};

const PlanTaskDetailPanel: React.FC<PlanTaskDetailPanelProps> = ({ task, onClose }) => {
  const [commentText, setCommentText] = useState("");
  const [commentsOpen, setCommentsOpen] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [addTaskComment, { isLoading: isAddingComment }] = useAddTaskCommentMutation();

  const taskId = task?.id || "";
  const { data: freshTaskData } = useGetTaskByIdQuery(taskId, { skip: !taskId });
  const { data: serverComments = [], isLoading: isLoadingComments } = useGetTaskCommentsQuery(taskId, { skip: !taskId });

  if (!task) return null;

  const liveTask: Task = freshTaskData
    ? {
        ...task,
        title: freshTaskData.title || task.title,
        description: freshTaskData.description || task.description,
        status: freshTaskData.status === "completed" ? "review" : task.status,
        completed: freshTaskData.status === "completed",
        assignees: getAssignedUsers(freshTaskData, task.assignees),
      }
    : task;

  const p = priorityConfig[liveTask.priority as keyof typeof priorityConfig] || priorityConfig.LOW;
  const isCompleted = liveTask.completed;

  const handleComment = async () => {
    if (!commentText.trim() || isAddingComment) return;
    try {
      await addTaskComment({ questId: liveTask.id, userComment: commentText }).unwrap();
      setCommentText("");
    } catch (err) {
      console.error("Failed to submit comment:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(6,11,27,0.85)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl lg:max-w-4xl lg:h-[500px] rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "#060B1B", border: "1.5px solid rgba(126,227,255,0.15)", maxHeight: "88vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-5 py-3 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="text-[#7f7f7f] text-[10px] uppercase tracking-[0.18em] font-semibold">
            Task Details
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCommentsOpen((v) => !v)}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors relative"
              style={{
                border: commentsOpen ? "1px solid rgba(126,227,255,0.3)" : "1px solid rgba(255,255,255,0.08)",
                background: commentsOpen ? "rgba(126,227,255,0.08)" : "transparent",
              }}
            >
              <img
                src={CommentIcon}
                alt="Comments"
                className="w-4 h-4"
                style={{
                  filter: commentsOpen
                    ? "brightness(0) saturate(100%) invert(71%) sepia(38%) saturate(2759%) hue-rotate(157deg) brightness(101%) contrast(91%)"
                    : "none",
                  opacity: commentsOpen ? 1 : 0.6,
                }}
              />
              {serverComments.length > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center"
                  style={{ background: "#7ee3ff", color: "#060b1b" }}
                >
                  {serverComments.length}
                </span>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <X size={14} color="#7f7f7f" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
          <div
            className="flex-1 p-6 overflow-y-auto"
            style={{ borderRight: commentsOpen ? "1px solid rgba(255,255,255,0.06)" : "none" }}
          >
            <p className="text-[#7f7f7f] text-xs font-semibold uppercase tracking-wider mb-4">
              {liveTask.status === "review" ? "Review/Done" : liveTask.status === "done" ? "Done" : liveTask.status === "todo" ? "To-Do" : "Overdue"}
            </p>

            <div className="flex items-start gap-3 mb-4">
              <h2
                className="text-white text-lg font-bold leading-snug"
                style={{
                  textDecoration: isCompleted ? "line-through" : "none",
                  color: isCompleted ? "#7f7f7f" : "#eeeeee",
                }}
              >
                {liveTask.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap mb-4">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {liveTask.status === "review" || liveTask.status === "done" ? (
                  <Calendar size={11} color="#7f7f7f" />
                ) : (
                  <Clock size={11} color="#7f7f7f" />
                )}
                <span className="text-[11px] text-[#b8adad]">{liveTask.dueDateDisplay}</span>
              </div>
              {(["HIGH", "MEDIUM", "LOW"] as const).map((pr) => (
                <span
                  key={pr}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-lg"
                  style={{
                    background: liveTask.priority === pr ? priorityConfig[pr].bg : "rgba(255,255,255,0.04)",
                    color: liveTask.priority === pr ? priorityConfig[pr].color : "#7f7f7f",
                    border: liveTask.priority === pr ? `1px solid ${priorityConfig[pr].border}` : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {pr}
                </span>
              ))}
            </div>

            <span
              className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full mb-5"
              style={{ background: "rgba(126,227,255,0.08)", color: "#7ee3ff", border: "1px solid rgba(126,227,255,0.15)" }}
            >
              ◆ {liveTask.project}
            </span>

            {liveTask.description && (
              <div className="mb-5">
                <p className="text-[#7f7f7f] text-[10px] uppercase tracking-wider font-semibold mb-2">Task Description</p>
                <p className="text-[#b8adad] text-sm leading-relaxed">{liveTask.description}</p>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="text-[#7f7f7f] text-[10px] uppercase tracking-wider font-semibold">Members</p>
                <button
                  type="button"
                  onClick={() => setInviteOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition-colors hover:bg-white/10"
                  style={{
                    color: "#7ee3ff",
                    border: "1px solid rgba(126,227,255,0.2)",
                    background: "rgba(126,227,255,0.08)",
                  }}
                >
                  <UserPlus size={12} />
                  Assign
                </button>
              </div>
              {liveTask.assignees && liveTask.assignees.length > 0 ? (
                <div className="space-y-2">
                  {liveTask.assignees.map((member, i) => (
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
              ) : (
                <p className="text-[#7f7f7f] text-xs">No members assigned yet</p>
              )}
            </div>
          </div>

          <AnimatePresence initial={false}>
            {commentsOpen && (
              <motion.div
                key="comments-panel"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 400, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col overflow-hidden shrink-0"
                style={{ background: "#061022" }}
              >
                <div className="flex flex-col p-5 h-full" style={{ width: 400 }}>
                  <div className="flex items-center gap-2 mb-5">
                    <img src={CommentIcon} alt="Comment" className="w-4 h-4" />
                    <span className="text-xs font-semibold" style={{ color: "#7ee3ff" }}>Comments</span>
                    {serverComments.length > 0 && (
                      <span
                        className="text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: "#7ee3ff", color: "#060b1b" }}
                      >
                        {serverComments.length}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 mb-3" style={{ scrollbarWidth: "none" }}>
                    {isLoadingComments ? (
                      <p className="text-[#7f7f7f] text-xs text-center mt-8">Loading comments...</p>
                    ) : serverComments.length === 0 ? (
                      <p className="text-[#7f7f7f] text-xs text-center mt-8">No comments yet</p>
                    ) : (
                      serverComments.map((comment: ApiComment) => (
                        <div key={comment.id}>
                          <div className="flex items-start gap-2.5">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                              style={{
                                background: "linear-gradient(135deg, #2a4a7f 0%, #1a3060 100%)",
                                border: "1.5px solid rgba(126,227,255,0.15)",
                                color: "#7ee3ff",
                              }}
                            >
                              {comment.userId?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 mb-0.5">
                                <p className="text-white text-xs font-semibold truncate max-w-[80px]">{comment.userId}</p>
                                <p className="text-[#7f7f7f] text-[9px]">{formatTime(comment.createdAt)}</p>
                              </div>
                              <p className="text-[#b8adad] text-xs leading-relaxed">{comment.userComment}</p>
                              <button className="text-[#7ee3ff] text-[10px] mt-1 flex items-center gap-1 hover:opacity-70 transition-opacity">
                                <CornerDownLeft size={9} /> Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

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
                      placeholder={isAddingComment ? "Posting comment..." : "Enter Your Comment Here..."}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isAddingComment}
                    />
                    <button
                      onClick={handleComment}
                      disabled={!commentText.trim() || isAddingComment}
                      className="absolute right-2 top-1/2 -translate-y-1/2 disabled:opacity-30 transition-opacity"
                    >
                      <CornerDownLeft size={13} color="#7ee3ff" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {inviteOpen && (
        <InviteModal
          questId={liveTask.id}
          onClose={() => setInviteOpen(false)}
          onConfirm={() => {
            setInviteOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default PlanTaskDetailPanel;
