import React from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store";
import type { Proposal } from "../../types";
import { openProposalModal } from "../../redux/proposalsSlice";

interface ProposalCardProps {
  proposal: Proposal;
}

const statusConfig = {
  accepted: {
    label: "Accepted",
    color: "#64b883",
    bg: "rgba(100,184,131,0.12)",
    border: "rgba(100,184,131,0.25)",
    dot: false,
  },
  rejected: {
    label: "Rejected",
    color: "#df5d5d",
    bg: "rgba(223,93,93,0.12)",
    border: "rgba(223,93,93,0.25)",
    dot: false,
  },
  under_review: {
    label: "Under review",
    color: "#7ee3ff",
    bg: "rgba(126,227,255,0.08)",
    border: "rgba(126,227,255,0.2)",
    dot: true,
  },
  draft: {
    label: "Draft",
    color: "#b8adad",
    bg: "rgba(184,173,173,0.08)",
    border: "rgba(184,173,173,0.15)",
    dot: false,
  },
  pending: {
    label: "Pending",
    color: "#e8a838",
    bg: "rgba(232,168,56,0.1)",
    border: "rgba(232,168,56,0.2)",
    dot: true,
  },
};

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal }) => {
  const dispatch = useDispatch<AppDispatch>();
  const s = statusConfig[proposal.status];
  const firstComment = proposal.rejectionFeedback?.[0] || proposal.comments[0];
  const avatarInitial = firstComment
    ? "author" in firstComment
      ? firstComment.author.charAt(0)
      : "reviewer" in firstComment
        ? firstComment.reviewer.charAt(0)
        : "?"
    : "?";

  return (
    <div
      onClick={() => dispatch(openProposalModal(proposal))}
      className="rounded-xl p-4 cursor-pointer transition-all duration-200 hover:translate-y-[-2px] group"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 24px rgba(0,0,0,0.2)";
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(255,255,255,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(255,255,255,0.07)";
      }}
    >
      {/* Title + status */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-white font-bold text-sm leading-snug">
          {proposal.title}
          {s.dot && (
            <span
              className="inline-block w-1.5 h-1.5 rounded-full ml-1 mb-0.5 align-middle"
              style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }}
            />
          )}
        </h3>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0"
          style={{
            background: s.bg,
            color: s.color,
            border: `1px solid ${s.border}`,
          }}
        >
          {s.label}
        </span>
      </div>

      {/* Description label */}
      <p
        className="text-[10px] font-semibold mb-1"
        style={{ color: "#7f7f7f" }}
      >
        Description
      </p>
      <p
        className="text-xs leading-relaxed mb-3 line-clamp-3"
        style={{ color: "#b8adad" }}
      >
        {proposal.description}
      </p>

      {/* Progress bar (accepted) */}
      {proposal.status === "accepted" && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px]" style={{ color: "#7f7f7f" }}>
              Progress
            </span>
            <span
              className="text-[10px] font-bold"
              style={{ color: "#7ee3ff" }}
            >
              {proposal.progress}%
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${proposal.progress}%`,
                background: "linear-gradient(90deg, #7ee3ff 0%, #4fb8d8 100%)",
                boxShadow: "0 0 8px rgba(126,227,255,0.4)",
              }}
            />
          </div>
        </div>
      )}

      {/* Latest comment/feedback snippet (rejected/under_review) */}
      {(proposal.status === "rejected" || proposal.status === "under_review") &&
        firstComment && (
          <div
            className="flex items-center gap-2 mt-2 p-2 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #2a4a7f, #1a3060)",
                color: "#7ee3ff",
              }}
            >
              {avatarInitial}
            </div>
            <p className="text-[10px] truncate" style={{ color: "#7f7f7f" }}>
              {"message" in firstComment
                ? firstComment.message
                : firstComment.text}
            </p>
          </div>
        )}
    </div>
  );
};

export default ProposalCard;
