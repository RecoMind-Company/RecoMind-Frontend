import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { closeSuccessModal } from "../../redux/proposalsSlice";

const SuccessModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccessModal } = useSelector((s: RootState) => s.proposals);

  if (!showSuccessModal) return null;

  const isSaved = showSuccessModal === "saved";

  // Auto-redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(closeSuccessModal());
    }, 3000);
    return () => clearTimeout(timer);
  }, [dispatch]);  

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #060b1b 0%, #0a1628 60%, #060e20 100%)",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(126,227,255,0.4)); }
          50%       { filter: drop-shadow(0 0 20px rgba(126,227,255,0.8)); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        .robot-anim { animation: scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both; }
        .plane-anim { animation: scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both; }
        .text-anim  { animation: floatUp 0.5s ease 0.5s both; }
        .glow-pulse { animation: pulseGlow 2s ease-in-out infinite 0.7s; }

        /* Progress bar countdown */
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
        .countdown-bar { animation: shrink 3s linear forwards; }
      `}</style>

      {/* Radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(126,227,255,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="flex flex-col items-center text-center px-8 relative z-10">
        {isSaved ? (
          /* ====== SAVED ====== */
          <>
            <div className="robot-anim glow-pulse mb-8">
              <svg width="160" height="180" viewBox="0 0 160 200" fill="none">
                {/* Head */}
                <rect
                  x="50"
                  y="30"
                  width="60"
                  height="52"
                  rx="10"
                  stroke="#7ee3ff"
                  strokeWidth="2"
                  fill="rgba(126,227,255,0.04)"
                />
                {/* Antenna */}
                <line
                  x1="80"
                  y1="30"
                  x2="80"
                  y2="14"
                  stroke="#7ee3ff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="80"
                  cy="10"
                  r="5"
                  fill="#7ee3ff"
                  style={{ filter: "drop-shadow(0 0 6px #7ee3ff)" }}
                />
                {/* Eyes */}
                <circle
                  cx="67"
                  cy="52"
                  r="9"
                  fill="none"
                  stroke="#7ee3ff"
                  strokeWidth="2"
                />
                <circle
                  cx="67"
                  cy="52"
                  r="4"
                  fill="#7ee3ff"
                  style={{ filter: "drop-shadow(0 0 4px #7ee3ff)" }}
                />
                <circle
                  cx="93"
                  cy="52"
                  r="9"
                  fill="none"
                  stroke="#7ee3ff"
                  strokeWidth="2"
                />
                <circle
                  cx="93"
                  cy="52"
                  r="4"
                  fill="#7ee3ff"
                  style={{ filter: "drop-shadow(0 0 4px #7ee3ff)" }}
                />
                {/* Smile */}
                <path
                  d="M66 68 Q80 78 94 68"
                  stroke="#7ee3ff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Neck */}
                <rect
                  x="74"
                  y="82"
                  width="12"
                  height="8"
                  rx="2"
                  stroke="#7ee3ff"
                  strokeWidth="1.5"
                  fill="none"
                />
                {/* Body */}
                <rect
                  x="38"
                  y="90"
                  width="84"
                  height="64"
                  rx="12"
                  stroke="#7ee3ff"
                  strokeWidth="2"
                  fill="rgba(126,227,255,0.04)"
                />
                {/* Chest panel */}
                <rect
                  x="60"
                  y="104"
                  width="40"
                  height="28"
                  rx="6"
                  stroke="#7ee3ff"
                  strokeWidth="1.5"
                  fill="rgba(126,227,255,0.08)"
                />
                <circle
                  cx="70"
                  cy="118"
                  r="4"
                  fill="#7ee3ff"
                  style={{ opacity: 0.6 }}
                />
                <circle cx="80" cy="118" r="4" fill="#7ee3ff" />
                <circle
                  cx="90"
                  cy="118"
                  r="4"
                  fill="#7ee3ff"
                  style={{ opacity: 0.6 }}
                />
                {/* Left arm */}
                <line
                  x1="38"
                  y1="102"
                  x2="20"
                  y2="120"
                  stroke="#7ee3ff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="20"
                  y1="120"
                  x2="14"
                  y2="138"
                  stroke="#7ee3ff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Left thumb up */}
                <path
                  d="M10 148 Q8 143 11 139 Q15 135 17 140 L20 138 Q22 134 21 148 Z"
                  stroke="#7ee3ff"
                  strokeWidth="1.8"
                  fill="rgba(126,227,255,0.1)"
                />
                <line
                  x1="14"
                  y1="141"
                  x2="14"
                  y2="148"
                  stroke="#7ee3ff"
                  strokeWidth="1.2"
                />
                <line
                  x1="17"
                  y1="141"
                  x2="17"
                  y2="148"
                  stroke="#7ee3ff"
                  strokeWidth="1.2"
                />
                {/* Right arm */}
                <line
                  x1="122"
                  y1="102"
                  x2="140"
                  y2="120"
                  stroke="#7ee3ff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="140"
                  y1="120"
                  x2="146"
                  y2="138"
                  stroke="#7ee3ff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Right thumb up */}
                <path
                  d="M150 148 Q152 143 149 139 Q145 135 143 140 L140 138 Q138 134 139 148 Z"
                  stroke="#7ee3ff"
                  strokeWidth="1.8"
                  fill="rgba(126,227,255,0.1)"
                />
                <line
                  x1="146"
                  y1="141"
                  x2="146"
                  y2="148"
                  stroke="#7ee3ff"
                  strokeWidth="1.2"
                />
                <line
                  x1="143"
                  y1="141"
                  x2="143"
                  y2="148"
                  stroke="#7ee3ff"
                  strokeWidth="1.2"
                />
                {/* Legs */}
                <rect
                  x="55"
                  y="154"
                  width="20"
                  height="32"
                  rx="8"
                  stroke="#7ee3ff"
                  strokeWidth="2"
                  fill="rgba(126,227,255,0.04)"
                />
                <rect
                  x="85"
                  y="154"
                  width="20"
                  height="32"
                  rx="8"
                  stroke="#7ee3ff"
                  strokeWidth="2"
                  fill="rgba(126,227,255,0.04)"
                />
                {/* Feet */}
                <ellipse
                  cx="65"
                  cy="187"
                  rx="16"
                  ry="6"
                  stroke="#7ee3ff"
                  strokeWidth="1.5"
                  fill="rgba(126,227,255,0.06)"
                />
                <ellipse
                  cx="95"
                  cy="187"
                  rx="16"
                  ry="6"
                  stroke="#7ee3ff"
                  strokeWidth="1.5"
                  fill="rgba(126,227,255,0.06)"
                />
              </svg>
            </div>

            <h2
              className="text-anim text-3xl font-bold"
              style={{ color: "#7ee3ff" }}
            >
              Saved Successfully
            </h2>
          </>
        ) : (
          /* ====== SENT ====== */
          <>
            <h2
              className="text-3xl font-bold mb-10"
              style={{
                color: "#7ee3ff",
                animation: "floatUp 0.5s ease 0.1s both",
              }}
            >
              Sent Successfully
            </h2>

            <div className="plane-anim mb-10 relative">
              {/* Shadow glow under */}
              <div
                className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-32 h-8 rounded-full"
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(126,227,255,0.25) 0%, transparent 70%)",
                  filter: "blur(6px)",
                }}
              />
              <svg
                width="140"
                height="120"
                viewBox="0 0 140 120"
                fill="none"
                className="glow-pulse"
              >
                {/* Paper plane */}
                <path
                  d="M10 60 L130 20 L90 110 L62 76 Z"
                  stroke="#7ee3ff"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  fill="rgba(126,227,255,0.07)"
                />
                <path
                  d="M62 76 L130 20"
                  stroke="#7ee3ff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M62 76 L68 96 L78 84"
                  stroke="#7ee3ff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="rgba(126,227,255,0.05)"
                />
              </svg>
              {/* Check badge */}
              <div
                className="absolute bottom-[-8px] right-[-8px] w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #7ee3ff 0%, #4fb8d8 100%)",
                  border: "3px solid #060b1b",
                  boxShadow: "0 0 20px rgba(126,227,255,0.5)",
                }}
              >
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                  <path
                    d="M1.5 7L6.5 12L16.5 2"
                    stroke="#060b1b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <p
              className="text-xl font-semibold"
              style={{
                color: "#b8adad",
                animation: "floatUp 0.5s ease 0.6s both",
              }}
            >
              Awaiting Acceptance
            </p>
          </>
        )}

        {/* Redirect countdown bar */}
        <div
          className="mt-10 w-48 h-0.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <div
            className="countdown-bar h-full rounded-full"
            style={{ background: "#7ee3ff", width: "100%" }}
          />
        </div>
        <p className="text-xs mt-2" style={{ color: "#7f7f7f" }}>
          Redirecting to proposals...
        </p>
      </div>
    </div>
  );
};

export default SuccessModal;
