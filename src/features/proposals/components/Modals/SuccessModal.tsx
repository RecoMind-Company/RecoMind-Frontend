import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { closeSuccessModal } from "../../redux/proposalsSlice";
import sendApproval from "../../../../assets/images/send_approval.png"
import doneApproval from "../../../../assets/images/doneApproval.png"


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
      className="fixed inset-0 z-60 flex items-center justify-center"
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
              <img src={doneApproval} alt="Done Approval" />
            </div>

            <h2
              className="text-anim text-4xl font-bold"
              style={{ color: "#7EE3FF" , fontFamily: " sans-serif"}}
            >
              Saved Successfully
            </h2>
          </>
        ) : (
          /* ====== SENT ====== */
          <>
            <h2
              className="text-[32px] font-bold mb-10"
              style={{
                color: "#7EE3FF",
                animation: "floatUp 0.5s ease 0.1s both",
                fontFamily: " sans-serif",
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
              <img src={sendApproval} alt="Send Approval" />
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
              className="text-[32px] font-semibold"
              style={{
                color: "#7EE3FF",
                animation: "floatUp 0.5s ease 0.6s both",
                fontFamily: " sans-serif",
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
