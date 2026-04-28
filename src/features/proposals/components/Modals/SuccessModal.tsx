import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { closeSuccessModal } from "../../redux/proposalsSlice";

const SuccessModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccessModal } = useSelector((s: RootState) => s.proposals);

  if (!showSuccessModal) return null;

  const isSaved = showSuccessModal === "saved";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(6,11,27,0.85)", backdropFilter: "blur(10px)" }}
      onClick={() => dispatch(closeSuccessModal())}
    >
      <div
        className="w-full max-w-xs rounded-2xl p-8 flex flex-col items-center text-center"
        style={{
          background: "linear-gradient(135deg, #0d1b3e 0%, #091428 100%)",
          border: "1.5px solid rgba(126,227,255,0.15)",
          animation: "popIn 0.25s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes popIn {
            from { opacity: 0; transform: scale(0.92); }
            to   { opacity: 1; transform: scale(1); }
          }
        `}</style>

        {isSaved ? (
          /* Robot illustration placeholder */
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center mb-5"
            style={{
              background: "rgba(126,227,255,0.06)",
              border: "2px solid rgba(126,227,255,0.15)",
            }}
          >
            {/* Robot SVG */}
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <rect
                x="15"
                y="20"
                width="30"
                height="26"
                rx="4"
                stroke="#7ee3ff"
                strokeWidth="1.5"
                fill="none"
              />
              <rect
                x="22"
                y="12"
                width="16"
                height="12"
                rx="2"
                stroke="#7ee3ff"
                strokeWidth="1.5"
                fill="none"
              />
              <line
                x1="30"
                y1="12"
                x2="30"
                y2="8"
                stroke="#7ee3ff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="30" cy="7" r="2" fill="#7ee3ff" />
              <circle
                cx="23"
                cy="28"
                r="3"
                fill="none"
                stroke="#7ee3ff"
                strokeWidth="1.5"
              />
              <circle
                cx="37"
                cy="28"
                r="3"
                fill="none"
                stroke="#7ee3ff"
                strokeWidth="1.5"
              />
              <path
                d="M24 36 Q30 40 36 36"
                stroke="#7ee3ff"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              <line
                x1="15"
                y1="30"
                x2="10"
                y2="33"
                stroke="#7ee3ff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="10"
                y1="33"
                x2="8"
                y2="37"
                stroke="#7ee3ff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="45"
                y1="30"
                x2="50"
                y2="33"
                stroke="#7ee3ff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="50"
                y1="33"
                x2="52"
                y2="37"
                stroke="#7ee3ff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="22"
                y1="46"
                x2="22"
                y2="54"
                stroke="#7ee3ff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="38"
                y1="46"
                x2="38"
                y2="54"
                stroke="#7ee3ff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Thumbs up */}
              <path
                d="M8 40 Q6 38 8 36 Q10 34 11 37 L13 36 Q14 34 13 40 L8 40Z"
                stroke="#7ee3ff"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M47 40 Q49 38 47 36 Q45 34 44 37 L42 36 Q41 34 42 40 L47 40Z"
                stroke="#7ee3ff"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </div>
        ) : (
          /* Paper plane illustration */
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center mb-5 relative"
            style={{
              background: "rgba(126,227,255,0.06)",
              border: "2px solid rgba(126,227,255,0.15)",
            }}
          >
            <svg width="55" height="55" viewBox="0 0 60 60" fill="none">
              <path
                d="M8 30 L52 12 L36 52 L28 34 Z"
                stroke="#7ee3ff"
                strokeWidth="1.8"
                strokeLinejoin="round"
                fill="rgba(126,227,255,0.08)"
              />
              <path
                d="M28 34 L52 12"
                stroke="#7ee3ff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {/* Check badge */}
            <div
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "#7ee3ff", border: "2px solid #0a1628" }}
            >
              <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                <path
                  d="M1 5.5L5 9.5L13 1.5"
                  stroke="#060b1b"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}

        <h3 className="text-white font-bold text-lg mb-1">
          {isSaved ? "Saved Successfully" : "Sent Successfully"}
        </h3>
        {!isSaved && (
          <p className="text-sm mt-1" style={{ color: "#7f7f7f" }}>
            Awaiting Acceptance
          </p>
        )}

        <button
          onClick={() => dispatch(closeSuccessModal())}
          className="mt-6 w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{
            background: "rgba(126,227,255,0.1)",
            color: "#7ee3ff",
            border: "1px solid rgba(126,227,255,0.2)",
          }}
        >
          Back to Proposals
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
