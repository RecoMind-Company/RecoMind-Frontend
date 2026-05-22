import React, { useState } from "react";
import {
  X,
  MessageSquare,
  CornerDownLeft,
  RefreshCw,
  Send,
  Save,
  FileText,
  Clock,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import {
  closeProposalModal,
  saveDraft,
  sendForApproval,
  addComment,
  revalidateProposal,
} from "../../redux/proposalsSlice";

const statusConfig = {
  accepted: {
    label: "Accepted",
    color: "#64b883",
    bg: "rgba(100,184,131,0.12)",
    border: "rgba(100,184,131,0.25)",
  },
  rejected: {
    label: "Rejected",
    color: "#df5d5d",
    bg: "rgba(223,93,93,0.12)",
    border: "rgba(223,93,93,0.25)",
  },
  under_review: {
    label: "Under review",
    color: "#7ee3ff",
    bg: "rgba(126,227,255,0.08)",
    border: "rgba(126,227,255,0.2)",
  },
  draft: {
    label: "Draft",
    color: "#b8adad",
    bg: "rgba(184,173,173,0.08)",
    border: "rgba(184,173,173,0.15)",
  },
  pending: {
    label: "Pending",
    color: "#e8a838",
    bg: "rgba(232,168,56,0.1)",
    border: "rgba(232,168,56,0.2)",
  },
};

const ProposalDetailModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedProposal, showProposalModal, isValidating, validationSteps } =
    useSelector((s: RootState) => s.proposals);
  const [commentText, setCommentText] = useState("");

  if (!showProposalModal || !selectedProposal) return null;

  const proposal = selectedProposal;
  const s = statusConfig[proposal.status];
  const isRejected = proposal.status === "rejected";
  const isDraft = proposal.status === "draft";
  const isPending = proposal.status === "pending";
  const showActions = isPending || isDraft;
  const showComments =
    proposal.status === "accepted" ||
    proposal.status === "rejected" ||
    proposal.status === "under_review";

  const handleComment = () => {
    if (!commentText.trim()) return;
    dispatch(addComment({ proposalId: proposal.id, text: commentText }));
    setCommentText("");
  };

  // ========================================================
  // DRAFT VIEW — compact modal with only "Send for Approval"
  // ========================================================
  if (isDraft) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: "rgba(6,11,27,0.88)",
          backdropFilter: "blur(12px)",
        }}
        onClick={() => dispatch(closeProposalModal())}
      >
        <div
          className="w-full max-w-sm rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: "#060B1B",
            border: "1.5px solid rgba(126,227,255,0.12)",
            maxHeight: "85vh",
            animation: "slideUp 0.22s ease",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <style>{`
            @keyframes slideUp {
              from { opacity:0; transform:translateY(14px); }
              to   { opacity:1; transform:translateY(0); }
            }
            .scroll-thin::-webkit-scrollbar { width:3px; }
            .scroll-thin::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:4px; }
          `}</style>

          {/* Input bar */}
          <div
            className="px-5 py-4 flex items-center gap-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="flex-1 px-4 py-2 rounded-xl text-sm"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#7f7f7f",
              }}
            >
              {proposal.plan || "Open A new Branch"}
            </div>
            <button
              onClick={() => dispatch(closeProposalModal())}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <X size={13} color="#7f7f7f" />
            </button>
          </div>

          {/* Date + status row */}
          <div className="px-5 py-3 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Clock size={11} color="#7f7f7f" />
              <span className="text-[11px]" style={{ color: "#7f7f7f" }}>
                Created at{" "}
                {new Date(proposal.createdAt).toLocaleDateString("en-GB")}
              </span>
            </div>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
              style={{
                background: s.bg,
                color: s.color,
                border: `1px solid ${s.border}`,
              }}
            >
              {s.label}
            </span>
          </div>

          {/* Report */}
          <div className="flex-1 overflow-y-auto scroll-thin px-5 pb-4">
            <h3
              className="text-white font-bold text-base mb-3"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                paddingBottom: "8px",
              }}
            >
              The Validation Report
            </h3>
            <div
              className="text-xs leading-relaxed whitespace-pre-line"
              style={{ color: "#b8adad" }}
            >
              {proposal.validationReport || "No validation report available."}
            </div>
          </div>

          {/* Send for Approval only */}
          <div
            className="px-5 py-4 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <button
              onClick={() => dispatch(sendForApproval(proposal))}
              className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #7ee3ff 0%, #4fb8d8 100%)",
                color: "#060b1b",
              }}
            >
              <Send size={13} />
              Send for Approval
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // VALIDATION REPORT VIEW — full width, no sidebar
  // (pending = just validated, not yet saved/sent)
  // ========================================================
  if (isPending) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: "rgba(6,11,27,0.9)",
          backdropFilter: "blur(12px)",
        }}
        onClick={() => dispatch(closeProposalModal())}
      >
        <div
          className="w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: "#060B1B",
            border: "1.5px solid rgba(126,227,255,0.15)",
            maxHeight: "88vh",
            animation: "slideUp 0.22s ease",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <style>{`
            @keyframes slideUp {
              from { opacity:0; transform:translateY(14px); }
              to   { opacity:1; transform:translateY(0); }
            }
            .scroll-thin::-webkit-scrollbar { width:3px; }
            .scroll-thin::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:4px; }
          `}</style>

          {/* Input bar */}
          <div
            className="px-6 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-full px-4 py-2.5 rounded-xl text-sm"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#7f7f7f",
              }}
            >
              {proposal.plan || "Open A new Branch"}
            </div>
          </div>

          {/* Report content */}
          <div className="flex-1 overflow-y-auto scroll-thin px-6 py-5">
            <h3 className="text-white font-bold text-xl mb-4">
              The Validation Report
            </h3>
            <div
              className="text-sm leading-relaxed whitespace-pre-line"
              style={{ color: "#b8adad" }}
            >
              {proposal.validationReport}
            </div>
          </div>

          {/* Save / Send */}
          <div
            className="flex gap-3 px-6 py-4 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <button
              onClick={() => dispatch(saveDraft(proposal))}
              className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "#eeeeee",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Save size={13} />
              Save Draft
            </button>
            <button
              onClick={() => dispatch(sendForApproval(proposal))}
              className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #7ee3ff 0%, #4fb8d8 100%)",
                color: "#060b1b",
              }}
            >
              <Send size={13} />
              Send for Approval
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // FULL DETAIL VIEW — accepted / rejected / under_review
  // (with left panel + right comments)
  // ========================================================
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(6,11,27,0.88)",
        backdropFilter: "blur(10px)",
      }}
      onClick={() => dispatch(closeProposalModal())}
    >
      <div
        className="w-full p-5 pt-13.75 relative rounded-2xl overflow-hidden flex shadow-[0_0_60px_15px_rgba(255,255,255,0.03)]"
        style={{
          maxWidth: "1000px",
          maxHeight: "90vh",
          background: "#060B1B",
          animation: "slideUp 0.22s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <button
            className=" absolute top-2.5 right-2.5  "
            onClick={() => dispatch(closeProposalModal())}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M35.9999 35.9999L23.9999 23.9999M23.9999 23.9999L12 12M23.9999 23.9999L36 12M23.9999 23.9999L12 36"
                stroke="#EEEEEE"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <style>{`
          @keyframes slideUp {
            from { opacity:0; transform:translateY(12px); }
            to   { opacity:1; transform:translateY(0); }
          }
          .scroll-thin::-webkit-scrollbar { width:4px; }
          .scroll-thin::-webkit-scrollbar-track { background:transparent; }
          .scroll-thin::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:4px; }
        `}</style>

        {/* LEFT PANEL */}
        <div className="flex-1 flex flex-col overflow-hidden mr-4">
          {/* Header */}
          <div
            className="flex items-start justify-between px-6 py-5 shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-white font-bold text-base">
                  {proposal.title}
                </h2>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                  style={{
                    background: s.bg,
                    color: s.color,
                    border: `1px solid ${s.border}`,
                  }}
                >
                  {s.label}
                </span>
              </div>
              <p
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "#7f7f7f" }}
              >
                Plan
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#b8adad" }}>
                {proposal.plan}
              </p>
            </div>
            {/* <button
              onClick={() => dispatch(closeProposalModal())}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors ml-4 shrink-0"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <X size={14} color="#7f7f7f" />
            </button> */}
          </div>

          {/* Rejection Feedback */}
          {isRejected &&
            proposal.rejectionFeedback &&
            proposal.rejectionFeedback.length > 0 && (
              <div
                className="mx-6 mt-4 rounded-xl p-4 shrink-0"
                style={{
                  background: "rgba(223,93,93,0.06)",
                  border: "1px solid rgba(223,93,93,0.2)",
                }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-wider mb-3"
                  style={{ color: "#df5d5d" }}
                >
                  Rejection Feedback
                </p>
                <div className="space-y-3">
                  {proposal.rejectionFeedback.map((fb, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                        style={{
                          background: "linear-gradient(135deg,#3a1a1a,#2a1010)",
                          color: "#df5d5d",
                          border: "1.5px solid rgba(223,93,93,0.2)",
                        }}
                      >
                        {fb.reviewer.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-white text-xs font-semibold">
                            {fb.reviewer}
                          </span>
                          <span
                            className="text-[9px]"
                            style={{ color: "#7f7f7f" }}
                          >
                            {fb.time}
                          </span>
                        </div>
                        <p
                          className="text-xs leading-relaxed mt-0.5"
                          style={{ color: "#b8adad" }}
                        >
                          {fb.message}
                        </p>
                        <button
                          className="flex items-center gap-1 text-[10px] mt-1 hover:opacity-70 transition-opacity"
                          style={{ color: "#7ee3ff" }}
                        >
                          <CornerDownLeft size={9} /> Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Re-Validate */}
                <button
                  onClick={() => dispatch(revalidateProposal(proposal))}
                  disabled={isValidating}
                  className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
                  style={{
                    background: "rgba(126,227,255,0.1)",
                    color: "#7ee3ff",
                    border: "1px solid rgba(126,227,255,0.2)",
                  }}
                >
                  {isValidating ? (
                    <>
                      <span
                        className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                        style={{
                          borderColor: "#7ee3ff",
                          borderTopColor: "transparent",
                        }}
                      />
                      Re-Validating...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={13} /> Re-Validate
                    </>
                  )}
                </button>
                {isValidating && (
                  <div className="mt-3 space-y-1.5">
                    {validationSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        {step.done ? (
                          <span style={{ color: "#64b883" }}>✓</span>
                        ) : (
                          <span
                            className="inline-block w-3 h-3 rounded-full border-2 border-t-transparent animate-spin"
                            style={{
                              borderColor: "#7ee3ff",
                              borderTopColor: "transparent",
                            }}
                          />
                        )}
                        <span
                          style={{ color: step.done ? "#64b883" : "#b8adad" }}
                        >
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          {/* Validation Report */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[] scrollbar-track-transparent px-6 py-4">
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-3"
              style={{ color: "#7f7f7f" }}
            >
              Validation Report
            </p>
            <div
              className="text-xs leading-relaxed whitespace-pre-line"
              style={{ color: "#b8adad" }}
            >
              {proposal.validationReport || "No validation report available."}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: COMMENTS */}
        <div className="w-1/2 flex flex-col shrink-0 bg-[#061022] rounded-xl">
          <div
            className="flex items-center justify-end gap-2 px-5 py-5 shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
            >
              <MessageSquare size={13} color="#7ee3ff" />
              <span className="text-white text-xs font-semibold">Comments</span>
              {proposal.comments.length > 0 && (
                <span
                  className="text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: "#7ee3ff", color: "#060b1b" }}
                >
                  {proposal.comments.length}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scroll-thin px-4 py-3 space-y-4">
            {proposal.comments.length === 0 ? (
              <p
                className="text-center text-xs py-8"
                style={{ color: "#7f7f7f" }}
              >
                No comments yet
              </p>
            ) : (
              proposal.comments.map((c) => (
                <div
                  key={c.id}
                  className="flex items-start gap-2.5 p-2.5 bg-[#0E152A] rounded-lg"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{
                      background: "linear-gradient(135deg,#2a4a7f,#1a3060)",
                      color: "#7ee3ff",
                      border: "1.5px solid rgba(126,227,255,0.15)",
                    }}
                  >
                    {c.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline flex-col gap-1 mb-0.5">
                      <span className="text-white text-xs font-semibold">
                        {c.author}
                      </span>
                      <span className="text-[9px]" style={{ color: "#7f7f7f" }}>
                        {c.time}
                      </span>
                    </div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "#b8adad" }}
                    >
                      {c.text}
                    </p>
                    <button
                      className="flex items-center justify-end w-full gap-1 text-[10px] mt-1 hover:opacity-70 transition-opacity"
                      style={{ color: "#7ee3ff" }}
                    >
                      <CornerDownLeft size={9} /> Reply
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-4 pb-4 pt-2 shrink-0">
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleComment();
                  }
                }}
              />
              <button
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 disabled:opacity-30 transition-opacity"
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

export default ProposalDetailModal;
