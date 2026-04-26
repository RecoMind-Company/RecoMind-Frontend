import React from "react";
import { useNavigate } from "react-router-dom";

const AIAssistantCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-2xl p-5 mt-4"
      style={{
        background: "linear-gradient(135deg, #0d1b3e 0%, #0a1628 100%)",
        border: "1px solid rgba(126,227,255,0.15)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #7ee3ff 0%, #4a9abf 100%)" }}
        >
          <span className="text-[#060b1b] text-sm font-bold">✦</span>
        </div>
        <span className="text-white font-semibold text-sm">AI Assistant</span>
      </div>

      <p className="text-[#7f7f7f] text-xs leading-relaxed mb-4">
        Need help prioritizing your tasks or getting unstuck? I'm here to help.
      </p>

      <button
        onClick={() => navigate("/home/chatbot")}
        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
        style={{
          background: "linear-gradient(135deg, #7ee3ff 0%, #4fb8d8 100%)",
          color: "#060b1b",
        }}
      >
        Ask AI Assistant
      </button>
    </div>
  );
};

export default AIAssistantCard;