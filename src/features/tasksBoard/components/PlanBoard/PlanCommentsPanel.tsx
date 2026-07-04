import React, { useEffect, useRef, useState } from "react";
import { CornerDownLeft, X } from "lucide-react";
import {
  useGetPlanCommentsQuery,
  useAddPlanCommentMutation,
} from "../../redux/tasksSlice";
import CommentIcon from "../../../../assets/images/comments-line_svgrepo.com.png";

interface ApiComment {
  id: string;
  userComment: string;
  userId: string;
  planId: string;
  createdAt: string;
  updatedAt: string | null;
  isUpdated: boolean;
}

interface PlanCommentsPanelProps {
  planId: string;
  open: boolean;
  onClose: () => void;
}

const formatTime = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const PlanCommentsPanel: React.FC<PlanCommentsPanelProps> = ({
  planId,
  open,
  onClose,
}) => {
  const [commentText, setCommentText] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  const { data: comments = [], isLoading } = useGetPlanCommentsQuery(planId, {
    skip: !planId,
  });
  const [addComment, { isLoading: isAdding }] = useAddPlanCommentMutation();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  const handleSubmit = async () => {
    if (!commentText.trim() || isAdding) return;
    try {
      await addComment({ planId, userComment: commentText }).unwrap();
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!open) return null;

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .scroll-thin::-webkit-scrollbar { width: 3px; }
        .scroll-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
      `}</style>

      <div
        ref={panelRef}
        className="fixed top-0 right-0 z-50 w-105 max-w-[90vw] h-dvh overflow-hidden shadow-2xl"
        style={{
          background: "#0b1327",
          border: "1px solid rgba(126,227,255,0.12)",
          borderLeft: "1px solid rgba(126,227,255,0.15)",
          animation: "slideInRight 0.25s ease",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 pt-4 pb-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2">
            <img src={CommentIcon} alt="Comments" className="w-4 h-4" />
            <span className="text-xs font-semibold" style={{ color: "#7ee3ff" }}>
              Plan Comments
            </span>
            {comments.length > 0 && (
              <span
                className="text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: "#7ee3ff", color: "#060b1b" }}
              >
                {comments.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <X size={14} color="#7f7f7f" />
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          {isLoading ? (
            <p className="text-[#7f7f7f] text-xs text-center mt-8">
              Loading comments...
            </p>
          ) : comments.length === 0 ? (
            <p className="text-[#7f7f7f] text-xs text-center mt-8">
              No comments yet
            </p>
          ) : (
            <div className="space-y-4">
              {(comments as ApiComment[]).map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-2xl px-4 py-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(17,26,52,0.9) 0%, rgba(11,19,39,0.9) 100%)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, #2a4a7f 0%, #1a3060 100%)",
                        border: "1.5px solid rgba(126,227,255,0.2)",
                        color: "#7ee3ff",
                      }}
                    >
                      {comment.userId?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <p className="text-white text-xs font-semibold truncate max-w-[100px]">
                          {comment.userId}
                        </p>
                        <p className="text-[#7f7f7f] text-[9px]">
                          {formatTime(comment.createdAt)}
                        </p>
                      </div>
                      <p className="text-[#b8adad] text-xs leading-relaxed mt-1">
                        {comment.userComment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment input */}
        <div
          className="px-4 py-4 shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
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
              placeholder={isAdding ? "Posting..." : "Enter Your Comment Here..."}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isAdding}
            />
            <button
              onClick={handleSubmit}
              disabled={!commentText.trim() || isAdding}
              className="absolute right-2 top-1/2 -translate-y-1/2 disabled:opacity-30 transition-opacity"
            >
              <CornerDownLeft size={13} color="#7ee3ff" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanCommentsPanel;
